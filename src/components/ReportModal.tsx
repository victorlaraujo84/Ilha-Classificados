import React, { useState } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, Flag } from 'lucide-react';

const REPORT_REASONS = [
  'Spam ou anúncio duplicado',
  'Fraude, golpe ou valor abusivo',
  'Fora da Cidade Universitária (não é da região do CEP 21941-000)',
  'Conteúdo impróprio, ofensivo ou ilegal',
  'Item já vendido ou indisponível no campus',
  'Informações de contato incorretas ou inválidas',
  'Outro motivo',
];

export const ReportModal: React.FC = () => {
  const { 
    isReportModalOpen, 
    setIsReportModalOpen, 
    reportTargetAd, 
    submitReport 
  } = useClassifieds();

  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isReportModalOpen || !reportTargetAd) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(selectedReason, details.trim());
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      setSelectedReason(REPORT_REASONS[0]);
    }, 2200);
  };

  const handleClose = () => {
    setIsReportModalOpen(false);
    setIsSubmitted(false);
    setDetails('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Denunciar Anúncio
              </h3>
              <p className="text-[11px] text-slate-500">
                Ajude a manter a moderação do campus segura
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Denúncia enviada com sucesso!
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Nossa equipe de moderação comunitária do Fundão irá analisar o anúncio. Obrigado por colaborar com a segurança da comunidade.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Ad brief */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Anúncio sob denúncia
              </span>
              <p className="font-semibold text-slate-900 truncate mt-0.5">
                {reportTargetAd.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Item: {reportTargetAd.type === 'ad' ? 'Classificado' : 'Pedido de Serviço'} · ID: {reportTargetAd.id}
              </p>
            </div>

            {/* Reason selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Qual o motivo da denúncia? *
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                      selectedReason === reason
                        ? 'bg-red-50/70 border-red-300 text-red-950 font-semibold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="text-red-600"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Optional details */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Informações adicionais (opcional)
              </label>
              <textarea
                rows={3}
                placeholder="Conte mais detalhes para ajudar nossa equipe de moderação..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 leading-relaxed"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Enviar Denúncia</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
