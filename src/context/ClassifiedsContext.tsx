import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppMode,
  AdItem, 
  ServiceOrder, 
  ServiceProposal, 
  User, 
  OlxFilterState, 
  ServiceFilterState,
  OlxCategory,
  ServiceCategory,
  LocationState,
  ItemCategoryConfig,
  AppNotification
} from '../types/classifieds';
import { 
  INITIAL_ADS, 
  INITIAL_SERVICE_ORDERS, 
  INITIAL_PROPOSALS, 
  DEMO_USER, 
  getSectorDistance,
  DEFAULT_ITEM_CATEGORIES,
  INITIAL_NOTIFICATIONS
} from '../data/seedData';

interface ReportPayload {
  targetId: string;
  targetType: 'ad' | 'service_order';
  title: string;
  reason: string;
  details?: string;
  timestamp: string;
  reporterUserId?: string;
}

interface ClassifiedsContextType {
  // Navigation Mode
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  serviceView: 'todos_pedidos' | 'meus_pedidos' | 'sou_profissional';
  setServiceView: (view: 'todos_pedidos' | 'meus_pedidos' | 'sou_profissional') => void;

  // OLX Flow (Classificados)
  ads: AdItem[];
  filteredAds: AdItem[];
  olxFilters: OlxFilterState;
  setOlxFilters: React.Dispatch<React.SetStateAction<OlxFilterState>>;
  resetOlxFilters: () => void;
  filters: OlxFilterState;
  setFilters: React.Dispatch<React.SetStateAction<OlxFilterState>>;
  resetFilters: () => void;
  selectedAd: AdItem | null;
  setSelectedAd: (ad: AdItem | null) => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  createAd: (adData: Omit<AdItem, 'id' | 'createdAt' | 'viewsCount' | 'sellerUserId'>) => AdItem;
  deleteAd: (id: string) => void;
  incrementViews: (id: string) => void;

  // Dashboard & Distance
  isDashboardModalOpen: boolean;
  setIsDashboardModalOpen: (open: boolean) => void;
  userAds: AdItem[];
  getUserSectorDistance: (ad: AdItem) => number | null;

  // GetNinjas Flow (Demanda Ativa de Serviços)
  serviceOrders: ServiceOrder[];
  filteredServiceOrders: ServiceOrder[];
  serviceFilters: ServiceFilterState;
  setServiceFilters: React.Dispatch<React.SetStateAction<ServiceFilterState>>;
  resetServiceFilters: () => void;
  selectedServiceOrder: ServiceOrder | null;
  setSelectedServiceOrder: (order: ServiceOrder | null) => void;
  isNewServiceOrderModalOpen: boolean;
  setIsNewServiceOrderModalOpen: (open: boolean) => void;
  createServiceOrder: (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'clientId' | 'clientName' | 'clientAffiliation' | 'clientPhone' | 'clientWhatsApp' | 'clientEmail' | 'proposalsCount' | 'status'>) => ServiceOrder;
  deleteServiceOrder: (id: string) => void;

  // GetNinjas: Propostas de Prestadores
  serviceProposals: ServiceProposal[];
  isProposalModalOpen: boolean;
  setIsProposalModalOpen: (open: boolean) => void;
  proposalTargetOrder: ServiceOrder | null;
  openProposalModal: (order: ServiceOrder) => void;
  submitProposal: (orderId: string, priceEstimate: string, message: string, availability: string) => void;
  getOrderProposals: (orderId: string) => ServiceProposal[];
  myServiceOrders: ServiceOrder[];
  myProposalsSent: ServiceProposal[];

  // User & Auth
  currentUser: User | null;
  login: (email: string) => boolean;
  loginAsDemo: () => void;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;

  // Common Modals & Tools
  isSafetyModalOpen: boolean;
  setIsSafetyModalOpen: (open: boolean) => void;
  favorites: string[];
  toggleFavorite: (adId: string) => void;
  isFavorite: (adId: string) => boolean;
  isFavoritesModalOpen: boolean;
  setIsFavoritesModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTarget: { id: string; type: 'ad' | 'service_order'; title: string } | null;
  reportTargetAd: { id: string; type: 'ad' | 'service_order'; title: string } | null;
  openReportModal: (id: string, type: 'ad' | 'service_order', title: string) => void;
  submitReport: (reason: string, details?: string) => void;
  hasReported: (id: string) => boolean;

  // Notification System (Alerta quando novo anúncio é publicado na categoria mais pesquisada)
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  activeToast: AppNotification | null;
  dismissToast: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  categorySearchCounts: Record<string, number>;
  recordCategorySearch: (category: string, query?: string) => void;
  mostSearchedCategory: string;
  mostSearchedCategoryLabel: string;
  simulateNewAdNotification: () => void;
  isNotificationPopoverOpen: boolean;
  setIsNotificationPopoverOpen: (open: boolean) => void;

  // Administrative Item Classification & Search Mitigation
  itemCategories: ItemCategoryConfig[];
  addCategory: (newCategory: Omit<ItemCategoryConfig, 'isDefault'>) => void;
  updateCategory: (id: string, updates: Partial<ItemCategoryConfig>) => void;
  deleteCategory: (id: string) => void;
  resetCategoriesToDefault: () => void;
  reclassifyAd: (adId: string, newCategory: string, newTags?: string[], newSubCategory?: string) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  // Location & Chat compatibility
  locationState: LocationState;
  setSimulatedLocation: (status: 'inside' | 'outside' | 'simulated_inside' | 'simulated_outside') => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  unreadMessagesCount: number;
  conversations: any[];
}

const STORAGE_KEY_APP_MODE = 'uniclassificados_app_mode_v3';
const STORAGE_KEY_ADS = 'uniclassificados_ads_v3';
const STORAGE_KEY_ORDERS = 'uniclassificados_orders_v3';
const STORAGE_KEY_PROPOSALS = 'uniclassificados_proposals_v3';
const STORAGE_KEY_USER = 'uniclassificados_user_v3';
const STORAGE_KEY_FAVS = 'uniclassificados_favs_v3';
const STORAGE_KEY_REPORTS = 'uniclassificados_reports_v3';
const STORAGE_KEY_CATEGORIES = 'uniclassificados_categories_v3';
const STORAGE_KEY_NOTIFICATIONS = 'uniclassificados_notifications_v3';
const STORAGE_KEY_SEARCH_COUNTS = 'uniclassificados_search_counts_v3';

const defaultOlxFilters: OlxFilterState = {
  searchQuery: '',
  category: 'todos',
  subCategory: 'todas',
  campusZone: 'Todas as áreas no campus',
  userSector: 'qualquer',
  maxDistanceKm: 'qualquer',
  minPrice: '',
  maxPrice: '',
  sortBy: 'recente',
  viewMode: 'grid',
};

const defaultServiceFilters: ServiceFilterState = {
  searchQuery: '',
  category: 'todos',
  campusZone: 'Todas as áreas no campus',
  userSector: 'qualquer',
  urgency: 'todas',
  sortBy: 'recente',
};

const ClassifiedsContext = createContext<ClassifiedsContextType | undefined>(undefined);

export const ClassifiedsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation Mode: 'olx' (Comprar e Alugar) vs 'getninjas' (Contratar Serviços)
  const [appMode, setAppMode] = useState<AppMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APP_MODE);
      if (saved === 'olx' || saved === 'getninjas') return saved;
    } catch {}
    return 'olx';
  });

  const [serviceView, setServiceView] = useState<'todos_pedidos' | 'meus_pedidos' | 'sou_profissional'>('todos_pedidos');

  // OLX Ads state
  const [ads, setAds] = useState<AdItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ADS;
  });

  // GetNinjas Service Orders state
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_SERVICE_ORDERS;
  });

  // GetNinjas Proposals state
  const [serviceProposals, setServiceProposals] = useState<ServiceProposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROPOSALS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_PROPOSALS;
  });

  // Current User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // OLX Modals
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [olxFilters, setOlxFilters] = useState<OlxFilterState>(defaultOlxFilters);

  // GetNinjas Modals
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<ServiceOrder | null>(null);
  const [isNewServiceOrderModalOpen, setIsNewServiceOrderModalOpen] = useState(false);
  const [serviceFilters, setServiceFilters] = useState<ServiceFilterState>(defaultServiceFilters);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalTargetOrder, setProposalTargetOrder] = useState<ServiceOrder | null>(null);

  // Auth Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Safety & Common
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);

  // Reports
  const [reports, setReports] = useState<ReportPayload[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; type: 'ad' | 'service_order'; title: string } | null>(null);

  // User Dashboard & Stats (Recharts)
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Editable Taxonomy / Categories for search mitigation
  const [itemCategories, setItemCategories] = useState<ItemCategoryConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_ITEM_CATEGORIES;
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Global Notification System
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] = useState(false);

  // Category Search & Frequency Tracking
  const [categorySearchCounts, setCategorySearchCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SEARCH_COUNTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { veiculos: 7, equipamentos: 4, produtos_usados: 3, imoveis: 2 };
  });

  // Location & Chat fallback
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [locationState, setLocationState] = useState<LocationState>({
    status: 'simulated_inside',
    isInsideFundao: true,
    lat: -22.8601,
    lng: -43.2307,
    message: 'Localização confirmada dentro do Campus do Fundão (CEP 21941-000)'
  });

  const setSimulatedLocation = (status: 'inside' | 'outside' | 'simulated_inside' | 'simulated_outside') => {
    const isInside = status === 'inside' || status === 'simulated_inside';
    setLocationState({
      status,
      isInsideFundao: isInside,
      lat: isInside ? -22.8601 : -22.9068,
      lng: isInside ? -43.2307 : -43.1729,
      message: isInside 
        ? 'Localização confirmada dentro do Campus do Fundão (CEP 21941-000)'
        : 'Dispositivo fora da Cidade Universitária. Contato protegido.'
    });
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APP_MODE, appMode);
    } catch {}
  }, [appMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(ads));
    } catch {}
  }, [ads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(serviceOrders));
    } catch {}
  }, [serviceOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROPOSALS, JSON.stringify(serviceProposals));
    } catch {}
  }, [serviceProposals]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
    } catch {}
  }, [reports]);

  // Persist Item Categories, Notifications and Search Stats
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(itemCategories));
    } catch {}
  }, [itemCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SEARCH_COUNTS, JSON.stringify(categorySearchCounts));
    } catch {}
  }, [categorySearchCounts]);

  // Auto-dismiss active notification toast after 6.5s
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // Search Frequency Tracking
  const recordCategorySearch = (category: string, query?: string) => {
    if (!category || category === 'todos') {
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        const matched = itemCategories.find(c => 
          c.label.toLowerCase().includes(q) || 
          c.keywords.some(k => k.toLowerCase().includes(q))
        );
        if (matched) {
          setCategorySearchCounts(prev => ({
            ...prev,
            [matched.id]: (prev[matched.id] || 0) + 1
          }));
        }
      }
      return;
    }
    setCategorySearchCounts(prev => ({
      ...prev,
      [category]: (prev[category] || 0) + 1
    }));
  };

  // Track search intent when category filter changes
  useEffect(() => {
    if (olxFilters.category !== 'todos') {
      recordCategorySearch(olxFilters.category);
    } else if (olxFilters.searchQuery.trim().length >= 3) {
      recordCategorySearch('todos', olxFilters.searchQuery);
    }
  }, [olxFilters.category, olxFilters.searchQuery]);

  // Compute top researched category
  const mostSearchedCategory = React.useMemo(() => {
    let topCat = 'veiculos';
    let maxCount = -1;
    for (const [cat, count] of Object.entries(categorySearchCounts)) {
      if (cat !== 'todos' && count > maxCount) {
        maxCount = count;
        topCat = cat;
      }
    }
    return topCat;
  }, [categorySearchCounts]);

  const mostSearchedCategoryLabel = React.useMemo(() => {
    const found = itemCategories.find(c => c.id === mostSearchedCategory);
    if (found) return found.label;
    if (mostSearchedCategory === 'veiculos') return 'Veículos';
    if (mostSearchedCategory === 'equipamentos') return 'Equipamentos';
    if (mostSearchedCategory === 'imoveis') return 'Imóveis & Vagas';
    if (mostSearchedCategory === 'produtos_usados') return 'Produtos Usados';
    return mostSearchedCategory;
  }, [itemCategories, mostSearchedCategory]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  // Instant test simulation for user to test the notification alert
  const simulateNewAdNotification = () => {
    const targetCategory = mostSearchedCategory;
    const catObj = itemCategories.find(c => c.id === targetCategory);
    const catLabel = catObj ? catObj.label : targetCategory;

    const sampleItems: Record<string, { title: string; desc: string; price: number; img: string; tags: string[] }> = {
      veiculos: {
        title: 'Patinete Elétrico Xiaomi Pro 2 - Autonomia 45km',
        desc: 'Patinete seminovo, freios a disco, pneus maciços anti-furo. Excelente para deslocamento rápido entre CT e CCMN no Fundão.',
        price: 1850,
        img: '/src/assets/images/ad_honda_biz_scooter_1791995294382.jpg',
        tags: ['patinete', 'elétrico', 'xiaomi', 'transporte', 'ct']
      },
      imoveis: {
        title: 'Vaga Individual em República Próxima à Prefeitura',
        desc: 'Quarto com internet, bancada de estudos e lavanderia na Vila Residencial do Fundão. Ambiente tranquilo.',
        price: 750,
        img: '/src/assets/images/ad_kitnet_vila_residencial_1791995294991.jpg',
        tags: ['vaga', 'quarto', 'república', 'vila residencial', 'moradia']
      },
      equipamentos: {
        title: 'Multímetro Digital True RMS Minipa com Pontas de Prova',
        desc: 'Instrumento de bancada profissional, display retroiluminado, ideal para aulas práticas no CT e COPPE.',
        price: 240,
        img: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
        tags: ['multímetro', 'minipa', 'eletrônica', 'ct', 'engenharia']
      },
      livros_academicos: {
        title: 'Física Clássica 1 e 2 Halliday & Resnick 10ª Edição',
        desc: 'Volumes completos sem rabiscos. O clássico indispensável para o ciclo básico de engenharia e física da UFRJ.',
        price: 210,
        img: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
        tags: ['livro', 'física', 'halliday', 'resnick', 'engenharia', 'ct']
      },
      eletronicos_ti: {
        title: 'Monitor Dell 24" IPS Full HD - Ajuste de Altura',
        desc: 'Monitor excelente para leitura de artigos científicos e programação. Sem marcas ou dead pixels.',
        price: 520,
        img: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
        tags: ['monitor', 'dell', 'setup', 'informática', 'ct']
      },
      produtos_usados: {
        title: 'Mesa Dobrável de Estudos com Suporte para Notebook',
        desc: 'Compacta e resistente, excelente para quartos e kitnets da Vila Universitária.',
        price: 150,
        img: '/src/assets/images/ad_kitnet_vila_residencial_1791995294991.jpg',
        tags: ['mesa', 'estudo', 'moradia', 'quarto']
      }
    };

    const sample = sampleItems[targetCategory] || sampleItems.veiculos;
    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    const simAd: AdItem = {
      id: `ad-sim-${Date.now()}`,
      title: sample.title,
      description: sample.desc,
      category: targetCategory,
      subCategory: 'Item em Destaque',
      classificationTags: sample.tags,
      price: sample.price,
      priceType: 'fixo',
      condition: 'seminovo',
      location: 'Centro de Tecnologia (CT) - Bloco A',
      campusZone: 'CT - Centro de Tecnologia',
      cep: '21941-000',
      imageUrl: sample.img,
      createdAt: new Date().toISOString(),
      sellerName: 'Mariana Duarte',
      sellerAffiliation: 'Pesquisadora COPPE / UFRJ',
      sellerWhatsApp: '21988887777',
      sellerPhone: '(21) 98888-7777',
      sellerUserId: 'usr_mariana',
      showWhatsApp: true,
      showPhone: true,
      restrictContactToCampus: true,
      viewsCount: 3,
      viewsHistory: [{ date: todayStr, views: 3 }]
    };

    setAds(prev => [simAd, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `🔔 Novo anúncio em ${catLabel}!`,
      message: `Foi publicado "${simAd.title}" na sua categoria mais pesquisada (${catLabel}). Valor: R$ ${simAd.price?.toLocaleString('pt-BR')}.`,
      category: targetCategory,
      categoryLabel: catLabel,
      adId: simAd.id,
      createdAt: new Date().toISOString(),
      read: false,
      type: 'new_ad_in_top_category'
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  // Administrative Category Management
  const addCategory = (newCat: Omit<ItemCategoryConfig, 'isDefault'>) => {
    const slug = newCat.id.trim().toLowerCase().replace(/\s+/g, '_');
    const fullCat: ItemCategoryConfig = {
      ...newCat,
      id: slug,
      isDefault: false,
      keywords: newCat.keywords || []
    };
    setItemCategories(prev => [...prev.filter(c => c.id !== slug), fullCat]);
  };

  const updateCategory = (id: string, updates: Partial<ItemCategoryConfig>) => {
    setItemCategories(prev => prev.map(cat => cat.id === id ? { ...cat, ...updates } : cat));
  };

  const deleteCategory = (id: string) => {
    setItemCategories(prev => prev.filter(cat => cat.id !== id || cat.isDefault));
    setAds(prev => prev.map(ad => ad.category === id ? { ...ad, category: 'produtos_usados' } : ad));
  };

  const resetCategoriesToDefault = () => {
    setItemCategories(DEFAULT_ITEM_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
  };

  const reclassifyAd = (adId: string, newCategory: string, newTags?: string[], newSubCategory?: string) => {
    setAds(prev => prev.map(ad => {
      if (ad.id !== adId) return ad;
      const updatedTags = newTags !== undefined ? newTags : ad.classificationTags;
      return {
        ...ad,
        category: newCategory,
        subCategory: newSubCategory !== undefined ? newSubCategory : ad.subCategory,
        classificationTags: updatedTags
      };
    }));

    const catObj = itemCategories.find(c => c.id === newCategory);
    const catLabel = catObj?.label || newCategory;
    const targetAd = ads.find(a => a.id === adId);

    const subMsg = newSubCategory ? ` (Subcategoria: ${newSubCategory})` : '';
    const reclassNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: '🏷️ Item Reclassificado pelo Admin',
      message: `O item "${targetAd?.title || 'Anúncio'}" foi reclassificado para "${catLabel}"${subMsg} com novas tags de taxonomia para mitigar a pesquisa no campus.`,
      category: newCategory,
      categoryLabel: catLabel,
      adId,
      createdAt: new Date().toISOString(),
      read: false,
      type: 'classification_updated'
    };
    setNotifications(prev => [reclassNotif, ...prev]);
    setActiveToast(reclassNotif);
  };

  // Auth functions
  const login = (email: string) => {
    if (!email) return false;
    if (email.toLowerCase().includes('victor') || email.toLowerCase().includes('ufrj.br')) {
      setCurrentUser(DEMO_USER);
      return true;
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      phone: '(21) 98000-0000',
      whatsApp: '21980000000',
      campusAffiliation: 'Comunidade Cidade Universitária',
      isProfessional: true,
      professionTitle: 'Profissional / Prestador Local',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
    return true;
  };

  const loginAsDemo = () => {
    setCurrentUser(DEMO_USER);
  };

  const signup = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // OLX Functions
  const userAds = ads.filter(a => a.sellerUserId === (currentUser?.id || 'usr_victor_fundao'));

  const getUserSectorDistance = (ad: AdItem): number | null => {
    if (!olxFilters.userSector || olxFilters.userSector === 'qualquer') return null;
    return getSectorDistance(olxFilters.userSector, ad.campusZone);
  };

  const createAd = (adData: Omit<AdItem, 'id' | 'createdAt' | 'viewsCount' | 'sellerUserId'>) => {
    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const newAd: AdItem = {
      ...adData,
      id: `ad-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      viewsHistory: [
        { date: todayStr, views: 1 }
      ],
      sellerUserId: currentUser?.id || 'usr_victor_fundao',
      cep: '21941-000',
      showWhatsApp: adData.showWhatsApp !== undefined ? adData.showWhatsApp : true,
      showPhone: adData.showPhone !== undefined ? adData.showPhone : true,
      restrictContactToCampus: adData.restrictContactToCampus !== undefined ? adData.restrictContactToCampus : true,
    };
    setAds(prev => [newAd, ...prev]);

    // Check if new ad is in user's top researched category and fire notification alert
    if (newAd.category === mostSearchedCategory) {
      const catObj = itemCategories.find(c => c.id === newAd.category);
      const catLabel = catObj ? catObj.label : newAd.category;
      const formattedPrice = newAd.price 
        ? `R$ ${newAd.price.toLocaleString('pt-BR')}` 
        : (newAd.priceType === 'gratis' ? 'Grátis' : 'A combinar');

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `🔔 Novo anúncio em ${catLabel}!`,
        message: `Foi publicado "${newAd.title}" na sua categoria mais pesquisada (${catLabel}). Valor: ${formattedPrice}.`,
        category: newAd.category,
        categoryLabel: catLabel,
        adId: newAd.id,
        createdAt: new Date().toISOString(),
        read: false,
        type: 'new_ad_in_top_category'
      };
      setNotifications(prev => [newNotif, ...prev]);
      setActiveToast(newNotif);
    }

    return newAd;
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
    if (selectedAd?.id === id) setSelectedAd(null);
  };

  const incrementViews = (id: string) => {
    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    setAds(prev => prev.map(a => {
      if (a.id !== id) return a;
      const history = a.viewsHistory ? [...a.viewsHistory] : [];
      const todayEntry = history.find(h => h.date === todayStr);
      if (todayEntry) {
        todayEntry.views += 1;
      } else {
        history.push({ date: todayStr, views: (a.viewsCount || 0) + 1 });
      }
      return {
        ...a,
        viewsCount: (a.viewsCount || 0) + 1,
        viewsHistory: history
      };
    }));
  };

  const resetOlxFilters = () => setOlxFilters(defaultOlxFilters);

  // Filtered OLX Ads with Search Mitigation
  const filteredAds = ads.filter(ad => {
    if (olxFilters.category !== 'todos' && ad.category !== olxFilters.category) {
      return false;
    }
    if (olxFilters.subCategory && olxFilters.subCategory !== 'todas') {
      if (ad.subCategory !== olxFilters.subCategory) {
        return false;
      }
    }
    if (olxFilters.campusZone !== 'Todas as áreas no campus' && ad.campusZone !== olxFilters.campusZone) {
      return false;
    }
    if (olxFilters.userSector !== 'qualquer' && olxFilters.maxDistanceKm !== 'qualquer') {
      const distance = getSectorDistance(olxFilters.userSector, ad.campusZone);
      if (distance > (olxFilters.maxDistanceKm as number)) {
        return false;
      }
    }
    if (olxFilters.searchQuery.trim()) {
      const q = olxFilters.searchQuery.toLowerCase().trim();
      const matchTitle = ad.title.toLowerCase().includes(q);
      const matchDesc = ad.description.toLowerCase().includes(q);
      const matchLoc = ad.location.toLowerCase().includes(q);
      const matchSeller = ad.sellerName.toLowerCase().includes(q);
      const matchSubCategory = ad.subCategory ? ad.subCategory.toLowerCase().includes(q) : false;

      // Search mitigation: match custom classification tags set by admin or seller
      const matchTags = ad.classificationTags 
        ? ad.classificationTags.some(t => t.toLowerCase().includes(q)) 
        : false;

      // Search mitigation: match category label and taxonomy keywords
      const catConfig = itemCategories.find(c => c.id === ad.category);
      const matchCategoryLabel = catConfig ? catConfig.label.toLowerCase().includes(q) : false;
      const matchCategoryKeywords = catConfig?.keywords 
        ? catConfig.keywords.some(k => k.toLowerCase().includes(q)) 
        : false;

      if (
        !matchTitle && 
        !matchDesc && 
        !matchLoc && 
        !matchSeller && 
        !matchSubCategory && 
        !matchTags && 
        !matchCategoryLabel && 
        !matchCategoryKeywords
      ) {
        return false;
      }
    }
    if (olxFilters.minPrice) {
      const min = parseFloat(olxFilters.minPrice);
      if (!isNaN(min) && (ad.price === null || ad.price < min)) {
        return false;
      }
    }
    if (olxFilters.maxPrice) {
      const max = parseFloat(olxFilters.maxPrice);
      if (!isNaN(max) && (ad.price === null || ad.price > max)) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (olxFilters.sortBy === 'menor_distancia' && olxFilters.userSector !== 'qualquer') {
      const distA = getSectorDistance(olxFilters.userSector, a.campusZone);
      const distB = getSectorDistance(olxFilters.userSector, b.campusZone);
      if (distA !== distB) return distA - distB;
    }
    if (olxFilters.sortBy === 'recente') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (olxFilters.sortBy === 'menor_preco') {
      return (a.price ?? 0) - (b.price ?? 0);
    }
    if (olxFilters.sortBy === 'maior_preco') {
      return (b.price ?? 0) - (a.price ?? 0);
    }
    return 0;
  });

  // GetNinjas Functions
  const createServiceOrder = (orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'clientId' | 'clientName' | 'clientAffiliation' | 'clientPhone' | 'clientWhatsApp' | 'clientEmail' | 'proposalsCount' | 'status'>) => {
    const newOrder: ServiceOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
      clientId: currentUser?.id || 'usr_anon',
      clientName: currentUser?.name || 'Cliente da UFRJ',
      clientAffiliation: currentUser?.campusAffiliation || 'Cidade Universitária',
      clientPhone: currentUser?.phone || '(21) 98765-4321',
      clientWhatsApp: currentUser?.whatsApp || '21987654321',
      clientEmail: currentUser?.email || 'contato@ufrj.br',
      proposalsCount: 0,
      status: 'aberto',
      cep: '21941-000',
    };
    setServiceOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const deleteServiceOrder = (id: string) => {
    setServiceOrders(prev => prev.filter(o => o.id !== id));
    if (selectedServiceOrder?.id === id) setSelectedServiceOrder(null);
  };

  const resetServiceFilters = () => setServiceFilters(defaultServiceFilters);

  const openProposalModal = (order: ServiceOrder) => {
    setProposalTargetOrder(order);
    setIsProposalModalOpen(true);
  };

  const submitProposal = (orderId: string, priceEstimate: string, message: string, availability: string) => {
    if (!currentUser) return;

    const newProposal: ServiceProposal = {
      id: `prop-${Date.now()}`,
      serviceOrderId: orderId,
      professionalId: currentUser.id,
      professionalName: currentUser.name,
      professionalAffiliation: currentUser.campusAffiliation,
      professionalPhone: currentUser.phone,
      professionalWhatsApp: currentUser.whatsApp,
      professionalEmail: currentUser.email,
      priceEstimate,
      message,
      availability,
      createdAt: new Date().toISOString(),
    };

    setServiceProposals(prev => [newProposal, ...prev]);

    // Update proposals count in the service order
    setServiceOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, proposalsCount: (o.proposalsCount || 0) + 1 };
      }
      return o;
    }));

    if (selectedServiceOrder?.id === orderId) {
      setSelectedServiceOrder(prev => prev ? { ...prev, proposalsCount: (prev.proposalsCount || 0) + 1 } : null);
    }
  };

  const getOrderProposals = (orderId: string) => {
    return serviceProposals.filter(p => p.serviceOrderId === orderId);
  };

  const myServiceOrders = currentUser 
    ? serviceOrders.filter(o => o.clientId === currentUser.id)
    : [];

  const myProposalsSent = currentUser 
    ? serviceProposals.filter(p => p.professionalId === currentUser.id)
    : [];

  // Filtered GetNinjas Orders
  const filteredServiceOrders = serviceOrders.filter(order => {
    // If viewing user's own orders
    if (serviceView === 'meus_pedidos') {
      if (!currentUser || order.clientId !== currentUser.id) return false;
    }

    if (serviceFilters.category !== 'todos' && order.category !== serviceFilters.category) {
      return false;
    }

    if (serviceFilters.campusZone !== 'Todas as áreas no campus' && order.campusZone !== serviceFilters.campusZone) {
      return false;
    }

    if (serviceFilters.urgency !== 'todas' && order.urgency !== serviceFilters.urgency) {
      return false;
    }

    if (serviceFilters.searchQuery.trim()) {
      const q = serviceFilters.searchQuery.toLowerCase().trim();
      const matchTitle = order.title.toLowerCase().includes(q);
      const matchDesc = order.description.toLowerCase().includes(q);
      const matchLoc = order.locationDetails.toLowerCase().includes(q) || order.campusZone.toLowerCase().includes(q);
      const matchClient = order.clientName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchClient) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (serviceFilters.sortBy === 'mais_propostas') {
      return (b.proposalsCount || 0) - (a.proposalsCount || 0);
    }
    if (serviceFilters.sortBy === 'menos_propostas') {
      return (a.proposalsCount || 0) - (b.proposalsCount || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Favorites
  const toggleFavorite = (adId: string) => {
    setFavorites(prev => 
      prev.includes(adId) ? prev.filter(id => id !== adId) : [...prev, adId]
    );
  };

  const isFavorite = (adId: string) => favorites.includes(adId);

  // Reporting
  const openReportModal = (id: string, type: 'ad' | 'service_order', title: string) => {
    setReportTarget({ id, type, title });
    setIsReportModalOpen(true);
  };

  const submitReport = (reason: string, details?: string) => {
    if (!reportTarget) return;
    const newReport: ReportPayload = {
      targetId: reportTarget.id,
      targetType: reportTarget.type,
      title: reportTarget.title,
      reason,
      details,
      timestamp: new Date().toISOString(),
      reporterUserId: currentUser?.id,
    };
    setReports(prev => [newReport, ...prev]);
    setIsReportModalOpen(false);
    setReportTarget(null);
  };

  const hasReported = (id: string) => {
    return reports.some(r => r.targetId === id);
  };

  return (
    <ClassifiedsContext.Provider
      value={{
        appMode,
        setAppMode,
        serviceView,
        setServiceView,

        // OLX Flow
        ads,
        filteredAds,
        olxFilters,
        setOlxFilters,
        resetOlxFilters,
        selectedAd,
        setSelectedAd,
        isPublishModalOpen,
        setIsPublishModalOpen,
        createAd,
        deleteAd,
        incrementViews,

        // GetNinjas Flow
        serviceOrders,
        filteredServiceOrders,
        serviceFilters,
        setServiceFilters,
        resetServiceFilters,
        selectedServiceOrder,
        setSelectedServiceOrder,
        isNewServiceOrderModalOpen,
        setIsNewServiceOrderModalOpen,
        createServiceOrder,
        deleteServiceOrder,

        // Proposals
        serviceProposals,
        isProposalModalOpen,
        setIsProposalModalOpen,
        proposalTargetOrder,
        openProposalModal,
        submitProposal,
        getOrderProposals,
        myServiceOrders,
        myProposalsSent,

        // User
        currentUser,
        login,
        loginAsDemo,
        signup,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,

        // Common
        isSafetyModalOpen,
        setIsSafetyModalOpen,
        favorites,
        toggleFavorite,
        isFavorite,
        isFavoritesModalOpen,
        setIsFavoritesModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTarget,
        reportTargetAd: reportTarget,
        openReportModal,
        submitReport,
        hasReported,

        // Notification System
        notifications,
        unreadNotificationsCount,
        activeToast,
        dismissToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        categorySearchCounts,
        recordCategorySearch,
        mostSearchedCategory,
        mostSearchedCategoryLabel,
        simulateNewAdNotification,
        isNotificationPopoverOpen,
        setIsNotificationPopoverOpen,

        // Administrative Item Classification & Search Mitigation
        itemCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        reclassifyAd,
        isAdminModalOpen,
        setIsAdminModalOpen,

        // Filter aliases for backward and standard component compatibility
        filters: olxFilters,
        setFilters: setOlxFilters,
        resetFilters: resetOlxFilters,

        // User Dashboard & Stats (Recharts)
        isDashboardModalOpen,
        setIsDashboardModalOpen,
        userAds,
        getUserSectorDistance,

        // Location & Chat compatibility
        locationState,
        setSimulatedLocation,
        isChatModalOpen,
        setIsChatModalOpen,
        unreadMessagesCount: 0,
        conversations: [],
      }}
    >
      {children}
    </ClassifiedsContext.Provider>
  );
};

export const useClassifieds = () => {
  const context = useContext(ClassifiedsContext);
  if (!context) {
    throw new Error('useClassifieds must be used within a ClassifiedsProvider');
  }
  return context;
};
