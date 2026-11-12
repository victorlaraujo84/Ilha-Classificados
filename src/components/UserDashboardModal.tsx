import React, { useState } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { 
  X, 
  BarChart2, 
  TrendingUp, 
  Eye, 
  Package, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  User as UserIcon,
  MapPin,
  Calendar,
  MessageSquare,
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  AreaChart, 
  Area,
  Legend 
} from 'recharts';
import { Category, AdItem } from '../types/classifieds';

const CATEGORY_COLORS: Record<string, string> = {
  veiculos: '#2563eb',     // Blue
  imoveis: '#d97706',      // Amber
  equipamentos: '#7c3aed', // Purple
  produtos_usados: '#ea580c', // Orange
  livros_academicos: '#0284c7', // Sky Blue
  eletronicos_ti: '#6366f1', // Indigo
};

const CATEGORY_LABELS: Record<string, string> = {
  veiculos: 'Veículos',
  imoveis: 'Imóveis',
  equipamentos: 'Equipamentos',
  produtos_usados: 'Usados',
  livros_academicos: 'Livros',
  eletronicos_ti: 'Eletrônicos',
};

export const UserDashboardModal: React.FC = () => {
  const { 
    isDashboardModalOpen, 
    setIsDashboardModalOpen, 
    currentUser, 
    ads,
    userAds, 
    setSelectedAd, 
    deleteAd, 
    setIsPublishModalOpen,
    conversations,
    setIsAdminModalOpen,
    itemCategories,
    mostSearchedCategoryLabel
  } = useClassifieds();

  const [scope, setScope] = useState<'my_ads' | 'campus_overview'>('my_ads');

  if (!isDashboardModalOpen) return null;

  // Active ads to display in charts
  const activeAdsToAnalyze = scope === 'my_ads' && userAds.length > 0 
    ? userAds 
    : (userAds.length > 0 ? userAds : ads);

  const totalUserViews = userAds.reduce((sum: number, ad: AdItem) => sum + (ad.viewsCount || 0), 0);
  const avgViewsPerAd = userAds.length > 0 ? Math.round(totalUserViews / userAds.length) : 0;
  const userConvos = currentUser ? (conversations || []).filter((c: any) => c.sellerId === currentUser.id || c.buyerId === currentUser.id) : [];

  // Data 1: Quantidade de anúncios publicados por categoria (Dynamic from admin taxonomy)
  const categoryOrder = itemCategories.map(c => c.id);

  const categoryData = categoryOrder.map(catId => {
    const count = activeAdsToAnalyze.filter((ad: AdItem) => ad.category === catId).length;
    const catConfig = itemCategories.find(c => c.id === catId);
    return {
      categoryKey: catId,
      name: catConfig ? catConfig.label : (CATEGORY_LABELS[catId] || catId),
      quantidade: count,
      color: CATEGORY_COLORS[catId] || '#ea580c',
    };
  });

  // Data 2: Evolução das visualizações dos anúncios ativos
  // We compile chronological 7-day view evolution
  const dates = ['08/10', '09/10', '10/10', '11/10', '12/10', '13/10', '14/10'];

  const viewsEvolutionData = dates.map(dateStr => {
    const entry: Record<string, any> = { date: dateStr };
    let dayTotal = 0;

    activeAdsToAnalyze.forEach((ad: AdItem, index: number) => {
      const hist = ad.viewsHistory?.find((h: { date: string; views: number }) => h.date === dateStr);
      let val = 0;
      if (hist) {
        val = hist.views;
      } else {
        // Approximate baseline if history not present
        const dayIdx = dates.indexOf(dateStr);
        val = Math.round((ad.viewsCount || 10) * ((dayIdx + 1) / dates.length));
      }
      const shortKey = `ad_${index}`;
      entry[shortKey] = val;
      dayTotal += val;
    });

    entry.totalViews = dayTotal;
    return entry;
  });

  const handleOpenAdDetail = (ad: AdItem) => {
    setSelectedAd(ad);
    setIsDashboardModalOpen(false);
  };

  const handleDeleteAd = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
      deleteAd(id);
    }
  };

  const handleNewAd = () => {
    setIsDashboardModalOpen(false);
    setIsPublishModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4 sm:my-8 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Painel do Anunciante & Estatísticas</span>
                <span className="text-[10px] font-semibold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full uppercase">
                  Recharts BI
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Métricas de desempenho e alcance no campus da Cidade Universitária (CEP 21941-000)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDashboardModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Fechar Painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* User Profile Summary Card */}
          {currentUser && (
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{currentUser.name}</h3>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                      Anunciante Ativo
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{currentUser.campusAffiliation}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>CEP 21941-000 · Ilha do Fundão</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDashboardModalOpen(false);
                    setIsAdminModalOpen(true);
                  }}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-orange-400 hover:text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer whitespace-nowrap"
                  title="Abrir Gestão de Classificação & Taxonomia"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                  <span>Classificação Admin</span>
                </button>

                <button
                  onClick={handleNewAd}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar Novo Anúncio</span>
                </button>
              </div>
            </div>
          )}

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Meus Anúncios</span>
                <Package className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {userAds.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {userAds.length === 1 ? 'Anúncio publicado' : 'Anúncios ativos no campus'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Visualizações</span>
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {totalUserViews}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+28% nos últimos 7 dias</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Média / Anúncio</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {avgViewsPerAd}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Views por item publicado
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Conversas & Chat</span>
                <MessageSquare className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {userConvos.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Interações via chat interno
              </p>
            </div>
          </div>

          {/* Scope Selector (Only visible if user has ads) */}
          {userAds.length > 0 && (
            <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-lg border border-slate-200">
              <div className="text-xs font-semibold text-slate-700 px-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Fonte dos dados dos gráficos:</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setScope('my_ads')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    scope === 'my_ads'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Meus Anúncios ({userAds.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope('campus_overview')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    scope === 'campus_overview'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Comparativo do Campus ({ads.length})
                </button>
              </div>
            </div>
          )}

          {/* Recharts Grid: 2 Required Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Quantidade de anúncios publicados por categoria */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-orange-600" />
                    <span>Anúncios Publicados por Categoria</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Distribuição da oferta entre Veículos, Serviços, Imóveis, Equipamentos e Usados
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {activeAdsToAnalyze.length} total
                </span>
              </div>

              {/* Recharts BarChart */}
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      interval={0}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`${val} ${val === 1 ? 'anúncio' : 'anúncios'}`, 'Publicados']}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#fed7aa', fontWeight: 600 }}
                    />
                    <Bar 
                      dataKey="quantidade" 
                      radius={[6, 6, 0, 0]}
                      maxBarSize={48}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend & Values */}
              <div className="grid grid-cols-5 gap-1.5 mt-2 pt-3 border-t border-slate-100 text-center">
                {categoryData.map((cat) => (
                  <div key={cat.categoryKey} className="px-1 py-1 rounded bg-slate-50">
                    <span className="text-[10px] text-slate-500 block truncate">{cat.name}</span>
                    <span className="text-xs font-bold text-slate-900 tabular-nums">{cat.quantidade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Evolução das visualizações dos seus anúncios ativos */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Evolução das Visualizações dos Anúncios Ativos</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Acessos acumulados ao longo dos últimos 7 dias na plataforma
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  +165 hoje
                </span>
              </div>

              {/* Recharts AreaChart */}
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={viewsEvolutionData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      formatter={(val: any) => [`${val} visualizações`, 'Total Acumulado']}
                      labelFormatter={(label) => `Data: ${label}/2026`}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                      itemStyle={{ color: '#fdba74', fontWeight: 600 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalViews" 
                      name="Visualizações" 
                      stroke="#ea580c" 
                      strokeWidth={2.5}
                      fillOpacity={1} 
                      fill="url(#viewsGradient)" 
                      activeDot={{ r: 6, fill: '#ea580c', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Timeline Note */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Janela: 08/10 a 14/10 (Atualização contínua)</span>
                </span>
                <span className="font-semibold text-slate-700">
                  {totalUserViews} views acumuladas
                </span>
              </div>
            </div>
          </div>

          {/* User's Active Classifieds Management Table/List */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span>Gerenciar Meus Anúncios Ativos ({userAds.length})</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Seus anúncios visíveis para toda a Cidade Universitária no CEP 21941-000
                </p>
              </div>

              <button
                type="button"
                onClick={handleNewAd}
                className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Anúncio</span>
              </button>
            </div>

            {userAds.length > 0 ? (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                {userAds.map((ad: AdItem) => (
                  <div 
                    key={ad.id}
                    onClick={() => handleOpenAdDetail(ad)}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                          {ad.title}
                        </h5>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold text-orange-600 capitalize">
                            {CATEGORY_LABELS[ad.category] || ad.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-bold text-slate-800">
                            {ad.priceType === 'gratis' ? 'Grátis' : ad.priceType === 'a_combinar' ? 'A combinar' : `R$ ${ad.price}`}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{ad.campusZone.split('-')[0].trim()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span className="tabular-nums">{ad.viewsCount || 0} views</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAdDetail(ad);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                          title="Ver anúncio"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAd(ad.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Excluir anúncio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Nenhum anúncio publicado nesta conta</p>
                <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  Publique um anúncio de veículo, serviço, equipamento ou usado para acompanhar os gráficos!
                </p>
                <button
                  type="button"
                  onClick={handleNewAd}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Criar primeiro anúncio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
