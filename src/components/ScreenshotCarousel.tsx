import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Tablet, Laptop, Sparkles, ZoomIn } from 'lucide-react';
import { ScreenshotItem } from '../types';

interface ScreenshotCarouselProps {
  screenshots: ScreenshotItem[];
  onOpenLightbox: (index: number) => void;
  appName?: string;
}

export const ScreenshotCarousel: React.FC<ScreenshotCarouselProps> = ({
  screenshots,
  onOpenLightbox,
  appName = 'AI MIRROR'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [deviceTab, setDeviceTab] = useState<'phone' | 'tablet' | 'chromebook'>('phone');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-6 border-b border-neutral-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Device Switcher Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setDeviceTab('phone')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              deviceTab === 'phone'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Celular</span>
          </button>

          <button
            onClick={() => setDeviceTab('tablet')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              deviceTab === 'tablet'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDeviceTab('chromebook')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              deviceTab === 'chromebook'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Chromebook</span>
          </button>

          <span className="text-xs text-neutral-400 ml-auto hidden sm:inline-block">
            Clique em qualquer imagem para ampliar
          </span>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              onClick={() => handleScroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-neutral-800 shadow-lg border border-neutral-200/80 flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer"
              aria-label="Rolar para a esquerda"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Scroll Right Button (Matches screenshot arrow) */}
          {canScrollRight && (
            <button
              onClick={() => handleScroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 text-neutral-800 shadow-lg border border-neutral-200/80 flex items-center justify-center hover:bg-white hover:scale-105 transition-all cursor-pointer"
              aria-label="Rolar para a direita"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Cards Track */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-4 sm:gap-5 overflow-x-auto scroll-smooth py-2 px-1 no-scrollbar"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {screenshots.map((item, index) => {
              const isTabletView = deviceTab === 'tablet';
              const isChromebookView = deviceTab === 'chromebook';

              return (
                <div
                  key={item.id}
                  onClick={() => onOpenLightbox(index)}
                  style={{ scrollSnapAlign: 'start' }}
                  className={`shrink-0 cursor-pointer group/card transition-all duration-300 hover:-translate-y-1 ${
                    isTabletView
                      ? 'w-[320px] sm:w-[360px] h-[460px]'
                      : isChromebookView
                      ? 'w-[380px] sm:w-[440px] h-[300px]'
                      : 'w-[200px] sm:w-[240px] md:w-[260px] h-[400px] sm:h-[480px]'
                  }`}
                >
                  {/* Phone Bezel Simulator */}
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl border-2 border-neutral-200/90 shadow-md group-hover/card:shadow-xl group-hover/card:border-neutral-400 overflow-hidden relative flex flex-col justify-between bg-neutral-900 transition-all">
                    
                    {/* Visual Art Transformation Canvas */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-90`}>
                      {/* Subtle Grid / Pattern overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/60" />
                    </div>

                    {/* Card Top Header */}
                    <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] sm:text-xs font-semibold text-white tracking-wide border border-white/10 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        {item.styleTag}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold text-white uppercase backdrop-blur-xs">
                        {item.badge}
                      </span>
                    </div>

                    {/* Center Art Preview Graphic */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 text-center">
                      {/* Interactive Dual-Side Comparison Graphic */}
                      <div className="relative w-full max-w-[200px] aspect-3/4 rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xs flex items-center justify-center group-hover/card:scale-105 transition-transform duration-300">
                        
                        {/* Mock Avatar Illustration Representation */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-indigo-950 flex flex-col items-center justify-center p-4">
                          <div 
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 flex items-center justify-center shadow-lg relative overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${item.accentColor}, #18181b)` }}
                          >
                            <Sparkles className="w-8 h-8 text-white drop-shadow-md animate-pulse" />
                            <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/60 text-[8px] text-white text-center font-mono">
                              {appName.toUpperCase().slice(0, 14)}
                            </div>
                          </div>

                          <span className="text-[11px] font-medium text-white/90 mt-3 max-w-[150px] line-clamp-2">
                            {item.beforeLabel} ➔ {item.afterLabel}
                          </span>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="p-2 rounded-full bg-white/30 backdrop-blur-md text-white">
                            <ZoomIn className="w-5 h-5" />
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Card Bottom Description */}
                    <div className="relative z-10 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-6 text-white">
                      <h4 className="text-sm sm:text-base font-bold leading-tight drop-shadow-sm">
                        {item.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-neutral-300 line-clamp-2 mt-1">
                        {item.subtitle}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
