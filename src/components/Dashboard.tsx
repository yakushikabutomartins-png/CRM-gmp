import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, logout } from '../lib/firebase';
import { LeadRow } from './LeadRow';
import { LogOut, Users, RefreshCw, Search, Bell, BellOff, Info, X, Phone, FileDown, Baby, HeartPulse, Stethoscope, CalendarClock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [sourceFilter, setSourceFilter] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
  
  const initialLoadRef = useRef(true);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const sendNotification = (title: string, body: string) => {
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Check for new leads or updates to notify
      if (!initialLoadRef.current) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const newLead = change.doc.data();
            sendNotification('Novo Lead!', `${newLead.name} está interessado em ${newLead.benefitType}`);
            setNotifications(prev => [
              { id: Date.now(), title: 'Novo Lead', text: `${newLead.name} - ${newLead.benefitType}`, time: new Date() },
              ...prev
            ]);
          }
          if (change.type === 'modified') {
            const updatedLead = change.doc.data();
            const oldLead = leads.find(l => l.id === change.doc.id);
            if (oldLead && oldLead.status !== updatedLead.status) {
              sendNotification('Status Atualizado', `${updatedLead.name} agora está como ${updatedLead.status.replace('_', ' ')}`);
              setNotifications(prev => [
                { id: Date.now(), title: 'Status Alterado', text: `${updatedLead.name} -> ${updatedLead.status.replace('_', ' ')}`, time: new Date() },
                ...prev
              ]);
            }
          }
        });

        // Track upcoming reminders to show in UI stats
        // Reminders are handled by the filter in the render, but we could add proactive notifications here if needed.
      }

      setLeads(leadsData);
      setLoading(false);
      initialLoadRef.current = false;
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leads');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [permission]);

  const filteredLeads = leads.filter(lead => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = lead.name.toLowerCase().includes(searchTermLower) || 
                          lead.benefitType.toLowerCase().includes(searchTermLower) ||
                          (lead.notes || '').toLowerCase().includes(searchTermLower);
    
    const matchesPhone = !phoneSearch || lead.phone.includes(phoneSearch);
    
    let matchesFilter = filter === 'todos' || lead.status === filter;
    if (filter === 'reminders') {
      matchesFilter = !!lead.reminderDate;
    }

    const matchesSource = sourceFilter === 'todos' || lead.source === sourceFilter;

    let matchesDate = true;
    if (lead.createdAt?.toDate) {
      const leadDate = lead.createdAt.toDate();
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (leadDate < start) matchesDate = false;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (leadDate > end) matchesDate = false;
      }
    }

    return matchesSearch && matchesPhone && matchesFilter && matchesSource && matchesDate;
  });

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = ['Nome', 'Telefone', 'Tipo de Benefício', 'Status', 'Origem', 'Data de Criação', 'Notas'];
    const rows = filteredLeads.map(lead => {
      const date = lead.createdAt?.toDate?.() 
        ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(lead.createdAt.toDate())
        : '';
        
      return [
        `"${lead.name || ''}"`,
        `"${lead.phone || ''}"`,
        `"${lead.benefitType || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.source || 'website'}"`,
        `"${date}"`,
        `"${(lead.notes || '').replace(/"/g, '""')}"` // Escape double quotes for CSV
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_consultoria_aml_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Brand Elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[url('https://images.unsplash.com/photo-1544126592-807daa2e5682?auto=format&fit=crop&q=80&w=1000')] bg-cover rounded-full opacity-10 border-8 border-white shadow-2xl rotate-3" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=1000')] bg-cover rounded-full opacity-10 border-8 border-white shadow-2xl -rotate-6" />
        
        {/* Floating Large Icons Watermarks */}
        <div className="absolute top-[15%] right-[25%] opacity-5 text-gray-900 border-2 border-gray-900/10 p-6 rounded-[3rem] -rotate-12"><Baby size={120} strokeWidth={1} /></div>
        <div className="absolute bottom-[20%] left-[15%] opacity-5 text-brand-blue border-2 border-brand-blue/10 p-6 rounded-[3rem] rotate-12"><HeartPulse size={100} strokeWidth={1} /></div>
        <div className="absolute top-[40%] left-[30%] opacity-5 text-gray-900 border-2 border-gray-900/10 p-6 rounded-[3rem] rotate-45"><Stethoscope size={80} strokeWidth={1} /></div>
        <div className="absolute bottom-[10%] right-[20%] opacity-5 text-brand-blue border-2 border-brand-blue/10 p-4 rounded-[3rem] -rotate-6"><CalendarClock size={90} strokeWidth={1} /></div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-brand-blue/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex flex-wrap justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue p-2 rounded-xl text-gray-900">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Consultoria<span className="text-brand-blue">AML</span></h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Painel CRM de Leads</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-xl transition-all relative ${
                notifications.length > 0 ? 'text-brand-blue bg-brand-blue/10' : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Bell size={22} />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4"
                >
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                    <span className="font-black text-gray-900 uppercase text-xs tracking-widest">Notificações</span>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] font-black text-brand-blue uppercase hover:underline"
                    >
                      Limpar
                    </button>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {permission !== 'granted' && (
                      <button 
                        onClick={requestPermission}
                        className="w-full flex items-center gap-3 p-3 bg-orange-50 text-orange-700 rounded-xl text-left hover:bg-orange-100 transition-colors"
                      >
                        <BellOff size={16} className="shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-tight">Ativar Notificações no Navegador</span>
                      </button>
                    )}

                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-gray-400 space-y-2">
                        <Info size={24} className="mx-auto opacity-20" />
                        <p className="text-xs font-medium">Nenhuma notificação nova</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="font-black text-gray-900 text-sm">{n.title}</p>
                          <p className="text-xs text-gray-500 font-medium">{n.text}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{n.time.toLocaleTimeString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={logout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-sm bg-gray-50 px-4 py-2 rounded-xl"
          >
            <LogOut size={18} /> <span className="hidden md:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto w-full space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
          <div className="relative flex-[2] w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, benefício ou notas..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filteredLeads.length === 0}
            className="flex items-center gap-2 bg-brand-blue text-gray-900 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-blue-dark transition-all shadow-lg shadow-brand-blue/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group w-full xl:w-auto justify-center"
          >
            <FileDown size={18} className="group-hover:-translate-y-0.5 transition-transform" />
            Exportar CSV
          </button>

          <div className="relative flex-1 w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex items-center gap-1">
              <Phone size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Zap</span>
            </div>
            <input 
              type="text" 
              placeholder="Telefone..."
              className="w-full pl-16 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all font-mono"
              value={phoneSearch}
              onChange={e => setPhoneSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <div className="flex flex-col gap-1 grow sm:grow-0">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight ml-2">Status</span>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-blue/50 transition-colors">
                <select 
                  className="bg-transparent text-sm font-bold text-gray-700 outline-none w-full cursor-pointer"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="concluido">Concluído</option>
                  <option value="arquivado">Arquivado</option>
                  <option value="reminders">Agendados</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 grow sm:grow-0">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight ml-2">Origem</span>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-blue/50 transition-colors">
                <select 
                  className="bg-transparent text-sm font-bold text-gray-700 outline-none w-full cursor-pointer"
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="social_media">Redes Sociais</option>
                  <option value="referral">Indicação</option>
                  <option value="google">Google</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1 grow sm:grow-0">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight ml-2">De</span>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-blue/50 transition-colors">
                <input 
                  type="date" 
                  className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 grow sm:grow-0">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tight ml-2">Até</span>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-brand-blue/50 transition-colors">
                <input 
                  type="date" 
                  className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all self-center"
                title="Limpar datas"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total</p>
            <p className="text-2xl font-black text-gray-900">{leads.length}</p>
          </div>
          <div className="bg-brand-blue/10 p-4 rounded-2xl border border-brand-blue/20 shadow-sm">
            <p className="text-xs font-bold text-brand-blue uppercase mb-1">Novos</p>
            <p className="text-2xl font-black text-gray-900">{leads.filter(l => l.status === 'novo').length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm">
            <p className="text-xs font-bold text-green-400 uppercase mb-1">Concluídos</p>
            <p className="text-2xl font-black text-green-700">{leads.filter(l => l.status === 'concluido').length}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">Arquivados</p>
            <p className="text-2xl font-black text-gray-600">{leads.filter(l => l.status === 'arquivado').length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-brand-blue/20 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-400 uppercase">Follow-ups</p>
              <Bell size={14} className="text-brand-blue" />
            </div>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {leads.filter(l => l.reminderDate && l.reminderDate.toDate() > new Date()).length}
            </p>
          </div>
        </div>
      </div>

      {/* Table/List View */}
      <main className="flex-1 px-4 md:px-8 pb-12 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-gray-400">
            <RefreshCw className="animate-spin" size={32} />
            <p className="font-bold">Carregando leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 text-center p-8 bg-white rounded-3xl border border-dashed border-gray-200">
            <Users className="text-gray-200" size={64} />
            <div>
              <p className="text-xl font-bold text-gray-800">Nenhum lead encontrado</p>
              <p className="text-gray-400">Tente mudar o filtro ou buscar outro termo.</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Nome</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Telefone</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Benefício</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Data</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLeads.map(lead => (
                    <LeadRow key={lead.id} lead={lead} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
