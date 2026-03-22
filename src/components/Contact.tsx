import React from 'react';
import { Mail, Send, Globe, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="legal-content" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Kontakt</h1>
      <p>Máte dotaz, nápad na vylepšení nebo s námi chcete spolupracovat? Jsme na příjmu.</p>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <Mail className="mb-2" />
          <h3>Email</h3>
          <p><a href="mailto:KryptidSoft@gmail.com">KryptidSoft@gmail.com</a></p>
        </div>

        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
          <Globe className="mb-2" />
          <h3>Web</h3>
		  <p><a href="www.uspejeme.cz">www.uspejeme.cz</a></p>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.7 }}>
        <p><MapPin size={16} style={{ verticalAlign: 'middle' }} /> Praha, Česká republika | Působíme online po celém světě.</p>
      </div>
    </div>
  );
};