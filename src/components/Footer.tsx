import React from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { MapPin, ShieldCheck, Home, Wrench, MessageSquare } from 'lucide-react';
import { Category } from '../types/classifieds';

export const Footer: React.FC = () => {
  const { setFilters, setAppMode, setIsSafetyModalOpen, setIsChatModalOpen } = useClassifieds();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Region */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                U
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                Uni<span className="text-orange-600">Classificados</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              O marketplace de classificados comunitário dedicado exclusivamente à região do <strong>CEP 21941-000 (Cidade Universitária / Ilha do Fundão - UFRJ)</strong>. Encontre veículos, quartos para estudantes, serviços locais (refrigeração, pedreiro, salgados e eventos), equipamentos e produtos usados com segurança local e chat interno.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Ilha do Fundão, Rio de Janeiro - RJ · CEP 21941-000</span>
            </div>
          </div>

          {/* Col 2: Categorias */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Categorias no Fundão
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'veiculos' }));
                    document.getElementById('anuncios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Veículos & Motos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'imoveis' }));
                    document.getElementById('anuncios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Quartos & Imóveis (Vila e Campus)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAppMode('getninjas');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 transition-colors cursor-pointer text-left font-medium text-emerald-700"
                >
                  Serviços (Pedreiro, Refrigeração, Festas) →
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'equipamentos' }));
                    document.getElementById('anuncios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Equipamentos & Calculadoras
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'produtos_usados' }));
                    document.getElementById('anuncios-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-600 transition-colors cursor-pointer"
                >
                  Produtos Usados & Livros
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Dicas & Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Comunidade & Ajuda
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dicas de Segurança no Campus</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsSafetyModalOpen(true)}
                  className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1 text-left"
                >
                  <Home className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>Dica de Aluguel: Visite acompanhado(a)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsChatModalOpen(true)}
                  className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chat Interno da Plataforma</span>
                </button>
              </li>
              <li>
                <span className="text-slate-400">Contatos protegidos por geolocalização</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>&copy; {new Date().getFullYear()} UniClassificados Cidade Universitária · CEP 21941-000</span>
          <span>Iniciativa comunitária para alunos, trabalhadores e moradores da Ilha do Fundão</span>
        </div>
      </div>
    </footer>
  );
};
