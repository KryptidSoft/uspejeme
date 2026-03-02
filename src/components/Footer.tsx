import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Trash2, ShieldAlert, Send } from 'lucide-react';
import { clearAppStorage } from '../utils/localStorage';

interface FooterProps {
  onShowDisclaimer: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowDisclaimer }) => {
  const lastUpdate = "02/2026";

  const handleReset = () => {
    if (window.confirm("Opravdu chcete smazat všechna uložená data? Tato akce je nevratná.")) {
      clearAppStorage();
      window.location.reload();
    }
  };

  return (
    <footer className="main-footer">
      <div className="footer-socials">
        <a href="#" className="social-icon-link" title="Facebook"><Facebook size={22} /></a>
        <a href="#" className="social-icon-link" title="Twitter"><Twitter size={22} /></a>
        <a href="#" className="social-icon-link" title="LinkedIn"><Linkedin size={22} /></a>
        <a href="https://t.me/rozhodni" className="social-icon-link" title="Telegram"><Send size={22} /></a>
        <a href="mailto:info@rozhodni.cz" className="social-icon-link" title="Email"><Mail size={22} /></a>
      </div>

      <div className="footer-actions">
        <button className="text-link" onClick={onShowDisclaimer}>
          <ShieldAlert size={16} color="var(--primary)" />
          Právní upozornění
        </button>

        <button className="text-link danger" onClick={handleReset}>
          <Trash2 size={16} />
          Smazat data
        </button>
      </div>

      <div className="build-info">
        Poslední aktualizace výpočtových modelů: <strong>{lastUpdate}</strong>
      </div>

      <p className="copy">
        © 2026 Rozhodni.cz | Verze 1.1.0 – Navigátor pro moderní OSVČ
      </p>
    </footer>
  );
};