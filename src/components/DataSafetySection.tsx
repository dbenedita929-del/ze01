import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Share2, Lock, Trash2, CheckCircle2, X } from 'lucide-react';

import { AppInfo } from '../types';

interface DataSafetySectionProps {
  app?: AppInfo;
}

export const DataSafetySection: React.FC<DataSafetySectionProps> = ({ app }) => {
  const [showModal, setShowModal] = useState(false);
  const devName = app?.developer || 'Sendas Distribuidora S/A';

  return (
    <section className="py-8 border-b border-neutral-100">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <span>Segurança dos dados</span>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 max-w-3xl mb-6">
          A segurança começa com o entendimento de como os desenvolvedores coletam e compartilham seus dados. As práticas de privacidade e segurança dos dados podem variar de acordo com o uso, a região e a idade. O desenvolvedor forneceu estas informações e pode atualizá-las ao longo do tempo.
        </p>

        {/* Data Safety Cards Grid */}
        <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6 bg-white space-y-4 max-w-4xl">
          
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#01875f] shrink-0 mt-0.5">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                Nenhum dado é compartilhado com terceiros
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                O desenvolvedor afirma que este app não compartilha dados do usuário com outras empresas ou organizações.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#01875f] shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                Os dados são criptografados em trânsito
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Seus dados de navegação são transferidos por uma conexão segura HTTPS/TLS de 256 bits criptografada.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#01875f] shrink-0 mt-0.5">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">
                Você pode solicitar a exclusão dos dados
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                O desenvolvedor oferece uma opção para você solicitar a exclusão de sua conta e informações vinculadas.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-xs sm:text-sm font-semibold text-[#01875f] hover:underline cursor-pointer"
            >
              Ver detalhes
            </button>
          </div>

        </div>

      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-[#01875f]" />
              <h3 className="text-lg font-bold text-neutral-900">Detalhes de Segurança dos Dados</h3>
            </div>
            <p className="text-xs text-neutral-500 mb-5">
              Declarações fornecidas por {devName} para conformidade com as políticas do Google Play.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="font-bold text-neutral-900 block text-sm mb-1">Privacidade e Uso de Dados</span>
                <p className="text-neutral-600 mb-2">
                  Coletados apenas quando você utiliza ativamente as funcionalidades do aplicativo oficial {app?.name || ''}.
                </p>
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Em conformidade com a LGPD e políticas do Google Play Protect</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="font-bold text-neutral-900 block text-sm mb-1">Informações do Aplicativo e Desempenho</span>
                <p className="text-neutral-600">
                  Logs de falhas e diagnósticos de renderização anônimos para correção de bugs no Android.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                <span className="font-bold text-neutral-900 block text-sm mb-1">IDs do Dispositivo</span>
                <p className="text-neutral-600">
                  Utilizados para prevenção de fraudes em compras no app e sincronização de assinaturas VIP com o Google Play Faturamento.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-2.5 bg-[#01875f] text-white rounded-lg font-medium text-sm hover:bg-[#017252] transition-colors"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
