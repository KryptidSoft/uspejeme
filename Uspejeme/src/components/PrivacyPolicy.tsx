import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="article-container fade-in">
	
	      {/* Lokální CSS jen pro tuto stránku */}
      <style>
        {`
          /* Zarovnání textu pro desktop */
          .article-content p {
            text-align: justify;
            line-height: 1.6;
          }

          /* Mobilní verze – vypnout justify */
          @media (max-width: 768px) {
            .article-content p {
              text-align: left;
            }
          }
        `}
      </style>
	  
      <div className="article-card">
        <h1 className="article-title">ZÁSADY OCHRANY OSOBNÍCH ÚDAJŮ</h1>
        
        <div className="article-meta">
          <span>Verze dokumentu: 2026-03-A | Datum poslední revize: 20. března 2026</span>
        </div>

        <div className="article-content">
          <h3>1. Úvodní ustanovení</h3>
          <p>
            Tento dokument stanovuje zásady zpracování a ochrany osobních údajů uživatelů webové aplikace. Provozovatel klade maximální důraz na soukromí a technické zabezpečení dat. Aplikace je navržena architekturou "Local-First", což znamená, že primární zpracování dat probíhá na straně klienta.
          </p>

          <h3>2. Rozsah zpracovávaných údajů</h3>
          <p>
            Provozovatel prohlašuje, že neshromažďuje, neukládá ani nezpracovává na svých serverech žádná finanční ani osobní data vložená uživatelem do kalkulačních modulů. Veškeré údaje vložené do formulářů jsou zpracovávány výhradně v rámci operační paměti prohlížeče uživatele nebo v jeho lokálním úložišti.
          </p>

          <h3>3. Reklamní systém a třetí strany</h3>
          <p>
            Za účelem financování provozu této bezplatné aplikace jsou využívány reklamní sítě Aads.com a EthicalAds.io. Tyto sítě byly zvoleny pro svou vysokou úroveň ochrany soukromí. Na rozdíl od konvenčních systémů:
          </p>
          <ul>
            <li>Neprovádí identifikaci uživatele napříč webovými stránkami.</li>
            <li>Nepoužívají sledovací soubory cookies pro účely profilování.</li>
            <li>Zobrazují inzerci na základě kontextu obsahu.</li>
            <li>Nevyžadují zadávání identifikačních údajů.</li>
          </ul>

          <h3>4. Technické ukládání dat (LocalStorage)</h3>
          <p>
            Webová aplikace využívá mechanismus LocalStorage pro uchování uživatelského nastavení. Toto úložiště je plně pod kontrolou uživatele. Provozovatel nemá k těmto datům technický přístup. Uživatel má právo data kdykoliv odstranit v nastavení prohlížeče nebo ikonkou Smazat data.
          </p>

          <h3>5. Kontaktní údaje</h3>
          <p>
            V případě dotazů se lze obrátit na správce na e-mailové adrese: <a href="mailto:KryptidSoft@gmail.com">KryptidSoft@gmail.com</a>
          </p>
        </div>

        <div className="footer-bottom" style={{ marginTop: '40px', paddingTop: '20px' }}>
          Poslední aktualizace: 03/2026 | Uspejeme.cz
        </div>
      </div>
    </div>
  );
};

export { PrivacyPolicy };