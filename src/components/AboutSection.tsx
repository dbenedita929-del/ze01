import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { AppInfo } from '../types';

interface AboutSectionProps {
  app: AppInfo;
  onTagClick?: (tag: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ app, onTagClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Bulletproof safety against undefined/null or non-array data
  const fullDescription: string[] = Array.isArray(app?.descriptionFull)
    ? app.descriptionFull
    : typeof app?.descriptionFull === 'string'
    ? [(app.descriptionFull as unknown as string)]
    : [app?.descriptionShort || 'Aplicativo oficial com recursos completos e atualizados para Android.'];

  const whatsNewLines: string[] = Array.isArray(app?.whatsNew)
    ? app.whatsNew
    : typeof app?.whatsNew === 'string'
    ? [(app.whatsNew as unknown as string)]
    : ['Correções de bugs e melhorias de desempenho contínuas nesta versão.'];

  const tagList: string[] = Array.isArray(app?.tags)
    ? app.tags
    : typeof app?.tags === 'string'
    ? [(app.tags as unknown as string)]
    : [app?.category || 'Aplicativos'];

  const contentRating = app?.contentRating || 'Livre';
  const contentNotes = Array.isArray(app?.contentRatingNotes)
    ? app.contentRatingNotes
    : typeof app?.contentRatingNotes === 'string'
    ? [(app.contentRatingNotes as unknown as string)]
    : [];

  return (
    <section id="sobre-o-app" className="py-8 border-b border-neutral-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Description Column (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
                <span>Sobre este app</span>
                <ArrowRight className="w-5 h-5 text-neutral-400" />
              </h2>
            </div>

            {/* Short Catchphrase */}
            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
              {app?.descriptionShort || (fullDescription[0] || 'Aplicativo oficial disponível para download.')}
            </p>

            {/* Expandable Full Description */}
            <div className="relative">
              <div 
                className={`space-y-3 text-sm text-neutral-600 leading-relaxed transition-all duration-300 overflow-hidden ${
                  isExpanded ? 'max-h-[1400px]' : 'max-h-36'
                }`}
              >
                {fullDescription.map((p, idx) => (
                  <p key={idx} className={p.startsWith('✨') || p.startsWith('•') || p.startsWith('💳') || p.startsWith('🔒') ? 'text-neutral-800' : ''}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Gradient Mask when Collapsed */}
              {!isExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              )}

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-sm font-semibold text-[#01875f] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isExpanded ? 'Mostrar menos' : 'Saiba mais'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* What's New Box (Google Play style) */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-neutral-900">Novidades</h3>
                <span className="text-xs text-neutral-500 font-mono">v{app?.version || '1.0.0'}</span>
              </div>
              <div className="space-y-1.5 text-xs sm:text-sm text-neutral-600">
                {whatsNewLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Category Tags (Interactive Buttons) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5" />
                <span>Marcadores</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick && onTagClick(tag)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: App Info / Technical Specs (Right 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                Informações do app
              </h3>

              <div className="divide-y divide-neutral-100 text-xs">
                
                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Versão</span>
                  <span className="font-medium text-neutral-900 font-mono">{app?.version || '1.0.0'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Atualizado em</span>
                  <span className="font-medium text-neutral-900">{app?.updatedDate || 'Recente'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Downloads</span>
                  <span className="font-medium text-neutral-900">{app?.downloads || '10 mi+'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Tamanho do download</span>
                  <span className="font-medium text-neutral-900">{app?.size || '45 MB'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Compras no app</span>
                  <span className="font-medium text-neutral-900 text-right">{app?.inAppPriceRange || 'Gratuito'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Requer Android</span>
                  <span className="font-medium text-neutral-900">{app?.requiredAndroid || 'Android 7.0 ou superior'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Oferecido por</span>
                  <span className="font-medium text-[#01875f]">{app?.developer || 'Desenvolvedor Oficial'}</span>
                </div>

                <div className="py-2.5 flex justify-between gap-4">
                  <span className="text-neutral-500">Classificação</span>
                  <span className={`font-medium ${contentRating === 'Livre' ? 'text-emerald-700' : 'text-amber-600'}`}>
                    {contentRating === 'Livre'
                      ? 'Classificação Livre'
                      : `${contentRating} anos ${contentNotes.length > 0 ? `(${contentNotes[0]})` : ''}`}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
