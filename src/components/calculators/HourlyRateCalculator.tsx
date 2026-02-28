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
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Clock size={28} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>Kalkulačka hodinové sazby</h2>
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
              <input type="number" placeholder="Daně/Soc/Zdr" onChange={(e) => setInputs({...inputs, costs: {...inputs.costs, taxes: parseFloat(e.target.value) || 0}})} />
              <input type="number" placeholder="Režie (nájem, tel)" onChange={(e) => setInputs({...inputs, costs: {...inputs.costs, overhead: parseFloat(e.target.value) || 0}})} />
            </div>
          </div>
          <button className="calculate-btn" onClick={handleCalculate}>VYPOČÍTAT SAZBU</button>
        </div>

        <div className="results">
          {results ? (
            <div className="results-box fade-in" style={{ textAlign: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Vaše minimální hodinovka by měla být:</span>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', margin: '10px 0' }}>
                {formatCZK(results.rate)}
              </div>
              <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                Celkové měsíční náklady: {formatCZK(results.totalCosts)}<br />
                Musíte vyfakturovat celkem: {formatCZK(results.totalRequired)}
              </p>
            </div>
          ) : (
            <div className="results-placeholder">Zadejte parametry pro výpočet sazby</div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};