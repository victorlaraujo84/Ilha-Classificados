import React, { useState } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  X, 
  MapPin, 
  Clock, 
  MessageCircle, 
  MessageSquare,
  Phone, 
  Mail, 
  Share2, 
  ShieldCheck, 
  User as UserIcon, 
  Trash2, 
  Check, 
  ArrowLeft, 
  Building, 
  Info, 
  Flag, 
  Heart,
  Lock,
  Compass,
  Navigation,
  AlertCircle,
  Home
} from 'lucide-react';
import { AdItem } from '../types/classifieds';

export const AdDetailModal: React.FC = () => {
  const { 
    selectedAd, 
    setSelectedAd, 
    currentUser, 
    deleteAd, 
    setIsSafetyModalOpen,
    toggleFavorite,
    isFavorite,
    openReportModal,
    hasReported,
    locationState,
    setSimulatedLocation,
    setIsChatModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useClassifieds();

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!selectedAd) return null;

  const isOwner = currentUser?.id === selectedAd.sellerUserId;
  const favorited = isFavorite(selectedAd.id);
  const alreadyReported = hasReported(selectedAd.id);

  // Seller preferences (default to true if undefined)
  const canShowWhatsApp = selectedAd.showWhatsApp !== false && !!selectedAd.sellerWhatsApp;
  const canShowPhone = selectedAd.showPhone !== false && !!selectedAd.sellerPhone;
  const canShowChat = true;

  const formatPrice = (ad: AdItem) => {
    if (ad.priceType === 'gratis') return 'Grátis';
    if (ad.priceType === 'a_combinar' || ad.price === null) return 'A combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(ad.price);
  };

  const formatCategoryName = (cat: string) => {
    switch (cat) {
      case 'veiculos': return 'Veículos';
      case 'servicos': return 'Serviços';
      case 'imoveis': return 'Imóveis & Vagas';
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

  const handleOpenWhatsApp = () => {
    const cleanNumber = selectedAd.sellerWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${selectedAd.sellerName}! Vi seu anúncio "${selectedAd.title}" no UniClassificados da Cidade Universitária (CEP 21941-000) e gostaria de conversar.`
    );
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(selectedAd.sellerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover este anúncio?')) {
      deleteAd(selectedAd.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4 sm:my-8 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => setSelectedAd(null)}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos classificados</span>
            </button>
            <span aria-hidden="true">/</span>
            <span>{formatCategoryName(selectedAd.category)}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{selectedAd.title}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Heart Favorite button */}
            <button
              onClick={() => toggleFavorite(selectedAd.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                favorited
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-200'
              }`}
              title={favorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">{favorited ? 'Salvo' : 'Favoritar'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Copiar link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setSelectedAd(null)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-200">
            {/* Featured Image */}
            <div className="aspect-[4/3] w-full bg-slate-100 rounded-xl overflow-hidden relative shadow-inner">
              {!imgError ? (
                <img
                  src={selectedAd.imageUrl}
                  alt={selectedAd.title}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-6 text-center text-sm">
                  <Building className="w-12 h-12 mb-2 text-slate-300" />
                  <span>Foto do item no campus</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Descrição do Anúncio
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedAd.description}
              </p>

              {/* Classification & Search Mitigation Tags */}
              {selectedAd.classificationTags && selectedAd.classificationTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                    Tags de Classificação:
                  </span>
                  {selectedAd.classificationTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Location in Campus */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    Localização na Cidade Universitária
                  </h5>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {selectedAd.location}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Zona: {selectedAd.campusZone} · CEP {selectedAd.cep} (Ilha do Fundão - UFRJ)
                  </p>
                </div>
              </div>
            </div>

            {/* Real Estate Rental Advice */}
            {selectedAd.category === 'imoveis' && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <Home className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs text-orange-950 leading-relaxed">
                  <span className="font-bold block text-orange-900 mb-0.5">
                    Recomendação para aluguel de imóveis no Fundão:
                  </span>
                  O ideal é <strong>marcar a visita</strong>, <strong>ir acompanhado(a)</strong> e <strong>tirar todas as suas dúvidas</strong> antes de fechar.
                </div>
              </div>
            )}

            {/* Safety Reminder */}
            <div className="mt-4 bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-snug">
                <span className="font-semibold">Negociação segura no Fundão:</span> Marque a entrega em pontos movimentados do campus durante o dia (Centro de Tecnologia, Hall do CCS, Bandejão ou Biblioteca Central).
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Purchase Module with Login & Geolocation gating */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-slate-50/30">
            <div>
              {/* Category & SubCategory & Condition */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 flex-wrap">
                <span className="font-semibold text-orange-600 uppercase tracking-wide">
                  {formatCategoryName(selectedAd.category)}
                </span>
                {selectedAd.subCategory && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-orange-900 bg-orange-100 border border-orange-200/80 px-2 py-0.5 rounded text-[11px]">
                      ↳ {selectedAd.subCategory}
                    </span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{formatCondition(selectedAd.condition)}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {selectedAd.title}
              </h2>

              {/* Price */}
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  {formatPrice(selectedAd)}
                </span>
                {selectedAd.priceType === 'a_combinar' && (
                  <span className="text-xs text-slate-500 ml-2">Preço negociável</span>
                )}
              </div>

              {/* Publication timestamp */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Publicado em {new Date(selectedAd.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedAd.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Seller Information Card */}
              <div className="mt-5 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 font-bold text-base shrink-0">
                    {selectedAd.sellerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {selectedAd.sellerName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {selectedAd.sellerAffiliation}
                    </p>
                  </div>
                </div>

                {/* Privacy & Location Gating */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {!currentUser ? (
                    /* CASE 1: NOT LOGGED IN */
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-2">
                      <div className="w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800">
                        Faça login para ver os dados de contato
                      </p>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Para proteger a comunidade acadêmica do Fundão, as informações de contato do anunciante são restritas a usuários cadastrados.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthModalMode('login');
                          setIsAuthModalOpen(true);
                        }}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Entrar ou Cadastrar-se
                      </button>
                    </div>
                  ) : locationState.isInsideFundao ? (
                    /* CASE 2: LOGGED IN & INSIDE FUNDÃO */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <span className="flex items-center gap-1 font-semibold">
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          <span>Você está no Fundão (Acesso liberado)</span>
                        </span>
                        <span className="text-[10px] text-emerald-600">CEP 21941-000</span>
                      </div>

                      {/* Visible direct contacts selected by the seller */}
                      <div className="space-y-2">
                        {canShowPhone && (
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>Telefone:</span>
                            </span>
                            <span className="font-semibold text-slate-800">{selectedAd.sellerPhone}</span>
                          </div>
                        )}

                        {!canShowPhone && !canShowWhatsApp && (
                          <p className="text-xs text-slate-500 italic">
                            O anunciante optou por receber contatos exclusivamente pelo Chat Interno.
                          </p>
                        )}
                      </div>

                      {/* Contact Buttons */}
                      <div className="space-y-2 pt-2">
                        {canShowWhatsApp && (
                          <button
                            onClick={handleOpenWhatsApp}
                            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Contatar no WhatsApp</span>
                          </button>
                        )}

                        {canShowPhone && (
                          <button
                            onClick={handleCopyPhone}
                            className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{copiedPhone ? 'Copiado!' : `Ligar: ${selectedAd.sellerPhone}`}</span>
                          </button>
                        )}

                        {/* Internal Chat option */}
                        {canShowChat && (
                          <button
                            onClick={() => setIsChatModalOpen(true)}
                            className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Conversar pelo Chat Interno</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* CASE 3: LOGGED IN & OUTSIDE FUNDÃO */
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left space-y-1.5">
                        <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                          <Compass className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Localização fora da Cidade Universitária</span>
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          Por segurança e privacidade, os dados diretos de WhatsApp e telefone ficam ocultos para quem está fora do campus. <strong>Utilize o Chat Interno</strong> da plataforma para falar com o anunciante.
                        </p>
                      </div>

                      {/* Primary Chat Button for Outside Users */}
                      <button
                        onClick={() => setIsChatModalOpen(true)}
                        className="w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Conversar pelo Chat Interno</span>
                      </button>
                    </div>
                  )}

                  {/* Geolocation Tester Bar for easy verification */}
                  {currentUser && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[11px] text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Compass className="w-3 h-3 text-slate-400" />
                          <span>GPS do dispositivo:</span>
                        </span>
                        <span className={`font-bold ${locationState.isInsideFundao ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {locationState.isInsideFundao ? 'Dentro do Fundão' : 'Fora do Fundão'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <button
                          type="button"
                          onClick={() => setSimulatedLocation('inside')}
                          className={`flex-1 py-1 px-1.5 text-[10px] rounded border transition-colors cursor-pointer ${
                            locationState.isInsideFundao
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Simular no Fundão
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimulatedLocation('outside')}
                          className={`flex-1 py-1 px-1.5 text-[10px] rounded border transition-colors cursor-pointer ${
                            !locationState.isInsideFundao
                              ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Simular Fora
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Report Action */}
              <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => openReportModal(selectedAd.id, 'ad', selectedAd.title)}
                  className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                    alreadyReported
                      ? 'text-amber-600'
                      : 'text-slate-500 hover:text-red-600'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{alreadyReported ? 'Anúncio sob análise de moderação' : 'Denunciar este anúncio'}</span>
                </button>
                <span className="text-[11px] text-slate-400">CEP 21941-000</span>
              </div>
            </div>

            {/* Bottom Actions for Ad Owner */}
            {isOwner && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={handleDelete}
                  className="w-full py-2 px-3 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir meu anúncio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
