import React, { useState } from 'react';
import { Clock, Calculator, AlertCircle } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateHourlyRate } from '../../utils/calculations/hourly';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const HourlyRateCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    grossIncome: 60000,
    billableHours: 100,
    nonBillableHours: 40,
    costs: { taxes: 12000, overhead: 5000, material: 0, reserves: 5000 }
  });

  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const res = calculateHourlyRate(inputs);
    setResults(res);
  };

  return (
    <GlassCard className="fade-in">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <Clock size={28} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>Kalkulačka hodinové sazby</h2>
      </div>

      {/* TEXT NAD KALKULAČKOU */}
      <div style={{ marginBottom: '25px', borderLeft: '2px solid var(--primary)', paddingLeft: '15px' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.5' }}>
          <strong>Kolik musíte vydělávat, aby vaše podnikání dávalo smysl?</strong><br />
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Spočítejte si sazbu, která pokryje vaše daně, režii i zasloužený zisk. Už žádné střílení cen od oka.
          </span>
        </p>
      </div>

      <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="inputs">
          <InputGroup
            label="Požadovaný čistý příjem"
            unit="Kč"
            value={inputs.grossIncome}
            onChange={(val) => setInputs({...inputs, grossIncome: parseFloat(val) || 0})}
            tooltip="Kolik peněz vám má zbýt 'do ruky' po zaplacení všeho."
          />
          <InputGroup
            label="Fakturovatelné hodiny"
            unit="hod/měs"
            value={inputs.billableHours}
            onChange={(val) => setInputs({...inputs, billableHours: parseFloat(val) || 0})}
            tooltip="Počet hodin, které skutečně naúčtujete klientům."
          />
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '15px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem' }}>Měsíční náklady a daně</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input 
                type="number" 
                placeholder="Daně/Soc/Zdr" 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'white' }}
                onChange={(e) => setInputs({...inputs, costs: {...inputs.costs, taxes: parseFloat(e.target.value) || 0}})} 
              />
              <input 
                type="number" 
                placeholder="Režie (nájem, tel)" 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'white' }}
                onChange={(e) => setInputs({...inputs, costs: {...inputs.costs, overhead: parseFloat(e.target.value) || 0}})} 
              />
            </div>
          </div>
          <button className="calculate-btn" onClick={handleCalculate} style={{ width: '100%', padding: '12px', fontWeight: 'bold' }}>VYPOČÍTAT SAZBU</button>
        </div>

        <div className="results" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {results ? (
            <div className="results-box fade-in" style={{ textAlign: 'center' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Vaše minimální hodinovka:</span>
              <div style={{ fontSize: '3.2rem', fontWeight: 'bold', color: 'var(--primary)', margin: '5px 0' }}>
                {formatCZK(results.rate)}
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, color: 'var(--text-dim)', marginBottom: '20px' }}>
                Celkové měsíční náklady: {formatCZK(results.totalCosts)}<br />
                Musíte vyfakturovat: {formatCZK(results.totalRequired)}
              </p>
              
              {/* TEXT POD KALKULAČKOU */}
              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', fontSize: '0.8rem', textAlign: 'left', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                  <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span><strong>Tip:</strong> Sazba počítá s čistým časem. Pokud vaše současná cena neodpovídá výsledku, je čas na úpravu ceníku nebo snížení nákladů.</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="results-placeholder" style={{ textAlign: 'center', opacity: 0.5, fontStyle: 'italic' }}>
              Zadejte data pro výpočet optimální sazby
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};