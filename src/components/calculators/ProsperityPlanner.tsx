import React, { useState, useMemo } from 'react';
import { Target, Wallet, Clock, Save, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const ProsperityPlanner: React.FC = () => {
  const [data, setData] = useState({
    monthlyExpenses: 40000,
    desiredSavings: 15000,
    billableHours: 100,
    safetyBufferMonths: 6,
    taxMode: 'pausal_dan', // Možnosti: pausal_dan, vydaje_60, realne_vydaje
    customTaxRate: 25, // Pro reálné výdaje (odhad daně + pojistné)
  });

  // Hodnoty pro rok 2026 (odhadované/aktuální)
  const PAUSAL_AMOUNT = 8500; 

  const analysis = useMemo(() => {
    const netNeeded = data.monthlyExpenses + data.desiredSavings;
    let grossNeeded = 0;
    let taxNote = "";

    if (data.taxMode === 'pausal_dan') {
      grossNeeded = netNeeded + PAUSAL_AMOUNT;
      taxNote = `Zahrnuje měsíční paušál ${formatCZK(PAUSAL_AMOUNT)}`;
    } else if (data.taxMode === 'vydaje_60') {
      grossNeeded = netNeeded / 0.78;
      taxNote = "Odhad odvodů při 60% výdajovém paušálu";
    } else {
      grossNeeded = netNeeded / (1 - data.customTaxRate / 100);
      taxNote = "Založeno na vašem odhadu zdanění";
    }

    const hourlyRate = Math.ceil(grossNeeded / data.billableHours);
    const totalReserveGoal = data.monthlyExpenses * data.safetyBufferMonths;
    
    return { hourlyRate, grossNeeded, totalReserveGoal, taxNote };
  }, [data]);

  const handleSave = () => {
    localStorage.setItem('last_planner_data', JSON.stringify({ ...data, ...analysis }));
    alert("Strategie uložena do prohlížeče.");
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <GlassCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
              <Target size={32} color="var(--primary)" />
              <h2 style={{ margin: 0 }}>Plánovač prosperity</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <section>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '15px' }}>Životní standard</h3>
                <InputGroup 
                  label="Měsíční náklady" 
                  unit="Kč" 
                  value={data.monthlyExpenses} 
                  onChange={(v) => setData({...data, monthlyExpenses: Number(v)})} 
                  tooltip="Zadejte součet všech vašich měsíčních výdajů (nájem, jídlo, služby, doprava)."
                />
                <InputGroup 
                  label="Měsíční spoření/investice" 
                  unit="Kč" 
                  value={data.desiredSavings} 
                  onChange={(v) => setData({...data, desiredSavings: Number(v)})} 
                  tooltip="Kolik peněz si chcete měsíčně odložit na budování majetku nebo důchod."
                />
                <InputGroup 
                  label="Bezpečnostní rezerva" 
                  unit="měsíců" 
                  type="range" 
                  min={1} 
                  max={12} 
                  value={data.safetyBufferMonths} 
                  onChange={(v) => setData({...data, safetyBufferMonths: Number(v)})} 
                  tooltip="Počet měsíců, které chcete mít pokryté v rezervě pro případ úplného výpadku příjmů."
                />
              </section>
              
              <section>
                <h3 style={{ fontSize: '1rem', color: 'var(--accent)', marginBottom: '15px' }}>Daňový režim</h3>
                <select 
                  value={data.taxMode} 
                  onChange={(e) => setData({...data, taxMode: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: 'var(--card)', color: 'white', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '20px' }}
                >
                  <option value="pausal_dan">Paušální daň (1. pásmo)</option>
                  <option value="vydaje_60">Výdajový paušál (60%)</option>
                  <option value="realne_vydaje">Skutečné výdaje / Jiné</option>
                </select>

                {data.taxMode === 'realne_vydaje' && (
                  <InputGroup 
                    label="Odhad daně + pojistného" 
                    unit="%" 
                    value={data.customTaxRate} 
                    onChange={(v) => setData({...data, customTaxRate: Number(v)})} 
                    tooltip="Váš vlastní odhad celkového zdanění a odvodů z hrubého zisku."
                  />
                )}

                <InputGroup 
                  label="Fakturovatelné hodiny" 
                  unit="hod/měs" 
                  value={data.billableHours} 
                  onChange={(v) => setData({...data, billableHours: Number(v)})} 
                  tooltip="Počet hodin měsíčně, které reálně fakturujete (po odečtení administrativy a dovolené)."
                />
              </section>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'start' }}>
              <AlertCircle size={18} color="#eab308" style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#eab308' }}>
                <strong>Právní doložka:</strong> Výpočty jsou orientační simulací. Daňové zákony se mění a individuální podmínky mohou výsledek změnit. Konzultujte s účetním.
              </p>
            </div>
          </GlassCard>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '30px', borderRadius: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Nutná hodinovka</span>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '10px 0' }}>{formatCZK(analysis.hourlyRate)}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '5px' }}>
              {analysis.taxNote}
            </div>
          </div>

          <GlassCard>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Měsíční obrat:</span>
                <span style={{ fontWeight: 'bold' }}>{formatCZK(analysis.grossNeeded)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)' }}>Cílová rezerva:</span>
                <span style={{ fontWeight: 'bold' }}>{formatCZK(analysis.totalReserveGoal)}</span>
              </div>
              <button onClick={handleSave} className="calculate-btn"><Save size={18} /> Uložit strategii</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};