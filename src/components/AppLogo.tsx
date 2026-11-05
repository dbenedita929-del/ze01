import React from 'react';
import { AppInfo } from '../types';
import { 
  Sun, 
  ShoppingCart, 
  Sparkles, 
  Store, 
  Package, 
  Percent, 
  ShoppingBag,
  Flame
} from 'lucide-react';

interface AppLogoProps {
  app: AppInfo;
  sizeClassName?: string;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  app,
  sizeClassName = 'w-24 h-24 sm:w-32 sm:h-32',
  className = ''
}) => {
  const [hasImageError, setHasImageError] = React.useState(false);

  // Reset error when URL changes
  React.useEffect(() => {
    setHasImageError(false);
  }, [app.customLogoUrl]);

  // If user uploaded a custom logo image or entered an image URL
  if ((app.logoMode === 'upload' || app.logoMode === 'url') && app.customLogoUrl && !hasImageError) {
    return (
      <div className={`relative shrink-0 ${sizeClassName} rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-neutral-100 bg-neutral-100 flex items-center justify-center ${className}`}>
        <img
          src={app.customLogoUrl}
          alt={app.name}
          className="w-full h-full object-cover"
          onError={() => setHasImageError(true)}
        />
      </div>
    );
  }

  // Preset: Assaí Atacadista (Default)
  const isAssai = app.logoPreset === 'assai' || (!app.logoPreset && app.name.toLowerCase().includes('assa'));

  if (isAssai) {
    return (
      <div className={`relative shrink-0 ${sizeClassName} rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,45,114,0.35)] border border-blue-900/20 bg-gradient-to-b from-[#003380] via-[#002660] to-[#00173d] flex flex-col items-center justify-center p-2 group select-none ${className}`}>
        {/* Radial Sun Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#ffb81c]/25 rounded-full blur-xl pointer-events-none" />

        {/* Rising Sun Graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center w-full px-1">
          {/* Sun Rays & Half Sun */}
          <div className="relative w-12 h-8 sm:w-16 sm:h-10 mb-1 flex items-end justify-center">
            {/* Red Arc Background */}
            <div className="absolute inset-0 bg-[#da291c] rounded-t-full shadow-md" />
            {/* Golden Sun Foreground */}
            <div className="relative w-9 h-6 sm:w-12 sm:h-8 bg-[#ffb81c] rounded-t-full flex items-center justify-center shadow-inner overflow-hidden">
              <Sun className="w-5 h-5 sm:w-7 sm:h-7 text-[#da291c] animate-spin-slow" />
            </div>
          </div>

          {/* Typography: ASSAÍ */}
          <span className="text-white font-black text-xs sm:text-base tracking-wider leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            ASSAÍ
          </span>
          {/* Subtext: ATACADISTA */}
          <span className="text-[#ffb81c] font-bold text-[8px] sm:text-[10px] tracking-widest uppercase leading-tight mt-0.5 drop-shadow-sm font-sans">
            ATACADISTA
          </span>
        </div>

        {/* Gloss highlight */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-3xl" />
      </div>
    );
  }

  // Preset: Supermarket / Atacado
  if (app.logoPreset === 'supermarket') {
    return (
      <div className={`relative shrink-0 ${sizeClassName} rounded-3xl overflow-hidden shadow-lg border border-emerald-500/20 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex flex-col items-center justify-center p-2 text-white ${className}`}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-1">
          <ShoppingCart className="w-7 h-7 sm:w-9 sm:h-9 text-amber-300" />
        </div>
        <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-emerald-200 font-mono">
          ATACADO
        </span>
      </div>
    );
  }

  // Preset: Delivery / Shopping
  if (app.logoPreset === 'delivery') {
    return (
      <div className={`relative shrink-0 ${sizeClassName} rounded-3xl overflow-hidden shadow-lg border border-rose-500/20 bg-gradient-to-br from-rose-500 via-red-600 to-amber-700 flex flex-col items-center justify-center p-2 text-white ${className}`}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-1">
          <ShoppingBag className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
        </div>
        <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-amber-200 font-mono">
          DELIVERY
        </span>
      </div>
    );
  }

  // Preset: AI Mirror Art (Retro / Sci-Fi)
  if (app.logoPreset === 'aimirror') {
    return (
      <div className={`relative shrink-0 ${sizeClassName} rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-neutral-100 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center p-2 group ${className}`}>
        <div className="absolute inset-0 bg-radial from-fuchsia-500/30 via-cyan-500/20 to-transparent opacity-90 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-300 p-0.5 shadow-lg flex items-center justify-center rotate-3">
            <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-300 fill-cyan-300/40 animate-pulse" />
            </div>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-cyan-200 mt-1 font-mono">
            AI MIRROR
          </span>
        </div>
      </div>
    );
  }

  // Custom Icon Generator Mode
  const bg = app.logoBgColor || 'bg-gradient-to-br from-blue-700 to-indigo-950';
  
  return (
    <div className={`relative shrink-0 ${sizeClassName} rounded-3xl overflow-hidden shadow-lg border border-neutral-200 ${bg} flex flex-col items-center justify-center p-2 text-white ${className}`}>
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-1">
        {app.logoIconSymbol === 'sun' && <Sun className="w-7 h-7 sm:w-9 sm:h-9 text-amber-300" />}
        {app.logoIconSymbol === 'cart' && <ShoppingCart className="w-7 h-7 sm:w-9 sm:h-9 text-white" />}
        {app.logoIconSymbol === 'store' && <Store className="w-7 h-7 sm:w-9 sm:h-9 text-emerald-300" />}
        {app.logoIconSymbol === 'package' && <Package className="w-7 h-7 sm:w-9 sm:h-9 text-amber-200" />}
        {app.logoIconSymbol === 'badge-percent' && <Percent className="w-7 h-7 sm:w-9 sm:h-9 text-rose-300" />}
        {(!app.logoIconSymbol || app.logoIconSymbol === 'sparkles') && <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-300" />}
      </div>
      {app.logoBadgeText && (
        <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-neutral-200 font-mono">
          {app.logoBadgeText}
        </span>
      )}
    </div>
  );
};
