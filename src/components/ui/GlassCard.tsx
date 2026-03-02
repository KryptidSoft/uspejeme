import React from 'react';

export interface GlassCardProps {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
  style?: React.CSSProperties; // Přidáno pro podporu inline stylů
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, onClick, style }) => {
  return (
    // Použijeme šablonový řetězec pro spojení tříd
    <div className={`glass-card ${className}`} onClick={onClick} style={style}>
      {children}
    </div>
  );
};