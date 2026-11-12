import React, { useState } from 'react';
import { useClassifieds } from '../context/ClassifiedsContext';
import { X, User as UserIcon, Mail, Lock, Phone, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    loginAsDemo, 
    signup,
    setIsPublishModalOpen
  } = useClassifieds();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('(21) 98765-4321');
  const [whatsApp, setWhatsApp] = useState('21987654321');
  const [campusAffiliation, setCampusAffiliation] = useState('Aluno de Graduação - CT');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor informe o seu e-mail');
      return;
    }
    const success = login(email);
    if (success) {
      setIsAuthModalOpen(false);
      setIsPublishModalOpen(true);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Preencha os campos obrigatórios');
      return;
    }
    signup({
      name,
      email,
      phone,
      whatsApp: whatsApp.replace(/\D/g, ''),
      campusAffiliation,
    });
    setIsAuthModalOpen(false);
    setIsPublishModalOpen(true);
  };

  const handleQuickDemoLogin = () => {
    loginAsDemo();
    setIsAuthModalOpen(false);
    setIsPublishModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Acesse o UniClassificados
              </h2>
              <p className="text-[11px] text-slate-500">
                Comunidade da Cidade Universitária · CEP 21941-000
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              authModalMode === 'login'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              authModalMode === 'register'
                ? 'border-orange-600 text-orange-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Cadastrar Conta
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  E-mail institucional ou pessoal
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="seu.email@ufrj.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Entrar e Continuar
              </button>

              {/* 1-Click Demo Shortcut */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider">
                  Ou para testar agora
                </span>
              </div>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Entrar como Victor (Engenharia - CT)</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Beatriz Lima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  E-mail *
                </label>
                <input
                  type="email"
                  placeholder="beatriz@biof.ufrj.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    WhatsApp (DDD + N°)
                  </label>
                  <input
                    type="text"
                    placeholder="21987654321"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Vínculo com o Campus
                  </label>
                  <select
                    value={campusAffiliation}
                    onChange={(e) => setCampusAffiliation(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 cursor-pointer"
                  >
                    <option value="Aluno de Graduação - CT">Aluno Graduação CT</option>
                    <option value="Aluno de Pós / COPPE">Aluno Pós / COPPE</option>
                    <option value="Aluno CCS / Biologia / Saúde">Aluno CCS / Saúde</option>
                    <option value="Aluno CCMN / Matemática / Física">Aluno CCMN / Exatas</option>
                    <option value="Morador da Vila Residencial">Morador Vila Residencial</option>
                    <option value="Servidor Técnico / Docente">Servidor / Docente</option>
                    <option value="Trabalhador no Parque Tecnológico">Parque Tecnológico</option>
                    <option value="Outro vínculo no Fundão">Outro no CEP 21941-000</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer mt-2"
              >
                Cadastrar e Continuar
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cadastro obrigatório apenas para publicar anúncios.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
