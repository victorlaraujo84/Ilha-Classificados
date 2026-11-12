import React, { useState } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { ItemCategoryConfig, AdItem } from '../types/classifieds';
import { 
  X, 
  Settings, 
  Plus, 
  Tag, 
  Search, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Zap, 
  Layers, 
  SlidersHorizontal,
  BookOpen,
  Car,
  Home,
  Cpu,
  Package,
  Laptop,
  Briefcase,
  Utensils,
  HelpCircle,
  AlertCircle,
  TrendingUp,
  Filter
} from 'lucide-react';

export const AdminClassificationModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    itemCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetCategoriesToDefault,
    ads,
    reclassifyAd,
    mostSearchedCategory,
    mostSearchedCategoryLabel,
    categorySearchCounts,
    simulateNewAdNotification
  } = useClassifieds();

  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'intelligence'>('categories');

  // New Category Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('BookOpen');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatKeywords, setNewCatKeywords] = useState('');
  const [newCatSubCategories, setNewCatSubCategories] = useState('');
  const [formError, setFormError] = useState('');

  // Edit Category State
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editSubCategories, setEditSubCategories] = useState('');

  // Items Filter in Tab 2
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('todos');
  const [onlyGenericItems, setOnlyGenericItems] = useState(false);

  // Tag editor per item
  const [editingItemTagsId, setEditingItemTagsId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  if (!isAdminModalOpen) return null;

  const handleStartEditCategory = (cat: ItemCategoryConfig) => {
    setEditingCatId(cat.id);
    setEditLabel(cat.label);
    setEditDesc(cat.description || '');
    setEditKeywords((cat.keywords || []).join(', '));
    setEditSubCategories((cat.subCategories || []).join(', '));
  };

  const handleSaveEditCategory = (id: string) => {
    if (!editLabel.trim()) return;
    const kwArray = editKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);
    const subArray = editSubCategories
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    updateCategory(id, {
      label: editLabel.trim(),
      description: editDesc.trim(),
      keywords: kwArray,
      subCategories: subArray,
    });
    setEditingCatId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) {
      setFormError('Informe o nome da categoria');
      return;
    }
    const slug = (newCatId || newCatLabel)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');

    if (itemCategories.some(c => c.id === slug)) {
      setFormError('Já existe uma categoria com este identificador');
      return;
    }

    const kwArray = newCatKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(Boolean);

    const subArray = newCatSubCategories
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addCategory({
      id: slug,
      label: newCatLabel.trim(),
      icon: newCatIcon,
      description: newCatDesc.trim() || `Classificação de itens do tipo ${newCatLabel.trim()} no campus`,
      keywords: kwArray.length > 0 ? kwArray : [slug, newCatLabel.toLowerCase()],
      subCategories: subArray.length > 0 ? subArray : undefined,
    });

    // Reset form
    setNewCatLabel('');
    setNewCatId('');
    setNewCatDesc('');
    setNewCatKeywords('');
    setNewCatSubCategories('');
    setFormError('');
    setShowAddForm(false);
  };

  const handleAddPreset = (preset: { id: string; label: string; icon: string; description: string; keywords: string[] }) => {
    addCategory(preset);
  };

  // Filter items for Tab 2
  const filteredItemsForAdmin = ads.filter(ad => {
    if (onlyGenericItems && ad.category !== 'produtos_usados') return false;
    if (itemCategoryFilter !== 'todos' && ad.category !== itemCategoryFilter) return false;
    if (itemSearchQuery.trim()) {
      const q = itemSearchQuery.toLowerCase().trim();
      const matchTitle = ad.title.toLowerCase().includes(q);
      const matchDesc = ad.description.toLowerCase().includes(q);
      const matchSeller = ad.sellerName.toLowerCase().includes(q);
      const matchTags = ad.classificationTags?.some(t => t.toLowerCase().includes(q)) || false;
      return matchTitle || matchDesc || matchSeller || matchTags;
    }
    return true;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return <Car className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Cpu': return <Cpu className="w-4 h-4" />;
      case 'Package': return <Package className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white leading-tight">
                  Painel Administrativo de Classificação & Taxonomia
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Modo Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Edite categorias, tags e a taxonomia de itens para alcançar outros produtos e mitigar o atrito de pesquisa.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar painel administrativo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categorias & Palavras-chave ({itemCategories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'items'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Reclassificar Itens ({ads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('intelligence')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'intelligence'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Inteligência de Busca & Alertas</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: GESTÃO DE CATEGORIAS E TAXONOMIA                  */}
          {/* ======================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Info banner */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-bold">Por que editar a taxonomia?</p>
                  <p className="mt-0.5 text-amber-800 leading-relaxed">
                    Ao criar categorias específicas (ex: <strong>Livros Acadêmicos</strong>, <strong>Eletrônicos & TI</strong>) e cadastrar palavras-chave de busca, itens deixam de ficar perdidos em categorias genéricas. O usuário encontra o que procura com um clique nas abas, <strong>mitigando a necessidade de buscas complexas</strong>.
                  </p>
                </div>
              </div>

              {/* Action bar: Add category + Presets */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Categorias Ativas de Classificação
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina rótulos, ícones e sinônimos de pesquisa para indexação automática.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Criar Nova Categoria</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetCategoriesToDefault}
                    title="Restaurar categorias de fábrica"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar Padrões</span>
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Atalhos Rápidos: Adicionar Taxonomias do Campus UFRJ
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddPreset({
                      id: 'livros_academicos',
                      label: 'Livros & Material Acadêmico',
                      icon: 'BookOpen',
                      description: 'Livros didáticos de cálculo, física, apostilas e resumos de disciplinas',
                      keywords: ['livro', 'livros', 'cálculo', 'stewart', 'boldrini', 'física', 'halliday', 'apostila', 'resumo']
                    })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-orange-600 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                    <span>+ Livros & Material Didático</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPreset({
                      id: 'eletronicos_ti',
                      label: 'Eletrônicos & Informática',
                      icon: 'Laptop',
                      description: 'Notebooks, monitores, peças de PC, periféricos e kits de desenvolvimento',
                      keywords: ['notebook', 'laptop', 'computador', 'monitor', 'teclado', 'mouse', 'arduino', 'setup']
                    })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-orange-600 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    <span>+ Eletrônicos & Informática</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddPreset({
                      id: 'republica_mobilia',
                      label: 'Móveis & República',
                      icon: 'Home',
                      description: 'Camas, escrivaninhas, armários e eletrodomésticos para repúblicas e Vila',
                      keywords: ['móveis', 'mobilia', 'mesa', 'cadeira', 'cama', 'colchão', 'geladeira', 'fogão']
                    })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-orange-500 text-slate-700 hover:text-orange-600 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+ Móveis & República</span>
                  </button>
                </div>
              </div>

              {/* Add Category Form Modal/Dropdown */}
              {showAddForm && (
                <form 
                  onSubmit={handleCreateCategory}
                  className="p-4 bg-orange-50/50 rounded-xl border border-orange-200 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-2">
                      <Plus className="w-4 h-4 text-orange-600" />
                      <span>Cadastrar Nova Classificação</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome da Categoria *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Livros & Apostilas de Exatas"
                        value={newCatLabel}
                        onChange={(e) => {
                          setNewCatLabel(e.target.value);
                          if (!newCatId) {
                            setNewCatId(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_'));
                          }
                        }}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Identificador (Slug)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: livros_apostilas"
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ícone Representativo
                      </label>
                      <select
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white cursor-pointer"
                      >
                        <option value="BookOpen">Livro (BookOpen)</option>
                        <option value="Laptop">Notebook / Informática (Laptop)</option>
                        <option value="Car">Veículo / Transporte (Car)</option>
                        <option value="Home">Moradia / Imóvel (Home)</option>
                        <option value="Cpu">Equipamento / TI (Cpu)</option>
                        <option value="Package">Pacote / Caixa (Package)</option>
                        <option value="Utensils">Alimentação (Utensils)</option>
                        <option value="Briefcase">Profissional (Briefcase)</option>
                        <option value="Tag">Etiqueta Geral (Tag)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Palavras-chave de Busca (Mitigar Pesquisa) *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: stewart, calculo, apostila, fisica, halliday (separar por vírgula)"
                        value={newCatKeywords}
                        onChange={(e) => setNewCatKeywords(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Termos que ativam esta categoria na busca instantânea
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Descrição / Finalidade
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Itens didáticos para alunos de engenharia, matemática e química do Fundão"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Opções de Subcategorias (Ex: Veículos &rarr; Carros, Motos)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Carros, Motos, Bicicletas, Patinetes & Scooters (separar por vírgula)"
                      value={newCatSubCategories}
                      onChange={(e) => setNewCatSubCategories(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Subcategorias permitem classificar anúncios com precisão e mitigar a pesquisa.
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm"
                    >
                      Salvar Classificação
                    </button>
                  </div>
                </form>
              )}

              {/* Category Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {itemCategories.map((cat) => {
                  const itemCount = ads.filter(a => a.category === cat.id).length;
                  const isEditing = editingCatId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isEditing 
                          ? 'border-orange-500 bg-orange-50/20 ring-2 ring-orange-100' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Nome da Categoria
                            </label>
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Palavras-chave de Busca (Mitigar Pesquisa)
                            </label>
                            <input
                              type="text"
                              value={editKeywords}
                              onChange={(e) => setEditKeywords(e.target.value)}
                              placeholder="palavra1, palavra2, termo..."
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Descrição
                            </label>
                            <input
                              type="text"
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Opções de Subcategorias (separadas por vírgula)
                            </label>
                            <input
                              type="text"
                              value={editSubCategories}
                              onChange={(e) => setEditSubCategories(e.target.value)}
                              placeholder="Carros, Motos, Bicicletas..."
                              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                            />
                            <span className="text-[9px] text-slate-400 mt-0.5 block">
                              Ex: Carros, Motos, Bicicletas, Peças & Acessórios
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingCatId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditCategory(cat.id)}
                              className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-md text-xs font-bold"
                            >
                              Salvar Alterações
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                                {getCategoryIcon(cat.icon)}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{cat.label}</span>
                                  {cat.isDefault && (
                                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                      Padrão
                                    </span>
                                  )}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  id: {cat.id}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                {itemCount} anúncio(s)
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStartEditCategory(cat)}
                                title="Editar categoria, subcategorias e palavras-chave"
                                className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {!cat.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => deleteCategory(cat.id)}
                                  title="Remover categoria customizada"
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 mb-2 line-clamp-2">
                            {cat.description || 'Sem descrição cadastrada'}
                          </p>

                          {/* Subcategories preview */}
                          {cat.subCategories && cat.subCategories.length > 0 && (
                            <div className="mb-2.5 pb-2 border-b border-slate-100">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                Subcategorias Ativas ({cat.subCategories.length}):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {cat.subCategories.map((sub, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] bg-orange-50 text-orange-900 border border-orange-200/60 px-1.5 py-0.5 rounded-md font-semibold"
                                  >
                                    ↳ {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Keywords for search mitigation */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Tags de Mitigação de Pesquisa:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {(cat.keywords || []).slice(0, 8).map((kw, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium"
                                >
                                  #{kw}
                                </span>
                              ))}
                              {(cat.keywords || []).length > 8 && (
                                <span className="text-[10px] text-slate-400 self-center">
                                  +{(cat.keywords || []).length - 8} tags
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: RECLASSIFICAÇÃO RÁPIDA DE ITENS                   */}
          {/* ======================================================== */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 min-w-[240px] relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filtrar anúncio por título, vendedor ou tags..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={itemCategoryFilter}
                    onChange={(e) => setItemCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="todos">Todas as Categorias</option>
                    {itemCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setOnlyGenericItems(!onlyGenericItems)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                      onlyGenericItems
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    ⚠️ Apenas "Produtos Usados" ({ads.filter(a => a.category === 'produtos_usados').length})
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {filteredItemsForAdmin.map((ad) => {
                  const currentCategoryObj = itemCategories.find(c => c.id === ad.category);
                  const isEditingTags = editingItemTagsId === ad.id;

                  return (
                    <div 
                      key={ad.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {ad.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Por <span className="font-medium text-slate-700">{ad.sellerName}</span> · {ad.campusZone} · {ad.price ? `R$ ${ad.price.toLocaleString('pt-BR')}` : 'A combinar'}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                              {currentCategoryObj?.label || ad.category}
                            </span>
                            {ad.subCategory && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-200">
                                ↳ {ad.subCategory}
                              </span>
                            )}
                          </div>

                          {/* Tags editor */}
                          <div className="mt-2 flex flex-wrap items-center gap-1">
                            <span className="text-[10px] text-slate-400 font-semibold mr-1">
                              Tags de Busca:
                            </span>
                            {(ad.classificationTags || []).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                              >
                                #{tag}
                              </span>
                            ))}

                            {isEditingTags ? (
                              <div className="inline-flex items-center gap-1 ml-1">
                                <input
                                  type="text"
                                  placeholder="tag1, tag2..."
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  className="px-2 py-0.5 text-[10px] border border-orange-400 rounded focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTags = tagInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
                                    reclassifyAd(ad.id, ad.category, newTags, ad.subCategory);
                                    setEditingItemTagsId(null);
                                  }}
                                  className="px-1.5 py-0.5 bg-orange-600 text-white rounded text-[10px] font-bold"
                                >
                                  OK
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingItemTagsId(null)}
                                  className="text-slate-400 hover:text-slate-600 text-[10px]"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItemTagsId(ad.id);
                                  setTagInput((ad.classificationTags || []).join(', '));
                                }}
                                className="text-[10px] text-orange-600 hover:underline font-semibold ml-1 cursor-pointer"
                              >
                                + Editar tags
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Instant Reclassification: Category & Subcategory (Ex: Veículos -> Carros) */}
                      <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-between sm:justify-end">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400 font-medium">
                            Categoria:
                          </span>
                          <select
                            value={ad.category}
                            onChange={(e) => {
                              const newCat = e.target.value;
                              const newCatConfig = itemCategories.find(c => c.id === newCat);
                              const defaultSub = newCatConfig?.subCategories?.[0] || 'Geral';
                              reclassifyAd(ad.id, newCat, ad.classificationTags, defaultSub);
                            }}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              ad.category === 'produtos_usados'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-white text-slate-800 border-slate-300 hover:border-orange-500'
                            }`}
                          >
                            {itemCategories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Subcategory Selector (Ex. Veículos -> Carros) */}
                        {(() => {
                          const catObj = itemCategories.find(c => c.id === ad.category);
                          if (!catObj?.subCategories || catObj.subCategories.length === 0) return null;

                          return (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-400 font-medium">
                                Sub:
                              </span>
                              <select
                                value={ad.subCategory || catObj.subCategories[0]}
                                onChange={(e) => reclassifyAd(ad.id, ad.category, ad.classificationTags, e.target.value)}
                                className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-orange-300 bg-orange-50/80 text-orange-950 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
                                title={`Subcategoria em ${catObj.label} (Ex: ${catObj.label} -> ${catObj.subCategories[0]})`}
                              >
                                {catObj.subCategories.map((sub) => (
                                  <option key={sub} value={sub}>
                                    {sub}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}

                {filteredItemsForAdmin.length === 0 && (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-xs text-slate-500 font-medium">
                      Nenhum anúncio encontrado com os filtros selecionados.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: INTELIGÊNCIA DE BUSCA & ALERTAS GLOBAIS          */}
          {/* ======================================================== */}
          {activeTab === 'intelligence' && (
            <div className="space-y-6">
              {/* Telemetry Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        Sistema Global de Alertas
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        Categoria Mais Pesquisada pelos Usuários no Campus
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-orange-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Categoria Líder Atual:
                      </span>
                      <span className="text-lg font-black text-white flex items-center gap-2">
                        <span>{mostSearchedCategoryLabel}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-600/30 text-orange-300 border border-orange-500/30">
                          {categorySearchCounts[mostSearchedCategory] || 0} buscas
                        </span>
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                        Novos anúncios publicados nesta categoria disparam notificações imediatas no topo da aplicação.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">
                          Ação Rápida de Teste do Alerta:
                        </span>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          Simule a publicação de um item nesta categoria para validar o alerta em tempo real.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={simulateNewAdNotification}
                        className="mt-3 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95"
                      >
                        <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                        <span>Simular Publicação & Testar Alerta</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ranking of category searches */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Ranking de Frequência de Pesquisas por Categoria
                </h4>

                <div className="space-y-2">
                  {Object.entries(categorySearchCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([catId, count], idx) => {
                      const catObj = itemCategories.find(c => c.id === catId);
                      const label = catObj?.label || (catId === 'todos' ? 'Buscas Gerais' : catId);
                      const maxCount = Math.max(...Object.values(categorySearchCounts), 1);
                      const percent = Math.round((count / maxCount) * 100);

                      return (
                        <div 
                          key={catId}
                          className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3"
                        >
                          <span className="w-6 text-center text-xs font-bold text-slate-400">
                            #{idx + 1}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 text-xs">
                              <span className="font-bold text-slate-800 truncate">
                                {label}
                              </span>
                              <span className="font-semibold text-slate-600 tabular-nums">
                                {count} pesquisas
                              </span>
                            </div>

                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  idx === 0 ? 'bg-orange-600' : 'bg-slate-400'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Alterações de taxonomia são sincronizadas instantaneamente com os filtros e busca dos alunos.
          </span>
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Concluir e Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
