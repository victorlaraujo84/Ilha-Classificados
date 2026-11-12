import { 
  AdItem, 
  User, 
  CampusSector, 
  ServiceOrder, 
  ServiceProposal, 
  OlxCategory, 
  ServiceCategory,
  ItemCategoryConfig,
  AppNotification
} from '../types/classifieds';

export const CAMPUS_ZONES = [
  'Todas as áreas no campus',
  'CT - Centro de Tecnologia',
  'CCMN - Ciências Matemáticas e Natureza',
  'CCS - Centro de Ciências da Saúde',
  'Letras e FACC (Ciências Sociais)',
  'Vila Residencial dos Professores/Alunos',
  'Parque Tecnológico da UFRJ',
  'Hospital Universitário (HUCFF)',
  'Prefeitura Universitária / Alojamento',
] as const;

export const CAMPUS_SECTORS: CampusSector[] = [
  { id: 'ct', name: 'CT - Centro de Tecnologia', shortName: 'CT', lat: -22.8601, lng: -43.2307, description: 'Engenharias, COPPE, Poli, Bloco A ao I' },
  { id: 'ccmn', name: 'CCMN - Ciências Matemáticas e Natureza', shortName: 'CCMN', lat: -22.8618, lng: -43.2285, description: 'Matemática, Física, Química, Geologia, CCMN' },
  { id: 'ccs', name: 'CCS - Centro de Ciências da Saúde', shortName: 'CCS', lat: -22.8465, lng: -43.2345, description: 'Medicina, Farmácia, Biologia, Odontologia' },
  { id: 'letras_facc', name: 'Letras e FACC (Ciências Sociais)', shortName: 'Letras / FACC', lat: -22.8570, lng: -43.2260, description: 'Letras, FACC, Economia, Educação' },
  { id: 'vila', name: 'Vila Residencial dos Professores/Alunos', shortName: 'Vila Residencial', lat: -22.8650, lng: -43.2210, description: 'Moradias, Praça da Vila' },
  { id: 'parque_tec', name: 'Parque Tecnológico da UFRJ', shortName: 'Parque Tec.', lat: -22.8520, lng: -43.2230, description: 'Empresas, Incubadora COPPE' },
  { id: 'hucff', name: 'Hospital Universitário (HUCFF)', shortName: 'HUCFF', lat: -22.8440, lng: -43.2370, description: 'Hospital Universitário Clementino Fraga Filho' },
  { id: 'reitoria', name: 'Prefeitura Universitária / Alojamento', shortName: 'Prefeitura / Aloj.', lat: -22.8540, lng: -43.2310, description: 'Reitoria, Prefeitura, Alojamento Estudantil' },
];

export function getZoneSectorId(zoneString: string): string {
  if (!zoneString) return 'ct';
  const z = zoneString.toLowerCase();
  if (z.includes('ct') || z.includes('tecnologia')) return 'ct';
  if (z.includes('ccmn') || z.includes('matemática') || z.includes('natureza')) return 'ccmn';
  if (z.includes('ccs') || z.includes('saúde') || z.includes('saude')) return 'ccs';
  if (z.includes('letras') || z.includes('facc')) return 'letras_facc';
  if (z.includes('vila') || z.includes('residencial')) return 'vila';
  if (z.includes('parque') || z.includes('tecnológico')) return 'parque_tec';
  if (z.includes('hucff') || z.includes('hospital')) return 'hucff';
  if (z.includes('prefeitura') || z.includes('alojamento') || z.includes('reitoria')) return 'reitoria';
  return 'ct';
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

export function getSectorDistance(fromSectorId: string, toZoneOrSector: string): number {
  if (!fromSectorId || fromSectorId === 'qualquer') return 0;
  const fromSector = CAMPUS_SECTORS.find(s => s.id === fromSectorId) || CAMPUS_SECTORS[0];
  const targetSectorId = CAMPUS_SECTORS.some(s => s.id === toZoneOrSector)
    ? toZoneOrSector
    : getZoneSectorId(toZoneOrSector);

  if (fromSector.id === targetSectorId) return 0;
  const targetSector = CAMPUS_SECTORS.find(s => s.id === targetSectorId) || CAMPUS_SECTORS[0];
  return calculateDistanceKm(fromSector.lat, fromSector.lng, targetSector.lat, targetSector.lng);
}

export function formatDistanceLabel(distanceKm: number): string {
  if (distanceKm <= 0.1) {
    return 'No seu setor';
  }
  if (distanceKm < 1) {
    return `~${Math.round(distanceKm * 1000)}m`;
  }
  return `~${distanceKm.toFixed(1)} km`;
}

// Default Base Item Categories with classification keywords and subcategories
export const DEFAULT_ITEM_CATEGORIES: ItemCategoryConfig[] = [
  { 
    id: 'veiculos', 
    label: 'Veículos', 
    icon: 'Car',
    description: 'Motos, carros, bicicletas e itens de locomoção no campus',
    keywords: ['carro', 'moto', 'motocicleta', 'honda', 'biz', 'bicicleta', 'bike', 'caloi', 'scooter', 'capacete', 'transporte', 'mobilidade'],
    subCategories: ['Carros', 'Motos', 'Bicicletas', 'Patinetes & Scooters', 'Peças & Acessórios'],
    isDefault: true
  },
  { 
    id: 'imoveis', 
    label: 'Imóveis & Vagas', 
    icon: 'Home',
    description: 'Vagas em repúblicas, kitnets e quartos na Vila Residencial e arredores',
    keywords: ['quarto', 'vaga', 'república', 'republica', 'kitnet', 'aluguel', 'vila residencial', 'moradia', 'apartamento', 'pensão'],
    subCategories: ['Quartos em Repúblicas', 'Kitnets & Studios', 'Vagas Compartilhadas', 'Apartamentos / Casas', 'Vagas de Garagem'],
    isDefault: true
  },
  { 
    id: 'equipamentos', 
    label: 'Equipamentos', 
    icon: 'Cpu',
    description: 'Instrumentos de precisão, calculadoras científicas, ferramentas de laboratório',
    keywords: ['calculadora', 'hp prime', 'ti', 'microscópio', 'multímetro', 'osciloscópio', 'laboratório', 'engenharia', 'bancada', 'medidor'],
    subCategories: ['Calculadoras & TI', 'Instrumentos de Laboratório', 'Ferramentas & Bancada', 'Eletrônica & Arduino', 'Áudio & Vídeo'],
    isDefault: true
  },
  { 
    id: 'produtos_usados', 
    label: 'Produtos Usados', 
    icon: 'Package',
    description: 'Itens diversos em bom estado de conservação de alunos e servidores',
    keywords: ['usado', 'seminovo', 'mochila', 'jaleco', 'armário', 'material', 'desk', 'mesa', 'estudo'],
    subCategories: ['Livros Acadêmicos', 'Vestuário & Jalecos', 'Móveis & República', 'Material de Desenho / Arquitetura', 'Utilidades & Diversos'],
    isDefault: true
  },
  {
    id: 'livros_academicos',
    label: 'Livros & Material Acadêmico',
    icon: 'BookOpen',
    description: 'Livros didáticos de cálculo, física, medicina, apostilas e resumos',
    keywords: ['livro', 'livros', 'cálculo', 'calculo', 'stewart', 'boldrini', 'álgebra', 'algebra linear', 'física', 'halliday', 'química', 'apostila', 'resumo', 'tcc'],
    subCategories: ['Exatas (Cálculo, Física, Química)', 'Engenharias & Computação', 'Biomédicas & Saúde', 'Humanas, Letras & Sociais', 'Apostilas & Resumos'],
    isDefault: false
  },
  {
    id: 'eletronicos_ti',
    label: 'Eletrônicos & Informática',
    icon: 'Laptop',
    description: 'Notebooks, monitores, periféricos, peças de PC e kits de desenvolvimento',
    keywords: ['notebook', 'laptop', 'computador', 'monitor', 'teclado', 'mouse', 'arduino', 'raspberry', 'fone', 'headset', 'carregador', 'usb'],
    subCategories: ['Notebooks & PCs', 'Monitores & Telas', 'Periféricos (Mouse/Teclado/Fone)', 'Kits Arduino & Componentes', 'Cabos & Carregadores'],
    isDefault: false
  }
];

export const OLX_CATEGORIES_CONFIG = [
  { id: 'todos', label: 'Todos os Itens', icon: 'Sparkles', keywords: [] },
  ...DEFAULT_ITEM_CATEGORIES
];

export const CATEGORIES_CONFIG = OLX_CATEGORIES_CONFIG;

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    title: '🔔 Novo anúncio em Veículos!',
    message: 'Foi publicado "Honda Biz 125 ES Prata" na sua categoria mais pesquisada (Veículos). Confira!',
    category: 'veiculos',
    categoryLabel: 'Veículos',
    adId: 'ad-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: false,
    type: 'new_ad_in_top_category',
  },
  {
    id: 'notif-002',
    title: '🏷️ Classificação Otimizada pelo Admin',
    message: 'A classificação "Livros & Material Acadêmico" foi ativada para você encontrar livros de cálculo e apostilas sem esforço.',
    category: 'livros_academicos',
    categoryLabel: 'Livros & Material Acadêmico',
    adId: 'ad-008',
    createdAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    read: false,
    type: 'classification_updated',
  }
];

// GETNINJAS SERVICE CATEGORIES (Demanda Ativa)
export const SERVICE_CATEGORIES_CONFIG = [
  { id: 'todos', label: 'Todos os Serviços', icon: 'Briefcase' },
  { id: 'reformas_reparos', label: 'Reformas & Reparos', icon: 'Wrench', description: 'Refrigeração, ar condicionado, pedreiro, pintura, elétrica' },
  { id: 'aulas_academico', label: 'Aulas & Apoio Acadêmico', icon: 'GraduationCap', description: 'Revisão ABNT, formatação de TCC, monitoria de cálculo/física' },
  { id: 'alimentacao_festas', label: 'Alimentação & Eventos', icon: 'Utensils', description: 'Salgados, kit festas, coffee break para bancas e defesas' },
  { id: 'ti_eletronica', label: 'TI & Eletrônica', icon: 'Laptop', description: 'Conserto de notebooks, Arduino, impressão 3D, formatação' },
  { id: 'outros_servicos', label: 'Outros Serviços', icon: 'MoreHorizontal', description: 'Serviços diversos na Cidade Universitária' },
] as const;

export const DEMO_USER: User = {
  id: 'usr_victor_fundao',
  name: 'Victor Araújo',
  email: 'victor.araujo@ufrj.br',
  phone: '(21) 98765-4321',
  whatsApp: '21987654321',
  campusAffiliation: 'Aluno de Engenharia - Bloco C (CT)',
  isProfessional: true,
  professionTitle: 'Monitor de Exatas & Desenvolvedor Maker',
  createdAt: '2026-01-10T10:00:00.000Z',
};

// ==========================================
// FLUXO OLX: Classificados de Itens Físicos
// ==========================================
export const INITIAL_ADS: AdItem[] = [
  {
    id: 'ad-001',
    title: 'Honda Biz 125 ES Prata - Econômica para o Campus',
    description: 'Honda Biz 125cc impecável, partida elétrica, revisada em concessionária e pneus novos. Perfeita para quem estuda ou trabalha na Ilha do Fundão e precisa se locomover com agilidade entre o Centro de Tecnologia (CT) e o CCS ou Vila Residencial. Consumo médio de 45 km/l. Documentação 2026 quitada.',
    category: 'veiculos',
    subCategory: 'Motos',
    classificationTags: ['moto', 'scooter', 'honda', 'biz', 'economia', 'ct'],
    price: 8900,
    priceType: 'fixo',
    condition: 'seminovo',
    location: 'Estacionamento Bloco I - CT',
    campusZone: 'CT - Centro de Tecnologia',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_honda_biz_scooter_1791995294382.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sellerName: 'Rodrigo Medeiros',
    sellerAffiliation: 'Mestrando em Engenharia Mecânica (COPPE)',
    sellerWhatsApp: '21991234567',
    sellerPhone: '(21) 99123-4567',
    sellerUserId: 'usr_rodrigo',
    showWhatsApp: true,
    showPhone: true,
    restrictContactToCampus: true, // Apenas para quem estiver no Fundão
    viewsCount: 142,
  },
  {
    id: 'ad-015',
    title: 'Volkswagen Gol 1.0 Trendline Flex - Prata Completo',
    description: 'Gol 1.0 4 portas, ar condicionado gelando muito, direção hidráulica, vidros elétricos e travas. Carro extremamente econômico (13 km/l na cidade), IPVA 2026 pago, ótimo para ir e voltar da Ilha do Fundão diariamente. Revisado na mecânica da Ilha do Governador.',
    category: 'veiculos',
    subCategory: 'Carros',
    classificationTags: ['carro', 'gol', 'volkswagen', 'veículo', 'economia', 'ct'],
    price: 24500,
    priceType: 'fixo',
    condition: 'seminovo',
    location: 'Estacionamento da Prefeitura Universitária',
    campusZone: 'Prefeitura Universitária / Alojamento',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_honda_biz_scooter_1791995294382.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    sellerName: 'Prof. Marcelo Vianna',
    sellerAffiliation: 'Docente COPPE / UFRJ',
    sellerWhatsApp: '21998881234',
    sellerPhone: '(21) 99888-1234',
    sellerUserId: 'usr_marcelo',
    showWhatsApp: true,
    showPhone: true,
    restrictContactToCampus: false,
    viewsCount: 310,
  },
  {
    id: 'ad-002',
    title: 'Quarto Individual Mobiliado na Vila Residencial',
    description: 'Quarto amplo, arejado e ensolarado para estudante ou pesquisador na Vila Residencial do Fundão (a 5 minutos a pé do Bloco A do CT e próximo ao ponto do circular). Quarto contém cama de solteiro com colchão densidade 33, escrivaninha de estudos, luminária, guarda-roupa embutido e internet fibra óptica 500MB inclusa. Ambiente calmo e familiar.',
    category: 'imoveis',
    subCategory: 'Quartos em Repúblicas',
    classificationTags: ['quarto', 'vaga', 'república', 'vila residencial', 'moradia'],
    price: 850,
    priceType: 'fixo',
    condition: 'novo',
    location: 'Rua Principal da Vila Residencial',
    campusZone: 'Vila Residencial dos Professores/Alunos',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_kitnet_vila_residencial_1791995294991.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    sellerName: 'Dona Maria Clara',
    sellerAffiliation: 'Moradora histórica da Vila Residencial',
    sellerWhatsApp: '21988776655',
    sellerPhone: '(21) 98877-6655',
    sellerUserId: 'usr_mariaclara',
    showWhatsApp: true,
    showPhone: true,
    restrictContactToCampus: false, // Visível para qualquer usuário cadastrado
    viewsCount: 389,
  },
  {
    id: 'ad-003',
    title: 'Calculadora Gráfica HP Prime v2 com Capa Rígida',
    description: 'Calculadora gráfica oficial HP Prime Touch Screen colorida, versão G2 com processador rápido. Acompanha cabo USB original, capa rígida de proteção e bateria em 100% de saúde. Usada por 2 períodos nas disciplinas de Cálculo Numérico e Mecânica dos Fluidos no Instituto de Matemática (CCMN). Sem riscos na tela.',
    category: 'equipamentos',
    subCategory: 'Calculadoras & TI',
    classificationTags: ['calculadora', 'hp prime', 'engenharia', 'cálculo', 'ccmn'],
    price: 680,
    priceType: 'fixo',
    condition: 'seminovo',
    location: 'Instituto de Matemática - CCMN Bloco C',
    campusZone: 'CCMN - Ciências Matemáticas e Natureza',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    sellerName: 'Lucas Bittencourt',
    sellerAffiliation: 'Graduando em Engenharia Química',
    sellerWhatsApp: '21976543210',
    sellerPhone: '(21) 97654-3210',
    sellerUserId: 'usr_lucas',
    showWhatsApp: true,
    showPhone: false, // Apenas WhatsApp
    restrictContactToCampus: true,
    viewsCount: 215,
  },
  {
    id: 'ad-005',
    title: 'Bicicleta Caloi Aro 26 com Trava U-Lock e Bagageiro',
    description: 'Bicicleta revisada, câmbio Shimano 21 marchas, freios V-Brake recém ajustados. Acompanha cadeado U-Lock reforçado anti-furto, lanterna dianteira recarregável USB e bagageiro traseiro para mochila. Excelente custo-benefício para se locomover na ciclovia que liga o HUCFF ao CT.',
    category: 'veiculos',
    subCategory: 'Bicicletas',
    classificationTags: ['bicicleta', 'bike', 'caloi', 'ciclovia', 'ccs', 'transporte'],
    price: 420,
    priceType: 'fixo',
    condition: 'usado',
    location: 'Bicicletário Hall Principal - CCS',
    campusZone: 'CCS - Centro de Ciências da Saúde',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_honda_biz_scooter_1791995294382.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    sellerName: 'Gabriel Nogueira',
    sellerAffiliation: 'Estudante de Fisioterapia - CCS',
    sellerWhatsApp: '21981122334',
    sellerPhone: '(21) 98112-2334',
    sellerUserId: 'usr_gabriel',
    showWhatsApp: true,
    showPhone: true,
    restrictContactToCampus: false,
    viewsCount: 184,
  },
  {
    id: 'ad-006',
    title: 'Microscópio Biológico Didático Binocular 1000x',
    description: 'Microscópio óptico monocular/binocular para estudos histológicos e biológicos. 4 objetivas acromáticas (4x, 10x, 40x, 100x imersão em óleo), iluminação LED embutida com dimmer e platina mecânica dupla. Ideal para estudantes de Farmácia, Medicina ou Biologia do CCS.',
    category: 'equipamentos',
    subCategory: 'Instrumentos de Laboratório',
    classificationTags: ['microscópio', 'óptica', 'biologia', 'medicina', 'ccs', 'laboratório'],
    price: 950,
    priceType: 'fixo',
    condition: 'seminovo',
    location: 'Instituto de Biofísica Carlos Chagas Filho - CCS',
    campusZone: 'CCS - Centro de Ciências da Saúde',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    sellerName: 'Dra. Beatriz Leão',
    sellerAffiliation: 'Pesquisadora Associada - IBCCF / UFRJ',
    sellerWhatsApp: '21972233445',
    sellerPhone: '(21) 97223-3445',
    sellerUserId: 'usr_beatriz',
    showWhatsApp: false, // Apenas Telefone
    showPhone: true,
    restrictContactToCampus: true,
    viewsCount: 178,
  },
  {
    id: 'ad-008',
    title: 'Kit Livros de Cálculo Stewart (Vol 1 e 2) + Álgebra Linear Boldrini',
    description: 'Combo com os 3 livros essenciais para o ciclo básico de exatas no Fundão (Engenharias, Física, Matemática e Química). Edições sem anotações à caneta, apenas com algumas marcações a lápis facilmente apagáveis. Entrego em mãos no bandejão do CT.',
    category: 'produtos_usados',
    subCategory: 'Livros Acadêmicos',
    classificationTags: ['livro', 'cálculo', 'stewart', 'álgebra linear', 'boldrini', 'exatas', 'ct', 'apostila'],
    price: 130,
    priceType: 'fixo',
    condition: 'usado',
    location: 'Bandejão Central do CT',
    campusZone: 'CT - Centro de Tecnologia',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    sellerName: 'Victor Araújo',
    sellerAffiliation: 'Aluno de Engenharia - Bloco C (CT)',
    sellerWhatsApp: '21987654321',
    sellerPhone: '(21) 98765-4321',
    sellerUserId: 'usr_victor_fundao',
    showWhatsApp: true,
    showPhone: true,
    restrictContactToCampus: false,
    viewsCount: 421,
  },
  {
    id: 'ad-012',
    title: 'Kit Arduino Mega 2560 R3 com 37 Sensores e Display LCD 16x2',
    description: 'Kit completo de desenvolvimento contendo placa Arduino Mega 2560 R3 original, protoboard 830 pontos, jumpers, sensores de ultrassom, temperatura DHT11, servo motor, relé e display LCD 16x2 com módulo I2C. Perfeito para projetos de Engenharia Elétrica e Computação no CT.',
    category: 'equipamentos',
    subCategory: 'Eletrônica & Arduino',
    price: 240,
    priceType: 'fixo',
    condition: 'seminovo',
    location: 'Laboratório de Eletrônica - CT Bloco H',
    campusZone: 'CT - Centro de Tecnologia',
    cep: '21941-000',
    imageUrl: '/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    sellerName: 'Victor Araújo',
    sellerAffiliation: 'Aluno de Engenharia - Bloco C (CT)',
    sellerWhatsApp: '21987654321',
    sellerPhone: '(21) 98765-4321',
    sellerUserId: 'usr_victor_fundao',
    showWhatsApp: true,
    showPhone: true,
    restrictContactToCampus: true,
    viewsCount: 265,
  },
];

// ===============================================
// FLUXO GETNINJAS: Pedidos de Serviços Abertos
// ===============================================
export const INITIAL_SERVICE_ORDERS: ServiceOrder[] = [
  {
    id: 'order-001',
    title: 'Higienização e Carga de Gás em Ar Split de 12.000 BTUs',
    description: 'Preciso de um técnico com urgência para fazer a limpeza química, troca de filtro e verificação de carga de gás em um aparelho de ar-condicionado split no laboratório de pesquisa da COPPE. O aparelho está pingando água e não gela o ambiente.',
    category: 'reformas_reparos',
    campusZone: 'CT - Centro de Tecnologia',
    locationDetails: 'Bloco I, Sala 214 - COPPE / CT',
    cep: '21941-000',
    urgency: 'urgente',
    budgetEstimate: 'R$ 150 a R$ 250',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    clientId: 'usr_victor_fundao',
    clientName: 'Victor Araújo',
    clientAffiliation: 'Aluno de Engenharia - Bloco C (CT)',
    clientPhone: '(21) 98765-4321',
    clientWhatsApp: '21987654321',
    clientEmail: 'victor.araujo@ufrj.br',
    proposalsCount: 2,
    status: 'aberto',
  },
  {
    id: 'order-002',
    title: 'Revisão Textual Gramatical e Formatação ABNT para TCC de Engenharia',
    description: 'Estou finalizando meu trabalho de conclusão de curso com 78 páginas. Preciso de profissional experiente para fazer revisão gramatical profunda, conferir normas da ABNT 2026, citações diretas/indiretas e ajustar referências bibliográficas.',
    category: 'aulas_academico',
    campusZone: 'CT - Centro de Tecnologia',
    locationDetails: 'Centro de Tecnologia / Biblioteca Central',
    cep: '21941-000',
    urgency: 'esta_semana',
    budgetEstimate: 'R$ 120 a R$ 200',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    clientId: 'usr_rodrigo',
    clientName: 'Rodrigo Medeiros',
    clientAffiliation: 'Mestrando em Eng. Mecânica (COPPE)',
    clientPhone: '(21) 99123-4567',
    clientWhatsApp: '21991234567',
    clientEmail: 'rodrigo.medeiros@coppe.ufrj.br',
    proposalsCount: 1,
    status: 'aberto',
  },
  {
    id: 'order-003',
    title: 'Cento de Salgadinhos Quentes e Kit Festa para Banca de Defesa',
    description: 'Preciso encomendar 2 centos de salgados variados (fritos e assados: coxinhas, empadas, esfirras e quibes) mais refrigerantes e descartáveis para recepção de banca examinadora de mestrado. Entrega pontual às 13h30 na sala de seminários.',
    category: 'alimentacao_festas',
    campusZone: 'CCMN - Ciências Matemáticas e Natureza',
    locationDetails: 'Prédio do CCMN - Sala de Seminários Bloco C',
    cep: '21941-000',
    urgency: 'esta_semana',
    budgetEstimate: 'R$ 160 a R$ 220',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    clientId: 'usr_lucas',
    clientName: 'Lucas Bittencourt',
    clientAffiliation: 'Graduando em Engenharia Química',
    clientPhone: '(21) 97654-3210',
    clientWhatsApp: '21976543210',
    clientEmail: 'lucas.bittencourt@eq.ufrj.br',
    proposalsCount: 1,
    status: 'aberto',
  },
  {
    id: 'order-004',
    title: 'Troca de Rejunte, Pia e Reparo em Parede com Infiltração',
    description: 'Procuro pedreiro ou profissional de reparos residenciais para consertar infiltração na parede do banheiro de kitnet na Vila Residencial e instalar nova torneira e sifão na pia da cozinha. Serviço rápido de 1 dia.',
    category: 'reformas_reparos',
    campusZone: 'Vila Residencial dos Professores/Alunos',
    locationDetails: 'Rua das Mangueiras - Vila Residencial',
    cep: '21941-000',
    urgency: 'sem_pressa',
    budgetEstimate: 'A combinar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    clientId: 'usr_mariaclara',
    clientName: 'Dona Maria Clara',
    clientAffiliation: 'Moradora da Vila Residencial',
    clientPhone: '(21) 98877-6655',
    clientWhatsApp: '21988776655',
    clientEmail: 'mariaclara.fundao@gmail.com',
    proposalsCount: 1,
    status: 'aberto',
  },
  {
    id: 'order-005',
    title: 'Formatação, Troca de Pasta Térmica e Instalação de SSD em Notebook Dell',
    description: 'Meu notebook de pesquisa está travando e esquentando muito. Já comprei o SSD SATA de 512GB e preciso de um técnico para abrir, limpar cooler, aplicar pasta térmica de prata e fazer backup e instalação limpa do Windows 11 com pacote Office.',
    category: 'ti_eletronica',
    campusZone: 'CCS - Centro de Ciências da Saúde',
    locationDetails: 'Instituto de Biofísica - CCS Bloco G',
    cep: '21941-000',
    urgency: 'esta_semana',
    budgetEstimate: 'R$ 100 a R$ 180',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    clientId: 'usr_beatriz',
    clientName: 'Dra. Beatriz Leão',
    clientAffiliation: 'Pesquisadora Associada - IBCCF',
    clientPhone: '(21) 97223-3445',
    clientWhatsApp: '21972233445',
    clientEmail: 'beatriz.leao@biof.ufrj.br',
    proposalsCount: 2,
    status: 'aberto',
  },
];

// ===============================================
// FLUXO GETNINJAS: Propostas Enviadas por Prestadores
// ===============================================
export const INITIAL_PROPOSALS: ServiceProposal[] = [
  {
    id: 'prop-001',
    serviceOrderId: 'order-001',
    professionalId: 'usr_carlos_refrig',
    professionalName: 'Carlos Refrigeração',
    professionalAffiliation: 'Técnico Credenciado Residente no Fundão',
    professionalPhone: '(21) 98444-5555',
    professionalWhatsApp: '21984445555',
    professionalEmail: 'carlos.climatizacaofundao@gmail.com',
    priceEstimate: 'R$ 180 (Incluso limpeza química e verificação de dreno)',
    message: 'Olá Victor! Sou técnico de refrigeração e estou atendendo hoje mesmo no Centro de Tecnologia. Tenho bomba de limpeza e nitrogênio para teste de pressão. Posso passar aí no Bloco I hoje às 14h.',
    availability: 'Hoje às 14h ou amanhã no período da manhã',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'prop-002',
    serviceOrderId: 'order-001',
    professionalId: 'usr_marcos_eletro',
    professionalName: 'Marcos Climatização e Elétrica',
    professionalAffiliation: 'Prestador Autônomo com atuação no Parque Tecnológico',
    professionalPhone: '(21) 98777-1122',
    professionalWhatsApp: '21987771122',
    professionalEmail: 'marcos.fundao@gmail.com',
    priceEstimate: 'R$ 200 (Com complemento de fluido refrigerante se necessário)',
    message: 'Boa tarde! Faço higienização completa com bactericida próprio para ambientes de laboratório e hospitais. Emito nota fiscal para projeto de pesquisa ou recibo autônomo.',
    availability: 'Amanhã a partir das 9h',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'prop-003',
    serviceOrderId: 'order-002',
    professionalId: 'usr_camila',
    professionalName: 'Camila Fagundes',
    professionalAffiliation: 'Mestre em Linguística Aplicada (Faculdade de Letras)',
    professionalPhone: '(21) 99554-4332',
    professionalWhatsApp: '21995544332',
    professionalEmail: 'camila.revisoes@ufrj.br',
    priceEstimate: 'R$ 150 (Prazo de 3 dias úteis)',
    message: 'Olá Rodrigo! Sou especialista na formatação das teses da COPPE e conheço detalhadamente o manual da UFRJ e da ABNT. Entrego o documento no Word com controle de alterações ativado para você acompanhar tudo.',
    availability: 'Início imediato após envio do arquivo',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'prop-004',
    serviceOrderId: 'order-003',
    professionalId: 'usr_neide',
    professionalName: 'Dona Neide Salgados',
    professionalAffiliation: 'Confeitaria Comunitária da Ilha',
    professionalPhone: '(21) 99333-4444',
    professionalWhatsApp: '21993334444',
    professionalEmail: 'neide.salgadosfundao@gmail.com',
    priceEstimate: 'R$ 170 (2 centos fritos e assados na hora + entrega inclusa)',
    message: 'Olá Lucas! Faço kits para bancas no CCMN há mais de 10 anos. Nossos salgadinhos chegam bem quentinhos em caixas térmicas, e já levo guardanapos e bandejas descartáveis para a mesa da banca.',
    availability: 'Entrego pontualmente às 13h30 na sala de seminários',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'prop-005',
    serviceOrderId: 'order-004',
    professionalId: 'usr_sebastiao',
    professionalName: 'Mestre Sebastião',
    professionalAffiliation: 'Profissional de Alvenaria e Reparos no Fundão',
    professionalPhone: '(21) 97111-2222',
    professionalWhatsApp: '21971112222',
    professionalEmail: 'sebastiao.obras@gmail.com',
    priceEstimate: 'R$ 160 (Mão de obra completa para banheiro e pia)',
    message: 'Dona Maria Clara, faço serviços na Vila há bastante tempo com recomendação dos moradores. Posso dar uma olhada na infiltração amanhã de manhã e já levar os materiais para vedação e troca de torneira.',
    availability: 'Amanhã pela manhã (a partir das 8h)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: 'prop-006',
    serviceOrderId: 'order-005',
    professionalId: 'usr_victor_fundao',
    professionalName: 'Victor Araújo',
    professionalAffiliation: 'Aluno de Engenharia - Bloco C (CT)',
    professionalPhone: '(21) 98765-4321',
    professionalWhatsApp: '21987654321',
    professionalEmail: 'victor.araujo@ufrj.br',
    priceEstimate: 'R$ 120 (Incluso pasta térmica Arctic Silver + instalação)',
    message: 'Olá Dra. Beatriz! Trabalho com manutenção de computadores no laboratório do CT. Posso realizar a abertura técnica, troca da pasta térmica por composto de alta performance e clonagem/instalação do SSD mantendo seus arquivos.',
    availability: 'Hoje no final da tarde ou amanhã no CCS',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];
