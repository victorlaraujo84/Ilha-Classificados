import React, { useState, useEffect, useRef } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  X, 
  Send, 
  MessageSquare, 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  MapPin
} from 'lucide-react';
interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  adId: string;
  adTitle: string;
  adImage: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  lastMessage: string;
  updatedAt: string;
}

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    adId: 'ad-008',
    adTitle: 'Kit Livros de Cálculo Stewart (Vol 1 e 2)',
    adImage: '/src/assets/images/ad_calculo_stewart_1791997043818.jpg',
    sellerId: 'usr_victor_fundao',
    sellerName: 'Victor Araújo',
    buyerId: 'usr_camila_letras',
    buyerName: 'Camila Rocha',
    lastMessage: 'Olá Victor! Os livros ainda estão disponíveis para entrega no CT?',
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  }
];

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'usr_camila_letras',
    senderName: 'Camila Rocha',
    text: 'Olá Victor! Os livros ainda estão disponíveis para entrega no CT?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'usr_victor_fundao',
    senderName: 'Victor Araújo',
    text: 'Oi Camila! Estão sim, posso te entregar hoje no Bloco C no intervalo das 12h ou às 17h.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  }
];

export const ChatModal: React.FC = () => {
  const { 
    isChatModalOpen, 
    setIsChatModalOpen, 
    currentUser,
    setSelectedAd,
    ads
  } = useClassifieds();

  const [conversations] = useState<Conversation[]>(DEFAULT_CONVERSATIONS);
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(DEFAULT_CONVERSATIONS[0]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = activeConversation
    ? messages.filter((m: ChatMessage) => m.conversationId === activeConversation.id)
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversation?.id]);

  if (!isChatModalOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser?.id || 'usr_me',
      senderName: currentUser?.name || 'Você',
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewAd = () => {
    if (!activeConversation) return;
    const targetAd = ads.find(a => a.id === activeConversation.adId);
    if (targetAd) {
      setIsChatModalOpen(false);
      setSelectedAd(targetAd);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[600px] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Chat Interno · UniClassificados
              </h3>
              <p className="text-[10px] text-slate-500">
                Comunicação segura para quem está dentro ou fora da Cidade Universitária
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List Sidebar (desktop or if no active conversation selected) */}
          <div className={`w-full sm:w-72 border-r border-slate-200 bg-slate-50/50 flex flex-col overflow-y-auto ${activeConversation ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Minhas Conversas ({conversations.length})
            </div>

            {conversations.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {conversations.map((conv) => {
                  const isActive = activeConversation?.id === conv.id;
                  const isSeller = conv.sellerId === currentUser?.id;
                  const otherPartyName = isSeller ? conv.buyerName : conv.sellerName;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className={`w-full p-3 text-left transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isActive ? 'bg-orange-50 border-r-2 border-orange-600' : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <img
                        src={conv.adImage}
                        alt={conv.adTitle}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 truncate">
                            {otherPartyName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatTime(conv.updatedAt)}
                          </span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                          {conv.adTitle}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                Nenhuma conversa iniciada ainda.
              </div>
            )}
          </div>

          {/* Active Conversation Message Pane */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Conversation Header & Ad Banner */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => setActiveConversation(null)}
                    className="sm:hidden p-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <img
                    src={activeConversation.adImage}
                    alt={activeConversation.adTitle}
                    className="w-9 h-9 rounded-md object-cover bg-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {activeConversation.adTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Falando com: <span className="font-semibold text-slate-800">{activeConversation.sellerId === currentUser?.id ? activeConversation.buyerName : activeConversation.sellerName}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleViewAd}
                  className="px-2.5 py-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Ver Anúncio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                {/* Security hint */}
                <div className="bg-slate-100 rounded-xl p-2.5 text-center text-[11px] text-slate-500 max-w-md mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                  Nunca faça pagamentos adiantados. Combine o encontro em local movimentado na Cidade Universitária.
                </div>

                {activeMessages.map((msg: ChatMessage) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-semibold text-slate-500">
                          {isMe ? 'Você' : msg.senderName}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                          isMe
                            ? 'bg-orange-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Digite sua mensagem no chat interno..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="hidden sm:flex flex-1 flex-col items-center justify-center p-8 text-center bg-white text-slate-400">
              <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">Selecione uma conversa</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Escolha uma conversa na lista ou abra um anúncio para falar com o anunciante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
