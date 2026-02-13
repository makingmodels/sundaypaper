import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Issue, User } from '../types';
import { getIssues } from '../services/storage';

interface ArchiveProps {
  user: User;
  onBack: () => void;
  onSelectIssue: (issue: Issue) => void;
}

export const Archive: React.FC<ArchiveProps> = ({ user, onBack, onSelectIssue }) => {
  const issues = getIssues(user.groupCode);

  return (
    <div className="min-h-screen bg-stone-100 p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
            <button 
                onClick={onBack}
                className="p-2 hover:bg-stone-200 rounded-full transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="sans text-3xl font-bold text-stone-900">Newsstand</h1>
                <p className="font-serif text-stone-500 italic">{user.groupCode} Weekly Editions</p>
            </div>
        </div>

        {issues.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50/50">
                <BookOpen size={48} className="mx-auto text-stone-300 mb-4" />
                <h3 className="sans font-bold text-stone-400 text-lg">The stand is empty.</h3>
                <p className="font-serif text-stone-400 mt-2">Publish your first Sunday Paper to see it here.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
                {issues.map((issue, index) => {
                    // Extract a snippet for the "fake text"
                    const firstText = issue.sections[0]?.blocks.find(b => b.type === 'TEXT') as any;
                    const snippet = firstText ? firstText.content : "The week in review...";
                    
                    return (
                        <motion.div
                            key={issue.id}
                            initial={{ y: 40, opacity: 0, rotateX: 10 }}
                            animate={{ y: 0, opacity: 1, rotateX: 0 }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            onClick={() => onSelectIssue(issue)}
                            className="relative group cursor-pointer perspective-1000"
                        >
                            {/* Paper Shadow/Stack Effect */}
                            <div className="absolute top-2 left-2 w-full h-full bg-stone-300 rounded-sm shadow-sm transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                            <div className="absolute top-1 left-1 w-full h-full bg-stone-200 rounded-sm shadow-sm transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                            
                            {/* Main Newspaper Card */}
                            <div className="relative bg-[#fdfdfd] w-full aspect-[3/4] p-4 shadow-xl border border-stone-200 flex flex-col transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden">
                                
                                {/* Masthead */}
                                <div className="text-center border-b-2 border-stone-900 pb-2 mb-3">
                                    <h2 className="font-serif font-black text-3xl md:text-2xl lg:text-3xl text-stone-900 tracking-tight leading-none mb-1">
                                        Sunday
                                    </h2>
                                    <h2 className="font-serif font-black text-3xl md:text-2xl lg:text-3xl text-stone-900 tracking-tight leading-none">
                                        Paper.
                                    </h2>
                                </div>
                                
                                {/* Dateline */}
                                <div className="flex justify-between border-b border-stone-300 pb-1 mb-3 text-[10px] font-sans font-bold uppercase tracking-widest text-stone-500">
                                    <span>Vol. {issue.weekNumber}</span>
                                    <span>{new Date(issue.publishDate).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                                </div>

                                {/* Headline */}
                                <h3 className="font-serif font-bold text-lg leading-tight mb-2 text-stone-800 line-clamp-3">
                                    The Week of {issue.sections.map(s => s.userName).join(', ')}
                                </h3>

                                {/* Fake Content Columns */}
                                <div className="flex-1 overflow-hidden relative">
                                    <div className="text-[8px] text-justify text-stone-400 font-serif leading-relaxed columns-2 gap-3 opacity-60">
                                        {snippet.repeat(10)}
                                    </div>
                                    {/* Fade out bottom */}
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#fdfdfd] to-transparent" />
                                </div>

                                {/* Call to Action Overlay (visible on hover) */}
                                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors flex items-end justify-center pb-4">
                                     <span className="bg-stone-900 text-white text-[10px] font-bold uppercase px-3 py-1 tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                        Read Issue
                                     </span>
                                </div>

                            </div>
                        </motion.div>
                    );
                })}
            </div>
        )}

      </motion.div>
    </div>
  );
};
