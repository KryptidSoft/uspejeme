import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Send, Trash2 } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { clearAppStorage } from '../utils/localStorage';

interface FooterProps {
  onShowDisclaimer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  const lastUpdate = "04/2026";

  const handleReset = () => {
    if (window.confirm("Opravdu chcete smazat všechna uložená data? Tato akce je nevratná.")) {
      clearAppStorage();
      window.location.reload();
    }
  };

  return (
    <footer className="main-footer">
      <div className="footer-grid">
        
        {/* 1. PROJEKT */}
        <div className="footer-col">
          <h4>Projekt</h4>
          <Link to="/o-nas" className="footer-item">O nás</Link>
          <Link to="/clanky" className="footer-item">Vzdělávání</Link>
          <Link to="/mapa-stranek" className="footer-item">Mapa stránek</Link>
          <Link to="/kontakt" className="footer-item">Kontakt</Link>
        </div>

        {/* 2. NÁSTROJE */}
        <div className="footer-col">
          <h4>Nástroje</h4>
          <Link to="/nastroje" className="footer-item">Faktury a platby</Link>
          <Link to="/audit" className="footer-item">Audit stability</Link>
          <Link to="/strategie" className="footer-item">Strategie a růst</Link>
          <Link to="/investice" className="footer-item">Investice a ROI</Link>
          <Link to="/kalendar" className="footer-item">Termíny 2026</Link>
        </div>

        {/* 3. PRÁVNÍ & SPRÁVA */}
        <div className="footer-col">
          <h4>Právní</h4>
          <Link to="/privacy" className="footer-item">Ochrana údajů</Link>
          <Link to="/terms" className="footer-item">Právní podmínky</Link>
          <button onClick={onShowDisclaimer} className="footer-item">
            Právní upozornění
          </button>
          <button onClick={handleReset} className="footer-item danger">
            <Trash2 size={14} style={{ marginRight: '8px' }} /> Smazat data
          </button>
        </div>

        {/* 4. KOMUNITA */}
        <div className="footer-col">
          <h4>Komunita</h4>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook"><Facebook size={18} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Twitter"><Twitter size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn"><Linkedin size={18} /></a>
            <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer" className="social-link" title="Telegram"><Send size={18} /></a>
            <a href="mailto:KryptidSoft@gmail.com" className="social-link" title="Email"><Mail size={18} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="build-info">
          Poslední aktualizace: <strong>{lastUpdate}</strong>
        </div>
        <p className="copy">
          © 2026 Uspejeme.cz | Vytvořeno pro komunitu svobodných profesionálů.
        </p>
      </div>
    </footer>
  );
};