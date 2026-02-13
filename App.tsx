import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AppPhase, Block, User, Issue } from './types';
import { Shoebox } from './components/Shoebox';
import { Editor } from './components/Editor';
import { Login } from './components/Login';
import { Archive } from './components/Archive';
import { Newsletter } from './components/Newsletter';
import { saveDraft, getDraft, publishIssue } from './services/storage';

export default function App() {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.AUTH);
  const [user, setUser] = useState<User | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishComplete, setPublishComplete] = useState(false);

  // Load user from session if available
  useEffect(() => {
    const savedUser = localStorage.getItem('sunday_paper_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        const drafts = getDraft(parsedUser);
        setBlocks(drafts);
        setPhase(AppPhase.SHOEBOX);
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('sunday_paper_user', JSON.stringify(newUser));
    const drafts = getDraft(newUser);
    setBlocks(drafts);
    setPhase(AppPhase.SHOEBOX);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sunday_paper_user');
    setBlocks([]);
    setPhase(AppPhase.AUTH);
  };

  const handleAddBlock = (block: Block) => {
    if (!user) return;
    const newBlocks = [...blocks, block];
    setBlocks(newBlocks);
    saveDraft(user, newBlocks);
  };

  const handlePublish = () => {
    if (!user) return;
    setPhase(AppPhase.PUBLISHED);
    setIsPublishing(true);
    setPublishComplete(false);
    
    // Use the storage service to consolidate content
    setTimeout(() => {
        publishIssue(user, blocks);
        setBlocks([]); // Clear local state, storage already cleared by service
        setIsPublishing(false);
        setPublishComplete(true);
    }, 2000);
  };

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setPhase(AppPhase.NEWSLETTER);
  };

  return (
    <div className="bg-[#f8f8f6] min-h-screen text-stone-900 selection:bg-stone-200 overflow-x-hidden">
      <AnimatePresence mode="wait">
        
        {phase === AppPhase.AUTH && (
          <motion.div
            key="auth"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        )}

        {phase === AppPhase.SHOEBOX && user && (
          <motion.div
            key="shoebox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Shoebox 
              user={user}
              blocks={blocks} 
              onAddBlock={handleAddBlock} 
              onTransition={() => setPhase(AppPhase.EDITOR)} 
              onLogout={handleLogout}
              onOpenArchive={() => setPhase(AppPhase.ARCHIVE)}
            />
          </motion.div>
        )}

        {phase === AppPhase.EDITOR && user && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Editor 
              user={user}
              blocks={blocks}
              onBack={() => setPhase(AppPhase.SHOEBOX)}
              onAddBlock={handleAddBlock}
              onPublish={handlePublish}
            />
          </motion.div>
        )}
        
        {phase === AppPhase.PUBLISHED && (
            <motion.div
                key="published"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 text-white p-6 text-center"
            >
                <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="max-w-md w-full"
                >
                    <h1 className="sans text-4xl font-bold tracking-tighter mb-6">
                        {isPublishing ? "Hot off the press..." : "Sent to the Press."}
                    </h1>
                    
                    <p className="font-serif text-stone-400 italic mb-8">
                      {isPublishing ? (
                        <>Compiling {user?.groupCode}...<br/>Ink is drying...</>
                      ) : (
                         <>
                           Delivery successful.<br/>
                           <span className="text-sm not-italic mt-2 block opacity-70">
                             A copy has been sent to {user?.email}
                           </span>
                         </>
                      )}
                    </p>

                    {publishComplete && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setPhase(AppPhase.ARCHIVE)}
                            className="w-full bg-white text-stone-900 py-4 rounded-lg flex items-center justify-center gap-2 sans font-bold hover:bg-stone-200 transition-colors"
                        >
                            Visit Newsstand
                            <ArrowRight size={16} />
                        </motion.button>
                    )}
                </motion.div>
            </motion.div>
        )}

        {phase === AppPhase.ARCHIVE && user && (
            <motion.div
                key="archive"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
            >
                <Archive 
                    user={user} 
                    onBack={() => setPhase(AppPhase.SHOEBOX)} 
                    onSelectIssue={handleViewIssue}
                />
            </motion.div>
        )}

        {phase === AppPhase.NEWSLETTER && selectedIssue && (
             <motion.div
                key="newsletter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
             >
                 <Newsletter 
                    issue={selectedIssue} 
                    onBack={() => setPhase(AppPhase.ARCHIVE)} 
                 />
             </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
