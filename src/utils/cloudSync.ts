import { AppInfo } from '../types';

// Dedicated cloud sync object ID for cross-device persistence (PC <-> Mobile on Vercel/hosting)
const CLOUD_SYNC_OBJECT_ID = 'ff808181a09d98f701a197451fe97fb5';
const CLOUD_SYNC_URL = `https://api.restful-api.dev/objects/${CLOUD_SYNC_OBJECT_ID}`;
const LOCAL_STORAGE_KEY = 'playstore_app_custom_data_v1';
const CLOUD_TIMESTAMP_KEY = 'playstore_app_cloud_timestamp_v1';
export const VERCEL_PROD_URL = 'https://google-play-rho.vercel.app';

/**
 * Clean and compact app info for cloud storage and URL sharing
 */
export function sanitizeAppForCloud(app: AppInfo): Partial<AppInfo> {
  const sanitized = { ...app };
  // If uploaded APK data is huge, don't blast it into the cloud JSON
  if (sanitized.uploadedApkData && sanitized.uploadedApkData.length > 500) {
    sanitized.uploadedApkData = 'cloud_synced';
  }
  return sanitized;
}

export interface CloudLoadResult {
  app: AppInfo;
  updatedAt: number;
}

/**
 * Saves app configuration to the global cloud store so mobile phones and all devices see it immediately
 */
export async function saveAppToCloud(app: AppInfo): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = sanitizeAppForCloud(app);
    const now = Date.now();
    const body = {
      name: 'google_play_app_b6ede505',
      data: {
        app: {
          ...payload,
          updatedAt: now
        },
        updatedAt: now
      }
    };

    const res = await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Status ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    if (json && json.data) {
      try {
        localStorage.setItem(CLOUD_TIMESTAMP_KEY, String(now));
      } catch {
        // ignore
      }
      return { success: true };
    }
    return { success: false, error: 'Resposta vazia da nuvem' };
  } catch (err: any) {
    console.warn('Falha ao salvar no Cloud Sync:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Loads app configuration from the global cloud store
 */
export async function loadAppFromCloud(): Promise<CloudLoadResult | null> {
  try {
    // Add cache busting timestamp to bypass any intermediate proxy or CDN cache
    const res = await fetch(`${CLOUD_SYNC_URL}?_nocache=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json && json.data && json.data.app && json.data.app.name) {
      const updatedAt = json.data.updatedAt || json.updatedAt || Date.now();
      return {
        app: json.data.app as AppInfo,
        updatedAt
      };
    }
    return null;
  } catch (err) {
    console.warn('Falha ao carregar do Cloud Sync:', err);
    return null;
  }
}

/**
 * Encode app config into a portable compact URL parameter for instant phone opening
 */
export function generateMobileSyncUrl(app: AppInfo, overrideOrigin?: string): string {
  try {
    const sanitized = sanitizeAppForCloud(app);
    const jsonStr = JSON.stringify(sanitized);
    // Use base64 encoding (UTF-8 safe)
    const base64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));

    // Target domain logic:
    // If overrideOrigin is explicitly provided (e.g. VERCEL_PROD_URL), use it!
    // If running already on Vercel production, use current origin
    // Otherwise fallback to VERCEL_PROD_URL so links sent to mobile always open on the live public hosting!
    let targetOrigin = overrideOrigin || VERCEL_PROD_URL;
    if (!overrideOrigin && typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('vercel.app')) {
        targetOrigin = window.location.origin;
      }
    }

    return `${targetOrigin}/#sync=${base64}`;
  } catch (err) {
    console.error('Erro ao gerar URL para celular:', err);
    return overrideOrigin || VERCEL_PROD_URL;
  }
}

/**
 * Checks if the current page URL has a mobile sync payload (#sync=... or ?sync=...)
 * If found, decodes it, persists to localStorage and returns it.
 */
export function extractMobileSyncFromUrl(): AppInfo | null {
  if (typeof window === 'undefined') return null;

  try {
    let rawEncoded = '';
    const hash = window.location.hash;
    const search = window.location.search;

    if (hash.includes('sync=')) {
      const match = hash.match(/sync=([^&]+)/);
      if (match && match[1]) rawEncoded = match[1];
    } else if (search.includes('sync=')) {
      const match = search.match(/sync=([^&]+)/);
      if (match && match[1]) rawEncoded = match[1];
    }

    if (!rawEncoded) return null;

    // Decode UTF-8 base64
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(rawEncoded), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonStr) as AppInfo;
    if (parsed && parsed.name) {
      // Save directly to localStorage on phone with timestamp
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        localStorage.setItem(CLOUD_TIMESTAMP_KEY, String(Date.now()));
      } catch {
        // ignore
      }

      // Also push to cloud so phone and other visits stay in sync
      saveAppToCloud(parsed).catch(() => {});

      // Clean URL hash without reloading page
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.pathname + (window.location.search.replace(/[?&]sync=[^&]+/, '') || '');
        window.history.replaceState(null, '', cleanUrl);
      }

      return parsed;
    }
  } catch (err) {
    console.warn('Erro ao decodificar sync da URL:', err);
  }

  return null;
}
