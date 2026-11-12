import React from 'react';
import { ServiceOrder } from '../types/classifieds';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  AlertCircle, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  DollarSign,
  User as UserIcon,
  Send
} from 'lucide-react';

interface ServiceOrderCardProps {
  order: ServiceOrder;
}

export const ServiceOrderCard: React.FC<ServiceOrderCardProps> = ({ order }) => {
  const { setSelectedServiceOrder, openProposalModal, currentUser, setAuthModalMode, setIsAuthModalOpen } = useClassifieds();

  const isOwner = currentUser?.id === order.clientId;

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

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgente':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Urgente
          </span>
        );
      case 'esta_semana':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Esta semana
          </span>
        );
      case 'sem_pressa':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Sem pressa
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            A combinar
          </span>
        );
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'reformas_reparos': return 'Reformas & Reparos';
      case 'aulas_academico': return 'Aulas & Apoio Acadêmico';
      case 'alimentacao_festas': return 'Alimentação & Eventos';
      case 'ti_eletronica': return 'TI & Eletrônica';
      default: return 'Serviços Gerais';
    }
  };

  const handleSendProposalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      openProposalModal(order);
    }
  };

  return (
    <div
      onClick={() => setSelectedServiceOrder(order)}
      className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all p-5 cursor-pointer flex flex-col justify-between group relative"
    >
      <div>
        {/* Top bar: Category + Urgency + Timestamp */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
              {getCategoryLabel(order.category)}
            </span>
            {getUrgencyBadge(order.urgency)}
          </div>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {formatRelativeTime(order.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2 mb-2">
          {order.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {order.description}
        </p>

        {/* Location & Client details */}
        <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
          <div className="flex items-center gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="font-semibold truncate">{order.campusZone}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 truncate">{order.locationDetails}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
            <span className="flex items-center gap-1">
              <UserIcon className="w-3 h-3 text-slate-400" />
              <span>Pedido de: <strong>{order.clientName}</strong> ({order.clientAffiliation.split('-')[0].trim()})</span>
            </span>
            <span className="text-slate-400">CEP {order.cep}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Budget + Proposals Count + Action */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Orçamento Estimado
          </span>
          <span className="text-sm font-extrabold text-slate-900 tabular-nums">
            {order.budgetEstimate}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Proposals badge */}
          <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>{order.proposalsCount} {order.proposalsCount === 1 ? 'proposta' : 'propostas'}</span>
          </div>

          {/* Action button */}
          {isOwner ? (
            <button
              type="button"
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Propostas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendProposalClick}
              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Proposta</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
