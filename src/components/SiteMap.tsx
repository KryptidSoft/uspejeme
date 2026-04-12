import React from 'react';
import { Link } from 'react-router-dom';

export const Sitemap: React.FC = () => {
  return (
    <div className="fade-in app-container min-h-screen flex flex-col justify-between sitemap-container">
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div className="mb-12 border-b border-white/10 pb-6">
        <h1>Mapa stránek</h1>
        <h2>
          Kompletní přehled všech nástrojů a sekcí portálu <strong>Uspejeme.cz</strong>. 
          Snadno najdete všechny kalkulačky, nástroje a informace, které potřebujete.
        </h2>
      </div>

      <div className="grid sitemap-grid gap-8">
        {/* 0. Úvodní stránka & Panel */}
        <section>
          <p className="section-title font-semibold">Úvodní stránka & Panel</p>
          <ul className="link-list">
            <li className="link-item"><Link to="/">Úvodní stránka</Link></li>
            <li className="link-item"><Link to="/panel">Můj panel</Link></li>
          </ul>
        </section>

        {/* 1. Faktury & platby */}
        <section>
          <p className="section-title font-semibold">Nástroje</p>
          <ul className="link-list">
            <li className="link-item"><Link to="/nastroje">Faktury & platby (rozcestník)</Link></li>
            <li className="link-item"><Link to="/faktura">Elite Faktura</Link></li>
            <li className="link-item"><Link to="/qr">QR Generátor</Link></li>
			<li className="link-item"><Link to="/nabidka">Nabídka</Link></li>
            <li className="link-item"><Link to="/upominky">Hlídač splatnosti</Link></li>
          </ul>
        </section>

        {/* 2. Audit stability */}
        <section>
          <p className="section-title font-semibold">Audit stability</p>
          <ul className="link-list">
            <li className="link-item"><Link to="/audit">Audit stability (rozcestník)</Link></li>
            <li className="link-item"><Link to="/stabilita">Index stability</Link></li>
            <li className="link-item"><Link to="/rezerva">Finanční rezerva</Link></li>
            <li className="link-item"><Link to="/rizika">Analýza rizik</Link></li>
            <li className="link-item"><Link to="/energie">Kalkulačka energií</Link></li>
          </ul>
        </section>

        {/* 3. Strategie & růst */}
        <section>
          <p className="section-title font-semibold">Strategie & růst</p>
          <ul className="link-list">
            <li className="link-item"><Link to="/strategie">Strategie & růst (rozcestník)</Link></li>
            <li className="link-item"><Link to="/planovac">Plánovač prosperity</Link></li>
            <li className="link-item"><Link to="/hodinovka">Hodinová sazba</Link></li>
            <li className="link-item"><Link to="/projekt">Ziskovost projektů</Link></li>
          </ul>
        </section>

        {/* 4. Investice & ROI */}
        <section>
          <p className="section-title font-semibold">Investice & ROI</p>
          <ul className="link-list">
            <li className="link-item"><Link to="/investice">Investice & ROI (rozcestník)</Link></li>
            <li className="link-item"><Link to="/roi">Návratnost ROI</Link></li>
            <li className="link-item"><Link to="/inflace">Inflační kalkulačka</Link></li>
            <li className="link-item"><Link to="/aktiva">Správa aktiv</Link></li>
            <li className="link-item"><Link to="/nakupy">Nákupní Kalkulačka</Link></li>
          </ul>
        </section>

        {/* 5. Ostatní */}
        <section>
          <p className="section-title font-semibold">Vzdělávání</p>
          <ul className="link-list">
		    <li className="link-item"><Link to="/clanky">Články</Link></li>
            <li className="link-item"><Link to="/kalendar">Kalendář</Link></li>
            <li className="link-item"><Link to="/kviz">Poznej se (Kvíz)</Link></li>
			<li className="link-item"><Link to="/dane-eu">Index zisku</Link></li>
          </ul>
        </section>

        {/* 6. Footer & Info */}
        <section>
          <p className="section-title font-semibold">Footer & Info</p>
          <ul className="link-list">
            <li className="link-item"><Link to="/o-nas">O nás</Link></li>
            <li className="link-item"><Link to="/kontakt">Kontakt</Link></li>
            <li className="link-item"><Link to="/privacy">Ochrana údajů</Link></li>
            <li className="link-item"><Link to="/terms">Právní podmínky</Link></li>
            <li className="link-item"><Link to="/mapa-stranek">Mapa stránek</Link></li>
          </ul>
        </section>
      </div>

      <footer className="footer text-center text-gray-500 text-sm mt-16 pt-8 border-t border-white/5">
        Uspejeme.cz — Poslední aktualizace mapy: Duben 2026
      </footer>
    </div>
  );
};

export default Sitemap;