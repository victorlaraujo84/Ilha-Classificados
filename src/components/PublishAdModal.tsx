import React, { useState } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { CAMPUS_ZONES, CATEGORIES_CONFIG } from '../data/seedData';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  DollarSign, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Category, Condition, PriceType } from '../types/classifieds';

export const PublishAdModal: React.FC = () => {
  const { 
    isPublishModalOpen, 
    setIsPublishModalOpen, 
    currentUser, 
    createAd, 
    setSelectedAd,
    itemCategories
  } = useClassifieds();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('produtos_usados');
  const [subCategory, setSubCategory] = useState<string>('Livros Acadêmicos & Apostilas');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [priceType, setPriceType] = useState<PriceType>('fixo');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('usado');
  const [campusZone, setCampusZone] = useState<string>(CAMPUS_ZONES[1]); // CT
  const [locationDetail, setLocationDetail] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg');
  const [customImageUploaded, setCustomImageUploaded] = useState(false);
  const [contactWhatsApp, setContactWhatsApp] = useState(currentUser?.whatsApp || '21987654321');
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [restrictContactToCampus, setRestrictContactToCampus] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isPublishModalOpen) return null;

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const catConfig = itemCategories.find(c => c.id === newCat);
    if (catConfig && catConfig.subCategories && catConfig.subCategories.length > 0) {
      setSubCategory(catConfig.subCategories[0]);
    } else {
      setSubCategory('Geral');
    }

    if (newCat === 'veiculos') {
      setCondition('seminovo');
      if (!customImageUploaded) {
        setImagePreview('/src/assets/images/ad_honda_biz_scooter_1791995294382.jpg');
      }
    } else if (newCat === 'imoveis') {
      setCondition('novo');
      if (!customImageUploaded) {
        setImagePreview('/src/assets/images/ad_kitnet_vila_residencial_1791995294991.jpg');
      }
    } else if (newCat === 'equipamentos') {
      setCondition('seminovo');
      if (!customImageUploaded) {
        setImagePreview('/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg');
      }
    } else {
      setCondition('usado');
      if (!customImageUploaded) {
        setImagePreview('/src/assets/images/ad_hp_graphing_calculator_1791995294926.jpg');
      }
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('A imagem deve ter menos de 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setCustomImageUploaded(true);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título do anúncio');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Por favor, adicione uma descrição');
      return;
    }
    if (priceType === 'fixo' && (!price || parseFloat(price) <= 0)) {
      setErrorMsg('Por favor, insira um valor válido ou selecione "A combinar"');
      return;
    }
    if (!locationDetail.trim()) {
      setErrorMsg('Informe o ponto de referência ou bloco (ex: Bloco H, Alojamento, Vila)');
      return;
    }

    const tagList = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const newAd = createAd({
      title: title.trim(),
      description: description.trim(),
      category: category,
      subCategory: subCategory,
      classificationTags: tagList,
      price: priceType === 'fixo' ? parseFloat(price) : null,
      priceType: priceType,
      condition: condition,
      location: `${campusZone.split('-')[0].trim()} - ${locationDetail.trim()}`,
      campusZone: campusZone,
      cep: '21941-000',
      imageUrl: imagePreview,
      sellerName: currentUser?.name || 'Anunciante do Fundão',
      sellerAffiliation: currentUser?.campusAffiliation || 'Comunidade Cidade Universitária',
      sellerWhatsApp: contactWhatsApp,
      sellerPhone: currentUser?.phone || '(21) 98765-4321',
      showWhatsApp,
      showPhone,
      restrictContactToCampus,
    });

    setIsPublishModalOpen(false);
    setSelectedAd(newAd);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-4 sm:my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Inserir Anúncio na Cidade Universitária
            </h2>
            <p className="text-xs text-slate-500">
              Foco exclusivo no CEP 21941-000 (Ilha do Fundão / UFRJ)
            </p>
          </div>
          <button
            onClick={() => setIsPublishModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Título do anúncio *
            </label>
            <input
              type="text"
              placeholder="Ex: Livro Cálculo Stewart Vol 1, Honda Biz 125, Quarto na Vila..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Seja direto e inclua modelo ou característica principal</span>
              <span>{title.length}/80</span>
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {itemCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Condição do Item *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                <option value="usado">Usado em bom estado</option>
                <option value="seminovo">Seminovo (Pouco uso)</option>
                <option value="novo">Novo na caixa / Lacrado</option>
              </select>
            </div>
          </div>

          {/* Classification Tags for Search Mitigation */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Palavras-chave de Busca / Tags (Mitigar a pesquisa)
            </label>
            <input
              type="text"
              placeholder="Ex: cálculo, stewart, exatas, poli, apostila (separar por vírgula)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Palavras-chave opcionais que ajudam compradores a encontrar o item diretamente na busca.
            </span>
          </div>

          {/* Dica de Segurança para Imóveis (Regra UFRJ) */}
          {category === 'imoveis' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">Recomendação para Aluguel de Imóveis & Vagas:</span>
                <p className="mt-0.5">
                  O ideal é marcar a visita, ir acompanhado(a), e tirar todas as suas dúvidas antes de fechar qualquer locação ou repasse de caução.
                </p>
              </div>
            </div>
          )}

          {/* Sub-classification / Subcategories (Ex: Veículos -> Carros, Motos, Bicicletas) */}
          {(() => {
            const currentCatConfig = itemCategories.find(c => c.id === category);
            const subOptions = currentCatConfig?.subCategories && currentCatConfig.subCategories.length > 0
              ? currentCatConfig.subCategories
              : null;

            if (!subOptions) return null;

            return (
              <div className="bg-orange-50/60 p-3.5 rounded-xl border border-orange-200/80">
                <label className="block text-xs font-bold text-orange-950 mb-1">
                  Subcategoria em {currentCatConfig?.label} *
                </label>
                <p className="text-[11px] text-orange-800 mb-2">
                  Selecione a opção específica para facilitar a busca de compradores (Ex: {currentCatConfig?.label} &rarr; {subOptions[0]}):
                </p>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-orange-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {subOptions.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  <option value="Outro / Específico">Outro / Específico</option>
                </select>
              </div>
            );
          })()}

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Preço ou Modalidade *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${priceType === 'fixo' ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold' : 'border-slate-200 text-slate-600'}`}>
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === 'fixo'}
                  onChange={() => setPriceType('fixo')}
                  className="text-orange-600"
                />
                <span>Valor Fixo (R$)</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${priceType === 'a_combinar' ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold' : 'border-slate-200 text-slate-600'}`}>
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === 'a_combinar'}
                  onChange={() => setPriceType('a_combinar')}
                  className="text-orange-600"
                />
                <span>A Combinar</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${priceType === 'gratis' ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold' : 'border-slate-200 text-slate-600'}`}>
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === 'gratis'}
                  onChange={() => setPriceType('gratis')}
                  className="text-orange-600"
                />
                <span>Doação / Grátis</span>
              </label>
            </div>

            {priceType === 'fixo' && (
              <div className="relative">
                <span className="text-slate-500 text-sm font-semibold absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  R$
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0,00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            )}
          </div>

          {/* Location on Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Área no Campus (CEP 21941-000) *
              </label>
              <select
                value={campusZone}
                onChange={(e) => setCampusZone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {CAMPUS_ZONES.filter(z => !z.startsWith('Todas')).map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Ponto de encontro / Detalhe *
              </label>
              <input
                type="text"
                placeholder="Ex: Bloco H / Estacionamento / Hall"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Descrição detalhada *
            </label>
            <textarea
              rows={4}
              placeholder="Descreva o estado de conservação, motivo da venda, horários de disponibilidade para entrega no campus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Foto do item ou serviço *
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                <img
                  src={imagePreview}
                  alt="Pré-visualização"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-lg cursor-pointer bg-slate-50 hover:bg-orange-50/30 transition-colors">
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">
                    {customImageUploaded ? 'Trocar foto selecionada' : 'Fazer upload de foto do seu aparelho'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1">
                  Formatos suportados: JPG, PNG, WEBP até 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information & Privacy Choices */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3.5">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Dados de contato
              </h4>
              <p className="text-[11px] text-slate-500">
                Você escolhe exatamente quais canais deseja exibir no seu anúncio para compradores do campus:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  WhatsApp com DDD (somente números)
                </label>
                <input
                  type="text"
                  placeholder="21987654321"
                  value={contactWhatsApp}
                  onChange={(e) => setContactWhatsApp(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  required
                />
              </div>
              <div className="flex items-center text-[11px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200">
                <span>🔒 <strong>Privacidade:</strong> Seu e-mail não será exposto em nenhuma hipótese. Os contatos são diretos via canais que você autorizar abaixo.</span>
              </div>
            </div>

            {/* Checkboxes: O anunciante escolhe o que quer exibir */}
            <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 block">
                Escolha o que compartilhar no anúncio (e com quem):
              </span>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWhatsApp}
                  onChange={(e) => setShowWhatsApp(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
                <span>Exibir botão de <strong>WhatsApp direto</strong></span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPhone}
                  onChange={(e) => setShowPhone(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                />
                <span>Exibir <strong>número de telefone</strong> para ligações diretas</span>
              </label>

              <label className="flex items-start gap-2 text-xs text-slate-800 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={restrictContactToCampus}
                  onChange={(e) => setRestrictContactToCampus(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-900">Restringir contato à Cidade Universitária</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Se marcado, apenas usuários conectados ou com dispositivo localizado dentro da Ilha do Fundão (área da Cidade Universitária) e logados poderão visualizar seu contato direto.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
            >
              Publicar Anúncio Agora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
