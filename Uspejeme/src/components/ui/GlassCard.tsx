import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // ← upraveno
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", style, onClick }) => {
  return (
    <div 
      className={`glass-card ${className}`} 
      style={style} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};