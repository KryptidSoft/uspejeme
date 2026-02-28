import React, { useState, useMemo } from 'react';
import { Activity, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateStability } from '../../utils/calculations/stability';

export const StabilityCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    reservesMonths: 3,
    incomeSustainability: 70,
    workload: 80,
    roiEfficiency: 60,
    expenseStability: 90
  });

  const results = useMemo(() => calculateStability(inputs), [inputs]);

  const handleImport = () => {
    const savedReserves = localStorage.getItem('last_reserves_result');
    const savedROI = localStorage.getItem('last_roi_result');
    
    setInputs(prev => ({
      ...prev,
      reservesMonths: savedReserves ? JSON.parse(savedReserves).targetMonths : prev.reservesMonths,
      roiEfficiency: savedROI ? Math.min(JSON.parse(savedROI).discountedROI, 100) : prev.roiEfficiency,
    }));
    
    alert("Data z ostatních kalkulaček byla importována!");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <GlassCard className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Diagnostika stability</h2>
        </div>
        
        <button 
          onClick={handleImport}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 16px', 
            background: 'rgba(59, 130, 246, 0.2)', 
            border: '1px solid var(--primary)', 
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <Download size={16} /> IMPORT DATA
        </button>
      </div>

      <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="inputs-section">
          {/* TADY JSOU TY DOPLNĚNÉ TOOLTIPY */}
          <InputGroup
            label="Dostupná rezerva"
            unit="měsíců"
            type="range" min={0} max={12}
            value={inputs.reservesMonths}
            onChange={(val) => setInputs({...inputs, reservesMonths: parseFloat(val) || 0})}
            tooltip="Počet měsíců, po které dokážete pokrýt své náklady bez jakéhokoliv dalšího příjmu."
          />
          <InputGroup
            label="Udržitelnost příjmů"
            unit="%"
            type="range" min={0} max={100}
            value={inputs.incomeSustainability}
            onChange={(val) => setInputs({...inputs, incomeSustainability: parseFloat(val) || 0})}
            tooltip="Jak moc jsou vaše příjmy stabilní? (100% = dlouhodobé kontrakty, 0% = náhodné zakázky)"
          />
          <InputGroup
            label="Pracovní vytížení"
            unit="%"
            type="range" min={0} max={150}
            value={inputs.workload}
            onChange={(val) => setInputs({...inputs, workload: parseFloat(val) || 0})}
            tooltip="Vaše aktuální vytížení. Nad 100 % hrozí vyhoření a dlouhodobá nestabilita."
          />
          <InputGroup
            label="Efektivita (ROI)"
            unit="%"
            type="range" min={0} max={100}
            value={inputs.roiEfficiency}
            onChange={(val) => setInputs({...inputs, roiEfficiency: parseFloat(val) || 0})}
            tooltip="Nakolik se vaše investice (časové i finanční) vrací zpět do podnikání."
          />
        </div>

        <div className="results-section" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: getScoreColor(results.score) }}>
            {results.score}%
          </div>
          <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>Index stability</div>
          
          <div style={{ marginTop: '20px', textAlign: 'left', display: 'grid', gap: '10px' }}>
             {Object.entries(results.factors).map(([key, val]: [string, any]) => (
               <div key={key}>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{key}</div>
                 <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '4px' }}>
                   <div style={{ height: '100%', width: `${val}%`, background: getScoreColor(val), borderRadius: '3px' }} />
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};