import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`glass-card ${onClick ? 'clickable' : ''} ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};