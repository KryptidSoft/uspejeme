import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="main-header" onClick={onLogoClick}>
      <h1>
        Rozhodni<span style={{ color: 'var(--accent)' }}>.cz</span>
      </h1>
      <p className="subtitle">Finanční navigátor pro OSVČ</p>
    </header>
  );
};