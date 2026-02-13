import React from 'react';
import { motion } from 'framer-motion';

interface MorphingCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  layoutId?: string;
}

export const MorphingCard: React.FC<MorphingCardProps> = ({ 
  id, 
  children, 
  className = "", 
  onClick,
  layoutId 
}) => {
  return (
    <motion.div
      layoutId={layoutId || `card-${id}`}
      className={`bg-white border border-gray-200 shadow-sm overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 350, 
        damping: 25,
        layout: { duration: 0.3 }
      }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
