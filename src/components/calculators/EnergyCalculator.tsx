import React, { useState } from 'react';
import { 
  Zap, 
  Printer, 
  Activity, 
  Flame, 
  Droplets, 
  TrendingUp, 
  Wallet, 
  ArrowRight,
  AlertTriangle,
  History,
  ShieldCheck,
  LineChart
} from 'lucide-react';
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
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* --- HLAVIČKA: Drsná realita --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '800' }}>Hlídač energetické pasti</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
          Zálohy jsou jen odhad, ale faktura je realita. Tato kalkulačka vám ukáže, jestli se řítíte do dluhů, 
          nebo si můžete v klidu zatopit. Počítejte dřív, než vám přijde obálka s pruhem.
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: currentProfile.color }}>
              {React.cloneElement(currentProfile.icon as React.ReactElement, { size: 28 })}
            </div>
            <h2 style={{ margin: 0 }}>Detailní bilance ({currentProfile.label})</h2>
          </div>
          <button onClick={() => window.print()} className="nav-item no-print" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px', color: '#10b981', borderRadius: '8px' }}>
            <Printer size={14} /> EXPORT PRO DODAVATELE
          </button>
        </div>

        <div className="calculator-grid">
          <div className="inputs-section">
            {/* Přepínač komodit */}
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
                <button onClick={() => toggleGasUnit(false)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', background: !gasInM3 ? currentProfile.color : 'transparent', color: !gasInM3 ? '#000' : '#888' }}>kWh (Fakturační)</button>
                <button onClick={() => toggleGasUnit(true)} style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '7px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', background: gasInM3 ? currentProfile.color : 'transparent', color: gasInM3 ? '#000' : '#888' }}>m³ (Plynoměr)</button>
              </div>
            )}

            <div className="input-grid">
              <InputGroup label="Stav z minulé faktury" unit={displayUnit} value={inputs.lastReadingValue} onChange={(val) => handleValueChange('lastReadingValue', val)} />
              <InputGroup label="Aktuální stav měřidla" unit={displayUnit} value={inputs.currentReadingValue} onChange={(val) => handleValueChange('currentReadingValue', val)} />
              <InputGroup label="Datum posledního odečtu" type="date" value={inputs.lastReadingDate} onChange={(val) => handleValueChange('lastReadingDate', val)} />
              <InputGroup label="Vaše měsíční záloha" unit="Kč" value={inputs.monthlyDeposit} onChange={(val) => handleValueChange('monthlyDeposit', val)} />
              <InputGroup label="Celková cena za jednotku" unit={`Kč/${displayUnit}`} value={inputs.pricePerUnit} onChange={(val) => handleValueChange('pricePerUnit', val)} />
            </div>

            <button className="calculate-btn no-print" onClick={handleCalculate} style={{ background: currentProfile.color, color: '#000', width: '100%', marginTop: '20px', cursor: 'pointer', fontWeight: 'bold', padding: '15px', borderRadius: '12px', border: 'none', fontSize: '1rem' }}>
              VYHODNOTIT SPOTŘEBU
            </button>
          </div>

          <div className="results-section">
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: '20px', border: '1px solid var(--border)', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: results ? 'flex-start' : 'center' }}>
              {results ? (
                <div className="fade-in" style={{ textAlign: 'left' }}>
                  <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Prognóza k ročnímu vyúčtování</span>
                    <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: results.balance >= 0 ? '#10b981' : '#ef4444', margin: '5px 0' }}>
                      {results.balance >= 0 ? 'Přeplatek ' : 'Nedoplatek '}
                      {formatCZK(Math.abs(results.balance))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div style={{ padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '8px' }}>
                        <Wallet size={16} /> AKTUÁLNÍ BILANCE ({results.daysPassed} dní od odečtu)
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                        <span>Kumulované zálohy:</span>
                        <span>{formatCZK(results.depositsPaidSoFar)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '8px' }}>
                        <span>Skutečná cena spotřeby:</span>
                        <span>{formatCZK(results.costToDate)}</span>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontWeight: 'bold', color: results.currentBalance >= 0 ? '#10b981' : '#fbbf24', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{results.currentBalance >= 0 ? 'Aktuálně přebývá:' : 'Aktuálně dlužíte:'}</span>
                        <span>{formatCZK(Math.abs(results.currentBalance))}</span>
                      </div>
                    </div>

                    <div style={{ padding: '15px', borderRadius: '15px', background: results.avgUnitsPerDay <= results.targetUnitsPerDay ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: results.avgUnitsPerDay <= results.targetUnitsPerDay ? '#10b981' : '#ef4444', fontSize: '0.75rem', marginBottom: '10px' }}>
                        <TrendingUp size={16} /> KRITICKÉ TEMPO SPOTŘEBY
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>REÁLNĚ PÁLÍTE</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{results.avgUnitsPerDay.toFixed(2)} {displayUnit}</span>
                        </div>
                        <ArrowRight size={16} color="rgba(255,255,255,0.2)" />
                        <div style={{ textAlign: 'center', flex: 1 }}>
                          <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>MUSÍTE STÁHNOUT NA</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3b82f6' }}>{results.targetUnitsPerDay.toFixed(2)} {displayUnit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ opacity: 0.3, textAlign: 'center' }}>
                  <Activity size={48} style={{ margin: '0 auto 15px', display: 'block' }} color={currentProfile.color} />
                  <p>Zadejte data z faktury a měřidla</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* --- STRATEGICKÁ SEKCE: "Román o přežití" --- */}
      <div className="no-print">
        <GlassCard style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
            <LineChart size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Jak se vyhnout nedoplatku?</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#10b981" /> Samoodečty jsou klíč
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Nedovolte dodavateli, aby vaši spotřebu odhadoval podle "historických tabulek". Pokud šetříte, 
                zadejte <strong>mimořádný samoodečet</strong> do portálu distributora. Tím zreálníte své zálohy 
                a vyhnete se šoku při ročním vyúčtování.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={22} color="#ef4444" /> Pozor na distribuční sazby
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Cena za jednotku není vše. Pokud se vaše spotřeba výrazně změnila (např. už netopíte plynem, ale elektřinou), 
                vaše stávající <strong>kapacita jističe nebo sazba (D02d vs D57d)</strong> může být extrémně nevýhodná. 
                Zkontrolujte fixní platby.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <History size={22} color="#3b82f6" /> Sezónní výkyvy
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Kalkulačka počítá s lineární spotřebou. Nezapomeňte, že u plynu "propálíte" 
                <strong> 70 % celoroční spotřeby</strong> během 4 zimních měsíců. Pokud vám teď v říjnu vychází 
                mírný přeplatek, v lednu se může situace dramaticky změnit.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default EnergyCalculator;