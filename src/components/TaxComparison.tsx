import React, { useMemo } from 'react';
import { GlassCard } from './ui/GlassCard';
import { TAX_DATA, calculateEfficiency } from '../data/taxData';

export const TaxComparison: React.FC = () => {
  const isCz = navigator.language.startsWith('cs');

  const t = {
    title: isCz ? 'Index čistého zisku OSVČ' : 'Self-Employed Net Profit Index',
    subtitle: isCz 
      ? 'Srovnejte nesrovnatelné. Některé země mají nízké daně, ale drahé pojistky. Index to sjednotí a vy uvidíte, kolik peněz vám zbyde na skutečný život (akt. duben 2026).' 
      : 'Comparing the incomparable. Some countries have low taxes but high insurance premiums. The index unifies it all, showing you exactly how much is left for your real life (updated April 2026).',
    taxes: isCz ? 'Stát si vezme' : 'State takes',
    profit: isCz ? 'Vám zůstane' : 'You keep',
    legend: isCz ? 'Data jsou orientační pro rok 2026.' : 'Data is indicative for 2026.'
  };

  const sortedData = useMemo(() => {
    return TAX_DATA.map(country => ({
      ...country,
      efficiency: calculateEfficiency(country),
      totalTax: Math.round((100 - calculateEfficiency(country)) * 10) / 10
    })).sort((a, b) => b.efficiency - a.efficiency);
  }, []);

  return (
    <section className="container-max fade-in" style={{ marginTop: '40px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>{t.title}</h1>
        <h2>{t.subtitle}</h2>
      </header>

      <div className="layout-grid">
        {/* Hlavní tabulka / Karty */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sortedData.map((item) => (
            <GlassCard key={item.id} className="info-box" style={{ padding: '15px 20px' }}>
              <div className="responsive-flex" style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                
                {/* Název země */}
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <span style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold', 
                    color: 'var(--text-main)' 
                  }}>
                    {isCz ? item.nameCz : item.nameEn}
                  </span>
                </div>

                {/* Čísla - mobilní zobrazení v jednom řádku */}
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  fontSize: '0.9rem',
                  color: 'var(--text-dim)'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{t.taxes}</div>
                    <div style={{ color: 'var(--danger)', fontWeight: '600' }}>{item.totalTax}%</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--success)' }}>{t.profit}</div>
                    <div style={{ color: 'var(--success)', fontWeight: '900', fontSize: '1.2rem' }}>{item.efficiency}%</div>
                  </div>
                </div>

                {/* Grafický indikátor (Progress bar) - na mobilu se natáhne na celou šířku */}
                <div style={{ width: '100%', marginTop: '10px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: '6px', 
                    backgroundColor: 'rgba(255,255,255,0.05)', 
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${item.efficiency}%`, 
                      height: '100%', 
                      background: item.efficiency > 70 
                        ? 'linear-gradient(90deg, #10b981, #34d399)' 
                        : item.efficiency > 60 
                        ? 'var(--accent-orange)' 
                        : 'var(--danger)',
                      transition: 'width 1.5s ease-in-out'
                    }} />
                  </div>
                </div>

              </div>
            </GlassCard>
          ))}
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '10px' }}>
            {t.legend}
          </p>
        </div>

        {/* Boční panel (Widget) - využívá tvůj 350px sloupec na desktopu */}
        {/* Boční panel (Widget) */}
<aside className="info-box" style={{ background: 'rgba(59, 130, 246, 0.05)', height: 'fit-content' }}>
  <h3 style={{ color: 'var(--accent-orange)', marginBottom: '15px', fontSize: '1.2rem' }}>
    {isCz ? 'Jak index počítáme?' : 'How is the index calculated?'}
  </h3>
  
  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
    <p style={{ marginBottom: '12px' }}>
      {isCz 
        ? 'Výpočet vychází z modelového příkladu digitálního OSVČ s ročním obratem 1 000 000 Kč (cca 40 000 €).' 
        : 'The calculation is based on a model example of a digital freelancer with an annual turnover of €40,000.'}
    </p>
    
    <ul style={{ paddingLeft: '20px', marginBottom: '15px', listStyleType: 'disc' }}>
      <li>
        <strong>{isCz ? 'Daň z příjmu:' : 'Income Tax:'}</strong> {isCz ? 'Standardní sazby a paušály pro rok 2026.' : 'Standard rates and flat-tax regimes for 2026.'}
      </li>
      <li>
        <strong>{isCz ? 'Odvody:' : 'Social Security:'}</strong> {isCz ? 'Povinné zdravotní a sociální pojištění.' : 'Mandatory health and social contributions.'}
      </li>
      <li>
        <strong>{isCz ? 'Čistý zisk:' : 'Net Profit:'}</strong> {isCz ? 'Peníze, které vám reálně zbudou na účtu.' : 'Actual take-home pay available for your use.'}
      </li>
    </ul>

    <div style={{ 
      padding: '10px', 
      background: 'rgba(255,255,255,0.03)', 
      borderRadius: '8px', 
      borderLeft: '3px solid var(--accent-orange)',
      fontStyle: 'italic'
    }}>
      {isCz 
        ? 'Mezi nejlepším a nejhorším místem v EU je rozdíl přes 30 % v čistém příjmu. To může dělat i stovky tisíc korun ročně.' 
        : 'The difference between the best and worst EU locations exceeds 30% in net income. This can amount to thousands of euros per year.'}
    </div>
  </div>
</aside>
      </div>
    </section>
  );
};