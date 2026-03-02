import React, { useState, useMemo, useEffect } from 'react';
import { PiggyBank, Share2, Calculator, Info, Lightbulb, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateReserves } from '../../utils/calculations/reserves';
import { formatCZK } from '../../utils/calculations/mathHelpers';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ReservesCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    monthlyExpenses: 30000,
    targetMonths: 6,
    savingMonths: 12
  });

  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const exp = params.get('exp');
    const tm = params.get('tm');
    const sm = params.get('sm');

    if (exp || tm || sm) {
      const newInputs = {
        monthlyExpenses: exp ? parseFloat(exp) : inputs.monthlyExpenses,
        targetMonths: tm ? parseFloat(tm) : inputs.targetMonths,
        savingMonths: sm ? parseFloat(sm) : inputs.savingMonths,
      };
      setInputs(newInputs);
      setResults(calculateReserves(newInputs));
    }
  }, []);

  const handleCalculate = () => {
    const res = calculateReserves(inputs);
    setResults(res);
    localStorage.setItem('last_reserves_result', JSON.stringify({ targetMonths: inputs.targetMonths }));
  };

  const handleShare = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      exp: inputs.monthlyExpenses.toString(),
      tm: inputs.targetMonths.toString(),
      sm: inputs.savingMonths.toString()
    });
    navigator.clipboard.writeText(`${baseUrl}?${params.toString()}`).then(() => {
        alert("Scénář zkopírován do schránky!");
    });
  };

  const chartData = useMemo(() => {
    if (!results) return null;
    const baseSafety = inputs.monthlyExpenses * Math.min(inputs.targetMonths, 3);
    const extraSafety = Math.max(0, results.totalTarget - baseSafety);
    return {
      labels: ['Základní rezerva (3m)', 'Komfortní polštář'],
      datasets: [{
        data: [baseSafety, extraSafety],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'],
        borderWidth: 2,
      }],
    };
  }, [results, inputs]);

  return (
    <GlassCard className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PiggyBank size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Finanční rezerva</h2>
        </div>
        <button onClick={handleShare} className="nav-item" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px' }}>
          <Share2 size={14} /> SDÍLET SCÉNÁŘ
        </button>
      </div>

      <div className="calculator-grid">
        {/* LEVÁ STRANA: TEXT + VSTUPY */}
        <div className="inputs-section">
          <div style={{ marginBottom: '20px', padding: '12px 15px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Máte dostatečný finanční polštář? Jako freelancer nemáte jistotu výplaty. Tahle kalkulačka vám spočítá, jak velkou rezervu potřebujete pro klidné spaní. Pamatujte: <strong>Rezerva vám nekupuje výnos, ale čas a svobodu</strong> říct „ne“ špatným zakázkám.
            </p>
          </div>

          <InputGroup 
            label="Měsíční výdaje" unit="Kč" value={inputs.monthlyExpenses} 
            onChange={(val) => setInputs({...inputs, monthlyExpenses: parseFloat(val) || 0})} 
            tooltip="Průměrná částka, kterou měsíčně utratíte. Slouží k určení velikosti jednoho měsíce rezervy."
          />
          <InputGroup 
            label={`Cíl: ${inputs.targetMonths} měsíců`} unit="měs" type="range" min={1} max={24} value={inputs.targetMonths} 
            onChange={(val) => setInputs({...inputs, targetMonths: parseFloat(val) || 0})} 
            tooltip="3 měsíce jsou nutné minimum, 6 měsíců standard pro bezpečí, 12+ měsíců pro naprostou svobodu."
          />
          <InputGroup 
            label="Doba spoření" unit="měsíců" value={inputs.savingMonths} 
            onChange={(val) => setInputs({...inputs, savingMonths: parseFloat(val) || 0})} 
            tooltip="Za jak dlouho chcete tuto rezervu vybudovat. Určí výši měsíční úspory."
          />
          <button className="calculate-btn" onClick={handleCalculate} style={{ width: '100%', marginTop: '20px' }}>
            SPOČÍTAT PLÁN
          </button>
        </div>

        {/* PRAVÁ STRANA: GRAF + DOPORUČENÍ */}
        <div className="results-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', minHeight: '250px' }}>
          {results ? (
            <div className="fade-in" style={{ width: '100%', maxWidth: '280px', position: 'relative' }}>
              <Doughnut data={chartData!} options={{ plugins: { legend: { display: false } }, cutout: '75%', responsive: true }} />
              <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Celkový cíl</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{formatCZK(results.totalTarget)}</div>
              </div>
              
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Měsíčně odložit:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--success)' }}>{formatCZK(results.monthlySavingNeeded)}</div>
              </div>

              {/* DYNAMICKÁ RADA POD VÝSLEDKEM */}
              <div style={{ marginTop: '15px', padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', border: '1px dashed #10b981', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px', color: '#10b981' }}>
                  <Lightbulb size={16} />
                  <strong style={{ fontSize: '0.85rem' }}>Konkrétní krok</strong>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0, lineHeight: '1.4' }}>
                  Nastavte si automatický převod <strong>{formatCZK(results.monthlySavingNeeded)}</strong> na spořicí účet hned po zaplacení faktur. Ideální rezerva pro OSVČ je 3–6 měsíců.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.2, textAlign: 'center' }}>
               <Calculator size={64} strokeWidth={1} style={{ marginBottom: '15px' }} />
               <p>Zadejte data pro vizualizaci rezervy</p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};