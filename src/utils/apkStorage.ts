/**
 * IndexedDB storage for APK files to support files of any size (50MB - 500MB+)
 * without localStorage 5MB quota restrictions or Data URL browser corruption.
 */

const DB_NAME = 'PlayStoreApkDB';
const DB_VERSION = 1;
const STORE_NAME = 'apkFiles';
const APK_KEY = 'current_installed_apk';

export interface StoredApkRecord {
  blob: Blob;
  fileName: string;
  fileSize: string;
  updatedAt: number;
}

export interface StorageEstimateResult {
  usageMb: number;
  quotaMb: number;
  availableMb: number;
  percentUsed: number;
  availableFormatted: string;
  quotaFormatted: string;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Reads available storage quota from the browser (IndexedDB capacity).
 */
export async function getStorageEstimate(): Promise<StorageEstimateResult | null> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const usageBytes = estimate.usage || 0;
      const quotaBytes = estimate.quota || 0;
      const usageMb = Math.round(usageBytes / (1024 * 1024));
      const quotaMb = Math.round(quotaBytes / (1024 * 1024));
      const availableBytes = Math.max(0, quotaBytes - usageBytes);
      const availableMb = Math.round(availableBytes / (1024 * 1024));
      const percentUsed = quotaBytes > 0 ? Math.round((usageBytes / quotaBytes) * 100) : 0;

      return {
        usageMb,
        quotaMb,
        availableMb,
        percentUsed,
        availableFormatted: formatBytes(availableBytes),
        quotaFormatted: formatBytes(quotaBytes)
      };
    } catch (err) {
      console.warn('Could not query storage estimate:', err);
    }
  }
  return null;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Saves an uploaded APK file directly as a binary Blob with its exact original filename.
 */
export async function saveApkFile(file: File): Promise<StoredApkRecord> {
  const db = await openDB();
  const formattedSize = formatBytes(file.size);
  
  // Ensure correct APK MIME type for Android Package Installer
  const apkBlob = new Blob([file], { type: 'application/vnd.android.package-archive' });
  
  const record: StoredApkRecord = {
    blob: apkBlob,
    fileName: file.name, // EXACT filename from user's system, zero modifications
    fileSize: formattedSize,
    updatedAt: Date.now()
  };

  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putRequest = store.put(record, APK_KEY);

      putRequest.onsuccess = () => {
        resolve(record);
      };

      putRequest.onerror = () => {
        reject(putRequest.error);
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Retrieves the stored binary APK from IndexedDB.
 */
export async function getStoredApk(): Promise<StoredApkRecord | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(APK_KEY);

      getRequest.onsuccess = () => {
        resolve(getRequest.result || null);
      };

      getRequest.onerror = () => {
        reject(getRequest.error);
      };
    });
  } catch (err) {
    console.warn('Could not read APK from IndexedDB:', err);
    return null;
  }
}

/**
 * Clears the stored APK from IndexedDB.
 */
export async function deleteStoredApk(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(APK_KEY);

      deleteRequest.onsuccess = () => {
        resolve();
      };

      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    });
  } catch (err) {
    console.warn('Could not clear APK from IndexedDB:', err);
  }
}

/**
 * Downloads a binary APK directly without browser URL size limits or corruption.
 */
export function downloadBlobAsFile(blob: Blob, exactFileName: string) {
  // Ensure the blob has Android APK mime type
  const apkBlob = blob.type === 'application/vnd.android.package-archive' 
    ? blob 
    : new Blob([blob], { type: 'application/vnd.android.package-archive' });
    
  const blobUrl = URL.createObjectURL(apkBlob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = exactFileName; // Keep exact name as written
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();

  // Clean up object URL after download begins
  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(blobUrl);
  }, 45000);
}
