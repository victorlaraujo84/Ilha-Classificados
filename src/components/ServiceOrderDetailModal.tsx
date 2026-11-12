import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Briefcase, 
  MessageSquare, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User as UserIcon, 
  Trash2, 
  Flag, 
  ArrowLeft,
  Building,
  DollarSign,
  Calendar
} from 'lucide-react';

export const ServiceOrderDetailModal: React.FC = () => {
  const { 
    selectedServiceOrder, 
    setSelectedServiceOrder, 
    currentUser, 
    deleteServiceOrder, 
    getOrderProposals, 
    openProposalModal,
    openReportModal,
    hasReported,
    setAuthModalMode,
    setIsAuthModalOpen
  } = useClassifieds();

  if (!selectedServiceOrder) return null;

  const isOwner = currentUser?.id === selectedServiceOrder.clientId;
  const proposals = getOrderProposals(selectedServiceOrder.id);
  const userProposal = currentUser ? proposals.find(p => p.professionalId === currentUser.id) : null;
  const alreadyReported = hasReported(selectedServiceOrder.id);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'reformas_reparos': return 'Reformas & Reparos';
      case 'aulas_academico': return 'Aulas & Apoio Acadêmico';
      case 'alimentacao_festas': return 'Alimentação & Eventos';
      case 'ti_eletronica': return 'TI & Eletrônica';
      default: return 'Serviços Gerais';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'urgente': return 'Urgente (Precisa o quanto antes)';
      case 'esta_semana': return 'Esta semana';
      case 'sem_pressa': return 'Sem pressa / Flexível';
      default: return 'A combinar';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja cancelar e remover este pedido de serviço?')) {
      deleteServiceOrder(selectedServiceOrder.id);
    }
  };

  const handleOpenProposal = () => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
    } else {
      openProposalModal(selectedServiceOrder);
    }
  };

  const handleOpenWhatsApp = (whatsapp: string, proName: string) => {
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá ${proName}! Vi sua proposta para o meu pedido "${selectedServiceOrder.title}" no UniClassificados da Cidade Universitária (CEP 21941-000) e gostaria de conversar.`
    );
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4 sm:my-8 overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => setSelectedServiceOrder(null)}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar aos pedidos</span>
            </button>
            <span aria-hidden="true">/</span>
            <span>{getCategoryLabel(selectedServiceOrder.category)}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 font-medium truncate max-w-[200px]">{selectedServiceOrder.title}</span>
          </div>

          <button
            onClick={() => setSelectedServiceOrder(null)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Split */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Info Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wide">
                {getCategoryLabel(selectedServiceOrder.category)}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Prazo: {getUrgencyText(selectedServiceOrder.urgency)}</span>
              </span>
              <span className="text-xs text-slate-400 ml-auto">
                Publicado em {new Date(selectedServiceOrder.createdAt).toLocaleDateString('pt-BR')} às {new Date(selectedServiceOrder.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {selectedServiceOrder.title}
            </h1>

            {/* Location & Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                    Local do Serviço (Campus)
                  </span>
                  <span className="text-xs font-bold text-slate-800 block">
                    {selectedServiceOrder.campusZone}
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {selectedServiceOrder.locationDetails} · CEP {selectedServiceOrder.cep}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <DollarSign className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                    Orçamento do Cliente
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block">
                    {selectedServiceOrder.budgetEstimate}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Profissionais enviam suas propostas e valores
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description of Service */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              O Que o Cliente Precisa (Descrição da Demanda)
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              {selectedServiceOrder.description}
            </p>
          </div>

          {/* Client Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-sm">
                {selectedServiceOrder.clientName.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {selectedServiceOrder.clientName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {selectedServiceOrder.clientAffiliation} · Comunidade Cidade Universitária
                </span>
              </div>
            </div>

            {isOwner && (
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Seu Pedido
              </span>
            )}
          </div>

          {/* SECTION: PROPOSALS OR SEND PROPOSAL BUTTON */}
          {isOwner ? (
            /* OWNER VIEW: See all proposals received with direct contact info */
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Propostas Recebidas dos Profissionais ({proposals.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Veja os orçamentos e entre em contato direto pelo WhatsApp ou telefone para combinar o serviço.
                  </p>
                </div>
              </div>

              {proposals.length > 0 ? (
                <div className="space-y-3">
                  {proposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-white border-2 border-emerald-200 rounded-xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                            {prop.professionalName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              {prop.professionalName}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {prop.professionalAffiliation}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Orçamento Proposto
                          </span>
                          <span className="text-base font-extrabold text-emerald-700">
                            {prop.priceEstimate}
                          </span>
                        </div>
                      </div>

                      {/* Proposal Message */}
                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {prop.message}
                      </div>

                      {/* Availability & Direct Contact Buttons */}
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Disponibilidade: <strong>{prop.availability}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          {prop.professionalWhatsApp && (
                            <button
                              onClick={() => handleOpenWhatsApp(prop.professionalWhatsApp, prop.professionalName)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Conversar no WhatsApp</span>
                            </button>
                          )}

                          {prop.professionalPhone && (
                            <a
                              href={`tel:${prop.professionalPhone.replace(/\D/g, '')}`}
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-600" />
                              <span>Ligar: {prop.professionalPhone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl text-center space-y-2">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    Aguardando propostas de profissionais
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Seu pedido está visível para os prestadores da Cidade Universitária. Assim que um profissional enviar um orçamento, ele aparecerá aqui com o contato direto.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* PROFESSIONAL / PUBLIC VIEW: Send proposal button */
            <div className="space-y-4 pt-4 border-t border-slate-200">
              {userProposal ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Você já enviou uma proposta para este pedido!</span>
                  </div>
                  <p className="text-xs text-emerald-950">
                    Sua proposta de <strong>{userProposal.priceEstimate}</strong> foi enviada ao cliente. O cliente entrará em contato via WhatsApp ou telefone com base nos seus dados cadastrados.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-bold text-emerald-950 flex items-center justify-center sm:justify-start gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-700" />
                      <span>Você presta este serviço na Cidade Universitária?</span>
                    </h4>
                    <p className="text-xs text-emerald-900 leading-relaxed">
                      Envie uma proposta com sua estimativa de valor e mensagem para o cliente entrar em contato direto.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenProposal}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Proposta Agora</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions: Delete or Report */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            {isOwner ? (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancelar e excluir meu pedido</span>
              </button>
            ) : (
              <button
                onClick={() => openReportModal(selectedServiceOrder.id, 'service_order', selectedServiceOrder.title)}
                className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                  alreadyReported ? 'text-amber-600' : 'text-slate-500 hover:text-red-600'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{alreadyReported ? 'Pedido sob análise de moderação' : 'Denunciar este pedido'}</span>
              </button>
            )}

            <span className="text-[11px] text-slate-400">
              Cidade Universitária · CEP {selectedServiceOrder.cep}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
