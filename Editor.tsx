import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Send, Grid, Type, Image as ImageIcon } from 'lucide-react';
import { Block, BlockType, PuzzleBlock as PuzzleBlockType, User } from '../types';
import { MorphingCard } from './MorphingCard';
import { PuzzleBlock } from './blocks/PuzzleBlock';
import { generateCrosswordFromContext } from '../services/geminiService';

interface EditorProps {
  user: User;
  blocks: Block[];
  onBack: () => void;
  onAddBlock: (block: Block) => void;
  onPublish: () => void;
}

export const Editor: React.FC<EditorProps> = ({ user, blocks, onBack, onAddBlock, onPublish }) => {
  const [isGeneratingPuzzle, setIsGeneratingPuzzle] = useState(false);

  const handleGeneratePuzzle = async () => {
    setIsGeneratingPuzzle(true);
    
    // Create a temporary loading block
    const tempId = `puzzle-${Date.now()}`;
    const loadingBlock: PuzzleBlockType = {
      id: tempId,
      timestamp: Date.now(),
      type: BlockType.PUZZLE,
      data: null,
      isGenerating: true
    };
    onAddBlock(loadingBlock);

    // Aggregate text for context
    const textContext = blocks
      .filter(b => b.type === BlockType.TEXT)
      .map(b => (b as any).content)
      .join(" ");

    const puzzleData = await generateCrosswordFromContext(textContext || "Sunday Morning Coffee Relax");
    
    const finishedBlock: PuzzleBlockType = {
        id: tempId,
        timestamp: Date.now(),
        type: BlockType.PUZZLE,
        data: puzzleData,
        isGenerating: false
    };

    setIsGeneratingPuzzle(false);
    onAddBlock(finishedBlock);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-32">
      {/* Navigation Bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex justify-between items-center"
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-stone-200 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <motion.h2 layoutId="header-title" className="sans font-bold text-xl text-stone-900">
              The Sunday Paper
            </motion.h2>
            <p className="text-xs font-serif text-stone-500">Drafting Issue #42 &bull; {user.groupCode}</p>
          </div>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={handleGeneratePuzzle}
             disabled={isGeneratingPuzzle}
             className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase hover:bg-blue-100 transition-colors disabled:opacity-50"
           >
             {isGeneratingPuzzle ? (
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
               >
                 <Sparkles size={14} />
               </motion.div>
             ) : (
               <Sparkles size={14} />
             )}
             {isGeneratingPuzzle ? "Crafting..." : "Add Puzzle"}
           </button>

           <button 
             onClick={onPublish}
             className="flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-full text-sm font-bold hover:bg-stone-800 transition-colors"
           >
             Publish
             <Send size={14} />
           </button>
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Intro */}
        <div className="text-center py-12 border-b border-stone-200 mb-12">
          <h1 className="sans text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-stone-900">
            WEEK 42
          </h1>
          <p className="font-serif text-xl italic text-stone-500">
            A collection of moments from the {user.groupCode} circle.
          </p>
        </div>

        {/* Content Blocks */}
        <AnimatePresence mode="popLayout">
          {blocks.length === 0 && (
             <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-20 text-stone-300 font-serif italic"
             >
                The page is empty. Go back to the shoebox to gather moments.
             </motion.div>
          )}

          {blocks.map((block) => (
            <motion.div
              key={block.id}
              layout
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {block.type === BlockType.TEXT && (
                <div className="group relative">
                    <p className="font-serif text-lg md:text-xl leading-relaxed text-stone-800 whitespace-pre-wrap">
                      {(block as any).content}
                    </p>
                </div>
              )}

              {block.type === BlockType.IMAGE && (
                <figure className="my-8">
                  <div className="overflow-hidden rounded-sm shadow-sm">
                    <img 
                      src={(block as any).url} 
                      alt="Memory" 
                      className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-in-out" 
                    />
                  </div>
                  {(block as any).caption && (
                    <figcaption className="mt-3 text-center sans text-xs font-medium text-stone-400 uppercase tracking-widest">
                      {(block as any).caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {block.type === BlockType.PUZZLE && (
                <div className="my-12">
                   {(block as any).isGenerating ? (
                     <div className="w-full h-64 bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-stone-400">
                        Generating Puzzle...
                     </div>
                   ) : (
                     <PuzzleBlock data={(block as any).data} />
                   )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Footer */}
        <div className="pt-20 pb-10 text-center border-t border-stone-200 mt-20">
            <div className="w-8 h-8 bg-stone-900 rounded-full mx-auto mb-4" />
            <p className="sans text-xs font-bold uppercase tracking-widest text-stone-400">
                Printed on Sunday &bull; Curated by {user.name}
            </p>
        </div>

      </div>
    </div>
  );
};
