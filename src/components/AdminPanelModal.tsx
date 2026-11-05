import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Settings, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Sun, 
  ShoppingCart, 
  Store, 
  Package, 
  Percent, 
  Building2, 
  Tag, 
  Star, 
  DownloadCloud, 
  Layers,
  FileCode,
  Download,
  CheckCircle2,
  HardDrive,
  Database,
  Gamepad2,
  Smartphone,
  Cpu,
  HelpCircle,
  QrCode,
  Share2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { AppInfo } from '../types';
import { AppLogo } from './AppLogo';
import { 
  saveApkFile, 
  getStoredApk, 
  downloadBlobAsFile,
  getStorageEstimate,
  StorageEstimateResult,
  formatBytes
} from '../utils/apkStorage';
import { generateAppTopicData, detectTopicKey } from '../utils/appTopicGenerator';
import { generateMobileSyncUrl, saveAppToCloud, VERCEL_PROD_URL } from '../utils/cloudSync';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApp: AppInfo;
  onSaveApp: (updatedApp: AppInfo) => void;
  onResetToAssai: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentApp,
  onSaveApp,
  onResetToAssai
}) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'apk' | 'details' | 'stats' | 'sync'>('branding');
  const [formData, setFormData] = useState<AppInfo>({ ...currentApp });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [apkUploadSuccess, setApkUploadSuccess] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<StorageEstimateResult | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [autoSyncTopicStats, setAutoSyncTopicStats] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apkFileInputRef = useRef<HTMLInputElement>(null);

  const wasOpenRef = useRef<boolean>(false);

  useEffect(() => {
    // Only initialize form data when modal transitions from closed to open
    if (isOpen && !wasOpenRef.current) {
      setFormData({ ...currentApp });
      setUploadError(null);
      setApkUploadSuccess(null);
      getStorageEstimate().then(setStorageInfo);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, currentApp]);

  if (!isOpen) return null;

  const handleNameChange = (newName: string) => {
    if (autoSyncTopicStats && newName.trim().length >= 2) {
      const topicData = generateAppTopicData(newName, formData);
      setFormData((prev) => ({
        ...prev,
        ...topicData,
        name: newName,
        // Preserve user's custom logo and button choices if explicitly set
        logoMode: prev.logoMode === 'upload' || prev.logoMode === 'url' ? prev.logoMode : (topicData.logoMode || prev.logoMode),
        logoPreset: prev.logoPreset || topicData.logoPreset,
        customLogoUrl: prev.customLogoUrl,
        installButtonText: prev.installButtonText && prev.installButtonText !== 'Instalar' ? prev.installButtonText : (topicData.installButtonText || 'Instalar'),
        // Preserve uploaded APK data
        apkFileName: prev.apkFileName,
        apkFileSize: prev.apkFileSize,
        apkUrl: prev.apkUrl,
        apkSourceType: prev.apkSourceType,
        uploadedApkData: prev.uploadedApkData
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: newName }));
    }
  };

  const handleApplyTopicStats = (nameToUse?: string) => {
    const targetName = (nameToUse || formData.name).trim();
    if (!targetName) return;
    const topicData = generateAppTopicData(targetName, formData);
    setFormData((prev) => ({
      ...prev,
      ...topicData,
      name: targetName,
      apkFileName: prev.apkFileName,
      apkFileSize: prev.apkFileSize,
      apkUrl: prev.apkUrl,
      apkSourceType: prev.apkSourceType,
      uploadedApkData: prev.uploadedApkData
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecione um arquivo de imagem válido (PNG, JPG, WEBP, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        logoMode: 'upload',
        customLogoUrl: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleApkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preserve 100% exact filename as written on user's system without alteration
    const exactOriginalFileName = file.name;
    const formattedSize = formatBytes(file.size);

    try {
      // 1. Store genuine binary APK directly into IndexedDB for instant local download
      await saveApkFile(file);

      // Refresh available browser storage quota
      getStorageEstimate().then(setStorageInfo);

      // 2. Also send to server API so mobile devices and hosting visitors can download it directly!
      try {
        const uploadForm = new FormData();
        uploadForm.append('apk', file);
        const serverUploadRes = await fetch('/api/upload-apk', {
          method: 'POST',
          body: uploadForm
        });
        if (serverUploadRes.ok) {
          const resData = await serverUploadRes.json();
          if (resData.success) {
            console.log('APK salvo no servidor com sucesso:', resData);
          }
        }
      } catch (serverErr) {
        console.warn('Upload para o servidor não completou, salvo localmente:', serverErr);
      }

      setFormData((prev) => ({
        ...prev,
        apkSourceType: 'upload',
        apkUrl: '/api/download-apk',
        apkDownloadUrl: '/api/download-apk',
        uploadedApkData: 'server',
        apkFileName: exactOriginalFileName, // NEVER alter the name!
        apkFileSize: formattedSize,
        size: formattedSize
      }));

      setApkUploadSuccess(`Arquivo "${exactOriginalFileName}" (${formattedSize}) salvo com sucesso no servidor da hospedagem e no navegador!`);
    } catch (err) {
      console.error('Erro ao salvar APK:', err);
      // Fallback
      setFormData((prev) => ({
        ...prev,
        apkSourceType: 'upload',
        apkUrl: '/api/download-apk',
        apkDownloadUrl: '/api/download-apk',
        apkFileName: exactOriginalFileName,
        apkFileSize: formattedSize,
        size: formattedSize
      }));
      setApkUploadSuccess(`Arquivo "${exactOriginalFileName}" selecionado!`);
    }
  };

  const handleTestDownload = async () => {
    // Exact filename without alteration
    const exactFilename = formData.apkFileName?.trim() 
      ? formData.apkFileName.trim() 
      : `${formData.name}.apk`;

    // 1. If direct URL is configured, use direct download
    if (formData.apkUrl) {
      const a = document.createElement('a');
      a.href = formData.apkUrl;
      a.download = exactFilename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 2. If uploaded file exists in IndexedDB, download byte-exact binary APK
    const stored = await getStoredApk();
    if (stored && stored.blob) {
      downloadBlobAsFile(stored.blob, stored.fileName || exactFilename);
      return;
    }

    // 3. Fallback to existing base64 data if available
    if (formData.uploadedApkData && formData.uploadedApkData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = formData.uploadedApkData;
      a.download = exactFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 4. Default dummy package if no file was uploaded yet
    const blob = new Blob([
      `Android Package Kit (APK) para ${formData.name}\nPackage: ${formData.id}\nVersão: ${formData.version}`
    ], { type: 'application/vnd.android.package-archive' });
    downloadBlobAsFile(blob, exactFilename);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppToCloud(formData).catch(() => {});
    onSaveApp(formData);
    onClose();
  };

  const handleForceCloudSync = async () => {
    setIsCloudSyncing(true);
    setCloudSyncStatus(null);
    try {
      const res = await saveAppToCloud(formData);
      if (res.success) {
        setCloudSyncStatus('Sincronizado na nuvem global! Seu celular já recebe essas alterações automaticamente.');
      } else {
        setCloudSyncStatus(res.error || 'Não foi possível sincronizar no momento.');
      }
    } catch {
      setCloudSyncStatus('Erro ao conectar com o serviço de nuvem.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const quickPresets = [
    { 
      name: 'Assaí Atacadista', 
      dev: 'Sendas Distribuidora S/A', 
      cat: 'Compras', 
      size: '42 MB',
      id: 'br.com.assai.app',
      preset: 'assai',
      desc: 'O app oficial do Assaí Atacadista com ofertas exclusivas, descontos do Meu Assaí e economia de verdade.'
    },
    { 
      name: 'Free Fire: Batalha Real', 
      dev: 'Garena International I', 
      cat: 'Jogos de Ação', 
      size: '1.2 GB',
      id: 'com.dts.freefireth',
      preset: 'aimirror',
      desc: 'Jogo de tiro e sobrevivência multiplayer de ação intensa com mapas gigantes e 50 jogadores.'
    },
    { 
      name: 'WhatsApp Messenger', 
      dev: 'WhatsApp LLC', 
      cat: 'Comunicação', 
      size: '48 MB',
      id: 'com.whatsapp',
      preset: 'supermarket',
      desc: 'Mensagens simples, seguras e chamadas gratuitas para falar com quem você quiser em qualquer lugar.'
    },
    { 
      name: 'Spotify: Músicas e Podcasts', 
      dev: 'Spotify AB', 
      cat: 'Música e Áudio', 
      size: '35 MB',
      id: 'com.spotify.music',
      preset: 'aimirror',
      desc: 'Milhões de músicas, playlists recomendadas e podcasts para ouvir online ou offline.'
    },
    { 
      name: 'Nubank: Conta, Cartão e Mais', 
      dev: 'Nu Pagamentos S.A.', 
      cat: 'Finanças', 
      size: '95 MB',
      id: 'com.nu.production',
      preset: 'supermarket',
      desc: 'O banco digital sem taxas abusivas com Pix instantâneo, cartão e investimentos fáceis.'
    },
    { 
      name: 'AI Mirror: AI Art Photo Editor', 
      dev: 'POLYVERSE INC.', 
      cat: 'Arte e Design', 
      size: '110 MB',
      id: 'com.polyverse.aimirror',
      preset: 'aimirror',
      desc: 'Crie artes mágicas e avatares espetaculares com inteligência artificial avançada.'
    },
    { 
      name: 'Utilitários & Ferramentas Pro', 
      dev: 'DevTools Lab', 
      cat: 'Ferramentas', 
      size: '15 MB',
      id: 'com.tools.utilities.pro',
      preset: 'supermarket',
      desc: 'Suíte completa de ferramentas essenciais para otimização, produtividade e arquivos no Android.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-neutral-200 relative my-8 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#01875f]/10 text-[#01875f]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
                Painel Admin · Personalizar App
              </h3>
              <p className="text-xs text-neutral-500">
                Altere o nome, logo e detalhes da listagem da loja
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Secret Admin Link Banner */}
        <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="truncate">
            <span className="font-bold text-emerald-900 block">Link de Acesso do Admin</span>
            <span className="text-emerald-700 text-[11px] font-mono truncate block">
              {typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?admin=true` : '?admin=true'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const url = `${window.location.origin}${window.location.pathname}?admin=true`;
                navigator.clipboard.writeText(url);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }
            }}
            className="px-3 py-1.5 bg-[#01875f] text-white hover:bg-[#017252] rounded-lg font-semibold text-xs whitespace-nowrap shrink-0 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link Copiado!</span>
              </>
            ) : (
              <span>Copiar Link Admin</span>
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-neutral-100 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-[#01875f] text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nome & Logo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'apk'
                ? 'bg-[#01875f] text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Arquivo APK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'details'
                ? 'bg-[#01875f] text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Desenvolvedor & Categoria</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'stats'
                ? 'bg-[#01875f] text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Notas & Estatísticas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'sync'
                ? 'bg-[#01875f] text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Sincronizar Celular</span>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
          
          {/* TAB 1: Branding (Name and Logo) */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              
              {/* App Name Input with Automatic Topic & Stats Synchronization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Nome do Aplicativo
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md cursor-pointer transition-colors border border-emerald-200/80">
                    <input
                      type="checkbox"
                      checked={autoSyncTopicStats}
                      onChange={(e) => setAutoSyncTopicStats(e.target.checked)}
                      className="w-3.5 h-3.5 text-[#01875f] accent-[#01875f] rounded"
                    />
                    <span>⚡ Sincronizar notas & estatísticas automáticas</span>
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyTopicStats(formData.name);
                      }
                    }}
                    onBlur={() => {
                      if (autoSyncTopicStats && formData.name.trim().length >= 2) {
                        handleApplyTopicStats(formData.name);
                      }
                    }}
                    placeholder="Ex: Assaí Atacadista, Banco Nubank, iFood Delivery, Free Fire..."
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-neutral-300 text-sm font-medium focus:outline-none focus:border-[#01875f] focus:ring-2 focus:ring-[#01875f]/20 shadow-xs transition-colors"
                  />
                  {formData.name && (
                    <button
                      type="button"
                      onClick={() => handleNameChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                      title="Limpar nome"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Live Topic & Statistics Indicator Card */}
                {formData.name.trim() && (
                  <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-in fade-in">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-950 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Estatísticas & Notas automáticas sincronizadas:</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-tight">
                        Categoria: <strong>{formData.category}</strong> · Nota: <strong className="text-emerald-950">{formData.rating}★</strong> ({formData.ratingCount}) · <strong>{formData.downloads}</strong> downloads
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyTopicStats(formData.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#01875f] hover:bg-[#017252] text-white rounded-lg text-[11px] font-bold shadow-2xs transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
                      title="Forçar sincronização de notas, comentários e estatísticas do assunto agora"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Sincronizar Tudo Agora</span>
                    </button>
                  </div>
                )}

                {/* Quick Sugestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-neutral-400 mr-1">Exemplos rápidos:</span>
                  {quickPresets.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleApplyTopicStats(item.name);
                      }}
                      className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Package ID & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    ID do Pacote (Package Name)
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Ex: com.exemplo.meuapp"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#01875f]"
                  />
                  <p className="text-[11px] text-neutral-400 mt-0.5">Identificador único no Android</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Versão do Aplicativo
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="Ex: 1.0.0 ou 2.4.15"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#01875f]"
                  />
                  <p className="text-[11px] text-neutral-400 mt-0.5">Exibido na ficha técnica do app</p>
                </div>
              </div>


              {/* Logo Section */}
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Logo / Ícone do Aplicativo
                </label>

                {/* Logo Live Preview */}
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center gap-5">
                  <AppLogo app={formData} sizeClassName="w-24 h-24 sm:w-28 sm:h-28" />

                  <div className="space-y-1.5 text-center sm:text-left flex-1">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      Visualização em Tempo Real
                    </span>
                    <h4 className="text-sm font-bold text-neutral-900">{formData.name || 'Sem nome'}</h4>
                    <p className="text-xs text-neutral-500">
                      Formato squircle de 128x128px padrão da loja Google Play Store.
                    </p>
                  </div>
                </div>

                {/* Logo Selection Mode Tabs */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
                    <Layers className="w-4 h-4 text-neutral-500" />
                    <span>Escolha como definir a logo:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoMode: 'preset', logoPreset: 'assai' })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.logoPreset === 'assai' && formData.logoMode === 'preset'
                          ? 'border-[#01875f] bg-[#01875f]/5 text-[#01875f] font-bold shadow-xs'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <Sun className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                      <span className="text-xs block">Assaí Atacadista</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoMode: 'preset', logoPreset: 'supermarket' })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.logoPreset === 'supermarket' && formData.logoMode === 'preset'
                          ? 'border-[#01875f] bg-[#01875f]/5 text-[#01875f] font-bold shadow-xs'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                      <span className="text-xs block">Supermercado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoMode: 'preset', logoPreset: 'aimirror' })}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.logoPreset === 'aimirror' && formData.logoMode === 'preset'
                          ? 'border-[#01875f] bg-[#01875f]/5 text-[#01875f] font-bold shadow-xs'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                      <span className="text-xs block">AI Mirror</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.logoMode === 'upload'
                          ? 'border-[#01875f] bg-[#01875f]/5 text-[#01875f] font-bold shadow-xs'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <Upload className="w-5 h-5 mx-auto mb-1 text-neutral-700" />
                      <span className="text-xs block">Enviar Imagem</span>
                    </button>
                  </div>
                </div>

                {/* Upload Action Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-[#01875f] bg-neutral-50/50 text-center transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-2.5 rounded-full bg-white shadow-xs text-neutral-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs sm:text-sm font-bold text-[#01875f] hover:underline cursor-pointer"
                      >
                        Clique para escolher imagem do computador
                      </button>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Formatos suportados: PNG, JPG, WEBP, SVG (máx. 5MB)
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-rose-600 font-medium mt-2">
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* Or Image URL */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-600">
                    Ou digite uma URL de imagem direta:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.customLogoUrl || ''}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          logoMode: 'url',
                          customLogoUrl: e.target.value
                        });
                      }}
                      placeholder="https://exemplo.com/logo.png"
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#01875f]"
                    />
                    {formData.customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, customLogoUrl: '', logoMode: 'preset' })}
                        className="px-3 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB: APK Configuration */}
          {activeTab === 'apk' && (
            <div className="space-y-6">
              
              {/* Storage Capacity & Unrestricted Space Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-md space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/20">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">
                          Espaço Livre para Qualquer Aplicativo e Tamanho
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                          Sem restrições
                        </span>
                      </div>
                      <p className="text-xs text-emerald-100/80 mt-0.5 leading-relaxed">
                        Suporta desde ferramentas leves (100 KB) até jogos 3D pesados e aplicativos multimídia (500 MB, 1 GB, 2 GB ou mais).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Storage estimate stats */}
                <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="text-emerald-100">
                      Capacidade no navegador (IndexedDB):{' '}
                      <strong className="text-white font-mono font-bold">
                        {storageInfo?.availableFormatted || 'Ilimitada / Gigabytes livres'}
                      </strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded-md font-mono">
                    Binários 100% íntegros
                  </span>
                </div>
              </div>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-emerald-950">Status do APK:</span>
                    <span className="text-emerald-800 ml-1 font-mono text-[11px] truncate inline-block max-w-xs align-bottom">
                      {formData.apkSourceType === 'upload' || formData.uploadedApkData 
                        ? `Arquivo APK pronto: ${formData.apkFileName || 'arquivo carregado'} (${formData.apkFileSize || 'OK'})` 
                        : formData.apkUrl 
                        ? `URL direta: ${formData.apkUrl}` 
                        : 'Pacote padrão pronto'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#01875f] text-white hover:bg-[#017252] rounded-lg text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Testar Download</span>
                </button>
              </div>

              {/* Option 1: APK Direct URL */}
              <div className="space-y-2 p-4 rounded-2xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Opção 1: Link / URL Direta do APK (Qualquer Tamanho)</span>
                  </label>
                  <span className="text-[11px] text-neutral-400 font-medium">Sem limites</span>
                </div>
                
                <input
                  type="url"
                  value={formData.apkUrl || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      apkUrl: e.target.value,
                      apkSourceType: 'url'
                    });
                  }}
                  placeholder="https://exemplo.com/downloads/meu-app.apk"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#01875f] focus:ring-2 focus:ring-[#01875f]/20"
                />
                <p className="text-[11px] text-neutral-500">
                  Ideal para hospedar arquivos de qualquer gigabyte: Google Drive, Dropbox, MediaFire, Mega, GitHub Releases, CDN ou servidor próprio.
                </p>
              </div>

              {/* Option 2: Upload local APK file */}
              <div className="space-y-2 p-4 rounded-2xl border border-neutral-200 bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                    Opção 2: Enviar arquivo .APK do seu computador / celular
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                    IndexedDB Ativo
                  </span>
                </div>

                <input
                  ref={apkFileInputRef}
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  onChange={handleApkFileUpload}
                  className="hidden"
                />

                <div className="p-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#01875f] bg-neutral-50/50 text-center transition-colors">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="p-2.5 rounded-full bg-white shadow-xs text-neutral-600">
                      <HardDrive className="w-6 h-6" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => apkFileInputRef.current?.click()}
                        className="text-xs sm:text-sm font-bold text-[#01875f] hover:underline cursor-pointer"
                      >
                        Clique para selecionar arquivo .apk de qualquer tamanho
                      </button>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Extensão necessária: .apk (armazena binário real e preserva nome exato)
                      </p>
                    </div>
                  </div>

                  {apkUploadSuccess && (
                    <div className="mt-3 p-2 rounded-lg bg-emerald-100/70 text-emerald-800 text-xs font-medium flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{apkUploadSuccess}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* APK Metadata (File Name, Display Size, and Android Version) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Nome do Arquivo (Exatamente como escrito)
                  </label>
                  <input
                    type="text"
                    value={formData.apkFileName || ''}
                    onChange={(e) => setFormData({ ...formData, apkFileName: e.target.value })}
                    placeholder="Ex: MeuArquivoDeInstalacao.apk"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#01875f]"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    O nome não é alterado: será baixado exatamente com as letras e pontuação originais.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Tamanho do Arquivo (Qualquer tamanho à vontade)
                  </label>
                  <input
                    type="text"
                    value={formData.apkFileSize || formData.size || ''}
                    onChange={(e) => setFormData({ ...formData, apkFileSize: e.target.value, size: e.target.value })}
                    placeholder="Ex: 15 MB, 180 MB, 1.2 GB..."
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#01875f]"
                  />
                  {/* Quick Size Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-neutral-400">Tamanhos rápidos:</span>
                    {['15 MB', '42 MB', '95 MB', '180 MB', '500 MB', '1.2 GB', '2.5 GB'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setFormData({ ...formData, apkFileSize: sz, size: sz })}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                          (formData.apkFileSize === sz || formData.size === sz)
                            ? 'bg-[#01875f] text-white font-bold'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Android Version Compatibility */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Compatibilidade Mínima do Android
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={formData.requiredAndroid || 'Android 7.0 ou superior'}
                    onChange={(e) => setFormData({ ...formData, requiredAndroid: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm bg-white focus:outline-none focus:border-[#01875f]"
                  >
                    <option value="Qualquer versão do Android">Qualquer versão do Android</option>
                    <option value="Android 5.0 ou superior (Lollipop)">Android 5.0 ou superior (Lollipop)</option>
                    <option value="Android 7.0 ou superior (Nougat)">Android 7.0 ou superior (Nougat)</option>
                    <option value="Android 8.0 ou superior (Oreo)">Android 8.0 ou superior (Oreo)</option>
                    <option value="Android 10 ou superior">Android 10 ou superior</option>
                    <option value="Android 12 ou superior">Android 12 ou superior</option>
                    <option value="Android 14 ou superior">Android 14 ou superior</option>
                    <option value="Android 15 ou superior (Mais recente)">Android 15 ou superior (Mais recente)</option>
                  </select>

                  <input
                    type="text"
                    value={formData.requiredAndroid || ''}
                    onChange={(e) => setFormData({ ...formData, requiredAndroid: e.target.value })}
                    placeholder="Ou digite outra versão..."
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-xs sm:text-sm focus:outline-none focus:border-[#01875f]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Details */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Nome do Desenvolvedor / Empresa
                </label>
                <input
                  type="text"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  placeholder="Ex: Sendas Distribuidora S/A"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                />
              </div>

              {/* Category & Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Categoria do Aplicativo
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-[11px] text-[#01875f] font-semibold hover:underline cursor-pointer"
                    >
                      {isCustomCategory ? 'Ver lista padrão' : '✏️ Digitar categoria livre'}
                    </button>
                  </div>

                  {isCustomCategory ? (
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Ex: Emulador, Assistente IA, Mod Menu..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                    />
                  ) : (
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true);
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:outline-none focus:border-[#01875f]"
                    >
                      <optgroup label="Jogos & Games">
                        <option value="Jogos de Ação">Jogos de Ação</option>
                        <option value="Jogos de Aventura">Jogos de Aventura</option>
                        <option value="RPG">RPG</option>
                        <option value="Estratégia">Estratégia</option>
                        <option value="Quebra-cabeça">Quebra-cabeça</option>
                        <option value="Esportes">Esportes</option>
                        <option value="Corrida">Corrida</option>
                        <option value="Simulação">Simulação</option>
                        <option value="Casual & Arcade">Casual & Arcade</option>
                      </optgroup>
                      <optgroup label="Aplicativos">
                        <option value="Compras">Compras & E-commerce</option>
                        <option value="Ferramentas">Ferramentas & Utilitários</option>
                        <option value="Produtividade">Produtividade</option>
                        <option value="Comunicação">Comunicação</option>
                        <option value="Redes Sociais">Redes Sociais</option>
                        <option value="Fotografia e Vídeo">Fotografia e Vídeo</option>
                        <option value="Música e Áudio">Música e Áudio</option>
                        <option value="Finanças">Finanças & Bancos</option>
                        <option value="Entretenimento">Entretenimento & Mídia</option>
                        <option value="Saúde e Fitness">Saúde e Fitness</option>
                        <option value="Educação">Educação & Cursos</option>
                        <option value="Estilo de Vida">Estilo de Vida</option>
                        <option value="Arte e Design">Arte e Design</option>
                        <option value="Negócios">Negócios</option>
                        <option value="Notícias e Revistas">Notícias e Revistas</option>
                        <option value="Personalização">Personalização</option>
                      </optgroup>
                      <option value="__custom__">✏️ Outra categoria (digitar à vontade)...</option>
                    </select>
                  )}
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Liberdade para definir qualquer gênero ou nicho de app
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Classificação Indicativa
                  </label>
                  <select
                    value={formData.contentRating}
                    onChange={(e) => setFormData({ ...formData, contentRating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm bg-white focus:outline-none focus:border-[#01875f]"
                  >
                    <option value="Livre">Livre (Todos os públicos)</option>
                    <option value="10">10 Anos</option>
                    <option value="12">12 Anos</option>
                    <option value="14">14 Anos</option>
                    <option value="16">16 Anos</option>
                    <option value="18">18 Anos</option>
                  </select>
                </div>
              </div>

              {/* Tags / Keywords */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Tags & Palavras-chave (Separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''}
                  onChange={(e) => {
                    const parsed = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                    setFormData({ ...formData, tags: parsed });
                  }}
                  placeholder="Ex: Ofertas, Descontos, Supermercado, Economia"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                />
                <p className="text-[11px] text-neutral-400 mt-0.5">Tags visíveis nos crachás do aplicativo</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    E-mail de Suporte
                  </label>
                  <input
                    type="email"
                    value={formData.developerEmail}
                    onChange={(e) => setFormData({ ...formData, developerEmail: e.target.value })}
                    placeholder="suporte@empresa.com.br"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Site Oficial
                  </label>
                  <input
                    type="url"
                    value={formData.developerWebsite}
                    onChange={(e) => setFormData({ ...formData, developerWebsite: e.target.value })}
                    placeholder="https://www.empresa.com.br"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  Resumo / Descrição Curta
                </label>
                <textarea
                  rows={2}
                  value={formData.descriptionShort}
                  onChange={(e) => setFormData({ ...formData, descriptionShort: e.target.value })}
                  placeholder="Descrição exibida no topo da página..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                />
              </div>

              {/* What's New / Changelog */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                  O que há de novo / Notas da Versão (Uma por linha)
                </label>
                <textarea
                  rows={3}
                  value={Array.isArray(formData.whatsNew) ? formData.whatsNew.join('\n') : ''}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(Boolean);
                    setFormData({ ...formData, whatsNew: lines });
                  }}
                  placeholder="Ex: Melhorias de estabilidade&#10;Novo modo escuro&#10;Correções de bugs"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                />
              </div>

            </div>
          )}

          {/* TAB 3: Stats */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Nota de Avaliação
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-mono focus:outline-none focus:border-[#01875f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Texto Avaliações
                  </label>
                  <input
                    type="text"
                    value={formData.ratingCount}
                    onChange={(e) => setFormData({ ...formData, ratingCount: e.target.value })}
                    placeholder="Ex: 385 mil avaliações"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                    Downloads
                  </label>
                  <input
                    type="text"
                    value={formData.downloads}
                    onChange={(e) => setFormData({ ...formData, downloads: e.target.value })}
                    placeholder="Ex: 10 mi+"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#01875f]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-2">
                <p className="font-semibold text-neutral-800">
                  Dica de consistência visual:
                </p>
                <p>
                  As métricas alteradas aqui serão refletidas instantaneamente na barra de estatísticas do topo, na seção de avaliações e no rodapé do aplicativo.
                </p>
              </div>

            </div>
          )}

          {/* TAB 5: Sincronização com Celular (Vercel / Hospedagem) */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#01875f] shrink-0" />
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Por que a alteração apareceu no computador mas não no celular?
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  A hospedagem no <strong>Vercel</strong> é estática (funciona sem servidor com banco de dados próprio). Quando você salva alterações no navegador do seu computador, elas ficam salvas no armazenamento local do seu computador.
                </p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Para que o seu celular <strong>receba instantaneamente o mesmo aplicativo, ícone, botão e estatísticas</strong>, basta abrir o link sincronizado abaixo no celular (ou escanear o QR Code). Assim que o celular abre esse link, ele grava todas as alterações na memória dele permanentemente!
                </p>
              </div>

              {/* Cloud Sync Status & Force Sync Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-neutral-900 border border-emerald-500/30 text-white space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white">Sincronização na Nuvem Global (Ativa)</h4>
                    </div>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      Todas as alterações que você salva no PC são enviadas para a nuvem global. Ao abrir a página no celular, ele busca automaticamente a versão mais recente!
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isCloudSyncing}
                    onClick={handleForceCloudSync}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isCloudSyncing ? (
                      <span>Sincronizando...</span>
                    ) : (
                      <>
                        <DownloadCloud className="w-4 h-4" />
                        <span>Sincronizar Nuvem Agora</span>
                      </>
                    )}
                  </button>
                </div>

                {cloudSyncStatus && (
                  <div className="p-2.5 rounded-xl bg-white/10 border border-emerald-400/30 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{cloudSyncStatus}</span>
                  </div>
                )}
              </div>

              {/* QR Code and Mobile Link Card */}
              <div className="border border-neutral-200 rounded-3xl p-5 bg-white shadow-xs space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                    Link Direto com Sincronização Instantânea (Vercel)
                  </span>
                  <p className="text-xs text-neutral-500">
                    Aponte a câmera do seu celular para o QR Code abaixo ou envie o link pelo WhatsApp para abrir a página no celular já com todas as alterações carregadas:
                  </p>
                </div>

                <div className="flex justify-center py-2">
                  <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md inline-block">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(generateMobileSyncUrl(formData, VERCEL_PROD_URL))}`}
                      alt="QR Code para Sincronizar com Celular" 
                      className="w-48 h-48 rounded-xl object-contain"
                    />
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = generateMobileSyncUrl(formData, VERCEL_PROD_URL);
                      navigator.clipboard.writeText(url);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }}
                    className="w-full py-2.5 px-4 bg-[#01875f] hover:bg-[#017252] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Link Copiado para o Celular!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Link Vercel para o Celular</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Abra este link no celular para carregar o aplicativo "${formData.name}" atualizado: ${generateMobileSyncUrl(formData, VERCEL_PROD_URL)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer text-center"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Enviar para meu WhatsApp</span>
                  </a>
                </div>

                <div className="text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 font-mono break-all text-center">
                  {generateMobileSyncUrl(formData, VERCEL_PROD_URL)}
                </div>
              </div>

              {/* Permanent Code Export (For Vercel permanent default) */}
              <div className="border border-neutral-200 rounded-3xl p-5 bg-neutral-50/70 space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    2. Deixar Fixo no Repositório (Permanente para Todos)
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Se você deseja que qualquer visitante novo no mundo que acesse <code>google-play-rho.vercel.app</code> (mesmo sem escanear o QR Code) já veja o <strong>{formData.name}</strong> por padrão, você pode baixar o arquivo de configuração e substituir o <code>src/data/defaultConfig.json</code> no seu GitHub:
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const jsonStr = JSON.stringify(formData, null, 2);
                      const blob = new Blob([jsonStr], { type: 'application/json' });
                      downloadBlobAsFile(blob, 'defaultConfig.json');
                    }}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar defaultConfig.json</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const jsonStr = JSON.stringify(formData, null, 2);
                      navigator.clipboard.writeText(jsonStr);
                      setCopiedJson(true);
                      setTimeout(() => setCopiedJson(false), 3000);
                    }}
                    className="px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedJson ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>JSON Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar JSON</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={onResetToAssai}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão Assaí</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#01875f] hover:bg-[#017252] text-white rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
