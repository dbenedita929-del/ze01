import React, { useState } from 'react';
import { ArrowRight, Star, X } from 'lucide-react';
import { SIMILAR_APPS } from '../data/appData';
import { AppInfo } from '../types';

interface SimilarAppsSectionProps {
  app?: AppInfo;
  onShowToast?: (msg: string) => void;
}

interface SimilarAppItem {
  id: string;
  name: string;
  developer: string;
  category: string;
  rating: number;
  downloads: string;
  iconBg: string;
  iconLetter: string;
  badge: string;
}

const CATEGORY_SIMILAR_APPS: Record<string, SimilarAppItem[]> = {
  compras: [
    {
      id: 'br.com.atacadao.app',
      name: 'Atacadão - Compras e Ofertas',
      developer: 'Atacadão S.A.',
      category: 'Compras',
      rating: 4.6,
      downloads: '10 mi+',
      iconBg: 'bg-orange-600',
      iconLetter: 'A',
      badge: 'Popular'
    },
    {
      id: 'br.com.carrefour.app',
      name: 'Meu Carrefour: Ofertas e Cupons',
      developer: 'Carrefour Brasil',
      category: 'Compras',
      rating: 4.5,
      downloads: '10 mi+',
      iconBg: 'bg-blue-600',
      iconLetter: 'C',
      badge: 'Destaque'
    },
    {
      id: 'br.com.paodeacucar.app',
      name: 'Pão de Açúcar Mais',
      developer: 'GPA',
      category: 'Compras',
      rating: 4.4,
      downloads: '5 mi+',
      iconBg: 'bg-emerald-700',
      iconLetter: 'P',
      badge: ''
    },
    {
      id: 'com.mercadolibre',
      name: 'Mercado Livre: Compras Online',
      developer: 'Mercado Libre',
      category: 'Compras',
      rating: 4.8,
      downloads: '100 mi+',
      iconBg: 'bg-yellow-500',
      iconLetter: 'M',
      badge: 'Top 1'
    },
    {
      id: 'com.luizalabs.magazineluiza',
      name: 'Magalu: Compras com Desconto',
      developer: 'Magazine Luiza S/A',
      category: 'Compras',
      rating: 4.7,
      downloads: '50 mi+',
      iconBg: 'bg-blue-500',
      iconLetter: 'M',
      badge: ''
    }
  ],
  financas: [
    {
      id: 'com.nu.production',
      name: 'Nubank: Conta, Cartão e Mais',
      developer: 'Nu Pagamentos S.A.',
      category: 'Finanças',
      rating: 4.8,
      downloads: '100 mi+',
      iconBg: 'bg-purple-700',
      iconLetter: 'N',
      badge: 'Top 1'
    },
    {
      id: 'br.com.intermedium',
      name: 'Banco Inter: Conta e Cartão',
      developer: 'Banco Inter S.A.',
      category: 'Finanças',
      rating: 4.7,
      downloads: '50 mi+',
      iconBg: 'bg-orange-500',
      iconLetter: 'I',
      badge: 'Popular'
    },
    {
      id: 'com.picpay',
      name: 'PicPay: Conta Digital e PIX',
      developer: 'PicPay',
      category: 'Finanças',
      rating: 4.6,
      downloads: '50 mi+',
      iconBg: 'bg-emerald-600',
      iconLetter: 'P',
      badge: ''
    },
    {
      id: 'com.c6bank.app',
      name: 'C6 Bank: Cartão e Conta',
      developer: 'Banco C6 S.A.',
      category: 'Finanças',
      rating: 4.5,
      downloads: '10 mi+',
      iconBg: 'bg-neutral-900',
      iconLetter: 'C',
      badge: ''
    },
    {
      id: 'com.itau',
      name: 'Itaú: Cartão, Conta e PIX',
      developer: 'Itaú Unibanco S.A.',
      category: 'Finanças',
      rating: 4.7,
      downloads: '100 mi+',
      iconBg: 'bg-orange-600',
      iconLetter: 'I',
      badge: ''
    }
  ],
  comida: [
    {
      id: 'br.com.brainweb.ifood',
      name: 'iFood Comida e Mercado',
      developer: 'iFood',
      category: 'Comida e Bebidas',
      rating: 4.8,
      downloads: '100 mi+',
      iconBg: 'bg-red-600',
      iconLetter: 'i',
      badge: 'Top 1'
    },
    {
      id: 'com.cerveceriamodelo.zedelivery',
      name: 'Zé Delivery de Bebidas',
      developer: 'Ambev S.A.',
      category: 'Comida e Bebidas',
      rating: 4.8,
      downloads: '10 mi+',
      iconBg: 'bg-amber-500',
      iconLetter: 'Z',
      badge: 'Popular'
    },
    {
      id: 'com.rappi.store',
      name: 'Rappi: Delivery Tudo em Um',
      developer: 'Rappi, Inc.',
      category: 'Comida e Bebidas',
      rating: 4.4,
      downloads: '50 mi+',
      iconBg: 'bg-orange-500',
      iconLetter: 'R',
      badge: ''
    },
    {
      id: 'com.mcdonalds.app',
      name: 'McDonald’s: Ofertas e Cupons',
      developer: 'Arcos Dourados',
      category: 'Comida e Bebidas',
      rating: 4.6,
      downloads: '10 mi+',
      iconBg: 'bg-yellow-500',
      iconLetter: 'M',
      badge: ''
    },
    {
      id: 'com.habibs.app',
      name: 'Habib’s: Esfihas e Delivery',
      developer: 'Habib’s S.A.',
      category: 'Comida e Bebidas',
      rating: 4.5,
      downloads: '5 mi+',
      iconBg: 'bg-rose-700',
      iconLetter: 'H',
      badge: ''
    }
  ]
};

export const SimilarAppsSection: React.FC<SimilarAppsSectionProps> = ({ app, onShowToast }) => {
  const [selectedApp, setSelectedApp] = useState<SimilarAppItem | null>(null);

  // Pick suitable similar apps list
  const catLower = (app?.category || '').toLowerCase();
  const nameLower = (app?.name || '').toLowerCase();

  let appsList = SIMILAR_APPS;
  if (catLower.includes('compra') || catLower.includes('mercado') || nameLower.includes('assa')) {
    appsList = CATEGORY_SIMILAR_APPS.compras;
  } else if (catLower.includes('finan') || catLower.includes('banc') || nameLower.includes('bank') || nameLower.includes('nu')) {
    appsList = CATEGORY_SIMILAR_APPS.financas;
  } else if (catLower.includes('comida') || catLower.includes('bebid') || catLower.includes('delivery') || nameLower.includes('food')) {
    appsList = CATEGORY_SIMILAR_APPS.comida;
  }

  const handleInstallSimilar = (appName: string) => {
    setSelectedApp(null);
    if (onShowToast) {
      onShowToast(`Preparando download de ${appName} no Google Play...`);
    }
  };

  return (
    <section className="py-8 border-b border-neutral-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <span>Apps semelhantes</span>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </h2>
          <span className="text-xs text-neutral-500 hidden sm:inline-block">
            Com base em suas preferências em {app?.category || 'Apps'}
          </span>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {appsList.map((similarApp) => (
            <div
              key={similarApp.id}
              onClick={() => setSelectedApp(similarApp)}
              className="group p-3 rounded-2xl hover:bg-neutral-50 transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
            >
              {/* App Icon */}
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-neutral-100 mb-3 group-hover:scale-102 transition-transform">
                <div className={`w-full h-full ${similarApp.iconBg} flex items-center justify-center text-white font-bold text-2xl`}>
                  {similarApp.iconLetter}
                </div>
                {similarApp.badge && (
                  <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-[9px] font-semibold text-white px-1.5 py-0.5 rounded">
                    {similarApp.badge}
                  </span>
                )}
              </div>

              {/* Title & Dev */}
              <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 truncate group-hover:text-[#01875f] transition-colors">
                {similarApp.name}
              </h4>
              <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                {similarApp.developer}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-600 font-medium">
                <span className="tabular-nums">{similarApp.rating.toString().replace('.', ',')}</span>
                <Star className="w-3 h-3 fill-neutral-700 text-neutral-700" />
                <span className="text-neutral-400">·</span>
                <span className="text-neutral-400 truncate">{similarApp.downloads}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Quick Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-2xl ${selectedApp.iconBg} text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0`}>
                {selectedApp.iconLetter}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base leading-snug">
                  {selectedApp.name}
                </h3>
                <p className="text-xs text-[#01875f] font-medium">{selectedApp.developer}</p>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
                  <span className="font-bold text-neutral-800">{selectedApp.rating} ★</span>
                  <span>·</span>
                  <span>{selectedApp.downloads}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
              Alternativa popular na categoria de <strong>{selectedApp.category}</strong>. Disponível para download gratuito no Google Play com compras opcionais.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleInstallSimilar(selectedApp.name)}
                className="w-full py-2.5 bg-[#01875f] text-white rounded-lg font-medium text-xs sm:text-sm hover:bg-[#017252] transition-colors cursor-pointer"
              >
                Instalar no Google Play
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-full py-2 border border-neutral-200 text-neutral-700 rounded-lg font-medium text-xs hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Voltar ao {app?.name || 'Aplicativo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
