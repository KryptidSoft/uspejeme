import React, { useState, useMemo } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';

export const RiskAssessment: React.FC = () => {
  const [risks, setRisks] = useState({
    singleClient: 50, // % příjmů od největšího klienta
    hasContracts: false,
    hasDeposits: false,
    hasBackup: false,
    diversification: 20 // % diverzifikace
  });

  const score = useMemo(() => {
    let total = 100;
    if (risks.singleClient > 70) total -= 30;
    if (risks.singleClient > 40 && risks.singleClient <= 70) total -= 15;
    if (!risks.hasContracts) total -= 25;
    if (!risks.hasDeposits) total -= 15;
    if (!risks.hasBackup) total -= 20;
    if (risks.diversification < 30) total -= 10;
    return Math.max(0, total);
  }, [risks]);

  const getStatus = (s: number) => {
    if (s >= 80) return { color: 'var(--success)', label: 'V bezpečí', icon: <ShieldCheck size={48} /> };
    if (s >= 50) return { color: '#eab308', label: 'Mírné riziko', icon: <AlertTriangle size={48} /> };
    return { color: 'var(--danger)', label: 'Vysoké riziko', icon: <ShieldAlert size={48} /> };
  };

  const status = getStatus(score);

  return (
    <div className="fade-in">
      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
          <ShieldAlert size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Analýza podnikatelských rizik</h2>
        </div>

        {/* Úvodní text */}
        <div style={{ marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
            Kde má vaše podnikání otevřená vrátka? Tato analýza neřeší daně, ale <strong>stabilitu vašich procesů</strong>. Odpovězte upřímně a zjistěte, jak moc by vás rozhodil výpadek jednoho klienta nebo nečekaná nemoc.
          </p>
        </div>

        <div className="calculator-grid">
          {/* Otázky */}
          <div className="inputs-section">
            <div style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.9rem' }}>Příjem od největšího klienta</label>
                <strong style={{ color: risks.singleClient > 50 ? 'var(--danger)' : 'var(--text)' }}>{risks.singleClient} %</strong>
              </div>
              <input 
                type="range" min="0" max="100" value={risks.singleClient} 
                onChange={(e) => setRisks({...risks, singleClient: parseInt(e.target.value)})}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <input type="checkbox" checked={risks.hasContracts} onChange={(e) => setRisks({...risks, hasContracts: e.target.checked})} />
                <span style={{ fontSize: '0.9rem' }}>Používám písemné smlouvy</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <input type="checkbox" checked={risks.hasDeposits} onChange={(e) => setRisks({...risks, hasDeposits: e.target.checked})} />
                <span style={{ fontSize: '0.9rem' }}>Vybírám zálohy předem</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <input type="checkbox" checked={risks.hasBackup} onChange={(e) => setRisks({...risks, hasBackup: e.target.checked})} />
                <span style={{ fontSize: '0.9rem' }}>Mám proces pro případ nemoci / záskok</span>
              </label>
            </div>
          </div>

          {/* Výsledek */}
          <div className="results-section" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: status.color, marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
              {status.icon}
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{score}%</div>
            <div style={{ fontSize: '1.2rem', color: status.color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {status.label}
            </div>

            {/* Doporučení */}
            <div style={{ marginTop: '25px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
                <Lightbulb size={18} />
                <strong style={{ fontSize: '0.85rem' }}>Doporučený krok</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0, lineHeight: '1.4' }}>
                {score >= 80 
                  ? "Vaše podnikání stojí na pevných základech. Udržujte procesy a nezapomínejte smlouvy pravidelně aktualizovat." 
                  : score >= 50 
                  ? "Máte slabá místa. Největší pákou bude snížení závislosti na hlavním klientovi a zavedení zálohových plateb."
                  : "Pozor, vaše podnikání je velmi křehké. Prioritně zaveďte písemné smlouvy a začněte hledat další zdroje příjmů."}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};