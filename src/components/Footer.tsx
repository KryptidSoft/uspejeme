import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Trash2, ShieldAlert } from 'lucide-react';
import { clearAppStorage } from '../utils/localStorage';

interface FooterProps {
  onShowDisclaimer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  // Datum buildu pro rok 2026
  const lastUpdate = "02/2026"; 

  const handleReset = () => {
    if (window.confirm("Opravdu chcete smazat všechna uložená data z kalkulaček? Tato akce je nevratná.")) {
      clearAppStorage();
      window.location.reload();
    }
  };

  return (
    <footer className="main-footer">
      {/* Sociální sítě se zvýrazněním */}
      <div className="footer-socials" style={{ display: 'flex', gap: '25px', marginBottom: '25px' }}>
        <a href="#" className="social-icon-link" title="Facebook"><Facebook size={22} /></a>
        <a href="#" className="social-icon-link" title="Instagram"><Instagram size={22} /></a>
        <a href="#" className="social-icon-link" title="LinkedIn"><Linkedin size={22} /></a>
        <a href="mailto:info@rozhodni.cz" className="social-icon-link" title="Email"><Mail size={22} /></a>
      </div>
      
      <div className="footer-actions" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button className="text-link" onClick={onShowDisclaimer} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <ShieldAlert size={16} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          Právní upozornění
        </button>
        
        <button className="text-link danger" onClick={handleReset} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Trash2 size={16} style={{ marginRight: '6px' }} />
          Smazat data
        </button>
      </div>

      <div className="build-info" style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginBottom: '10px' }}>
        Poslední aktualizace výpočtových modelů: <strong>{lastUpdate}</strong>
      </div>
      
      <p className="copy" style={{ color: 'var(--text-dim)', fontSize: '0.8rem', margin: 0 }}>
        © 2026 Rozhodni.cz | Verze 1.1.0 – Navigátor pro moderní OSVČ
      </p>
    </footer>
  );
};