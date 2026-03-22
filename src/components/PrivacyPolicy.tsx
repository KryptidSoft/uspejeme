import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fade-in" style={{ maxWidth: '850px', margin: '0 auto', padding: '40px 20px', color: '#fff' }}>
      
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'rgba(255,255,255,0.5)', 
          cursor: 'pointer', 
          marginBottom: '20px',
          padding: 0,
          fontSize: '0.9rem',
          textDecoration: 'underline'
        }}
      >
        Zpět na předchozí stránku
      </button>

      <GlassCard style={{ padding: '50px', borderRadius: '4px' }}>
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px', paddingBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', margin: '0 0 10px 0', letterSpacing: '0.5px' }}>
            ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.5, margin: 0 }}>
            Verze dokumentu: 2026-03-A | Datum poslední revize: 20. března 2026
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', textAlign: 'justify', fontSize: '0.95rem', lineHeight: '1.6' }}>
          
          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>1. Úvodní ustanovení</h2>
            <p>
              Tento dokument stanovuje zásady zpracování a ochrany osobních údajů uživatelů webové aplikace. 
              Provozovatel klade maximální důraz na soukromí a technické zabezpečení dat. Aplikace je navržena 
              architekturou "Local-First", což znamená, že primární zpracování dat probíhá na straně klienta.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>2. Rozsah zpracovávaných údajů</h2>
            <p>
              Provozovatel prohlašuje, že neshromažďuje, neukládá ani nezpracovává na svých serverech žádná finanční 
              ani osobní data vložená uživatelem do kalkulačních modulů. Veškeré údaje vložené do formulářů jsou 
              zpracovávány výhradně v rámci operační paměti prohlížeče uživatele nebo v jeho lokálním úložišti.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>3. Reklamní systém a třetí strany</h2>
            <p>
              Za účelem financování provozu této bezplatné aplikace je využívána reklamní síť <strong>Aads.com</strong> (Anonymous Ads). 
              Tato síť byla zvolena pro svou vysokou úroveň ochrany soukromí. Na rozdíl od konvenčních systémů 
              (např. Google AdSense) tento systém:
            </p>
            <ul style={{ marginTop: '10px' }}>
              <li>Neprovádí identifikaci uživatele napříč různými webovými stránkami (Cross-Site Tracking).</li>
              <li>Nepoužívá sledovací soubory cookies pro účely profilování uživatele.</li>
              <li>Zobrazuje inzerci na základě kontextu obsahu, nikoliv na základě historie chování uživatele.</li>
              <li>Nevyžaduje po uživateli zadávání e-mailové adresy, jména ani jiných identifikačních údajů.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>4. Technické ukládání dat (LocalStorage)</h2>
            <p>
              Webová aplikace využívá mechanismus <strong>LocalStorage</strong> pro uchování uživatelského nastavení 
              mezi jednotlivými relacemi. Toto úložiště je plně pod kontrolou uživatele. Provozovatel nemá 
              k těmto datům technický přístup. Uživatel má právo tato data kdykoliv odstranit prostřednictvím 
              nastavení prohlížeče nebo dedikovanou funkcí přímo v rozhraní aplikace použitím ikonky Smazat data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '10px', textTransform: 'uppercase' }}>5. Kontaktní údaje</h2>
            <p>
              V případě dotazů týkajících se technického zabezpečení nebo ochrany soukromí se lze obrátit na 
              správce na e-mailové adrese: <strong>KryptidSoft@gmail.com</strong>
            </p>
          </section>

      <section style={{ marginBottom: '25px' }}>
        <h3>Změny zásad</h3>
        <p>Tyto zásady mohou být kdykoliv aktualizovány, aby odpovídaly aktuálním technickým a právním požadavkům.</p>
      </section>

      <footer style={{ marginTop: '40px', fontSize: '0.85rem', opacity: 0.7, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
        Poslední aktualizace: 03/2026 | Uspejeme.cz
      </footer>

        </div>
      </GlassCard>
    </div>
  );
};