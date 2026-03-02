import React, { useState } from 'react';
import { Zap, Printer, Activity, Flame, Droplets, TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateEnergy } from '../../utils/calculations/energy';
import { formatCZK } from '../../utils/calculations/mathHelpers';

export const EnergyCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    lastReadingValue: 12500,
    currentReadingValue: 12850,
    lastReadingDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    monthlyDeposit: 3500,
    pricePerUnit: 6.5
  });

  const [gasInM3, setGasInM3] = useState(false);
  const [results, setResults] = useState<any>(null);

  const profiles = [
    { label: 'Elektřina', id: 'ele', price: 6.5, icon: <Zap size={20} />, color: '#fbbf24', unit: 'kWh' },
    { label: 'Plyn', id: 'gas', price: 1.8, icon: <Flame size={20} />, color: '#ff7e33', unit: 'kWh', hasM3: true },
    { label: 'Voda', id: 'wat', price: 110, icon: <Droplets size={20} />, color: '#3b82f6', unit: 'm³' },
  ];

  const [activeProfileId, setActiveProfileId] = useState('ele');
  const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
  const displayUnit = (currentProfile.hasM3 && gasInM3) ? "m³" : currentProfile.unit;

  const handleCalculate = () => {
    try {
      const dataToCalculate = {
        ...inputs,
        lastReadingValue: Number(inputs.lastReadingValue),
        currentReadingValue: Number(inputs.currentReadingValue),
        monthlyDeposit: Number(inputs.monthlyDeposit),
        pricePerUnit: Number(inputs.pricePerUnit)
      };

      const calculated = calculateEnergy(dataToCalculate);
      if (calculated) setResults(calculated);
    } catch (error) {
      console.error("Chyba při výpočtu:", error);
      alert("Nepodařilo se spočítat bilanci.");
    }
  };

  const handleValueChange = (field: string, val: string) => {
    const num = field === 'lastReadingDate' ? val : (val === '' ? 0 : parseFloat(val));
    setInputs(prev => ({ ...prev, [field]: num }));
    if (results) setResults(null);
  };

  const handleProfileChange = (p: any) => {
    setActiveProfileId(p.id);
    setGasInM3(false);
    setInputs({
      ...inputs,
      pricePerUnit: p.price,
      lastReadingValue: p.id === 'wat' ? 100 : (p.id === 'gas' ? 2000 : 12500),
      currentReadingValue: p.id === 'wat' ? 112 : (p.id === 'gas' ? 2150 : 12850),
    });
    setResults(null);
  };

  const toggleGasUnit = (toM3: boolean) => {
    if (gasInM3 === toM3) return;
    const KOEFICIENT = 10.55;
    let newPrice = inputs.pricePerUnit * (toM3 ? KOEFICIENT : 1/KOEFICIENT);
    let newLast = inputs.lastReadingValue * (toM3 ? 1/KOEFICIENT : KOEFICIENT);
    let newCurr = inputs.currentReadingValue * (toM3 ? 1/KOEFICIENT : KOEFICIENT);
    
    setGasInM3(toM3);
    setInputs(prev => ({ 
      ...prev, 
      pricePerUnit: Number(newPrice.toFixed(2)),
      lastReadingValue: Number(newLast.toFixed(2)),
      currentReadingValue: Number(newCurr.toFixed(2))
    }));
    setResults(null);
  };

  return (
    <GlassCard className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: currentProfile.color }}>
            {React.cloneElement(currentProfile.icon as React.ReactElement, { size: 28 })}
          </div>
          <h2 style={{ margin: 0 }}>Hlídač vyúčtování ({currentProfile.label})</h2>
        </div>
        <button onClick={() => window.print()} className="nav-item no-print" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px', color: '#10b981', borderRadius: '8px' }}>
          <Printer size={14} /> EXPORT PDF
        </button>
      </div>

      <div className="calculator-grid">
        <div className="inputs-section">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }} className="no-print">
            {profiles.map(p => (
              <button 
                key={p.id} 
                onClick={() => handleProfileChange(p)} 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '4px', padding: '10px', borderRadius: '12px', cursor: 'pointer', border: '2px solid', borderColor: activeProfileId === p.id ? p.color : 'transparent', background: activeProfileId === p.id ? `${p.color}15` : 'rgba(255,255,255,0.03)', color: activeProfileId === p.id ? p.color : '#888' }}
              >
                {p.icon}
                <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>{p.label}</span>
              </button>
            ))}
          </div>

          {currentProfile.hasM3 && (
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '10px', marginBottom: '20px' }}>
              <button onClick={() => toggleGasUnit(false)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', background: !gasInM3 ? currentProfile.color : 'transparent', color: !gasInM3 ? '#000' : '#888' }}>kWh</button>
              <button onClick={() => toggleGasUnit(true)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', background: gasInM3 ? currentProfile.color : 'transparent', color: gasInM3 ? '#000' : '#888' }}>m³</button>
            </div>
          )}

          <div className="input-grid">
            <InputGroup label="Poslední stav" unit={displayUnit} value={inputs.lastReadingValue} onChange={(val) => handleValueChange('lastReadingValue', val)} />
            <InputGroup label="Aktuální stav" unit={displayUnit} value={inputs.currentReadingValue} onChange={(val) => handleValueChange('currentReadingValue', val)} />
            <InputGroup label="Datum odečtu" type="date" value={inputs.lastReadingDate} onChange={(val) => handleValueChange('lastReadingDate', val)} />
            <InputGroup label="Měsíční záloha" unit="Kč" value={inputs.monthlyDeposit} onChange={(val) => handleValueChange('monthlyDeposit', val)} />
            <InputGroup label="Cena za jednotku" unit={`Kč/${displayUnit}`} value={inputs.pricePerUnit} onChange={(val) => handleValueChange('pricePerUnit', val)} />
          </div>

          <button className="calculate-btn no-print" onClick={handleCalculate} style={{ background: currentProfile.color, color: '#000', width: '100%', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold', padding: '15px', borderRadius: '12px', border: 'none', fontSize: '1rem' }}>
            SPOČÍTAT BILANCI
          </button>
        </div>

        <div className="results-section">
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: results ? 'flex-start' : 'center' }}>
            {results ? (
              <div className="fade-in" style={{ textAlign: 'left' }}>
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Očekávaný výsledek roku</span>
                  <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: results.balance >= 0 ? '#10b981' : '#ef4444', margin: '5px 0' }}>
                    {results.balance >= 0 ? 'Přeplatek ' : 'Nedoplatek '}
                    {formatCZK(Math.abs(results.balance))}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}>
                      <Wallet size={16} /> PENĚŽENKA K DNEŠKU ({results.daysPassed} dní)
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>Zaplacené zálohy:</span>
                      <span>{formatCZK(results.depositsPaidSoFar)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                      <span>Reálná spotřeba:</span>
                      <span>{formatCZK(results.costToDate)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: results.currentBalance >= 0 ? '#10b981' : '#fbbf24', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{results.currentBalance >= 0 ? 'Přeplatek:' : 'Dluh:'}</span>
                      <span>{formatCZK(Math.abs(results.currentBalance))}</span>
                    </div>
                  </div>

                  <div style={{ padding: '15px', borderRadius: '15px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '0.75rem', marginBottom: '10px' }}>
                      <TrendingUp size={16} /> LIMITY PRO VAŠE ŠETŘENÍ
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>AKTUÁLNĚ PÁLÍTE</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{results.avgUnitsPerDay.toFixed(2)}</span>
                      </div>
                      <ArrowRight size={16} color="rgba(255,255,255,0.2)" />
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>MUSÍTE SE VEJÍT DO</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6' }}>{results.targetUnitsPerDay.toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>
                      jednotek ({displayUnit}) denně po zbytek roku
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ opacity: 0.3, textAlign: 'center' }}>
                <Activity size={48} style={{ margin: '0 auto 15px', display: 'block' }} color={currentProfile.color} />
                <p>Zadejte stavy pro výpočet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};