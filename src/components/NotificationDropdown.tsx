import React, { useRef, useEffect } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Tag, 
  Search, 
  Zap, 
  X,
  ExternalLink
} from 'lucide-react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    mostSearchedCategory,
    mostSearchedCategoryLabel,
    categorySearchCounts,
    simulateNewAdNotification,
    setSelectedAd,
    ads,
    setFilters
  } = useClassifieds();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.category) {
      setFilters(prev => ({ ...prev, category: notif.category, searchQuery: '' }));
    }
    if (notif.adId) {
      const target = ads.find(a => a.id === notif.adId);
      if (target) {
        setSelectedAd(target);
      }
    }
    onClose();
  };

  const currentSearchCount = categorySearchCounts[mostSearchedCategory] || 0;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold leading-tight">Central de Notificações</h3>
            <p className="text-[10px] text-slate-300">
              {unreadNotificationsCount > 0 
                ? `${unreadNotificationsCount} nova(s) notificação(ões)` 
                : 'Todas lidas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <>
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                title="Marcar todas como lidas"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={clearNotifications}
                title="Limpar histórico"
                className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Search Insight Pill */}
      <div className="p-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-b border-orange-100/80">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-md bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800">
                Categoria mais pesquisada por você:
              </span>
              <span className="text-[10px] font-semibold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">
                {currentSearchCount} pesquisas
              </span>
            </div>
            <p className="text-xs font-black text-orange-600 mt-0.5">
              {mostSearchedCategoryLabel}
            </p>
            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
              O sistema monitora suas pesquisas e alerta automaticamente quando novos itens são publicados nesta categoria.
            </p>

            {/* Quick Simulation Trigger Button */}
            <button
              type="button"
              onClick={simulateNewAdNotification}
              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-3 h-3 text-amber-200 fill-amber-200" />
              <span>Simular novo anúncio em {mostSearchedCategoryLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const isUnread = !notif.read;
            const timeAgo = formatTimeAgo(notif.createdAt);

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 relative ${
                  isUnread ? 'bg-orange-50/40' : 'bg-white'
                }`}
              >
                {isUnread && (
                  <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-orange-600 ring-4 ring-orange-100" />
                )}

                <div className="flex items-start gap-2.5 pr-4">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    notif.type === 'classification_updated'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {notif.type === 'classification_updated' ? (
                      <Tag className="w-3.5 h-3.5" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {notif.categoryLabel || notif.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {timeAgo}
                      </span>
                    </div>

                    <h4 className={`text-xs ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      {notif.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.adId && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700">
                        <span>Ver anúncio agora</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-2">
              <Bell className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Nenhuma notificação</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Você será alertado quando novos anúncios forem publicados na sua categoria favorita.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[10px] text-slate-500">
          Notificações em tempo real com estado global no Fundão
        </span>
      </div>
    </div>
  );
};

function formatTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  } catch {
    return 'Recente';
  }
}
