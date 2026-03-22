import React, { useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Users, 
  FileText, 
  HeartPulse,
  Scale,
  BookOpen
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useBusinessData } from '../../hooks/useBusinessData';

export const RiskAssessment: React.FC = () => {
  const { data, updateData } = useBusinessData();
  
const score = useMemo(() => {
    let total = 100;
    if (data.topClientShare > 70) total -= 30;
    if (data.topClientShare > 40 && data.topClientShare <= 70) total -= 15;
    
    // Zde byla chyba - opraveno na data.xxx
    if (!data.hasContracts) total -= 25;
    if (!data.hasDeposits) total -= 15;
    if (!data.hasBackup) total -= 20;
    
    // Smazali jsme řádek s diversification (není v global datech)
    return Math.max(0, total);
  }, [data]); // Sledujeme celé globální data

  const getStatus = (s: number) => {
    if (s >= 80) return { color: '#10b981', label: 'V bezpečí', icon: <ShieldCheck size={64} /> };
    if (s >= 50) return { color: '#eab308', label: 'Mírné riziko', icon: <AlertTriangle size={64} /> };
    return { color: '#ef4444', label: 'Vysoké riziko', icon: <ShieldAlert size={64} /> };
  };

  const status = getStatus(score);

  return (
    <div className="fade-in app-container">
      
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '800' }}>Audit podnikatelské odolnosti</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
          Úspěšné podnikání není o tom, že se nic nepokazí. Je o tom, <strong>kolik ran dokážete ustát</strong>, aniž byste museli skončit. 
          Otestujte stabilitu svých procesů a zjistěte, kde máte slabiny dřív, než je odhalí trh.
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
          <Scale size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Stav vašich "vrátek"</h2>
        </div>

        <div style={{ marginBottom: '30px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.5' }}>
            💡 <strong>Instrukce:</strong> Odpovídejte podle aktuální reality, ne podle toho, jak byste chtěli, aby to vypadalo. 
            Jen pravda vám pomůže postavit neprůstřelné podnikání.
          </p>
        </div>

        <div className="calculator-grid" style={{ gap: '30px' }}>
          {/* Levá strana: Vstupy */}
          <div className="inputs-section">
            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '1rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Users size={18} color="var(--primary)" /> Závislost na největším klientovi
                </label>
                <strong style={{ color: data.topClientShare > 50 ? '#ef4444' : 'white', fontSize: '1.1rem' }}>{data.topClientShare} % příjmů</strong>
              </div>
              <input 
  type="range" 
  min="0" 
  max="100" 
  value={data.topClientShare} 
  onChange={(e) => updateData({ topClientShare: parseInt(e.target.value) })}
  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
/>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                Pokud tento klient odejde, o kolik procent vašich příjmů okamžitě přijdete?
              </p>
            </div>

<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '15px', background: data.hasContracts ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: data.hasContracts ? '1px solid #10b981' : '1px solid var(--border)', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={data.hasContracts || false} onChange={(e) => updateData({ hasContracts: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Písemné smlouvy</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Mám podepsané smlouvy na každý projekt.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '15px', background: data.hasDeposits ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: data.hasDeposits ? '1px solid #10b981' : '1px solid var(--border)', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={data.hasDeposits || false} onChange={(e) => updateData({ hasDeposits: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Zálohový systém</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Vybírám min. 30–50 % před zahájením práce.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '15px', background: data.hasBackup ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', borderRadius: '12px', border: data.hasBackup ? '1px solid #10b981' : '1px solid var(--border)', transition: 'all 0.2s' }}>
                <input type="checkbox" checked={data.hasBackup || false} onChange={(e) => updateData({ hasBackup: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>Krizový plán (Nemoc/Výpadek)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Vím, na koho delegovat nebo jak komunikovat neschopnost.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Pravá strana: Výsledek */}
          <div className="results-section" style={{ 
  textAlign: 'center', 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'center', 
  padding: '30px', 
  background: `${status.color}05`, // Velmi jemný nádech barvy statusu
  borderRadius: '24px', 
  border: `1px solid ${status.color}33`, // Průhledný okraj v barvě statusu
  transition: 'all 0.5s ease'
}}>
            <div style={{ color: status.color, marginBottom: '20px', display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 0 15px ' + status.color + '44)' }}>
              {status.icon}
            </div>
            <div style={{ fontSize: '4rem', fontWeight: '900', color: 'white' }}>{score}%</div>
            <div style={{ fontSize: '1.4rem', color: status.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '25px' }}>
              {status.label}
            </div>

            <div style={{ textAlign: 'left', padding: '20px', borderRadius: '15px', background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', color: 'var(--accent)' }}>
                <Zap size={20} />
                <strong style={{ fontSize: '0.9rem' }}>Strategické doporučení</strong>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0, lineHeight: '1.6' }}>
                {score >= 80 
                  ? "Váš systém je robustní. Jste v horních 5 % freelancerů, kteří mají své podnikání pod kontrolou. Pokračujte v diverzifikaci portfolia." 
                  : score >= 50 
                  ? "Máte postavené základy, ale stojíte na jedné silné noze. Snížení závislosti na hlavním klientovi pod 40 % by mělo být vaší prioritou pro příští kvartál."
                  : "Vaše podnikání je v zóně extrémní křehkosti. Jakýkoliv náraz (nemoc, odchod klienta) může být likvidační. Prvním krokem musí být zavedení smluv a záloh."}
              </p>
            </div></div>
        </div>
      </GlassCard>

      {/* --- HLOUBKOVÝ PRŮVODCE RIZIKY --- */}
      <div className="no-print">
        <GlassCard style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Jak vybudovat neprůstřelné podnikání</h2>
          </div>

          <div className="smart-grid">
            <div>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <Lock size={20} color="#3b82f6" /> Past zlaté klece
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Mít jednoho velkého klienta, který platí skvěle a bere veškerý váš čas, je lákavé, ale extrémně nebezpečné. 
                De jure jste freelancer, de facto jste zaměstnanec bez zaměstnaneckých výhod. Vždy si držte prostor pro alespoň 2–3 menší projekty.
              </p>
            </div>

            <div>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <FileText size={20} color="#10b981" /> Psychologie smluv a záloh
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Smlouvy a zálohy nejsou jen právní ochrana. Jsou to <strong>filtry na špatné klienty</strong>. Klient, který odmítá podepsat 
                jednoduchou objednávku nebo zaplatit zálohu, je téměř vždy klient, se kterým budou v budoucnu problémy při placení faktur.
              </p>
            </div>

            <div>
              <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                <HeartPulse size={20} color="#ef4444" /> Riziko "Single Point of Failure"
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Pokud všechno ve vaší firmě závisí na vaší hlavě a rukou, máte problém. Co se stane, když vypadnete na měsíc? 
                Budování sítě kontaktů (vzájemný záskok s jinými freelancery) je nejlevnější pojištění, které si můžete pořídit.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '35px', padding: '20px', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '15px', border: '1px dashed var(--primary)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Zap size={30} color="var(--primary)" />
            <p style={{ margin: 0, fontSize: '1rem', color: 'white' }}>
              <strong>Změnily se vaše náklady?</strong> Upravte je v strategii a tato analýza se okamžitě přizpůsobí.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RiskAssessment;