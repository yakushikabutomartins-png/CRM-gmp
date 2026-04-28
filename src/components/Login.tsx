import React from 'react';
import { signInWithGoogle } from '../lib/firebase';
import { LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center border-t-8 border-brand-blue"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-brand-blue/10 p-4 rounded-3xl text-gray-900 border border-brand-blue/20">
            <LogIn size={48} />
          </div>
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Consultoria<span className="text-brand-blue">AML</span></h1>
        <p className="text-gray-500 mb-8 font-medium">Acesso exclusivo para Adilsom e equipe.</p>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Entrar com Google
        </button>
        
        <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest font-black">
          Portal do Consultor v1.0
        </p>
      </motion.div>
    </div>
  );
}
