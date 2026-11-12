import React from 'react';
import { ClassifiedsProvider, useClassifieds } from './context/ClassifiedsContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { AdCard } from './components/AdCard';
import { AdDetailModal } from './components/AdDetailModal';
import { PublishAdModal } from './components/PublishAdModal';
import { AuthModal } from './components/AuthModal';
import { CampusSafetyModal } from './components/CampusSafetyModal';
import { ReportModal } from './components/ReportModal';
import { FavoritesModal } from './components/FavoritesModal';
import { ChatModal } from './components/ChatModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { AdminClassificationModal } from './components/AdminClassificationModal';
import { NotificationToast } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { SearchX, Plus, Sparkles, MapPin } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    filteredAds, 
    filters, 
    resetFilters, 
    setIsPublishModalOpen, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalMode 
  } = useClassifieds();

  const handleOpenPublish = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      setIsPublishModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <HeroBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar />

        {/* Listings Section */}
        {filteredAds.length > 0 ? (
          <div
            className={
              filters.viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                : 'space-y-4'
            }
          >
            {filteredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} viewMode={filters.viewMode} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mx-auto mb-4">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Nenhum anúncio encontrado
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Não encontramos nenhum anúncio com os filtros atuais para a região do CEP 21941-000. Experimente buscar por outros termos ou limpar os filtros.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Limpar todos os filtros
              </button>
              <button
                type="button"
                onClick={handleOpenPublish}
                className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Ser o primeiro a anunciar
              </button>
            </div>
          </div>
        )}

        {/* Floating Quick Add Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-30">
          <button
            onClick={handleOpenPublish}
            className="flex items-center gap-2 px-5 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-xs shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Anunciar no Fundão</span>
          </button>
        </div>
      </main>

      <Footer />

      {/* Modals & Alerts */}
      <AdDetailModal />
      <PublishAdModal />
      <AuthModal />
      <CampusSafetyModal />
      <ReportModal />
      <FavoritesModal />
      <ChatModal />
      <UserDashboardModal />
      <AdminClassificationModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <ClassifiedsProvider>
      <MainContent />
    </ClassifiedsProvider>
  );
}
