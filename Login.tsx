import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlusCircle } from 'lucide-react';
import { User } from '../types';
import { generateCircleCode } from '../services/storage';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [groupCode, setGroupCode] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && groupCode.trim() && email.trim()) {
      onLogin({ 
        name: name.trim(), 
        email: email.trim(),
        groupCode: groupCode.trim().toUpperCase() 
      });
    }
  };

  const handleCreateCircle = () => {
    const code = generateCircleCode();
    setGroupCode(code);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f8f8f6]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.h1 
            layoutId="header-title"
            className="sans text-5xl font-extrabold tracking-tighter text-stone-900 mb-4"
          >
            Sunday Paper.
          </motion.h1>
          <p className="font-serif text-stone-500 italic">
            A digital scrapbook for your inner circle.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                Who are you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-transparent border-b border-stone-300 py-2 text-xl font-serif text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
                autoFocus
              />
            </div>

            <div className="group">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent border-b border-stone-300 py-2 text-xl font-serif text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>

            <div className="group relative">
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">
                Circle Code
              </label>
              <div className="flex gap-2">
                  <input
                    type="text"
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    placeholder="e.g. FAM-202"
                    className="w-full bg-transparent border-b border-stone-300 py-2 text-xl font-serif text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-900 transition-colors uppercase"
                  />
                  {/* Generator Button */}
                  {!groupCode && (
                    <button
                        type="button"
                        onClick={handleCreateCircle}
                        className="absolute right-0 bottom-2 text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1 bg-stone-100 px-2 py-1 rounded"
                    >
                        <PlusCircle size={12} />
                        New Circle
                    </button>
                  )}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!name || !groupCode || !email}
            type="submit"
            className="w-full bg-stone-900 text-white py-4 rounded-lg flex items-center justify-center gap-2 sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
          >
            Enter Shoebox
            <ArrowRight size={16} />
          </motion.button>
        </form>
      </motion.div>

      <div className="absolute bottom-8 text-xs text-stone-400 font-serif italic text-center leading-relaxed">
        Issue #42 &bull; Printing Sunday 8PM <br/>
        <span className="opacity-50">Join an existing circle or create a new one to start.</span>
      </div>
    </div>
  );
};
