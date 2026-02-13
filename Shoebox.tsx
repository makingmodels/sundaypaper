import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Send, X, LogOut, Archive as ArchiveIcon } from 'lucide-react';
import { Block, BlockType, TextBlock, ImageBlock, User } from '../types';

interface ShoeboxProps {
  user: User;
  blocks: Block[];
  onAddBlock: (block: Block) => void;
  onTransition: () => void;
  onLogout: () => void;
  onOpenArchive: () => void;
}

export const Shoebox: React.FC<ShoeboxProps> = ({ user, blocks, onAddBlock, onTransition, onLogout, onOpenArchive }) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const timestamp = Date.now();
    const id = `block-${timestamp}`;

    if (selectedImage) {
      const newBlock: ImageBlock = {
        id,
        timestamp,
        type: BlockType.IMAGE,
        url: selectedImage,
        caption: inputValue
      };
      onAddBlock(newBlock);
      setSelectedImage(null);
      setInputValue('');
    } else if (inputValue.trim()) {
      const newBlock: TextBlock = {
        id,
        timestamp,
        type: BlockType.TEXT,
        content: inputValue
      };
      onAddBlock(newBlock);
      setInputValue('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsFocused(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 max-w-2xl mx-auto">
      
      {/* Header */}
      <motion.div 
        layoutId="header-title"
        className="absolute top-12 left-6 z-10"
      >
        <h1 className="sans text-4xl font-extrabold tracking-tighter text-stone-900">Sunday Paper.</h1>
        <div className="flex items-center gap-2 mt-1 text-stone-500">
           <p className="font-serif italic">Hey, {user.name}.</p>
           <span className="text-xs sans uppercase bg-stone-200 px-2 py-0.5 rounded text-stone-600 font-bold">{user.groupCode}</span>
        </div>
      </motion.div>

      {/* Top Right Controls */}
      <div className="absolute top-12 right-6 flex gap-2">
          <button 
            onClick={onOpenArchive}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2"
            title="Archive"
          >
            <ArchiveIcon size={18} />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
      </div>

      {/* Input Area - The "Dump Button" Morph */}
      <motion.div 
        layoutId="input-container"
        className={`w-full max-w-xl transition-all duration-500 ease-out ${isFocused || inputValue ? 'scale-105' : 'scale-100'}`}
      >
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-stone-100 p-2">
          
          {selectedImage && (
            <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden bg-stone-100">
               <img src={selectedImage} alt="Upload preview" className="w-full h-full object-cover" />
               <button 
                 onClick={() => setSelectedImage(null)}
                 className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
               >
                 <X size={16} />
               </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col relative">
            <textarea
              className="w-full p-4 text-xl font-serif text-stone-800 placeholder:text-stone-300 resize-none focus:outline-none bg-transparent min-h-[120px]"
              placeholder={`What happened this week, ${user.name}?`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(!!inputValue || !!selectedImage)}
            />
            
            <div className="flex justify-between items-center px-4 pb-2 mt-2">
               <div className="flex gap-2">
                 <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
                 >
                   <Image size={20} />
                 </button>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept="image/*"
                   onChange={handleImageUpload}
                 />
               </div>
               
               <button 
                 type="submit"
                 disabled={!inputValue && !selectedImage}
                 className="flex items-center gap-2 bg-stone-900 text-white px-6 py-2 rounded-full sans font-medium text-sm hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-900 transition-all active:scale-95"
               >
                 Drop in Shoebox
                 <Send size={14} />
               </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* The Stack (Visual indication of saved items) */}
      <AnimatePresence>
        {blocks.length > 0 && (
           <motion.div 
             className="fixed bottom-8 right-8 cursor-pointer group"
             initial={{ y: 100, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 100, opacity: 0 }}
             onClick={onTransition}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
           >
             <div className="relative">
               {/* Stack effect layers */}
               <div className="absolute inset-0 bg-stone-800 rounded-lg transform rotate-6 translate-x-2 translate-y-2 opacity-20 w-16 h-16 pointer-events-none" />
               <div className="absolute inset-0 bg-stone-800 rounded-lg transform -rotate-3 translate-x-1 translate-y-1 opacity-40 w-16 h-16 pointer-events-none" />
               
               <div className="bg-stone-900 text-white w-16 h-16 rounded-lg shadow-2xl flex items-center justify-center relative z-10">
                 <span className="sans font-bold text-xl">{blocks.length}</span>
               </div>
               
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs sans py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                 Open Editor
               </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
