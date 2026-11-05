import React from 'react';
import { Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-neutral-600 text-xs py-10 mt-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">Google Play</h4>
            <ul className="space-y-2">
              <li><a href="#play-pass" className="hover:text-neutral-900 transition-colors">Play Pass</a></li>
              <li><a href="#play-pontos" className="hover:text-neutral-900 transition-colors">Play Pontos</a></li>
              <li><a href="#gift-cards" className="hover:text-neutral-900 transition-colors">Vales-presente</a></li>
              <li><a href="#resgatar" className="hover:text-neutral-900 transition-colors">Resgatar código</a></li>
              <li><a href="#reembolso" className="hover:text-neutral-900 transition-colors">Política de reembolso</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">Crianças e família</h4>
            <ul className="space-y-2">
              <li><a href="#guia-pais" className="hover:text-neutral-900 transition-colors">Guia para os pais</a></li>
              <li><a href="#compartilhamento" className="hover:text-neutral-900 transition-colors">Biblioteca da família</a></li>
              <li><a href="#family-link" className="hover:text-neutral-900 transition-colors">Family Link</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">Desenvolvedores</h4>
            <ul className="space-y-2">
              <li><a href="#play-console" className="hover:text-neutral-900 transition-colors">Google Play Console</a></li>
              <li><a href="#politicas-dev" className="hover:text-neutral-900 transition-colors">Políticas para desenvolvedores</a></li>
              <li><a href="#recursos" className="hover:text-neutral-900 transition-colors">Recursos do Android SDK</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 text-sm">Sobre</h4>
            <ul className="space-y-2">
              <li><a href="#sobre-google" className="hover:text-neutral-900 transition-colors">Sobre o Google</a></li>
              <li><a href="#google-store" className="hover:text-neutral-900 transition-colors">Google Store</a></li>
              <li><a href="#privacidade" className="hover:text-neutral-900 transition-colors">Privacidade e Termos</a></li>
              <li><a href="#contato" className="hover:text-neutral-900 transition-colors">Contato</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Country + Legal */}
        <div className="pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-neutral-500">
            <a href="#termos" className="hover:underline">Termos de Serviço</a>
            <a href="#privacidade" className="hover:underline">Privacidade</a>
            <a href="#aviso" className="hover:underline">Avisos legais</a>
            <span>Todos os preços incluem tributos e impostos aplicáveis.</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-700 font-medium">
            <Globe className="w-4 h-4 text-neutral-500" />
            <span>Brasil (Português)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
