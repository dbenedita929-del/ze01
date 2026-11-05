import React, { useState } from 'react';
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Check, 
  Smartphone,
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { AppInfo } from '../types';
import { AppLogo } from './AppLogo';

interface AppHeroProps {
  app: AppInfo;
  onInstallClick: () => void;
  onShareClick?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  installedDeviceName?: string | null;
  onSelectDevicesClick: () => void;
  onOpenAdminPanel: () => void;
  onSaveApp?: (updatedApp: AppInfo) => void;
}

export const AppHero: React.FC<AppHeroProps> = ({
  app,
  onInstallClick,
  onShareClick,
  isWishlisted,
  onToggleWishlist,
  installedDeviceName,
  onSelectDevicesClick,
  onOpenAdminPanel,
  onSaveApp
}) => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  return (
    <section className="pt-8 pb-10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main App Info (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* App Header Lockup */}
            <div className="flex items-start gap-5 sm:gap-6">
              
              {/* App Icon (Display only - editing is only inside Admin Panel) */}
              <div className="shrink-0 select-none">
                <AppLogo app={app} sizeClassName="w-24 h-24 sm:w-32 sm:h-32" />
              </div>

              {/* Title & Developer Meta */}
              <div className="space-y-1 sm:space-y-1.5 pt-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                    {app.name}
                  </h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const devSec = document.getElementById('sobre-o-desenvolvedor');
                      if (devSec) devSec.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#01875f] font-semibold text-sm sm:text-base hover:underline text-left cursor-pointer"
                  >
                    {app.developer}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span>{app.containsAds ? 'Contém anúncios' : 'Sem anúncios'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{app.inAppPurchases ? 'Compras no app' : 'Gratuito'}</span>
                </div>
              </div>
            </div>

            {/* Metrics Row (Google Play Authentic Grid) */}
            <div className="flex items-center divide-x divide-neutral-200 pt-2 pb-1 max-w-lg">
              
              {/* Rating */}
              <div className="pr-6 sm:pr-8">
                <div className="flex items-center gap-1">
                  <span className="text-sm sm:text-base font-bold text-neutral-900 tabular-nums">
                    {app.rating.toString().replace('.', ',')}
                  </span>
                  <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 whitespace-nowrap">
                  {app.ratingCount}
                </p>
              </div>

              {/* Downloads */}
              <div className="px-6 sm:px-8">
                <p className="text-sm sm:text-base font-bold text-neutral-900 tabular-nums">
                  {app.downloads}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5 whitespace-nowrap">
                  downloads
                </p>
              </div>

              {/* Classification Mini Badge for Mobile */}
              <div className="pl-6 sm:pl-8 lg:hidden">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded text-white text-xs font-bold flex items-center justify-center ${
                    app.contentRating === 'Livre' 
                      ? 'bg-[#009639]' 
                      : app.contentRating === '10' 
                      ? 'bg-[#0084c9]' 
                      : app.contentRating === '12' 
                      ? 'bg-[#e5a00d]' 
                      : app.contentRating === '16'
                      ? 'bg-[#e53935]'
                      : app.contentRating === '18'
                      ? 'bg-[#212121]'
                      : 'bg-[#f57c00]'
                  }`}>
                    {app.contentRating === 'Livre' ? 'L' : app.contentRating}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 whitespace-nowrap">
                  {app.contentRating === 'Livre' ? 'Livre' : `${app.contentRating} anos`}
                </p>
              </div>

            </div>

            {/* Action Buttons - Primary Action using configured button name */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              
              {/* Primary Install Button */}
              <button
                onClick={onInstallClick}
                className="px-8 py-2.5 rounded-lg bg-[#01875f] hover:bg-[#017252] active:bg-[#015f43] text-white font-medium text-sm sm:text-base transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01875f]/50 whitespace-nowrap flex items-center gap-2 cursor-pointer"
              >
                {installedDeviceName ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Instalado no {installedDeviceName}</span>
                  </>
                ) : (
                  <span>{app.installButtonText?.trim() || 'Instalar'}</span>
                )}
              </button>

              {/* Share Button */}
              {onShareClick && (
                <button
                  type="button"
                  onClick={onShareClick}
                  className="px-4 py-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 text-[#01875f] font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
                  title="Compartilhar aplicativo"
                >
                  <Share2 className="w-4 h-4 text-[#01875f]" />
                  <span>Compartilhar</span>
                </button>
              )}

              {/* Wishlist Button */}
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={onToggleWishlist}
                  className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2 text-sm font-medium cursor-pointer ${
                    isWishlisted
                      ? 'border-[#01875f] bg-[#01875f]/10 text-[#01875f]'
                      : 'border-neutral-300 hover:bg-neutral-50 text-neutral-700'
                  }`}
                  title={isWishlisted ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
                >
                  {isWishlisted ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-[#01875f]" />
                      <span>Na lista de desejos</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4 text-neutral-600" />
                      <span>Adicionar à lista de desejos</span>
                    </>
                  )}
                </button>
              )}

            </div>

            {/* Direct APK Compatibility Info */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
              <Smartphone className="w-4 h-4 text-[#01875f] shrink-0" />
              <span>Compatível com seu dispositivo Android ({app.requiredAndroid || 'Android 7.0 ou superior'})</span>
            </div>

          </div>

          {/* Right Column: Age Rating Box & App Support Accordion (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-4 pt-2">
            
            {/* Age Rating Box */}
            <div className="border border-neutral-200 rounded-2xl p-4 sm:p-5 bg-white shadow-xs">
              <div className="flex items-start gap-4">
                {/* Rating Badge (Livre = Green L; 10/12/14/16/18 = Numbers) */}
                <div className={`w-12 h-12 rounded-lg text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs ${
                  app.contentRating === 'Livre' 
                    ? 'bg-[#009639]' 
                    : app.contentRating === '10' 
                    ? 'bg-[#0084c9]' 
                    : app.contentRating === '12' 
                    ? 'bg-[#e5a00d]' 
                    : app.contentRating === '16'
                    ? 'bg-[#e53935]'
                    : app.contentRating === '18'
                    ? 'bg-[#212121]'
                    : 'bg-[#f57c00]'
                }`}>
                  {app.contentRating === 'Livre' ? 'L' : app.contentRating}
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-snug">
                    Classificação {app.contentRating === 'Livre' ? 'Livre' : `${app.contentRating} anos`}
                  </h3>
                  <p className="text-xs text-neutral-600">
                    {app.contentRatingNotes && app.contentRatingNotes.length > 0
                      ? app.contentRatingNotes.join(' · ')
                      : app.contentRating === 'Livre'
                      ? 'Para todos os públicos'
                      : 'Orientação parental'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {app.inAppPurchases ? 'Compras no Aplicativo' : 'Totalmente Gratuito'}
                  </p>
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="text-xs font-medium text-[#01875f] hover:underline pt-1 inline-block cursor-pointer"
                  >
                    Saiba mais
                  </button>
                </div>
              </div>
            </div>

            {/* Support do App Accordion (Matches screenshot) */}
            <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setIsSupportOpen(!isSupportOpen)}
                className="w-full flex items-center justify-between p-4 text-sm font-medium text-neutral-800 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-neutral-900">Suporte do app</span>
                {isSupportOpen ? (
                  <ChevronUp className="w-5 h-5 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-500" />
                )}
              </button>

              {isSupportOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-neutral-100 space-y-3 text-xs text-neutral-600 bg-neutral-50/50">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-700">Site do desenvolvedor</p>
                      <a 
                        href={app.developerWebsite} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#01875f] hover:underline break-all"
                      >
                        {app.developerWebsite}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-700">E-mail de suporte</p>
                      <a 
                        href={`mailto:${app.developerEmail}`} 
                        className="text-[#01875f] hover:underline"
                      >
                        {app.developerEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-700">Endereço da sede</p>
                      <p className="text-neutral-500">{app.developerAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <ShieldAlert className="w-4 h-4 text-neutral-400 shrink-0" />
                    <a 
                      href={app.privacyPolicyUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-[#01875f] hover:underline font-medium"
                    >
                      Política de Privacidade
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Rating Classification Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg text-white flex items-center justify-center font-bold text-lg ${
                app.contentRating === 'Livre' 
                  ? 'bg-[#009639]' 
                  : app.contentRating === '10' 
                  ? 'bg-[#0084c9]' 
                  : app.contentRating === '12' 
                  ? 'bg-[#e5a00d]' 
                  : app.contentRating === '16'
                  ? 'bg-[#e53935]'
                  : app.contentRating === '18'
                  ? 'bg-[#212121]'
                  : 'bg-[#f57c00]'
              }`}>
                {app.contentRating === 'Livre' ? 'L' : app.contentRating}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-lg">
                  Classificação {app.contentRating === 'Livre' ? 'Livre' : `${app.contentRating} Anos`}
                </h3>
                <p className="text-xs text-neutral-500">Classificação Indicativa (Brasil / Ministério da Justiça)</p>
              </div>
            </div>

            <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
              {app.contentRating === 'Livre'
                ? `O aplicativo oficial ${app.name} possui Classificação Livre e é recomendado para todos os públicos, sem restrição de idade.`
                : `Este aplicativo é recomendado para pessoas com ${app.contentRating} anos ou mais. ${app.contentRatingNotes && app.contentRatingNotes.length > 0 ? `Identificadores: ${app.contentRatingNotes.join(', ')}.` : ''}`}
            </p>

            <div className="bg-neutral-50 rounded-xl p-3 mb-5 border border-neutral-100 text-xs text-neutral-600 space-y-1">
              <p>• <strong>Desenvolvedor:</strong> {app.developer}</p>
              <p>• <strong>Compras no aplicativo:</strong> {app.inAppPurchases ? 'Permite aquisições opcionais' : 'Totalmente gratuito sem compras internas'}.</p>
            </div>

            <button
              onClick={() => setShowRatingModal(false)}
              className="w-full py-2.5 bg-[#01875f] text-white rounded-lg font-medium text-sm hover:bg-[#017252] transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
