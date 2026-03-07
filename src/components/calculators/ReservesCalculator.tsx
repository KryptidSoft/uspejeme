import React, { useState, useMemo, useEffect } from 'react';
import { 
  PiggyBank, 
  Share2, 
  Calculator, 
  Lightbulb, 
  ShieldCheck, 
  TrendingUp, 
  BookOpen, 
  HeartPulse, 
  Target,
  ArrowRightCircle
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateReserves } from '../../utils/calculations/reserves';
import { formatCZK } from '../../utils/calculations/mathHelpers';
import { useBusinessData } from '../../hooks/useBusinessData'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ReservesCalculator: React.FC = () => {
  const { data } = useBusinessData(); 
  
  const [inputs, setInputs] = useState({
    monthlyExpenses: data.monthlyExpenses || 40000,
    targetMonths: 6,
    savingMonths: 12
  });

  const [results, setResults] = useState<any>(null);

  // SYNCHRONIZACE: Reakce na změnu nákladů v globálním stavu
  useEffect(() => {
    if (data.monthlyExpenses) {
      setInputs(prev => ({ ...prev, monthlyExpenses: data.monthlyExpenses }));
    }
  }, [data.monthlyExpenses]);

  // Automatický první výpočet a aktualizace při změně vstupů
  useEffect(() => {
    handleCalculate();
  }, [inputs]);

  const handleCalculate = () => {
    const res = calculateReserves(inputs);
    setResults(res);
  };

  const handleShare = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      exp: inputs.monthlyExpenses.toString(),
      tm: inputs.targetMonths.toString(),
      sm: inputs.savingMonths.toString()
    });
    navigator.clipboard.writeText(`${baseUrl}?${params.toString()}`).then(() => {
        alert("Strategie rezervy zkopírována do schránky!");
    });
  };

  const chartData = useMemo(() => {
    if (!results) return null;
    const baseSafety = inputs.monthlyExpenses * Math.min(inputs.targetMonths, 3);
    const extraSafety = Math.max(0, results.totalTarget - baseSafety);
    return {
      labels: ['Základní přežití (3m)', 'Bezpečnostní polštář'],
      datasets: [{
        data: [baseSafety, extraSafety],
        backgroundColor: ['#3b82f6', '#10b981'],
        borderColor: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)'],
        borderWidth: 2,
        hoverOffset: 10,
        borderRadius: 5,
      }],
    };
  }, [results, inputs]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '25px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.2rem', marginBottom: '10px', fontWeight: '800' }}>Finanční rezerva: Váš "fuck-off" fond</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Rezerva není jen hromada peněz na horší časy. Je to <strong>nástroj svobody</strong>. Umožňuje vám odmítat toxické klienty, 
          investovat do rozvoje a spát v klidu, i když trh zrovna kolísá.
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PiggyBank size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Plánování polštáře</h2>
          </div>
          <button onClick={handleShare} className="nav-item" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', padding: '8px 15px', color: 'var(--primary)' }}>
            <Share2 size={14} /> SDÍLET SCÉNÁŘ
          </button>
        </div>

        <div className="calculator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="inputs-section">
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontSize: '0.9rem', color: 'var(--text)' }}>
               <Target size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} color="var(--primary)" />
               <strong>Synchronizováno:</strong> Měsíční náklady <strong>{formatCZK(data.monthlyExpenses)}</strong> se automaticky propisují z vaší strategie.
            </div>

            <InputGroup 
              label="Měsíční výdaje (osobní + business)" 
              unit="Kč" 
              value={inputs.monthlyExpenses} 
              onChange={(val) => setInputs({...inputs, monthlyExpenses: parseFloat(val) || 0})} 
              tooltip="Vše, co musíte měsíčně zaplatit: nájem, jídlo, SW, daně, pojištění. Pokud jste si nastavili hodinovku, tato data už máte správně."
            />
            <InputGroup 
              label={`Cílový klid: ${inputs.targetMonths} měsíců`} 
              unit="měs" 
              type="range" 
              min={3} 
              max={24} 
              value={inputs.targetMonths} 
              onChange={(val) => setInputs({...inputs, targetMonths: parseFloat(val) || 0})} 
              tooltip="Na jak dlouho dopředu chcete mít 'předplacený život'? Expertům doporučujeme 6-12 měsíců."
            />
            <InputGroup 
              label="Během kolika měsíců ji vytvoříte?" 
              unit="měsíců" 
              value={inputs.savingMonths} 
              onChange={(val) => setInputs({...inputs, savingMonths: parseFloat(val) || 0})} 
              tooltip="Za jak dlouho se chcete dostat na cílovou částku. Čím kratší doba, tím více musíte měsíčně odložit."
            />
          </div>

          <div className="results-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {results && chartData ? (
              <div className="fade-in" style={{ width: '100%', maxWidth: '300px', position: 'relative' }}>
                <Doughnut data={chartData} options={{ plugins: { legend: { display: false } }, cutout: '78%' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Cílová rezerva</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white' }}>{formatCZK(results.totalTarget)}</div>
                </div>
                
                <div style={{ marginTop: '35px', textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '5px' }}>Měsíčně musíte odložit:</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{formatCZK(results.monthlySavingNeeded)}</div>
                </div>

                <div style={{ marginTop: '20px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Lightbulb size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: '1.4', color: 'var(--text-dim)' }}>
                     Tato částka by měla být započtena ve vaší <strong>hodinové sazbě</strong> jako položka "rezervy".
                  </p>
                </div>
              </div>
            ) : (
               <div style={{ opacity: 0.3, textAlign: 'center' }}>
                 <Calculator size={64} style={{ marginBottom: '15px' }} />
                 <p>Upravte parametry pro výpočet</p>
               </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* --- EDUKATIVNÍ SEKCE: HLOUBKOVÝ PRŮVODCE --- */}
      <div className="no-print">
        <GlassCard style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Strategie budování rezervy</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#3b82f6" /> Úrovně bezpečí
              </h3>
              <ul style={{ padding: 0, listStyle: 'none', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '10px' }}><strong>1. Úroveň (3 měsíce):</strong> Základní přežití. Pokryje nečekané výpadky nebo krátkou nemoc.</li>
                <li><strong>2. Úroveň (6+ měsíců):</strong> Svoboda. Můžete říct "ne" špatným zakázkám a investovat do velkých změn.</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HeartPulse size={22} color="#ef4444" /> Psychologický efekt
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Prázdný bankovní účet vytváří "mentální tunelové vidění". Člověk pak dělá špatná rozhodnutí pod tlakem. 
                Rezerva vám vrací <strong>kognitivní kapacitu</strong> k tomu, abyste mohli o svém podnikání přemýšlet strategicky.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} color="#10b981" /> Kam s ní?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Rezerva není investice. Musí být <strong>likvidní</strong> (dostupná ihned). Ideální je spořicí účet oddělený od hlavního 
                podnikatelského účtu, aby vás nelákalo z ní "ujídat" na běžný provoz.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '35px', padding: '20px', background: 'rgba(59, 130, 246, 0.03)', borderRadius: '15px', border: '1px dashed var(--primary)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ArrowRightCircle size={30} color="var(--primary)" />
            <p style={{ margin: 0, fontSize: '1rem', color: 'white' }}>
              <strong>Změnily se vaše náklady?</strong> Upravte je v <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Hodinové sazbě</span> a tato kalkulačka se okamžitě přizpůsobí.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ReservesCalculator;