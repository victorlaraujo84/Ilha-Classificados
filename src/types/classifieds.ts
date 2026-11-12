export type AppMode = 'olx' | 'getninjas';

export type OlxCategory = 
  | 'todos'
  | 'veiculos' 
  | 'imoveis' 
  | 'equipamentos' 
  | 'produtos_usados'
  | (string & {});

export type Category = OlxCategory;

export interface ItemCategoryConfig {
  id: string;
  label: string;
  icon: string;
  description?: string;
  keywords: string[]; // Palavras-chave para mitigar pesquisa e associar termos
  subCategories?: string[]; // Opções de subcategorias (Ex: Veículos -> Carros, Motos, etc.)
  isDefault?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  categoryLabel: string;
  adId?: string;
  createdAt: string;
  read: boolean;
  type: 'new_ad_in_top_category' | 'classification_updated' | 'system';
}

export type ServiceCategory =
  | 'todos'
  | 'reformas_reparos'
  | 'aulas_academico'
  | 'alimentacao_festas'
  | 'ti_eletronica'
  | 'outros_servicos';

export type Condition = 'novo' | 'seminovo' | 'usado';

export type PriceType = 'fixo' | 'a_combinar' | 'gratis';

// FLUXO OLX: Anúncio de item/produto/veículo/imóvel (Passivo)
export interface AdItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  classificationTags?: string[]; // Tags e palavras-chave de taxonomia para mitigar a pesquisa
  price: number | null;
  priceType: PriceType;
  condition: Condition;
  location: string;
  campusZone: string;
  cep: string;
  imageUrl: string;
  createdAt: string;
  sellerName: string;
  sellerAffiliation: string;
  sellerWhatsApp: string;
  sellerPhone: string;
  sellerUserId: string;
  // Escolhas de compartilhamento feitas pelo anunciante no momento do anúncio:
  showWhatsApp: boolean;          // Compartilhar WhatsApp no anúncio
  showPhone: boolean;             // Compartilhar Telefone para ligações
  restrictContactToCampus: boolean; // Se somente quem estiver dentro da localização permitida (Fundão) pode ver os contatos
  viewsCount: number;
  viewsHistory?: { date: string; views: number }[];
}

export interface LocationState {
  status: 'inside' | 'outside' | 'simulated_inside' | 'simulated_outside' | 'checking' | 'prompt' | 'error';
  isInsideFundao: boolean;
  lat?: number;
  lng?: number;
  message?: string;
}

// FLUXO GETNINJAS: Pedido de Serviço (Demanda Ativa)
export type ServiceUrgency = 'urgente' | 'esta_semana' | 'sem_pressa' | 'a_combinar';

export interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  category: Exclude<ServiceCategory, 'todos'>;
  campusZone: string;
  locationDetails: string;
  cep: string;
  urgency: ServiceUrgency;
  budgetEstimate: string; // Ex: "Até R$ 200", "A combinar", "R$ 150 a R$ 300"
  createdAt: string;
  clientId: string;
  clientName: string;
  clientAffiliation: string;
  clientPhone: string;
  clientWhatsApp: string;
  clientEmail: string;
  proposalsCount: number;
  status: 'aberto' | 'em_atendimento' | 'concluido';
}

// FLUXO GETNINJAS: Proposta do Profissional
export interface ServiceProposal {
  id: string;
  serviceOrderId: string;
  professionalId: string;
  professionalName: string;
  professionalAffiliation: string;
  professionalPhone: string;
  professionalWhatsApp: string;
  professionalEmail: string;
  priceEstimate: string; // Ex: "R$ 120 (incluso visita)", "R$ 50/hora"
  message: string;
  availability: string; // Ex: "Posso ir hoje às 14h no CT", "Segunda a sexta pela manhã"
  createdAt: string;
}

export interface CampusSector {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsApp: string;
  campusAffiliation: string;
  isProfessional?: boolean;
  professionTitle?: string;
  createdAt: string;
}

export interface OlxFilterState {
  searchQuery: string;
  category: OlxCategory;
  subCategory: string; // Ex: 'todas', 'Carros', 'Motos', etc.
  campusZone: string;
  userSector: string;
  maxDistanceKm: number | 'qualquer';
  minPrice: string;
  maxPrice: string;
  sortBy: 'recente' | 'menor_distancia' | 'menor_preco' | 'maior_preco';
  viewMode: 'grid' | 'list';
}

export interface ServiceFilterState {
  searchQuery: string;
  category: ServiceCategory;
  campusZone: string;
  userSector: string;
  urgency: 'todas' | ServiceUrgency;
  sortBy: 'recente' | 'mais_propostas' | 'menos_propostas';
}

export type FilterState = OlxFilterState;
