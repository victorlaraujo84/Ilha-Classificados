import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { Search, MapPin, Sparkles, Car, Home, Cpu, Package, BookOpen, Laptop, Tag } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { filters, setFilters, ads, itemCategories } = useClassifieds();

  const getCategoryIcon = (id: string, iconName?: string) => {
    if (id === 'todos') return Sparkles;
    if (id === 'veiculos' || iconName === 'Car') return Car;
    if (id === 'imoveis' || iconName === 'Home') return Home;
    if (id === 'equipamentos' || iconName === 'Cpu') return Cpu;
    if (id === 'produtos_usados' || iconName === 'Package') return Package;
    if (id === 'livros_academicos' || iconName === 'BookOpen') return BookOpen;
    if (id === 'eletronicos_ti' || iconName === 'Laptop') return Laptop;
    return Tag;
  };

  const categories = [
    { id: 'todos', label: 'Todos os Itens', icon: Sparkles },
    ...itemCategories.slice(0, 6).map(c => ({
      id: c.id,
      label: c.label,
      icon: getCategoryIcon(c.id, c.icon)
    }))
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('anuncios-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden border-b border-slate-800">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_cidade_universitaria_1791995293664.jpg"
          alt="Campus da Cidade Universitária UFRJ Fundão"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 text-center">
        {/* Subtle Local Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-orange-300 bg-orange-950/60 border border-orange-700/40 px-3.5 py-1 rounded-full mb-4 backdrop-blur-sm">
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span>Classificados Locais · Cidade Universitária · CEP 21941-000</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto text-balance leading-tight">
          O marketplace direto de quem estuda e trabalha no <span className="text-orange-500">Fundão</span>
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compre, venda e contrate sem frete abusivo e sem atravessadores. Anúncios de veículos, vagas em repúblicas, serviços acadêmicos e equipamentos com chat interno e segurança local.
        </p>

        {/* Hero Search Box */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl p-2 flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full flex items-center pl-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="O que você está procurando no Fundão? Ex: Bicicleta, Calculadora HP, Quarto..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-3 pr-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold text-sm transition-all shadow cursor-pointer shrink-0"
          >
            Buscar Anúncios
          </button>
        </form>

        {/* Quick Category Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: cat.id }));
                  const el = document.getElementById('anuncios-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-600 text-white shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Counter */}
        <div className="mt-6 text-xs text-slate-400">
          <span>{ads.length} anúncios ativos no CEP 21941-000</span>
          <span className="mx-2">·</span>
          <span>Entrega e retirada no campus</span>
          <span className="mx-2">·</span>
          <span>Contato direto via WhatsApp</span>
        </div>
      </div>
    </div>
  );
};
