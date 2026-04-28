import React, { useState } from 'react';
import { doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Phone, MessageSquare, Trash2, Calendar, Edit3, Save, X, ExternalLink, Bell, Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Timestamp } from 'firebase/firestore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LeadProps {
  lead: {
    id: string;
    name: string;
    phone: string;
    benefitType: string;
    status: string;
    notes: string;
    source?: string;
    createdAt: any;
    reminderDate?: any;
  };
}

const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-blue-100 text-blue-700 border-blue-200',
  em_contato: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  concluido: 'bg-green-100 text-green-700 border-green-200',
  arquivado: 'bg-gray-100 text-gray-600 border-gray-200'
};

export function LeadRow({ lead }: LeadProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(lead.notes || '');
  const [status, setStatus] = useState(lead.status);
  const [source, setSource] = useState(lead.source || 'website');
  const [reminder, setReminder] = useState(lead.reminderDate ? 
    new Date(lead.reminderDate.toDate()).toISOString().slice(0, 16) : ''
  );

  const handleUpdate = async () => {
    try {
      const updateData: any = {
        notes,
        status,
        source,
        updatedAt: serverTimestamp()
      };

      if (reminder) {
        updateData.reminderDate = Timestamp.fromDate(new Date(reminder));
      } else {
        updateData.reminderDate = null;
      }

      await updateDoc(doc(db, 'leads', lead.id), updateData);
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${lead.id}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) return;
    try {
      await deleteDoc(doc(db, 'leads', lead.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${lead.id}`);
    }
  };

  const formattedDate = lead.createdAt?.toDate?.() 
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(lead.createdAt.toDate())
    : 'Data não disponível';

  const reminderDate = lead.reminderDate?.toDate?.() ? lead.reminderDate.toDate() : null;
  const isOverdue = reminderDate && reminderDate < new Date();
  const formattedReminder = reminderDate 
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(reminderDate)
    : null;

  const whatsappUrl = `https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.name}, sou da Consultoria AML. Vi seu interesse em ${lead.benefitType}. Como posso te ajudar?`)}`;

  return (
    <>
      <tr className="hover:bg-gray-50/80 transition-all group">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border text-center transition-all hover:ring-2 hover:ring-brand-blue/20",
                STATUS_COLORS[status] || STATUS_COLORS.novo
              )}
              title="Clique para editar status"
            >
              {status.replace('_', ' ')}
            </button>
            {formattedReminder && (
              <div className={cn(
                "flex items-center gap-1 text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded border",
                isOverdue 
                  ? "bg-red-50 text-red-500 border-red-100" 
                  : "bg-brand-blue/5 text-brand-blue border-brand-blue/10"
              )}>
                <Clock size={10} />
                {formattedReminder.split(',')[0]}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-bold text-gray-900">{lead.name}</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{lead.source}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
          {lead.phone}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-blue">
          {lead.benefitType}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
          {formattedDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
              title="WhatsApp"
            >
              <MessageSquare size={18} />
            </a>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "p-2 rounded-lg transition-all relative",
                isEditing ? "bg-brand-blue/10 text-brand-blue" : "text-gray-400 hover:bg-gray-100",
                formattedReminder && "text-brand-blue"
              )}
              title="Editar"
            >
              <Edit3 size={18} />
              {formattedReminder && <div className="absolute top-1 right-1 w-2 h-2 bg-brand-blue rounded-full border-2 border-white" />}
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 text-gray-300 hover:text-red-500 transition-all"
              title="Excluir"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isEditing && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50/50"
          >
            <td colSpan={6} className="px-6 py-4">
              <div className="flex flex-col xl:flex-row gap-6 items-start">
                <div className="flex-1 w-full space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Observações</p>
                  <textarea 
                    className="w-full text-sm bg-white border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all min-h-[100px]"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Adicione detalhes sobre o atendimento..."
                  />
                </div>
                
                <div className="w-full xl:w-72 space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                      <Bell size={10} /> Agendar Follow-up
                    </p>
                    <input 
                      type="datetime-local"
                      className="w-full text-sm font-bold border border-gray-200 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      value={reminder}
                      onChange={e => setReminder(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Origem</p>
                    <select 
                      className="w-full text-sm font-bold border border-gray-200 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      value={source}
                      onChange={e => setSource(e.target.value)}
                    >
                      <option value="website">Website</option>
                      <option value="instagram">Instagram</option>
                      <option value="social_media">Redes Sociais</option>
                      <option value="referral">Indicação</option>
                      <option value="google">Google</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status do Lead</p>
                    <div className="relative">
                      <select 
                        className="w-full text-sm font-bold border border-gray-200 rounded-xl p-3 bg-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all appearance-none cursor-pointer"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                      >
                        <option value="novo">Novo</option>
                        <option value="em_contato">Em Contato</option>
                        <option value="concluido">Concluído</option>
                        <option value="arquivado">Arquivado</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleUpdate}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-gray-200"
                    >
                      <Save size={16} /> Salvar
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="p-3 bg-white border border-gray-200 text-gray-400 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}
