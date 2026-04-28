import React, { useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { CheckCircle2, Send, Lock, ChevronDown, ArrowRight, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BENEFIT_TYPES = [
  "Auxílio-Maternidade",
  "Aposentadoria por Idade",
  "Aposentadoria Rural",
  "BPC / LOAS (Idoso ou Deficiente)",
  "Pensão por Morte",
  "Outros Assuntos INSS"
];

export function LeadForm({ 
  onSuccess, 
  title = "Simule Grátis", 
  buttonText = "CONSULTAR AGORA",
  source = "website" 
}: { 
  onSuccess?: (data: { name: string, benefitType: string }) => void, 
  title?: string, 
  buttonText?: string,
  source?: string
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    benefitType: '',
    source: source
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'redirecting' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.benefitType) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        status: 'novo',
        notes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      if (onSuccess) {
        setStatus('redirecting');
        setTimeout(() => {
          onSuccess({ name: formData.name, benefitType: formData.benefitType });
        }, 1500);
      } else {
        setStatus('success');
      }
      setFormData({ name: '', phone: '', benefitType: '', source: source });
    } catch (error) {
      setStatus('error');
      handleFirestoreError(error, OperationType.CREATE, 'leads');
    }
  };

  if (status === 'success' && !onSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center border-t-8 border-green-500"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full text-green-600">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-4">Quase lá!</h3>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Sua solicitação foi enviada com sucesso. Fique de olho no seu WhatsApp, entraremos em contato em breve.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="bg-brand-blue text-gray-900 px-10 py-4 rounded-full font-black text-lg hover:shadow-xl shadow-brand-blue/20 transition-all shadow-blue-100"
        >
          Novo Atendimento
        </button>
      </motion.div>
    );
  }

  if (status === 'redirecting') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center border-t-8 border-brand-blue"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-brand-blue/20 p-4 rounded-full text-brand-blue">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-4">Cadastro Realizado!</h3>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Estamos te redirecionando para o WhatsApp do especialista agora mesmo...
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-brand-blue font-black uppercase tracking-tighter animate-pulse">
            Conectando ao WhatsApp
          </div>
          <button 
            onClick={() => onSuccess && onSuccess({ name: formData.name, benefitType: formData.benefitType })}
            className="text-xs text-gray-400 underline hover:text-brand-blue transition-colors"
          >
            Se não for redirecionado, clique aqui
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-t-8 border-brand-blue space-y-8">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-gray-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <Lock size={12} /> Portal Seguro LGPD
        </div>
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 italic font-serif leading-tight">Análise completa em menos de 24 horas</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group/field relative">
            <label htmlFor="name" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 text-left cursor-help">
              Seu Nome Completo
              <Info size={12} className="text-gray-300 group-hover/field:text-brand-blue transition-colors" />
            </label>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 w-full max-w-[240px] opacity-0 invisible group-hover/field:opacity-100 group-hover/field:visible transition-all duration-300 z-20 pointer-events-none">
              <div className="bg-gray-900 text-white text-[10px] font-bold p-3 rounded-xl shadow-xl leading-relaxed">
                Usamos seu nome para personalizar seu atendimento e identificar sua solicitação corretamente.
                <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -translate-y-1" />
              </div>
            </div>

            <input
              id="name"
              required
              type="text"
              placeholder="Ex: Maria dos Santos"
              className="w-full px-5 py-5 rounded-2xl border-2 border-gray-50 focus:border-brand-blue focus:bg-brand-blue/5 outline-none transition-all text-xl font-medium shadow-inner"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="group/field relative">
            <label htmlFor="phone" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 text-left cursor-help">
              WhatsApp para Contato
              <Info size={12} className="text-gray-300 group-hover/field:text-brand-blue transition-colors" />
            </label>

            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-2 w-full max-w-[240px] opacity-0 invisible group-hover/field:opacity-100 group-hover/field:visible transition-all duration-300 z-20 pointer-events-none">
              <div className="bg-gray-900 text-white text-[10px] font-bold p-3 rounded-xl shadow-xl leading-relaxed">
                O contato será feito exclusivamente por WhatsApp para garantir sua comodidade e segurança.
                <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -translate-y-1" />
              </div>
            </div>

            <PatternFormat
              id="phone"
              required
              format="(##) #####-####"
              type="tel"
              placeholder="(00) 00000-0000"
              className="w-full px-5 py-5 rounded-2xl border-2 border-gray-50 focus:border-brand-blue focus:bg-brand-blue/5 outline-none transition-all text-xl font-medium shadow-inner"
              value={formData.phone}
              onValueChange={(values) => setFormData({ ...formData, phone: values.value })}
            />
          </div>
        </div>

        <div className="group/field relative">
          <label htmlFor="benefit" className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 text-left cursor-help">
            Benefício de Interesse
            <Info size={12} className="text-gray-300 group-hover/field:text-brand-blue transition-colors" />
          </label>

          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 w-full max-w-[400px] opacity-0 invisible group-hover/field:opacity-100 group-hover/field:visible transition-all duration-300 z-20 pointer-events-none">
            <div className="bg-gray-900 text-white text-[10px] font-bold p-3 rounded-xl shadow-xl leading-relaxed inline-block">
              Saber o benefício ajuda nossos especialistas a prepararem a análise correta para o seu caso específico.
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 rotate-45 -translate-y-1" />
            </div>
          </div>

          <div className="relative">
            <select
              id="benefit"
              required
              className="w-full px-5 py-5 rounded-2xl border-2 border-gray-50 focus:border-brand-blue focus:bg-brand-blue/5 outline-none transition-all text-xl font-medium appearance-none bg-white shadow-inner"
              value={formData.benefitType}
              onChange={e => setFormData({ ...formData, benefitType: e.target.value })}
            >
              <option value="" disabled>Selecione um benefício</option>
              {BENEFIT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <ChevronDown size={24} />
            </div>
          </div>
        </div>

        <button
          disabled={status === 'loading'}
          className={`w-full py-6 md:py-7 rounded-[2.5rem] text-white font-black text-xl md:text-2xl shadow-xl flex items-center justify-center gap-4 transition-all transform active:scale-95 group ${
            status === 'loading' ? 'bg-gray-400 cursor-not-allowed overflow-hidden' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200 shadow-green-100/50'
          }`}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="blur-[1px] opacity-70">ENVIANDO...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4"
              >
                {buttonText} <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        
        {status === 'error' && (
          <p className="text-red-500 text-center text-sm font-black uppercase tracking-widest">
            Erro ao enviar. Tente novamente.
          </p>
        )}
      </div>

      <p className="border-t border-gray-50 pt-6 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest leading-relaxed">
        Seus dados estão protegidos pela Lei Geral de Proteção de Dados (LGPD). Prometemos sigilo absoluto.
      </p>
    </form>
  );
}
