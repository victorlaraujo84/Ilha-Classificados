import React, { useState } from 'react';
import { AdItem } from '../types/classifieds';
import { useClassifieds } from '../context/ClassifiedsContext';
import { getSectorDistance, formatDistanceLabel } from '../data/seedData';
import { MapPin, Clock, Tag, MessageCircle, ExternalLink, Heart, Navigation } from 'lucide-react';

interface AdCardProps {
  ad: AdItem;
  viewMode: 'grid' | 'list';
}

export const AdCard: React.FC<AdCardProps> = ({ ad, viewMode }) => {
  const { setSelectedAd, incrementViews, toggleFavorite, isFavorite, filters } = useClassifieds();
  const [imgError, setImgError] = useState(false);
  const favorited = isFavorite(ad.id);

  const distKm = filters.userSector !== 'qualquer' 
    ? getSectorDistance(filters.userSector, ad.campusZone) 
    : null;

  const formatPrice = (ad: AdItem) => {
    if (ad.priceType === 'gratis') return 'Grátis';
    if (ad.priceType === 'a_combinar' || ad.price === null) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(ad.price);
  };

  const formatRelativeTime = (isoString: string) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Há ${Math.max(1, minutes)} min`;
    if (hours < 24) return `Hoje às ${new Date(isoString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (days === 1) return `Ontem`;
    return `${days} dias atrás`;
  };

  const formatCategoryName = (cat: string) => {
    switch (cat) {
      case 'veiculos': return 'Veículos';
      case 'servicos': return 'Serviços';
      case 'imoveis': return 'Imóveis';
      case 'equipamentos': return 'Equipamentos';
      case 'produtos_usados': return 'Produtos Usados';
      default: return cat;
    }
  };

  const formatCondition = (cond: string) => {
    switch (cond) {
      case 'novo': return 'Novo';
      case 'seminovo': return 'Seminovo';
      case 'usado': return 'Usado';
      case 'servico': return 'Serviço Profissional';
      default: return cond;
    }
  };

  const handleCardClick = () => {
    incrementViews(ad.id);
    setSelectedAd(ad);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(ad.id);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = ad.sellerWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá ${ad.sellerName}! Vi seu anúncio "${ad.title}" no UniClassificados da Cidade Universitária e gostaria de mais informações.`);
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleCardClick}
        className="group bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row gap-4 cursor-pointer relative"
      >
        {/* Image Thumbnail */}
        <div className="w-full sm:w-48 h-40 sm:h-32 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative">
          {!imgError ? (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center text-xs">
              <Tag className="w-6 h-6 mb-1 text-slate-300" />
              <span>{formatCategoryName(ad.category)}</span>
            </div>
          )}

          {/* Favorite button on thumbnail */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              favorited
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600'
            }`}
            title={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Metadata clean line without pill boxes */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
              <span className="font-semibold text-orange-600 uppercase tracking-wide text-[11px]">
                {formatCategoryName(ad.category)}
              </span>
              {ad.subCategory && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">{ad.subCategory}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{formatCondition(ad.condition)}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatRelativeTime(ad.createdAt)}</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
              {ad.title}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {ad.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-slate-100">
            <div>
              <div className="text-lg font-black text-slate-900 tabular-nums">
                {formatPrice(ad)}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[200px]">{ad.location}</span>
                {distKm !== null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    distKm <= 0.1 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : distKm <= 1.0 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {formatDistanceLabel(distKm)}
                  </span>
                )}
                <span className="text-slate-400">({ad.cep})</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickWhatsApp}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              <button
                type="button"
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Ver Detalhes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (Default)
  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Product Image */}
      <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
        {!imgError ? (
          <img
            src={ad.imageUrl}
            alt={ad.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center text-xs">
            <Tag className="w-8 h-8 mb-2 text-slate-300" />
            <span>{formatCategoryName(ad.category)}</span>
          </div>
        )}

        {/* Condition label top-left */}
        <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
          {formatCondition(ad.condition)}
        </div>

        {/* Heart Favorite button top-right */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            favorited
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600'
          }`}
          title={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Unboxed clean text */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1 flex-wrap">
            <span className="font-semibold text-orange-600 uppercase tracking-wide">
              {formatCategoryName(ad.category)}
            </span>
            {ad.subCategory && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700">{ad.subCategory}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{formatRelativeTime(ad.createdAt)}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
            {ad.title}
          </h3>

          <div className="mt-2 text-lg font-black text-slate-900 tabular-nums">
            {formatPrice(ad)}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate mr-2">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{ad.campusZone.split('-')[0].trim()}</span>
            {distKm !== null && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                distKm <= 0.1 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : distKm <= 1.0 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {formatDistanceLabel(distKm)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">CEP {ad.cep}</span>
        </div>
      </div>
    </div>
  );
};
