import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ScreenshotItem } from '../types';

interface LightboxModalProps {
  isOpen: boolean;
  currentIndex: number;
  screenshots: ScreenshotItem[];
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  appName?: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  currentIndex,
  screenshots,
  onClose,
  onNavigate,
  appName = 'AI MIRROR'
}) => {
  if (!isOpen || !screenshots[currentIndex]) return null;

  const currentItem = screenshots[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < screenshots.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, screenshots.length, onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Fechar galeria"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < screenshots.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Container */}
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Visual Phone Frame */}
        <div className="w-[300px] sm:w-[360px] h-[520px] sm:h-[580px] rounded-[36px] border-4 border-neutral-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col justify-between bg-neutral-950">
          
          <div className={`absolute inset-0 bg-gradient-to-b ${currentItem.gradient} opacity-90`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/80" />

          {/* Top Info */}
          <div className="relative z-10 p-5 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {currentItem.styleTag}
            </span>
            <span className="text-xs text-white/80 font-mono">
              {currentIndex + 1} / {screenshots.length}
            </span>
          </div>

          {/* Center Art Render */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
            <div 
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center relative overflow-hidden backdrop-blur-xs"
              style={{ background: `linear-gradient(135deg, ${currentItem.accentColor}, #09090b)` }}
            >
              <Sparkles className="w-16 h-16 text-white animate-pulse" />
              <div className="absolute inset-x-0 bottom-0 py-1 bg-black/70 text-[9px] font-mono font-bold text-center text-amber-300 tracking-wider">
                {appName.toUpperCase()}
              </div>
            </div>

            <div className="mt-5 text-center px-4">
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                {currentItem.beforeLabel} ➔ {currentItem.afterLabel}
              </p>
              <p className="text-xs text-white/60 mt-1 max-w-xs italic">
                "{currentItem.imagePromptDescription}"
              </p>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="relative z-10 p-6 bg-gradient-to-t from-black via-black/80 to-transparent text-white">
            <h3 className="text-lg font-bold">
              {currentItem.title}
            </h3>
            <p className="text-xs text-neutral-300 mt-1">
              {currentItem.subtitle}
            </p>
          </div>

        </div>

        {/* Thumbnails strip */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto p-1 max-w-md">
          {screenshots.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => onNavigate(idx)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'bg-[#01875f] scale-125 ring-2 ring-white'
                  : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
