import React, { useState, useMemo } from 'react';
import { ShoppingCart, ArrowRight, Zap, Info } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useBusinessData } from '../../hooks/useBusinessData';
import { calculateDashboardStats } from '../../utils/calculations/businessLogic';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const SafeBuyCalculator: React.FC = () => {
  const { data, updateData } = useBusinessData();
  
  // Pomocné výpočty z tvé business logiky, které používá i Dashboard
  const stats = useMemo(() => calculateDashboardStats(data), [data]);

  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState(stats.disposableNet > 0 ? Math.round(stats.disposableNet * 0.8) : 50000);

  const simulation = useMemo(() => {
    const currentReserves = data.reserves || 0;
    const newReserves = Math.max(0, currentReserves - itemPrice);
    
    // Simulace nové Runwaye (kolik měsíců přežiješ po nákupu)
    const monthlyExp = stats.exp || 1;
    const currentRunway = stats.runway;
    const newRunway = newReserves / monthlyExp;
    const runwayLoss = currentRunway - newRunway;

    // Kolik hodin tvého života to stojí (při tvé efektivní sazbě)
    const hoursNeeded = Math.round(itemPrice / (stats.effectiveRate || 1));
	// 🔥 SAFE LIMIT (nová feature)
const SAFE_RUNWAY = 3;
const safeLimit = Math.max(0, currentReserves - (monthlyExp * SAFE_RUNWAY));
const isOverSafeLimit = itemPrice > safeLimit;
    
    // Verdikt podle tvého "Zdraví podnikání"
    let color = "#22c55e"; // zelená
    let status = "POHODIČKA, KÁMO";
    let advice = "Tenhle nákup tvoje rezerva spolkne jako malinu. Pokud tu věc chceš, jdi do toho.";

    if (newRunway < 3) {
      color = "#fbbf24"; // žlutá
      status = "BUĎ VE STŘEHU";
      advice = `Rezerva ti klesne pod 3 měsíce. To už začíná smrdět průšvihem, pokud vypadne klient.`;
    }
    if (newRunway < 1.5 || itemPrice > currentReserves) {
      color = "#ef4444"; // červená
      status = "KAPITÁLOVÝ HAZARD";
      advice = `Tohle ti vymaže měsíce klidného spaní. Radši počkej, až víc vyděláš.`;
    }

return {
  newReserves,
  currentRunway,
  newRunway,
  runwayLoss,
  hoursNeeded,
  color,
  status,
  advice,
  safeLimit,
  isOverSafeLimit
};
  }, [itemPrice, data.reserves, stats]);

  return (
    <div className="fade-in app-container">
      
  {/* 1. LIDSKÝ ÚVOD */}
  <div>
    <h1>
      Můžu si to dovolit? <span style={{ color: simulation.color }}>{simulation.status}</span>
    </h1>
    <h2>
      Tady máš kalkulačku, co ti nelže. Chceš si něco koupit? Ukážu ti, co to udělá s tvým Dashboardem. 
      Stačí zadat, co tě láká, a já ti hned ukážu, o kolik měsíců svobody přijdeš. 
      Pohodička, kámo, zjisti si, jestli ti to za to stojí.
    </h2>
  </div>

      <div className="calculator-grid" style={{ gap: '25px' }}>
        
        {/* LEVÝ PANEL - VSTUPY (To, co po mně chceš) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard style={{ padding: '30px' }}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                Co si chceš pořídit?
              </label>
              <div style={{ position: 'relative' }}>
                <ShoppingCart style={{ position: 'absolute', left: '15px', top: '15px', opacity: 0.3 }} size={20} />
                <input 
                  type="text" 
                  placeholder="Např. Nový foťák, Školení..." 
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  style={{ width: '100%', padding: '12px 12px 12px 45px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '16px', color: '#fff', fontSize: '1rem', }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ opacity: 0.6, fontSize: '0.8rem' }}>Cena investice</label>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{formatCZK(itemPrice)}</span>
              </div>
              <input 
                type="range" min="0" max="3000000" step="10000"
                value={itemPrice} onChange={(e) => setItemPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ opacity: 0.6, fontSize: '0.8rem' }}>Tvoje aktuální rezerva</label>
                <span style={{ fontWeight: 'bold', color: '#22c55e', fontSize: '1.2rem' }}>{formatCZK(data.reserves)}</span>
              </div>
              <input 
                type="range" min="0" max="3000000" step="10000"
                value={data.reserves} 
                onChange={(e) => updateData({ reserves: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#22c55e' }}
              />
            </div>
          </GlassCard>

          <div style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Zap color="#fbbf24" />
            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Tenhle nákup tě stojí <strong>{simulation.hoursNeeded} hodin</strong> čisté práce v kuse.
            </span>
          </div>
        </div>

        {/* PRAVÝ PANEL - DOPAD NA DASHBOARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* VERDIKT KARTA */}
          <div style={{ 
            background: simulation.color + '10', 
            border: `2px solid ${simulation.color}`, 
            padding: '30px', 
            borderRadius: '24px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: simulation.color, marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {simulation.status}
            </h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>{simulation.advice}</p>
          </div>

          {/* SROVNÁNÍ PŘED A PO */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '5px' }}>Rezerva Předtím</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{simulation.currentRunway.toFixed(1)} <span style={{ fontSize: '0.8rem' }}>měs.</span></div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '24px', textAlign: 'center', border: `1px solid ${simulation.color}` }}>
              <div style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '5px' }}>Rezerva Potom</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: simulation.color }}>{simulation.newRunway.toFixed(1)} <span style={{ fontSize: '0.8rem' }}>měs.</span></div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',flexWrap: 'wrap',gap: '15px' }}>
            <div>
              <div style={{ opacity: 0.5, fontSize: '0.7rem' }}>ZŮSTANE TI NA ÚČTU</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{formatCZK(simulation.newReserves)}</div>
            </div>
            <ArrowRight size={24} style={{ opacity: 0.2 }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ opacity: 0.5, fontSize: '0.7rem' }}>ZTRÁTA RUNWAYE</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ef4444' }}>-{simulation.runwayLoss.toFixed(1)} měs.</div>
            </div>
          </div>

{/* 🔥 SAFE LIMIT KARTA */}
<div style={{ 
  background: simulation.isOverSafeLimit ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
  border: `1px solid ${simulation.isOverSafeLimit ? '#ef4444' : '#22c55e'}`,
  padding: '20px',
  borderRadius: '20px'
}}>
  <div style={{ opacity: 0.5, fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '5px' }}>
    Bezpečný limit nákupu
  </div>

  <div style={{ 
    fontSize: '1.6rem', 
    fontWeight: '900', 
    color: simulation.isOverSafeLimit ? '#ef4444' : '#22c55e'
  }}>
    {formatCZK(simulation.safeLimit)}
  </div>

  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
    Aby ti zůstaly alespoň 3 měsíce rezervy
  </div>

  {simulation.isOverSafeLimit && (
    <div style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '8px' }}>
      Přestřelil jsi limit o {formatCZK(itemPrice - simulation.safeLimit)}
    </div>
  )}
</div>

          <div style={{ padding: '15px', borderRadius: '15px', background: 'rgba(59,130,246,0.1)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Info size={18} color="#60a5fa" />
            <span style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
              Tento výpočet vychází z tvých měsíčních nákladů ({formatCZK(stats.exp)}) nastavených v tvém panelu. Částku můžeš upravovat v sekci Strategie & růst - Plánovač.
            </span>
          </div>
        </div>
      </div>

      {/* TEXT POD ČAROU */}
      <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '15px' }}>Proč na tom záleží?</h3>
        <p style={{ maxWidth: '800px', margin: '0 auto', opacity: 0.6, lineHeight: '1.7', fontSize: '1rem' }}>
          Jako podnikatel neplatíš penězi, ale **svobodou a časem**. Pokaždé, když si něco koupíš, 
          vyměňuješ kus své bezpečnosti za věc. Tahle kalkulačka ti nemá bránit v radosti, 
          ale má ti ukázat tu realitu za cenovkou. Pokud na to musíš makat {simulation.hoursNeeded} hodin, 
          stojí ti {itemName || 'tenhle nákup'} za to, abys byl o {simulation.runwayLoss.toFixed(1)} měsíce dříve "na nule", kdyby se nedařilo? 
          Pokud je odpověď ANO, užij si to!
        </p>
      </div>
    </div>
  );
};