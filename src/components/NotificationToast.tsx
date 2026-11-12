import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { Bell, X, ArrowRight, Sparkles, Tag } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast, setSelectedAd, ads, setFilters } = useClassifieds();

  if (!activeToast) return null;

  const handleOpenAd = () => {
    if (activeToast.adId) {
      const target = ads.find(a => a.id === activeToast.adId);
      if (target) {
        setSelectedAd(target);
      }
    }
    if (activeToast.category) {
      setFilters(prev => ({ ...prev, category: activeToast.category }));
    }
    dismissToast();
  };

  const isReclass = activeToast.type === 'classification_updated';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in">
      <div className="bg-slate-900 text-white rounded-xl shadow-2xl border border-orange-500/40 p-4 relative overflow-hidden backdrop-blur-md">
        {/* Glow indicator line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 animate-pulse" />

        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isReclass ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
          }`}>
            {isReclass ? <Tag className="w-5 h-5" /> : <Bell className="w-5 h-5 animate-wiggle" />}
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isReclass ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-700/50' : 'bg-orange-900/80 text-orange-300 border border-orange-700/50'
              }`}>
                {isReclass ? 'Classificação Admin' : 'Alerta de Categoria Favorita'}
              </span>
              <span className="text-[10px] text-slate-400">Agora</span>
            </div>

            <h4 className="text-xs font-bold text-white truncate">
              {activeToast.title}
            </h4>

            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
              {activeToast.message}
            </p>

            <div className="mt-3 flex items-center gap-2">
              {activeToast.adId && (
                <button
                  type="button"
                  onClick={handleOpenAd}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <span>Ver Anúncio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={dismissToast}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Dispensar
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissToast}
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
