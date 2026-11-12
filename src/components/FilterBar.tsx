import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { CAMPUS_ZONES, CATEGORIES_CONFIG, CAMPUS_SECTORS } from '../data/seedData';
import { 
  LayoutGrid, 
  List, 
  Filter, 
  X, 
  ArrowUpDown, 
  MapPin, 
  DollarSign, 
  RotateCcw,
  Heart,
  Navigation,
  Compass
} from 'lucide-react';
import { Category } from '../types/classifieds';

export const FilterBar: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    filteredAds,
    favorites,
    currentUser,
    setIsFavoritesModalOpen,
    setAuthModalMode,
    setIsAuthModalOpen,
    itemCategories,
    setIsAdminModalOpen
  } = useClassifieds();

  const hasActiveFilters = 
    filters.category !== 'todos' ||
    filters.subCategory !== 'todas' ||
    filters.campusZone !== 'Todas as áreas no campus' ||
    filters.userSector !== 'qualquer' ||
    filters.maxDistanceKm !== 'qualquer' ||
    filters.searchQuery !== '' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '';

  const currentSectorObj = CAMPUS_SECTORS.find(s => s.id === filters.userSector);

  const displayCategories = [
    { id: 'todos', label: 'Todos os Itens' },
    ...itemCategories
  ];

  return (
    <div id="anuncios-section" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      {/* Top Row: Category Tabs (Dinamically configured by Admin) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-slate-100 no-scrollbar">
        {displayCategories.map((cat) => {
          const isSelected = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id, subCategory: 'todas' }))}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}

        {/* Quick Admin classification button */}
        <button
          type="button"
          onClick={() => setIsAdminModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 whitespace-nowrap transition-all cursor-pointer"
          title="Editar ou criar categorias para mitigar a pesquisa"
        >
          ⚙️ Ajustar Classificação
        </button>

        {/* Quick Favoritos access */}
        <button
          onClick={() => {
            if (!currentUser) {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            } else {
              setIsFavoritesModalOpen(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ml-auto shrink-0 ${
            favorites.length > 0
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
          title="Ver anúncios favoritados"
        >
          <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-rose-600 text-rose-600' : 'text-slate-500'}`} />
          <span>Meus Favoritos ({favorites.length})</span>
        </button>
      </div>

      {/* Subcategory Row: Ex. Veículos -> Carros, Motos, Bicicletas */}
      {(() => {
        const currentCatObj = itemCategories.find(c => c.id === filters.category);
        const hasSubCategories = currentCatObj?.subCategories && currentCatObj.subCategories.length > 0;

        if (hasSubCategories) {
          return (
            <div className="mb-4 pb-3 border-b border-slate-100 animate-in fade-in">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-orange-600 font-black">↳</span>
                  <span>Opções de Subcategorias em {currentCatObj?.label} (Ex: {currentCatObj?.label} &rarr; {currentCatObj?.subCategories?.[0]})</span>
                </label>
                {filters.subCategory !== 'todas' && (
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, subCategory: 'todas' }))}
                    className="text-[10px] text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                  >
                    Ver todas em {currentCatObj?.label}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, subCategory: 'todas' }))}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filters.subCategory === 'todas'
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas as Subcategorias
                </button>
                {currentCatObj.subCategories!.map((sub) => {
                  const isSelected = filters.subCategory === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setFilters(prev => ({ ...prev, subCategory: sub }))}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs font-bold'
                          : 'bg-orange-50/70 text-orange-950 hover:bg-orange-100 border border-orange-200/50'
                      }`}
                    >
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        if (filters.category === 'todos') {
          // Quick shortcuts for popular subcategories across the campus
          const popularShortcuts = [
            { cat: 'veiculos', sub: 'Carros', label: '🚗 Carros' },
            { cat: 'veiculos', sub: 'Motos', label: '🏍️ Motos' },
            { cat: 'veiculos', sub: 'Bicicletas', label: '🚲 Bicicletas' },
            { cat: 'imoveis', sub: 'Quartos em Repúblicas', label: '🏠 Quartos & Repúblicas' },
            { cat: 'equipamentos', sub: 'Calculadoras & TI', label: '📐 Calculadoras & TI' },
            { cat: 'produtos_usados', sub: 'Livros Acadêmicos', label: '📚 Livros Acadêmicos' },
          ];

          return (
            <div className="mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Atalhos Rápidos de Subcategorias:
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {popularShortcuts.map((sc) => (
                  <button
                    key={`${sc.cat}-${sc.sub}`}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, category: sc.cat, subCategory: sc.sub }))}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-900 border border-slate-200 hover:border-orange-300 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })()}

      {/* Campus Academic Sector Chips (ex: CT, CCMN, CCS) */}
      <div className="mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-orange-600" />
            <span>Sua Unidade Acadêmica / Setor do Campus (Filtro por Proximidade)</span>
          </label>
          {filters.userSector !== 'qualquer' && (
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, userSector: 'qualquer', maxDistanceKm: 'qualquer' }))}
              className="text-[10px] text-slate-500 hover:text-red-600 font-semibold cursor-pointer"
            >
              Remover setor
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, userSector: 'qualquer' }))}
            className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              filters.userSector === 'qualquer'
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todo o Campus
          </button>
          {CAMPUS_SECTORS.map((sector) => {
            const isSelected = filters.userSector === sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  userSector: sector.id,
                  // If switching to a sector, optionally default sorting to closest
                  sortBy: prev.sortBy === 'recente' ? 'menor_distancia' : prev.sortBy
                }))}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-orange-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={sector.description}
              >
                <span>{sector.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Row: Distance Radius, Price range, Sorting, View Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Distance Radius Filter (or Specific Zone) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {filters.userSector !== 'qualquer' ? `Distância de ${currentSectorObj?.shortName || 'Setor'}` : 'Local Específico no Campus'}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {filters.userSector !== 'qualquer' ? (
              <select
                value={filters.maxDistanceKm}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  maxDistanceKm: e.target.value === 'qualquer' ? 'qualquer' : parseFloat(e.target.value) 
                }))}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                <option value="qualquer">Qualquer distância no campus</option>
                <option value="0.3">No mesmo setor (&lt; 300m)</option>
                <option value="1.0">Até 1 km (Setores adjacentes a pé)</option>
                <option value="2.0">Até 2 km (Todo o anel viário)</option>
              </select>
            ) : (
              <select
                value={filters.campusZone}
                onChange={(e) => setFilters(prev => ({ ...prev, campusZone: e.target.value }))}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
              >
                {CAMPUS_ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Faixa de Preço (R$)
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <span className="text-slate-400 text-xs absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">R$</span>
              <input
                type="number"
                min="0"
                placeholder="Mín"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-full pl-7 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <span className="text-slate-400 text-xs">-</span>
            <div className="relative flex-1">
              <span className="text-slate-400 text-xs absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">R$</span>
              <input
                type="number"
                min="0"
                placeholder="Máx"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-full pl-7 pr-2 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Ordenar Por
          </label>
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            >
              {filters.userSector !== 'qualquer' && (
                <option value="menor_distancia">Mais Próximos da Minha Unidade 📍</option>
              )}
              <option value="recente">Mais Recentes</option>
              <option value="menor_preco">Menor Preço</option>
              <option value="maior_preco">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* View Mode & Reset */}
        <div className="flex flex-col justify-end">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Visualização
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'grid' }))}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  filters.viewMode === 'grid' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Exibir em Grade"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, viewMode: 'list' }))}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  filters.viewMode === 'list' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Exibir em Lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Summary Bar */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 tabular-nums">
            {filteredAds.length}
          </span>
          <span>
            {filteredAds.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'} na Cidade Universitária
          </span>
        </div>

        <div className="flex items-center gap-2">
          {filters.subCategory && filters.subCategory !== 'todas' && (
            <div className="flex items-center gap-1.5 text-xs bg-orange-100 text-orange-950 font-semibold px-2.5 py-0.5 rounded-md border border-orange-200">
              <span>Subcategoria: {filters.subCategory}</span>
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, subCategory: 'todas' }))}
                className="text-orange-600 hover:text-orange-900 cursor-pointer"
                title="Limpar subcategoria"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.searchQuery && (
            <div className="flex items-center gap-1.5 text-xs bg-orange-50 text-orange-800 px-2.5 py-0.5 rounded">
              <span>Busca: "{filters.searchQuery}"</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="text-orange-500 hover:text-orange-800 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
