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

// 1. Přidáme interface, aby TypeScript věděl, co kalkulačka vrací (řeší chybu 'any')
interface ReservesResult {
  totalTarget: number;
  monthlySavingNeeded: number;
  currentStatus?: string;
}

export const ReservesCalculator: React.FC = () => {
  const { data, updateData } = useBusinessData(); 
  
  const [inputs, setInputs] = useState({
    monthlyExpenses: data.monthlyExpenses || 40000,
    targetMonths: data.safetyBufferMonths || 6,
    savingMonths: 12
  });

  // --- 1. SYNCHRONIZACE BEZ EFFECTU ---
  // Pokud se změní globální data, "přetlačíme" lokální stav přímo při renderu.
  // To je legální React pattern pro synchronizaci props -> state.
  const [prevGlobalExpenses, setPrevGlobalExpenses] = useState(data.monthlyExpenses);
  if (data.monthlyExpenses !== prevGlobalExpenses) {
    setPrevGlobalExpenses(data.monthlyExpenses);
    setInputs(prev => ({ ...prev, monthlyExpenses: data.monthlyExpenses }));
  }

  // --- 2. VÝPOČET PŘES useMemo (místo useState + useEffect) ---
  // Tímto zmizí chyba na řádku 55 (setResults uvnitř efektu).
  const results = useMemo<ReservesResult>(() => {
    return calculateReserves(inputs);
  }, [inputs]);

  // --- 3. JEDINÝ EFEKT PRO ZÁPIS DO PROFILU ---
  // Efekty mají sloužit pro zápis ven (do DB/LocalStorage/Globálního stavu), ne pro vnitřní výpočty.
  useEffect(() => {
    if (results.totalTarget !== data.reserves || inputs.targetMonths !== data.safetyBufferMonths) {
      updateData({
        reserves: results.totalTarget,
        safetyBufferMonths: inputs.targetMonths
      });
    }
  }, [results.totalTarget, inputs.targetMonths, data.reserves, data.safetyBufferMonths, updateData]);

  // ... handleShare a zbytek return zůstává stejný ...

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
    const extraSafety = Math.max(0, (results?.totalTarget || 0) - baseSafety);
    
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
  }, [results, inputs.monthlyExpenses, inputs.targetMonths]);

  return (
    <div className="fade-in app-container">
      
  {/* --- STRATEGICKÝ ÚVOD (MAXIMÁLNÍ MINIMALISMUS) --- */}
  <div>
    <h1>Finanční rezerva: Váš "fuck-off" fond</h1>
    <h2>
      Rezerva není jen hromada peněz na horší časy. Je to <strong>nástroj svobody</strong>. 
      Umožňuje vám odmítat toxické klienty, investovat do rozvoje a spát v klidu, 
      i když trh zrovna kolísá.
    </h2>
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

        <div className="calculator-grid" style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', 
  gap: '40px', 
  alignItems: 'start' 
}}>
          <div className="inputs-section">
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)', fontSize: '0.9rem', color: 'var(--text)' }}>
               <Target size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} color="var(--primary)" />
               <strong>Synchronizováno:</strong> Měsíční náklady <strong>{formatCZK(data.monthlyExpenses)}</strong> se automaticky propisují z vaší strategie.
            </div>

<InputGroup 
  label="Měsíční výdaje (osobní + business)" 
  unit="Kč" 
  value={inputs.monthlyExpenses} 
  onChange={(val) => {
    const numVal = parseFloat(val) || 0;
    setInputs({ ...inputs, monthlyExpenses: numVal });
    updateData({ monthlyExpenses: numVal });
  }} 
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
                  <div style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', fontWeight: 'bold', color: 'white' }}>{formatCZK(results.totalTarget)}</div>
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
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Strategie budování rezervy</h2>
          </div>

          <div className="info-grid">
            {/* BOX 1 */}
            <div className="info-box">
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#3b82f6" /> Úrovně bezpečí
              </h3>
              <ul style={{ padding: 0, listStyle: 'none', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '10px' }}><strong>1. Úroveň (3 měsíce):</strong> Základní přežití. Pokryje nečekané výpadky nebo krátkou nemoc.</li>
                <li><strong>2. Úroveň (6+ měsíců):</strong> Svoboda. Můžete říct "ne" špatným zakázkám a investovat do velkých změn.</li>
              </ul>
            </div>

            {/* BOX 2 */}
            <div className="info-box">
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HeartPulse size={22} color="#ef4444" /> Psychologický efekt
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Prázdný bankovní účet vytváří "mentální tunelové vidění". Člověk pak dělá špatná rozhodnutí pod tlakem. 
                Rezerva vám vrací <strong>kognitivní kapacitu</strong> k tomu, abyste mohli o svém podnikání přemýšlet strategicky.
              </p>
            </div>

            {/* BOX 3 */}
            <div className="info-box">
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} color="#10b981" /> Kam s ní?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Rezerva není investice. Musí být <strong>likvidní</strong> (dostupná ihned). Ideální je spořicí účet oddělený od hlavního 
                podnikatelského účtu, aby vás nelákalo z ní "ujídat" na běžný provoz.
              </p>
            </div>
          </div>

          <div style={{ 
            marginTop: '35px', 
            padding: '20px', 
            background: 'rgba(59, 130, 246, 0.03)', 
            borderRadius: '15px', 
            border: '1px dashed var(--primary)', 
            display: 'flex', 
            flexWrap: 'wrap',
            alignItems: 'center', 
            gap: '15px' 
          }}>
            <ArrowRightCircle size={30} color="var(--primary)" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'white', flex: '1 1 250px' }}>
              <strong>Změnily se vaše náklady?</strong> Upravte je v <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>Hodinové sazbě</span> a tato kalkulačka se okamžitě přizpůsobí.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ReservesCalculator;