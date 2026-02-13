import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { BlockType, Issue } from '../types';
import { PuzzleBlock } from './blocks/PuzzleBlock';

interface NewsletterProps {
  issue: Issue;
  onBack: () => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ issue, onBack }) => {
  
  const handleShareEmail = () => {
    const subject = `Sunday Paper: Issue #${issue.weekNumber}`;
    const body = `Hey! Here is our weekly Sunday Paper for circle ${issue.circleCode}.\n\n(In a real app, this would be a link to the web version of the newsletter).`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4 overflow-y-auto">
      {/* Email Container simulation */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-none border-t-4 border-stone-900"
      >
        
        {/* Navigation within the viewer */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <button onClick={onBack} className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-sm font-sans font-bold uppercase">
                <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-3">
                <button onClick={handleShareEmail} className="text-stone-400 hover:text-stone-900 transition-colors" title="Share via Email">
                    <Mail size={18} />
                </button>
                <span className="text-xs text-stone-400 font-serif italic hidden sm:inline">Viewing Web Version</span>
            </div>
        </div>

        {/* Email Header */}
        <div className="p-8 md:p-12 text-center border-b border-gray-100">
            <h1 className="sans text-4xl md:text-6xl font-extrabold tracking-tighter text-stone-900 mb-2">
                SUNDAY PAPER
            </h1>
            <div className="flex justify-center items-center gap-3 text-xs sans font-bold uppercase tracking-widest text-stone-400">
                <span>Issue #{issue.weekNumber}</span>
                <span>&bull;</span>
                <span>{issue.circleCode}</span>
                <span>&bull;</span>
                <span>{new Date(issue.publishDate).toLocaleDateString()}</span>
            </div>
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-100">
            {issue.sections.map((section, idx) => (
                <div key={idx} className="p-8 md:p-12">
                    {/* User Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center font-serif font-bold text-stone-500 text-lg">
                            {section.userName.charAt(0)}
                        </div>
                        <div>
                            <h3 className="sans font-bold text-lg text-stone-900">{section.userName}'s Week</h3>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        {section.blocks.map(block => (
                            <div key={block.id}>
                                {block.type === BlockType.TEXT && (
                                    <p className="font-serif text-lg text-stone-800 leading-relaxed whitespace-pre-wrap">
                                        {(block as any).content}
                                    </p>
                                )}
                                {block.type === BlockType.IMAGE && (
                                    <div className="rounded-lg overflow-hidden bg-stone-100">
                                        <img 
                                            src={(block as any).url} 
                                            alt="User content" 
                                            className="w-full h-auto object-cover"
                                        />
                                        {(block as any).caption && (
                                            <p className="p-3 text-center sans text-xs font-bold text-stone-400 uppercase">
                                                {(block as any).caption}
                                            </p>
                                        )}
                                    </div>
                                )}
                                {block.type === BlockType.PUZZLE && (block as any).data && (
                                     <div className="bg-stone-50 p-6 rounded border border-stone-200">
                                         <PuzzleBlock data={(block as any).data} />
                                     </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="bg-stone-900 text-stone-400 p-12 text-center">
            <p className="font-serif italic mb-4">"The details are not the details. They make the design."</p>
            <p className="sans text-xs font-bold uppercase tracking-widest">
                Generated by Sunday Paper App
            </p>
        </div>

      </motion.div>
    </div>
  );
};
