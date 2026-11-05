import React, { useState, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  Sliders, 
  Wand2, 
  RefreshCw, 
  Image as ImageIcon, 
  Tag, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Gamepad2, 
  Send, 
  Zap, 
  Smartphone,
  Flame,
  ArrowRight
} from 'lucide-react';
import { AppInfo } from '../types';

interface StylePreset {
  id: string;
  name: string;
  tag: string;
  beforeDescription: string;
  afterDescription: string;
  themeGradient: string;
  accent: string;
  glow: string;
}

const PRESETS: StylePreset[] = [
  {
    id: 'anime90',
    name: 'Anime Retrô Anos 90',
    tag: 'Clássico Shonen',
    beforeDescription: 'Foto comum de câmera frontal',
    afterDescription: 'Traço cel-shading com granulação analógica e olhar expressivo',
    themeGradient: 'from-amber-600 via-rose-600 to-indigo-900',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2099',
    tag: 'Sci-Fi Neon',
    beforeDescription: 'Retrato urbano noturno',
    afterDescription: 'Implantes cibernéticos, luz volumétrica de neon e atmosfera chuvosa',
    themeGradient: 'from-cyan-500 via-blue-600 to-fuchsia-600',
    accent: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)'
  },
  {
    id: 'vinyltoy',
    name: 'Estatueta 3D Colecionável',
    tag: 'Vinyl Toy',
    beforeDescription: 'Pose casual em pé',
    afterDescription: 'Miniatura estilizada em vinil brilhante com base de acrílico',
    themeGradient: 'from-emerald-500 via-teal-700 to-slate-900',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)'
  },
  {
    id: 'ghibli',
    name: 'Pintura Aquarela Mágica',
    tag: 'Studio Nostalgia',
    beforeDescription: 'Passeio em parque aberto',
    afterDescription: 'Tons pasteis suaves, céu azul profundo e pinceladas aquareladas',
    themeGradient: 'from-sky-400 via-teal-500 to-emerald-600',
    accent: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.4)'
  }
];

interface InteractivePlaygroundProps {
  app?: AppInfo;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({ app }) => {
  const [activePreset, setActivePreset] = useState<StylePreset>(PRESETS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // States for shopping / supermarket app demo (like Assaí)
  const [activeCoupons, setActiveCoupons] = useState<Record<string, boolean>>({
    c1: true,
    c2: false,
    c3: false
  });

  // State for finance apps
  const [pixSent, setPixSent] = useState(false);
  const [pixAmount, setPixAmount] = useState('50,00');

  // State for game apps
  const [gameMode, setGameMode] = useState<'casual' | 'ranked' | 'ultra'>('ultra');
  const [fpsBoost, setFpsBoost] = useState(true);

  // State for generic features test
  const [activeFeatures, setActiveFeatures] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: false,
    3: false
  });

  const catLower = (app?.category || '').toLowerCase();
  const nameLower = (app?.name || '').toLowerCase();

  const isArtOrAiApp = 
    app?.logoPreset === 'aimirror' ||
    catLower.includes('arte') || 
    catLower.includes('foto') || 
    nameLower.includes('mirror') || 
    nameLower.includes('ia') || 
    nameLower.includes('ai');

  const isShoppingApp =
    !isArtOrAiApp && (
      catLower.includes('compra') || 
      catLower.includes('supermercado') || 
      catLower.includes('varejo') || 
      nameLower.includes('assai') || 
      nameLower.includes('atacadao') || 
      nameLower.includes('carrefour') ||
      nameLower.includes('loja')
    );

  const isFinanceApp =
    !isArtOrAiApp && !isShoppingApp && (
      catLower.includes('finan') || 
      nameLower.includes('banco') || 
      nameLower.includes('pix') || 
      nameLower.includes('nu') || 
      nameLower.includes('inter') || 
      nameLower.includes('pag')
    );

  const isGameApp =
    !isArtOrAiApp && !isShoppingApp && !isFinanceApp && (
      catLower.includes('jogo') || 
      catLower.includes('game') || 
      nameLower.includes('fire') || 
      nameLower.includes('battle') ||
      nameLower.includes('gta')
    );

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX);
  };

  const toggleCoupon = (id: string) => {
    setActiveCoupons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. SHOPPING / SUPERMARKET APP DEMO
  if (isShoppingApp) {
    const totalSavings = (activeCoupons.c1 ? 14.50 : 0) + (activeCoupons.c2 ? 8.90 : 0) + (activeCoupons.c3 ? 22.00 : 0);

    return (
      <section className="py-10 bg-neutral-50/70 border-b border-neutral-200/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#01875f] uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Demonstração Interativa</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Experimente os recursos exclusivos do {app?.name || 'Aplicativo'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Ative as ofertas com 1 clique e veja a economia sendo calculada em tempo real para o caixa.
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl flex items-center gap-3">
              <span className="text-xs text-emerald-800 font-medium">Economia calculada:</span>
              <span className="text-lg font-bold text-[#01875f] font-mono">
                R$ {totalSavings.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div 
              onClick={() => toggleCoupon('c1')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeCoupons.c1 
                  ? 'border-[#01875f] bg-[#01875f]/5 shadow-xs' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                  Desconto do App
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeCoupons.c1 ? 'bg-[#01875f] text-white' : 'border border-neutral-300'}`}>
                  {activeCoupons.c1 && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Itens Básicos de Cesta</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Economize R$ 14,50 direto ao informar seu CPF no caixa.</p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#01875f]">
                {activeCoupons.c1 ? '✓ Oferta Ativada' : '+ Clique para ativar'}
              </span>
            </div>

            <div 
              onClick={() => toggleCoupon('c2')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeCoupons.c2 
                  ? 'border-[#01875f] bg-[#01875f]/5 shadow-xs' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                  Hortifrúti e Limpeza
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeCoupons.c2 ? 'bg-[#01875f] text-white' : 'border border-neutral-300'}`}>
                  {activeCoupons.c2 && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Preço de Atacado Unitário</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Leve poucas unidades pagando o menor valor por pacote.</p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#01875f]">
                {activeCoupons.c2 ? '✓ Oferta Ativada' : '+ Clique para ativar'}
              </span>
            </div>

            <div 
              onClick={() => toggleCoupon('c3')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeCoupons.c3 
                  ? 'border-[#01875f] bg-[#01875f]/5 shadow-xs' 
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                  Cartão Exclusivo
                </span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${activeCoupons.c3 ? 'bg-[#01875f] text-white' : 'border border-neutral-300'}`}>
                  {activeCoupons.c3 && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h4 className="font-bold text-sm text-neutral-900">Desconto em Bebidas & Carnes</h4>
              <p className="text-xs text-neutral-500 mt-0.5">Economize R$ 22,00 adicionais com pagamento facilitado.</p>
              <span className="inline-block mt-3 text-xs font-semibold text-[#01875f]">
                {activeCoupons.c3 ? '✓ Oferta Ativada' : '+ Clique para ativar'}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. FINANCE / BANK APP DEMO
  if (isFinanceApp) {
    return (
      <section className="py-10 bg-neutral-50/70 border-b border-neutral-200/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#01875f] uppercase tracking-wider mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Simulador de Conta Digital</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Teste a agilidade financeira do {app?.name || 'Aplicativo'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Simule um envio de PIX instantâneo com segurança ponta a ponta.
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl flex items-center gap-3">
              <span className="text-xs text-emerald-800 font-medium">Saldo em conta:</span>
              <span className="text-lg font-bold text-[#01875f] font-mono">
                R$ {pixSent ? '1.800,00' : '1.850,00'}
              </span>
            </div>
          </div>

          <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Área PIX 24h</span>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">Sem tarifas</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-700">R$</span>
              <input 
                type="text" 
                value={pixAmount} 
                onChange={(e) => setPixAmount(e.target.value)}
                className="w-full text-lg font-bold text-neutral-900 border-b border-neutral-300 focus:outline-none focus:border-[#01875f] py-1"
                placeholder="0,00"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPixSent(true);
                setTimeout(() => setPixSent(false), 3000);
              }}
              className="w-full py-3 bg-[#01875f] hover:bg-[#017252] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {pixSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>PIX Enviado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transferir PIX Agora</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 3. GAMES APP DEMO
  if (isGameApp) {
    return (
      <section className="py-10 bg-neutral-900 text-white border-b border-neutral-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Modo de Jogo & Desempenho</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Otimização para {app?.name || 'Jogos'}
              </h2>
              <p className="text-sm text-neutral-400 mt-1">
                Ajuste os gráficos para alta performance com 120 FPS estáveis.
              </p>
            </div>
            
            <div className="bg-neutral-800 border border-neutral-700 px-4 py-2 rounded-2xl flex items-center gap-3">
              <span className="text-xs text-neutral-400 font-medium">Taxa de quadros:</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {fpsBoost ? '120 FPS' : '60 FPS'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {(['casual', 'ranked', 'ultra'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setGameMode(mode)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  gameMode === mode
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                    : 'border-neutral-800 bg-neutral-800/60 hover:border-neutral-700 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase">
                    {mode === 'casual' ? 'Modo Básico' : mode === 'ranked' ? 'Competitivo' : 'Gráficos Ultra HD'}
                  </span>
                  {gameMode === mode && <Flame className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-xs text-neutral-400">
                  {mode === 'ultra' ? 'Texturas em 4K e sombras dinâmicas ativadas.' : 'Equilíbrio entre consumo de bateria e fluidez.'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 4. GENERIC / UTILITIES / OTHER APP DEMO
  if (!isArtOrAiApp && app?.features && app.features.length > 0) {
    return (
      <section className="py-10 bg-neutral-50/70 border-b border-neutral-200/70">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#01875f] uppercase tracking-wider mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Recursos Interativos em Destaque</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Descubra o potencial do {app?.name || 'Aplicativo'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                Clique nos recursos abaixo para testar as ferramentas integradas em tempo real.
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl flex items-center gap-3">
              <span className="text-xs text-emerald-800 font-medium">Status do App:</span>
              <span className="text-sm font-bold text-[#01875f] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Otimizado
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {app.features.map((feat, idx) => {
              const isAct = activeFeatures[idx];
              return (
                <div
                  key={idx}
                  onClick={() => setActiveFeatures(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isAct 
                      ? 'border-[#01875f] bg-[#01875f]/5 shadow-xs' 
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#01875f]/10 text-[#01875f]">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isAct ? 'bg-[#01875f] text-white' : 'border border-neutral-300'}`}>
                      {isAct && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-neutral-900">{feat.title}</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-snug">{feat.desc}</p>
                  <span className="inline-block mt-3 text-xs font-semibold text-[#01875f]">
                    {isAct ? '✓ Ativo no app' : '+ Clique para ativar'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 5. AI & ART PHOTO APP INTERACTIVE COMPARISON CANVAS (Default for AI apps)
  return (
    <section className="py-10 bg-neutral-50/70 border-b border-neutral-200/70">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#01875f] uppercase tracking-wider mb-1">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Demonstração Interativa</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Veja a transformação com IA em tempo real
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Arraste a linha divisória para comparar a foto original com o resultado estilizado do {app?.name || 'AI Mirror'}.
            </p>
          </div>

          {/* Style Selector Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-white rounded-xl border border-neutral-200 shadow-xs">
            {PRESETS.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#01875f] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Comparison Canvas */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-neutral-200 bg-neutral-950 select-none">
          
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] cursor-ew-resize overflow-hidden"
          >
            {/* Layer 1 (Full): AFTER (AI Transformed Result) */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${activePreset.themeGradient} flex items-center justify-center p-6 text-white`}>
              
              {/* Artistic Grid and Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/70" />
              
              {/* After Aesthetic Illustration */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <div 
                  className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-white/60 shadow-[0_0_50px_rgba(255,255,255,0.4)] flex items-center justify-center relative overflow-hidden backdrop-blur-xs transition-transform duration-500 scale-105"
                  style={{ boxShadow: `0 0 60px ${activePreset.glow}` }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-white/30 to-black/60 flex flex-col items-center justify-center p-4">
                    <Sparkles className="w-16 h-16 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-widest text-amber-300 mt-2">
                      AI GENERATED
                    </span>
                  </div>
                </div>

                <div className="mt-6 max-w-md bg-black/50 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                    Resultado: {activePreset.name}
                  </span>
                  <p className="text-sm font-medium text-white/90 mt-0.5">
                    {activePreset.afterDescription}
                  </p>
                </div>
              </div>

              {/* Tag in Top Right */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Depois ({app?.name || 'IA'})</span>
              </div>
            </div>

            {/* Layer 2 (Clipped): BEFORE (Original Photo) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex items-center justify-center text-neutral-100"
              style={{ width: `${sliderPosition}%` }}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center p-6"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              >
                {/* Before Portrait Placeholder Visual */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border-4 border-neutral-600 bg-neutral-800/80 shadow-inner flex items-center justify-center relative overflow-hidden">
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                      <ImageIcon className="w-14 h-14 mb-1 text-neutral-400" />
                      <span className="text-[11px] font-medium">Foto Base</span>
                    </div>
                  </div>

                  <div className="mt-6 max-w-md bg-neutral-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-neutral-700">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                      Original
                    </span>
                    <p className="text-sm font-medium text-neutral-200 mt-0.5">
                      {activePreset.beforeDescription}
                    </p>
                  </div>
                </div>

                {/* Tag in Top Left */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-neutral-300">
                  <span>Antes (Original)</span>
                </div>
              </div>
            </div>

            {/* Draggable Divider Line & Knob */}
            <div
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-neutral-900 shadow-2xl border border-neutral-300 flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                <Sliders className="w-4 h-4 text-neutral-700 rotate-90" />
              </div>
            </div>

          </div>

          {/* Interactive Bar Below Slider */}
          <div className="bg-neutral-900 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-neutral-300">
                Divisão atual: <strong className="text-white font-mono">{Math.round(sliderPosition)}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSliderPosition(50)}
                className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Centralizar 50/50</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
