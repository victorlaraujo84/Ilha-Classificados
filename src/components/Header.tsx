import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  Plus, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  MapPin, 
  Heart, 
  MessageSquare,
  Compass,
  Navigation,
  BarChart2,
  Bell,
  SlidersHorizontal
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setIsAuthModalOpen, 
    setAuthModalMode, 
    setIsPublishModalOpen,
    setIsSafetyModalOpen,
    setFilters,
    favorites,
    setIsFavoritesModalOpen,
    locationState,
    setSimulatedLocation,
    setIsChatModalOpen,
    unreadMessagesCount,
    setIsDashboardModalOpen,
    unreadNotificationsCount,
    isNotificationPopoverOpen,
    setIsNotificationPopoverOpen,
    setIsAdminModalOpen,
    mostSearchedCategoryLabel
  } = useClassifieds();

  const handleOpenPublish = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      setIsPublishModalOpen(true);
    }
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenFavorites = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      setIsFavoritesModalOpen(true);
    }
  };

  const handleOpenChat = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      setIsChatModalOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice for CEP 21941-000 & GPS location toggle */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="font-medium">Região Exclusiva:</span>
            <span className="text-slate-300">Cidade Universitária · Ilha do Fundão · CEP 21941-000</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Location Status Pill with Instant Simulation Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-700">
              <span className="text-slate-400">GPS:</span>
              <button
                type="button"
                onClick={() => setSimulatedLocation(locationState.isInsideFundao ? 'outside' : 'inside')}
                title="Clique para alternar entre dentro/fora do Fundão para testar o acesso aos contatos"
                className={`font-bold cursor-pointer hover:underline flex items-center gap-1 ${
                  locationState.isInsideFundao ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>{locationState.isInsideFundao ? 'No Fundão (Contatos Liberados)' : 'Fora do Fundão (Chat Exclusivo)'}</span>
              </button>
            </div>

            {/* Admin Classification Tool Access */}
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-orange-300 hover:text-white border border-slate-700 hover:border-orange-500/50 transition-all cursor-pointer font-bold"
              title="Abrir Painel Administrativo de Classificação & Taxonomia para mitigar a pesquisa"
            >
              <SlidersHorizontal className="w-3 h-3 text-orange-400" />
              <span>Admin: Classificação</span>
            </button>

            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                } else {
                  setIsDashboardModalOpen(true);
                }
              }}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Painel do Usuário</span>
            </button>

            <button
              onClick={handleOpenFavorites}
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Favoritos ({favorites.length})</span>
            </button>

            <button
              onClick={() => setIsSafetyModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Segurança</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:bg-orange-500 transition-colors">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                Uni<span className="text-orange-600">Classificados</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                Fundão · CEP 21941-000
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links (Veículos sem carona; Equipamentos) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'todos', searchQuery: '' }));
              const el = document.getElementById('anuncios-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-orange-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Todos os Anúncios
          </button>
          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'veiculos' }));
              const el = document.getElementById('anuncios-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-orange-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Veículos
          </button>
          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'imoveis' }));
              const el = document.getElementById('anuncios-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-orange-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Quartos & Vagas
          </button>
          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'equipamentos' }));
              const el = document.getElementById('anuncios-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-orange-600 transition-colors whitespace-nowrap cursor-pointer"
          >
            Equipamentos
          </button>
          <button 
            onClick={handleOpenChat}
            className="hover:text-orange-600 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Chat Interno</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Global Notification Bell & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationPopoverOpen(!isNotificationPopoverOpen)}
              className="p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
              title={`Central de Notificações (${unreadNotificationsCount} novas) · Categoria favorita: ${mostSearchedCategoryLabel}`}
              aria-label="Abrir central de notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotificationPopoverOpen}
              onClose={() => setIsNotificationPopoverOpen(false)}
            />
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenChat}
                className="p-2 text-slate-600 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
                title="Abrir Chat Interno"
              >
                <MessageSquare className="w-4 h-4" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-600" />
                )}
              </button>

              <button
                onClick={() => setIsDashboardModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Abrir Meu Painel (Estatísticas e Anúncios)"
              >
                <BarChart2 className="w-4 h-4 text-orange-600" />
                <span className="hidden sm:inline">Meu Painel</span>
              </button>

              <button
                onClick={handleOpenFavorites}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Ver meus favoritos salvos"
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full tabular-nums">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsDashboardModalOpen(true)}
                title="Abrir Painel do Usuário"
                className="hidden lg:flex flex-col text-right hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {currentUser.campusAffiliation}
                </span>
              </button>
              <button
                onClick={logout}
                title="Sair da conta"
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleOpenLogin}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-orange-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Entrar / Cadastrar
            </button>
          )}

          <button
            onClick={handleOpenPublish}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Inserir anúncio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
