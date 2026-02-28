import React, { useState } from 'react';
import { PiggyBank, Calculator } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateReserves } from '../../utils/calculations/reserves';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const ReservesCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    monthlyExpenses: 30000,
    targetMonths: 6,
    savingMonths: 12
  });

  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const res = calculateReserves(inputs);
    setResults(res);

    // ULOŽENÍ PRO STABILITU
    localStorage.setItem('last_reserves_result', JSON.stringify({
      targetMonths: inputs.targetMonths
    }));
  };

  return (
    <GlassCard className="fade-in">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <PiggyBank size={28} color="var(--primary)" />
        <h2 style={{ margin: 0 }}>Finanční rezerva</h2>
      </div>

      <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="inputs">
          <InputGroup label="Měsíční výdaje" unit="Kč" value={inputs.monthlyExpenses} onChange={(val) => setInputs({...inputs, monthlyExpenses: parseFloat(val) || 0})} />
          <InputGroup label="Cílová rezerva" unit="měsíců" type="range" min={1} max={24} value={inputs.targetMonths} onChange={(val) => setInputs({...inputs, targetMonths: parseFloat(val) || 0})} />
          <InputGroup label="Doba spoření" unit="měsíců" value={inputs.savingMonths} onChange={(val) => setInputs({...inputs, savingMonths: parseFloat(val) || 0})} />
          
          <button className="calculate-btn" onClick={handleCalculate} style={{ width: '100%', marginTop: '20px' }}>
            SPOČÍTAT PLÁN
          </button>
        </div>

        <div className="results">
          {results ? (
            <div className="results-box fade-in" style={{ textAlign: 'center' }}>
              <span style={{ color: 'var(--text-dim)' }}>Cílová rezerva:</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                {formatCZK(results.totalTarget)}
              </div>
            </div>
          ) : (
            <div className="results-placeholder">Vypočítejte si finanční polštář</div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};