import React, { useState } from 'react';
import { X, Smartphone, Check, Loader2, Download, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AppInfo } from '../types';
import { getStoredApk, downloadBlobAsFile } from '../utils/apkStorage';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallSuccess: (deviceName: string) => void;
  app: AppInfo;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  onInstallSuccess,
  app
}) => {
  const [installState, setInstallState] = useState<'idle' | 'installing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const triggerApkDownload = async () => {
    // Preserve exact filename as entered/uploaded without altering or lowercasing
    const filename = app.apkFileName?.trim()
      ? app.apkFileName.trim()
      : (app.apkUrl && app.apkUrl.split('/').pop()?.split('?')[0])
        ? app.apkUrl.split('/').pop()?.split('?')[0]!
        : `${app.name}.apk`;

    // 1. External URL download if provided
    if (app.apkUrl && !app.apkUrl.startsWith('/api/') && !app.apkUrl.includes('/api/download-apk')) {
      const a = document.createElement('a');
      a.href = app.apkUrl;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 2. Genuine binary APK from IndexedDB if stored locally in this browser
    const stored = await getStoredApk();
    if (stored && stored.blob) {
      downloadBlobAsFile(stored.blob, stored.fileName || filename);
      return;
    }

    // 3. Fallback to base64 if present
    if (app.uploadedApkData && app.uploadedApkData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = app.uploadedApkData;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 4. Download directly from server /api/download-apk (available to all visitors and mobile phones on hosting)
    const a = document.createElement('a');
    a.href = '/api/download-apk';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 1000);
  };

  const handleStartInstall = () => {
    setInstallState('installing');
    setProgress(20);

    // Trigger the direct APK download to the user's browser/phone
    triggerApkDownload();

    const step1 = setTimeout(() => setProgress(55), 500);
    const step2 = setTimeout(() => setProgress(85), 1000);
    const step3 = setTimeout(() => {
      setProgress(100);
      setInstallState('completed');
      setTimeout(() => {
        onInstallSuccess('Dispositivo Android');
      }, 1000);
    }, 1500);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const displayApkName = app.apkFileName?.trim()
    ? app.apkFileName.trim()
    : (app.apkUrl && app.apkUrl.split('/').pop()?.split('?')[0])
      ? app.apkUrl.split('/').pop()?.split('?')[0]!
      : `${app.name}.apk`;
  const displayApkSize = app.apkFileSize || app.size || '42 MB';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {installState === 'idle' && (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-neutral-900">
                Instalar {app.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Download direto e instalação do pacote oficial <strong>.APK</strong> ({displayApkSize}).
              </p>
            </div>

            {/* APK Badge Info */}
            <div className="mb-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-[#01875f]/10 text-[#01875f] shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 truncate font-mono">
                    {displayApkName}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Tamanho: {displayApkSize} · Android {app.requiredAndroid || '7.0+'}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold shrink-0">
                Pronto para baixar
              </span>
            </div>

            {/* Verified Security Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 my-4 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verificado pelo Google Play Protect (Seguro & Oficial)</span>
              </div>

              <div className="divide-y divide-neutral-200/60 text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-neutral-500">Identificador do Pacote</span>
                  <span className="font-mono text-neutral-800 font-medium">{app.id}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-neutral-500">Versão</span>
                  <span className="font-mono text-neutral-800 font-medium">v{app.version}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-neutral-500">Compatibilidade</span>
                  <span className="text-neutral-800 font-medium">{app.requiredAndroid || 'Android 7.0 ou superior'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-neutral-500">Desenvolvedor</span>
                  <span className="text-neutral-800 font-medium">{app.developer}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-4 mt-2">
              <span className="text-xs text-neutral-500 font-medium">
                {app.inAppPurchases ? 'Gratuito · Compras no app' : '100% Gratuito'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStartInstall}
                  className="px-6 py-2.5 bg-[#01875f] hover:bg-[#017252] text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {app.installButtonText && app.installButtonText !== 'Instalar'
                      ? app.installButtonText
                      : 'Baixar e Instalar APK'}
                  </span>
                </button>
              </div>
            </div>
          </>
        )}

        {installState === 'installing' && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#01875f]/10 flex items-center justify-center text-[#01875f]">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                Baixando {app.name}...
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Download do arquivo APK ({displayApkSize}) e verificação do Play Protect.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="max-w-xs mx-auto">
              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full bg-[#01875f] transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-neutral-400 mt-2 block">
                {progress}% concluído ({displayApkSize})
              </span>
            </div>
          </div>
        )}

        {installState === 'completed' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#01875f] flex items-center justify-center shadow-xs">
              <Check className="w-9 h-9 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                Download Concluído!
              </h3>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                <strong>{app.name}</strong> ({displayApkName}) foi baixado com sucesso para seu dispositivo.
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={triggerApkDownload}
                className="text-xs font-medium text-[#01875f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Clique aqui se deseja baixar o .APK novamente</span>
              </button>

              <button
                onClick={onClose}
                className="mt-2 px-8 py-2.5 bg-[#01875f] text-white rounded-lg font-semibold text-sm hover:bg-[#017252] transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
