import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { X, Heart, Trash2, ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { AdItem } from '../types/classifieds';

export const FavoritesModal: React.FC = () => {
  const { 
    isFavoritesModalOpen, 
    setIsFavoritesModalOpen, 
    favorites,
    ads, 
    toggleFavorite, 
    setSelectedAd, 
    currentUser 
  } = useClassifieds();

  const favoriteAds = ads.filter((ad: AdItem) => favorites.includes(ad.id));

  if (!isFavoritesModalOpen) return null;

  const formatPrice = (ad: AdItem) => {
    if (ad.priceType === 'gratis') return 'Grátis';
    if (ad.priceType === 'a_combinar' || ad.price === null) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(ad.price);
  };

  const handleCardClick = (ad: AdItem) => {
    setIsFavoritesModalOpen(false);
    setSelectedAd(ad);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4 sm:my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600">
              <Heart className="w-4 h-4 fill-rose-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Meus Anúncios Favoritos
              </h2>
              <p className="text-xs text-slate-500">
                {favoriteAds.length} {favoriteAds.length === 1 ? 'item salvo' : 'itens salvos'} na sua conta ({currentUser?.name})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFavoritesModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {favoriteAds.length > 0 ? (
            <div className="space-y-3">
              {favoriteAds.map((ad) => (
                <div
                  key={ad.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-sm bg-white transition-all"
                >
                  {/* Thumbnail & Title */}
                  <div 
                    onClick={() => handleCardClick(ad)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                        {ad.title}
                      </h4>
                      <div className="text-xs font-black text-slate-900 tabular-nums mt-0.5">
                        {formatPrice(ad)}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{ad.campusZone.split('-')[0].trim()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCardClick(ad)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Ver Anúncio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(ad.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Você ainda não salvou nenhum favorito
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-5">
                Navegue pelos classificados da Cidade Universitária e clique no coração dos anúncios que te interessarem para acompanhar depois.
              </p>
              <button
                onClick={() => setIsFavoritesModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Explorar Anúncios no Fundão
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
