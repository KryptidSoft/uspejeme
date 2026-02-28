import React, { useState } from 'react';
import { Zap, Calculator, Lightbulb } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateEnergy } from '../../utils/calculations/energy';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const EnergyCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    watts: 500,
    hoursPerDay: 8,
    pricePerKWh: 6.5
  });

  const [results, setResults] = useState<any>(null);

  const handleCalculate = () => {
    const res = calculateEnergy(inputs);
    setResults(res);
  };

  return (
    <GlassCard className="fade-in">
      <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <Zap size={28} color="#fbbf24" />
        <h2 style={{ margin: 0 }}>Náklady na energii</h2>
      </div>

      <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div className="inputs">
          <InputGroup
            label="Příkon zařízení"
            unit="W"
            value={inputs.watts}
            onChange={(val) => setInputs({...inputs, watts: parseFloat(val) || 0})}
            tooltip="Např. herní PC (400-600W), notebook (60W), přímotop (2000W)."
          />
          <InputGroup
            label="Doba provozu"
            unit="hod/den"
            value={inputs.hoursPerDay}
            onChange={(val) => setInputs({...inputs, hoursPerDay: parseFloat(val) || 0})}
            tooltip="Kolik hodin denně zařízení běží."
          />
          <InputGroup
            label="Cena elektřiny"
            unit="Kč/kWh"
            value={inputs.pricePerKWh}
            onChange={(val) => setInputs({...inputs, pricePerKWh: parseFloat(val) || 0})}
            tooltip="Vaše aktuální sazba za kilowatthodinu."
          />
          <button className="calculate-btn" onClick={handleCalculate} style={{ background: '#fbbf24', color: '#000' }}>
            SPOČÍTAT SPOTŘEBU
          </button>
        </div>

        <div className="results">
          {results ? (
            <div className="results-box fade-in" style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: 'var(--text-dim)' }}>Denní spotřeba:</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{results.dailyKwh.toFixed(2)} kWh</div>
              </div>
              <div style={{ padding: '20px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '15px' }}>
                <span style={{ color: 'var(--text-dim)' }}>Měsíční náklady (30 dní):</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                  {formatCZK(results.monthlyCost)}
                </div>
              </div>
            </div>
          ) : (
            <div className="results-placeholder">Vypočítejte si, kolik vás stojí provoz techniky</div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};