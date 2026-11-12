import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { X, ShieldCheck, MapPin, Clock, CreditCard, CheckCircle2 } from 'lucide-react';

export const CampusSafetyModal: React.FC = () => {
  const { isSafetyModalOpen, setIsSafetyModalOpen } = useClassifieds();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Guia de Segurança no Campus (CEP 21941-000)
            </h3>
          </div>
          <button
            onClick={() => setIsSafetyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-emerald-950 font-medium">
              O UniClassificados é desenhado para aproximar quem estuda e trabalha na Ilha do Fundão. Para negociações presenciais tranquilas, siga estas recomendações:
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Pontos de Encontro Recomendados
                </strong>
                <span>
                  Opte por halls centrais com circulação de pessoas: Hall do Bloco A no CT, átrio do CCMN, Hall de entrada do CCS ou a área externa do Restaurante Universitário (Bandejão Central).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Horário Diurno
                </strong>
                <span>
                  Combine entregas durante os turnos letivos da manhã ou início da tarde, aproveitando o funcionamento normal das secretarias e das bibliotecas.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Pagamento na Retirada
                </strong>
                <span>
                  Nunca faça depósitos antecipados para "reservar" itens. Teste o equipamento (calculadoras, notebooks, bicicletas) pessoalmente antes de efetuar o Pix ou pagamento em dinheiro.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  Aluguel de Imóveis e Quartos
                </strong>
                <span>
                  Para aluguel de imóveis, o ideal é marcar a visita, ir acompanhado(a), e tirar todas as suas dúvidas antes de fechar qualquer contrato ou pagamento.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsSafetyModalOpen(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
            >
              Entendido, voltar aos classificados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
