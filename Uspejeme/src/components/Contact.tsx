import React from 'react';
import { Mail, Globe, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="article-container">
      <h1 className="article-title">Kontakt</h1>
      <p className="article-content">
        Máte dotaz, nápad na vylepšení nebo s námi chcete spolupracovat? Jsme na příjmu.
      </p>

      <div className="info-grid" style={{ marginTop: '40px' }}>
        <div className="info-box">
          <Mail className="mb-2" />
          <h3>Email</h3>
          <p>
            <a href="mailto:KryptidSoft@gmail.com">KryptidSoft@gmail.com</a>
          </p>
        </div>

        <div className="info-box">
          <Globe className="mb-2" />
          <h3>Web</h3>
          <p>
            <a href="https://www.uspejeme.cz" target="_blank" rel="noopener noreferrer">
              www.uspejeme.cz
            </a>
          </p>
        </div>
      </div>

      <div className="article-meta" style={{ marginTop: '40px', textAlign: 'center', opacity: 0.7 }}>
        <p>
          <MapPin size={16} style={{ verticalAlign: 'middle' }} /> Praha, Česká republika | Působíme online po celém světě.
        </p>
      </div>
    </div>
  );
};