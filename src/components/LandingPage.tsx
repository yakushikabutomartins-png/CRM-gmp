import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LeadForm } from './LeadForm';
import { Heart, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight, Star, Clock, Lock, HelpingHand, ChevronDown, Share2, Facebook, Twitter, Link, X, Check, ChevronUp, ChevronLeft, ChevronRight, Baby, GraduationCap, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TESTIMONIALS = [
  {
    name: "Dona Maria Silva",
    age: "67 anos",
    text: "Eu não sabia como pedir meu auxílio e estava com medo de cair em golpe. O pessoal da consultoria me explicou tudo com muita paciência e deu tudo certo!",
    role: "Aposentada",
    avatar: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=50&w=160"
  },
  {
    name: "Seu José Oliveira",
    age: "72 anos",
    text: "Trabalhei muito tempo na roça e achei que nunca ia conseguir me aposentar. Eles resolveram minha vida em poucos meses. Recomendo para todos.",
    role: "Pensionista Rural",
    avatar: "https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&q=50&w=160"
  },
  {
    name: "Ana Cláudia",
    age: "28 anos",
    text: "Consegui meu auxílio-maternidade mesmo sem estar trabalhando registrada na época. Foi uma benção para mim e para o meu bebê.",
    role: "Mãe de Primeira Viagem",
    avatar: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=50&w=160"
  }
];

const FAQS = [
  {
    q: "Eu preciso pagar alguma coisa agora?",
    a: "Não! Nossa análise inicial é 100% gratuita. Você só paga uma porcentagem do benefício quando ele for aprovado e cair na sua conta."
  },
  {
    q: "É seguro mandar meus dados?",
    a: "Totalmente. Seus dados são protegidos pela Lei Geral de Proteção de Dados (LGPD) e nunca serão compartilhados com terceiros."
  },
  {
    q: "Quanto tempo demora para sair o benefício?",
    a: "Cada caso é único, mas nossa equipe trabalha para agilizar ao máximo, acompanhando o processo no INSS todos os dias."
  },
  {
    q: "Nunca paguei INSS, posso receber algo?",
    a: "Sim, existem benefícios como o BPC/LOAS e o Auxílio-Maternidade que atendem pessoas que não contribuíram regularmente. Fazemos essa análise para você."
  }
];

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col items-center leading-none ${className}`}>
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Blue orbit */}
      <div className="absolute inset-0 border-[3px] border-brand-blue rounded-full border-t-transparent -rotate-45"></div>
      {/* Black orbit */}
      <div className="absolute inset-1 border-[3px] border-gray-900 rounded-full border-b-transparent rotate-45"></div>
      <span className="text-xl font-black text-gray-900 tracking-tighter">AML</span>
    </div>
    <div className="text-[7px] font-black tracking-[0.2em] text-brand-blue uppercase mt-1">PELOS QUE MAIS PRECISAM</div>
  </div>
);

const PromotionalBanner = ({ onCtaClick }: { onCtaClick: () => void }) => (
  <section className="py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="relative bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row items-stretch">
        <div className="flex-1 p-10 md:p-16 flex flex-col justify-center space-y-8 relative z-10 bg-linear-to-br from-white to-blue-50/30">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-black text-gray-900 leading-none tracking-tight">
              MÃES TÊM DIREITO AOS <br/>
              <span className="text-brand-blue">BENEFÍCIOS DO INSS</span>
            </h3>
            <div className="inline-block bg-brand-pink text-gray-900 px-6 py-2 rounded-2xl font-black text-xl md:text-3xl mt-4 uppercase shadow-lg shadow-pink-200/50">
              AUXÍLIO-MATERNIDADE
            </div>
          </div>
          
          <p className="text-lg text-gray-600 font-bold max-w-md italic">
            Você que trabalhou de <span className="text-gray-900">carteira assinada</span>, que nunca trabalhou ou trabalha na <span className="text-brand-blue">Zona Rural</span>.
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-blue-50 text-brand-blue rounded-2xl shadow-sm border border-blue-100"><Baby size={32} /></div>
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest max-w-[80px]">Salário Maternidade</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-blue-50 text-gray-900 rounded-2xl shadow-sm border border-gray-100"><GraduationCap size={32} /></div>
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest max-w-[80px]">Aposentadoria Rural</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 bg-blue-50 text-brand-blue rounded-2xl shadow-sm border border-blue-100"><Heart size={32} /></div>
              <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest max-w-[80px]">Auxílio Doença</span>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={onCtaClick}
              className="bg-gray-900 text-white px-8 py-5 rounded-3xl font-black text-xl flex items-center gap-4 hover:bg-black transition-all shadow-xl shadow-gray-200 group"
            >
              DESCUBRA SEUS DIREITOS! <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="md:w-2/5 relative min-h-[300px] bg-brand-blue/5 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1594142484501-9ff96621316b?auto=format&fit=crop&q=60&w=800" 
            alt="Mãe e filho simbolizando amor e cuidado" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-white/20 to-white md:to-transparent" />
          
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-brand-pink/90 backdrop-blur-md rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center p-4 text-center">
             <span className="text-[10px] font-black text-gray-900 uppercase leading-tight">MÃE, exemplo de amor!</span>
             <div className="text-gray-900 mt-1"><Heart size={16} fill="currentColor" /></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [detectedSource, setDetectedSource] = useState('website');

  const WHATSAPP_NUMBER = "5573999350209";
  const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const src = params.get('src') || params.get('utm_source');
    
    if (src === 'instagram') {
      setDetectedSource('instagram');
    } else if (src === 'google') {
      setDetectedSource('google');
    } else {
      setDetectedSource('website');
    }
  }, []);

  const handleWhatsAppRedirect = (data: { name: string, benefitType: string }) => {
    const sourceName = detectedSource === 'instagram' ? 'Instagram' : 'Site';
    const message = encodeURIComponent(`Olá! Meu nome é ${data.name}. Vi o ${sourceName} da Consultoria AML e gostaria de uma análise para o benefício: ${data.benefitType}. Pode me ajudar a saber se tenho direito?`);
    
    // wa.me é o padrão recomendado para links diretos que funcionam bem em mobile e desktop
    const finalUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    // Tenta abrir em nova aba para não perder o site de fundo
    const win = window.open(finalUrl, '_blank', 'noopener,noreferrer');
    
    if (!win) {
      // Se o popup for bloqueado (comum em alguns navegadores mobile), redireciona na mesma aba
      window.location.assign(finalUrl);
    }
    
    setShowWhatsAppModal(false);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 8000); // Auto bypass every 8 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevTestimonial();
      if (e.key === 'ArrowRight') nextTestimonial();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareUrl = window.location.origin + window.location.pathname;
  const shareText = "Garanta seu benefício do INSS com a Consultoria AML. Análise gratuita e sem taxas antecipadas com Adilson Macrina!";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="text-green-500" size={24} />,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: 'hover:bg-green-50 text-green-700'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="text-blue-600" size={24} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 text-blue-800'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="text-sky-500" size={24} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-sky-50 text-sky-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100 selection:text-blue-900 border-x-0">
      {/* Modals */}
      <AnimatePresence>
        {showWhatsAppModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-xl relative overflow-visible"
            >
              <button 
                onClick={() => setShowWhatsAppModal(false)}
                className="absolute -top-4 -right-4 p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-colors z-[110] border border-gray-100"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <LeadForm 
                onSuccess={handleWhatsAppRedirect} 
                title="Falar no WhatsApp" 
                buttonText="INICIAR CONVERSA" 
                source={detectedSource === 'website' ? 'whatsapp' : detectedSource}
              />
            </motion.div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                id="close-share-modal"
              >
                <X size={20} className="text-gray-400" />
              </button>

              <div className="p-8 text-center space-y-8">
                <div className="space-y-2">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <Share2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">Compartilhar</h3>
                  <p className="text-gray-500 font-medium text-sm">Ajude outras pessoas a garantirem seus direitos.</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${social.color}`}
                    >
                      {social.icon}
                      <span className="text-[10px] font-black uppercase tracking-widest">{social.name}</span>
                    </a>
                  ))}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={copyToClipboard}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${
                      copied ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-900 hover:border-blue-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {copied ? <Check size={20} /> : <Link size={20} className="text-blue-500" />}
                      <span className="font-bold text-sm tracking-tight">
                        {copied ? 'Copiado com sucesso!' : 'Copiar link da página'}
                      </span>
                    </div>
                    {!copied && <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="bg-brand-blue text-gray-900 py-2 px-4 text-center text-xs font-black uppercase tracking-widest">
        Consultoria Especializada • Adilson Macrina Levado
      </div>

      {/* Top Professional Bar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="scale-75 origin-left">
              <Logo />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-gray-900 tracking-tighter uppercase leading-none">Consultoria<span className="text-brand-blue">AML</span></span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Adilson Macrina</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-700">
            <a href="#beneficios" className="hover:text-brand-blue transition-colors uppercase tracking-widest text-[11px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Benefícios</a>
            <a href="#como-funciona" className="hover:text-brand-blue transition-colors uppercase tracking-widest text-[11px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Como Funciona</a>
            <a href="#depoimentos" className="hover:text-brand-blue transition-colors uppercase tracking-widest text-[11px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Depoimentos</a>
            <a href="#faq" className="hover:text-brand-blue transition-colors uppercase tracking-widest text-[11px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Dúvidas</a>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <RouterLink 
            to="/crm" 
            className="hidden sm:flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-brand-blue hover:text-gray-900 transition-all shadow-xl shadow-gray-200/50 focus-visible:ring-4 focus-visible:ring-brand-blue/20 outline-none border border-transparent hover:border-brand-blue/50"
          >
            Painel CRM
          </RouterLink>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:scale-110 transition-transform p-2 bg-pink-50 rounded-full"
            title="Siga-nos no Instagram"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <button 
            onClick={() => setShowWhatsAppModal(true)}
            className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-green-100 transition-colors"
          >
            <MessageCircle size={18} /> Conversar no WhatsApp
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-24 px-4 md:px-8 overflow-hidden">
        {/* Background Image Container */}
          <div className="absolute inset-0 -z-10">
          <img 
            src="https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=45&w=1000" 
            alt="Mãe sorrindo segurando um bebê feliz" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-orange-100">
                <Star size={14} className="fill-current" /> Atendimento Humanizado e Seguro
              </div>
              <div className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-brand-blue/20">
                <CheckCircle2 size={14} /> Atendemos em todo o Brasil
              </div>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black text-gray-900 leading-[1] md:leading-[0.95] tracking-tighter">
              VOCÊ SABIA QUE <span className="text-brand-blue">TEM DIREITO?</span> <div className="text-brand-pink text-3xl md:text-5xl mt-2">MÃE DESEMPREGADA</div>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-medium leading-relaxed max-w-xl">
              Mesmo sem ter trabalhado de carteira assinada, você pode ter direito ao SALÁRIO MATERNIDADE!
            </p>

            <div className="grid grid-cols-1 gap-3 max-w-md">
              <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm transition-all">
                <div className="bg-blue-50 p-2 rounded-xl text-blue-600 shrink-0"><Lock size={20} /></div>
                <span className="font-bold text-gray-700 text-sm italic">Nunca trabalhou com carteira assinada</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm transition-all">
                <div className="bg-pink-50 p-2 rounded-xl text-pink-600 shrink-0"><Heart size={20} /></div>
                <span className="font-bold text-gray-700 text-sm italic">Sempre foi dona de casa</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm transition-all">
                <div className="bg-green-50 p-2 rounded-xl text-green-600 shrink-0"><CheckCircle2 size={20} /></div>
                <span className="font-bold text-gray-700 text-sm italic">Tem direito ao benefício</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-blue-100/30 rounded-[3rem] blur-2xl -z-10" />
            <LeadForm source={detectedSource} />
            
            {/* Share Trigger */}
            <div className="absolute -bottom-6 left-12 right-12 flex justify-center">
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-xl border border-gray-100 font-black text-xs text-gray-700 uppercase tracking-widest hover:text-brand-blue hover:scale-105 transition-all group focus-visible:ring-4 focus-visible:ring-brand-blue/20 outline-none"
              >
                <Share2 size={16} className="group-hover:rotate-12 transition-transform" /> Compartilhar página
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Trust Badges Bar */}
      <div className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-blue-400 font-black text-3xl mb-1">5.000+</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Famílias Ajudadas</div>
          </div>
          <div>
            <div className="text-blue-400 font-black text-3xl mb-1">R$ 0,00</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Custo Antecipado</div>
          </div>
          <div>
            <div className="text-blue-400 font-black text-3xl mb-1">100%</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">Sigilo de Dados</div>
          </div>
          <div>
            <div className="text-blue-400 font-black text-3xl mb-1">7 Anos</div>
            <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">De Experiência</div>
          </div>
        </div>
      </div>

      <PromotionalBanner onCtaClick={() => setShowWhatsAppModal(true)} />

      {/* Services Section */}
      <section id="beneficios" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight text-center uppercase">VOCÊ PODE TER DIREITO A:</h2>
            <div className="bg-brand-pink/30 py-2 px-6 rounded-full inline-block mx-auto text-gray-900 font-bold text-sm">
              Análise Profissional com ADILSON MACRINA LEVADO
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                title: "Auxílio-Maternidade",
                desc: "Receba o salário maternidade rural ou urbano mesmo que nunca tenha trabalhado de carteira assinada. Atendemos mães de todo o Brasil.",
                icon: <Baby className="text-pink-500" size={28} />,
                bg: "bg-pink-50",
                border: "border-pink-100"
              },
              {
                title: "Aposentadoria Rural e Urbano",
                desc: "Aposentadoria rural e urbana com agilidade. Garantimos o seu direito com foco total na transparência.",
                icon: <GraduationCap className="text-green-500" size={28} />,
                bg: "bg-green-50",
                border: "border-green-100"
              },
              {
                title: "Auxílio Doença",
                desc: "Especialistas em BPC/LOAS e auxílio doença. Assessoria completa para quem mais precisa de acolhimento.",
                icon: <Stethoscope className="text-brand-blue" size={28} />,
                bg: "bg-brand-blue/5",
                border: "border-brand-blue/10"
              }
            ].map((s, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] border-2 ${s.border} ${s.bg} space-y-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-default`}>
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight">{s.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{s.desc}</p>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-600 transition-colors">
                    Ver detalhes <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="como-funciona" className="py-24 px-6 bg-brand-blue text-gray-900 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&q=45&w=1000" 
            alt="Casal de idosos em momento de tranquilidade." 
            className="w-full h-full object-cover opacity-10 mix-blend-multiply"
          />
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8 text-left">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">O caminho para o seu benefício em 3 passos simples</h2>
            <div className="space-y-6">
              {[
                { n: "01", t: "Análise Gratuita", d: "Você preenche o formulário e nossa equipe faz uma análise rápida do seu caso sem contratar nada antes." },
                { n: "02", t: "Organização", d: "Nós cuidamos de toda a documentação, acompanhando cada passo com transparência total." },
                { n: "03", t: "Recebimento", d: "Assim que seu benefício for aprovado, você recebe o valor. Paga apenas se ganhar." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6 items-start p-6 bg-white/40 rounded-3xl backdrop-blur-sm border border-white/40 font-sans">
                  <div className="text-4xl font-black opacity-30 italic">{step.n}</div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold">{step.t}</h4>
                    <p className="text-gray-700 leading-relaxed font-medium">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute -inset-10 bg-white/40 rounded-full blur-3xl animate-pulse" />
            <div className="bg-white/60 backdrop-blur-md p-12 rounded-[3.5rem] border border-white/40 text-center space-y-6">
              <HelpingHand size={80} className="mx-auto text-gray-900" />
              <h3 className="text-3xl font-black">Adilson Macrina</h3>
              <p className="text-gray-800 text-lg font-medium leading-tight">"Pelos que mais precisam"<br/><span className="text-sm font-bold opacity-60 uppercase tracking-widest">Consultoria Especializada</span></p>
              <div className="pt-4">
                <button 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                  className="bg-gray-900 text-white px-8 py-4 rounded-full font-black text-lg shadow-xl shadow-gray-900/20 active:scale-95 transition-all outline-none"
                >
                  FALAR COM O ADILSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 px-6 bg-[#FAFAFA] relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.03]">
          <img 
            src="https://images.unsplash.com/photo-1507206130118-b5907f817163?auto=format&fit=crop&q=35&w=1000" 
            alt="Pessoas felizes" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-flex gap-1 text-orange-400 justify-center">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight text-center">O que dizem sobre nós</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Carousel Content */}
            <div className="relative overflow-hidden min-h-[400px] md:min-h-[350px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center space-y-10 relative">
                    <div className="absolute top-8 left-8 text-6xl text-blue-100 font-serif leading-none opacity-50">"</div>
                    <div className="absolute bottom-8 right-8 text-6xl text-blue-100 font-serif leading-none rotate-180 opacity-50">"</div>
                    
                    <p className="text-xl md:text-2xl text-gray-700 font-medium italic leading-relaxed max-w-2xl relative z-10">
                      {TESTIMONIALS[currentTestimonial].text}
                    </p>

                    <div className="flex flex-col items-center gap-4 pt-6 border-t border-gray-50 w-full max-w-xs relative z-10">
                      <motion.img 
                        layoutId="avatar"
                        src={TESTIMONIALS[currentTestimonial].avatar} 
                        alt={`Foto de perfil de ${TESTIMONIALS[currentTestimonial].name}`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-lg"
                      />
                      <div className="text-center">
                        <h5 className="font-black text-xl text-gray-900 tracking-tight">{TESTIMONIALS[currentTestimonial].name}</h5>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                          {TESTIMONIALS[currentTestimonial].age} • {TESTIMONIALS[currentTestimonial].role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 lg:-left-20">
              <button 
                onClick={prevTestimonial}
                className="p-4 rounded-full bg-white shadow-xl hover:bg-brand-blue hover:text-gray-900 transition-all focus-visible:ring-4 focus-visible:ring-brand-blue/20 outline-none group border border-gray-100"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 lg:-right-20">
              <button 
                onClick={nextTestimonial}
                className="p-4 rounded-full bg-white shadow-xl hover:bg-brand-blue hover:text-gray-900 transition-all focus-visible:ring-4 focus-visible:ring-brand-blue/20 outline-none group border border-gray-100"
                aria-label="Próximo depoimento"
              >
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-12 pb-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`transition-all duration-300 rounded-full h-2 focus-visible:ring-4 focus-visible:ring-brand-blue/20 outline-none ${
                    currentTestimonial === i ? 'w-10 bg-brand-blue' : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  aria-current={currentTestimonial === i ? 'step' : undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl font-black text-center text-gray-900 tracking-tight">Dúvidas Frequentes</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-gray-800 text-lg">{faq.q}</span>
                  <ChevronDown className={`text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} size={20} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-gray-50 text-gray-600 leading-relaxed border-t border-gray-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-brand-pink text-center space-y-10">
        <div className="bg-gray-900 text-white px-6 py-2 rounded-full inline-block font-black text-sm uppercase tracking-widest mb-4">NÃO DEIXE DE RECEBER O QUE É SEU!</div>
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Entre em contato e descubra como receber.<br/><span className="text-gray-900/60 font-medium">Análise honesta e transparente.</span></h2>
        <button 
          onClick={() => setShowWhatsAppModal(true)}
          className="inline-block bg-gray-900 text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-black transition-all transform active:scale-95 outline-none uppercase tracking-tight"
        >
          FALE CONOSCO VIA WHATSAPP
        </button>
        <div className="space-y-2">
          <p className="text-gray-900 text-lg font-black uppercase tracking-widest">ADILSON MACRINA LEVADO</p>
          <p className="text-gray-600 font-bold">@MACRINALEVADO</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div className="space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <Logo className="scale-75 origin-left" />
              <span className="font-black text-xl text-gray-900 uppercase mt-4">Consultoria<span className="text-brand-blue">AML</span></span>
              <div className="mt-2 inline-flex items-center gap-2 bg-brand-blue/5 text-brand-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-blue/10">
                <CheckCircle2 size={10} /> Atendemos em todo o Brasil
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium">Informação, respeito e compromisso com seus direitos.</p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <div className="text-brand-blue"><HelpingHand size={18} /></div> PELOS QUE MAIS PRECISAM
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <div className="text-brand-blue"><ShieldCheck size={18} /></div> SEUS DIREITOS, NOSSO COMPROMISSO
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <div className="text-brand-blue"><Heart size={18} /></div> EMPATIA QUE TRANSFORMA
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-4 pt-6">
              <button onClick={() => setShowWhatsAppModal(true)} className="text-green-500 hover:scale-110 transition-transform"><MessageCircle size={24} /></button>
              <a href="https://instagram.com" className="text-pink-500 hover:scale-110 transition-transform">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <button 
                onClick={() => setShowShareModal(true)}
                className="text-blue-500 hover:scale-110 transition-transform"
                title="Compartilhar"
              >
                <Share2 size={24} />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start gap-4">
            <h5 className="font-black text-gray-900 uppercase tracking-widest text-sm">Links</h5>
            <div className="flex flex-col gap-3 text-gray-700 font-bold text-sm">
              <a href="#" className="hover:text-brand-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Quem Somos</a>
              <a href="#" className="hover:text-brand-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Segurança</a>
              <a href="/login" className="hover:text-brand-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue rounded-sm outline-none">Painel CRM</a>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <h5 className="font-black text-gray-900 uppercase tracking-widest text-sm">Site Oficial</h5>
            <div className="text-gray-500 font-medium text-sm md:text-right space-y-2">
              <a 
                href={shareUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-blue hover:underline break-all block max-w-[280px] md:max-w-none"
              >
                {shareUrl}
              </a>
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black pt-4">
                © 2026 Consultoria AML • CNPJ 00.000.000/0001-00
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA for Mobile */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-center">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="bg-white text-gray-900 p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 border-2 border-gray-100 group"
              title="Voltar ao topo"
            >
              <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setShowWhatsAppModal(true)}
          className="bg-green-500 text-white p-5 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all active:scale-95 border-4 border-white animate-bounce shadow-green-200/50"
          title="Falar no WhatsApp"
        >
          <MessageCircle size={32} />
        </button>
      </div>
    </div>
  );
}
