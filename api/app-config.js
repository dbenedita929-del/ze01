// Vercel Serverless Function: /api/app-config
// Serves and saves the app configuration for Vercel production hosting

const CLOUD_SYNC_OBJECT_ID = 'ff808181a09d98f701a197451fe97fb5';
const CLOUD_SYNC_URL = `https://api.restful-api.dev/objects/${CLOUD_SYNC_OBJECT_ID}`;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch app config from cloud storage
  if (req.method === 'GET') {
    try {
      const cloudRes = await fetch(`${CLOUD_SYNC_URL}?_nocache=${Date.now()}`, {
        cache: 'no-store'
      });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        if (json && json.data && json.data.app) {
          return res.status(200).json({ success: true, app: json.data.app });
        }
      }
    } catch (err) {
      console.warn('Vercel API GET error:', err);
    }

    // Default fallback
    return res.status(200).json({
      success: true,
      app: {
        id: 'com.polyverse.aimirror',
        name: 'AI Mirror: AI Art Photo Editor',
        developer: 'POLYVERSE INC.',
        category: 'Arte e Design',
        rating: 4.4,
        ratingCount: '223 mil avaliações',
        downloads: '10 mi+',
        version: '4.12.0',
        size: '86 MB',
        logoMode: 'preset',
        logoPreset: 'aimirror',
        installButtonText: 'Instalar'
      }
    });
  }

  // POST: Save updated app config to cloud storage
  if (req.method === 'POST') {
    try {
      const updatedApp = req.body;
      if (!updatedApp || !updatedApp.name) {
        return res.status(400).json({ success: false, error: 'Dados inválidos' });
      }

      const now = Date.now();
      const body = {
        name: 'google_play_app_b6ede505',
        data: {
          app: {
            ...updatedApp,
            updatedAt: now
          },
          updatedAt: now
        }
      };

      const putRes = await fetch(CLOUD_SYNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (putRes.ok) {
        const json = await putRes.json();
        return res.status(200).json({ success: true, app: json.data?.app || updatedApp });
      }

      return res.status(200).json({ success: true, app: updatedApp });
    } catch (err) {
      console.error('Vercel API POST error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
