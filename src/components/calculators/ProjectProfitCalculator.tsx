import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateProjectProfit, type ProjectInput, type ProjectResult } from '../../utils/calculations/projectProfit';
import { getProfitColor, formatCZK } from '../../utils/calculations/mathHelpers';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { 
  Plus, 
  Calculator, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  TrendingDown, 
  Briefcase,
  AlertCircle,
  Zap,
  BookOpen
} from 'lucide-react';
import { useBusinessData } from '../../hooks/useBusinessData';

export const ProjectProfitCalculator: React.FC = () => {
  const { data } = useBusinessData();
  
  // 1. SAZBA: Inicializace sazby přímo z globálního úložiště
  // Pokud jste v HourlyRateCalculatoru vypočítali 1250 Kč, bude tady.
  const [hourlyRate, setHourlyRate] = useState(data.hourlyRate || 800);

  const [projects, setProjects] = useState<ProjectInput[]>([
    {
      name: 'Ukázkový projekt', 
      client: '', 
      price: 50000, 
      materialCosts: 2000, 
      softwareCosts: 1000,
      energyCosts: 0, 
      otherCosts: 0, 
      prepHours: 5, 
      workHours: 30,
      adminHours: 5, 
      riskFactor: 0.1,
    },
  ]);
  const [results, setResults] = useState<ProjectResult[] | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // 2. SYNCHRONIZACE: Sledujeme změnu globální sazby
  // Pokud si v jiném tabu upravíte hodinovku, projekty zde se na to připraví
  useEffect(() => {
    if (data.hourlyRate > 0) {
      setHourlyRate(data.hourlyRate);
    }
  }, [data.hourlyRate]);

  // 3. AUTOMATICKÝ PŘEPOČET: 
  // Ve vašem původním kódu jste musel kliknout na tlačítko. 
  // Je lepší, když se výsledky aktualizují samy, jakmile se změní sazba nebo data.
  useEffect(() => {
    const calculatedResults = calculateProjectProfit(projects, hourlyRate);
    setResults(calculatedResults);
  }, [projects, hourlyRate]);

  const handleCalculate = () => {
    // Ponecháno pro kompatibilitu s vaším tlačítkem, 
    // ale useEffect výše to teď dělá reaktivně.
    const calculatedResults = calculateProjectProfit(projects, hourlyRate);
    setResults(calculatedResults);
  };

  const addProject = () => {
    const newProject: ProjectInput = {
      name: '', client: '', price: 0, materialCosts: 0, softwareCosts: 0,
      energyCosts: 0, otherCosts: 0, prepHours: 0, workHours: 0,
      adminHours: 0, riskFactor: 0.1,
    };
    setProjects([...projects, newProject]);
    setExpandedIndex(projects.length);
  };

  const removeProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
    if (expandedIndex === index) setExpandedIndex(null);
  };
  
  const handleChange = (index: number, field: keyof ProjectInput, value: any) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const chartData = results ? {
    labels: results.map((r) => r.name || 'Projekt'),
    datasets: [
      {
        label: 'Čistý zisk po zaplacení vaší mzdy (Kč)',
        data: results.map((r) => r.adjustedProfit),
        backgroundColor: results.map((r) => getProfitColor(r.adjustedProfit, 0.6)),
        borderColor: results.map((r) => getProfitColor(r.adjustedProfit, 1)),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  } : null;

  return (
    <div className="fade-in app-container" style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      
      {/* --- STRATEGICKÝ ÚVOD --- */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '15px', fontWeight: '800' }}>Profitabilita zakázek</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
          Vyděláváte, nebo jen "točíte peníze"? Tato analýza odečte od ceny zakázky nejen přímé náklady, 
          ale i <strong>hodnotu vašeho času</strong>. Skutečný zisk je to, co zbude, až zaplatíte i sami sobě.
        </p>
      </div>

      <GlassCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
          <Briefcase size={28} color="var(--primary)" />
          <h2 style={{ margin: 0 }}>Analýza portfolia projektů</h2>
        </div>

        {/* PROPOJENÁ SAZBA */}
        <div style={{ marginBottom: '35px', padding: '20px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '15px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                <Zap size={18} color="var(--primary)" />
                <strong style={{ fontSize: '1rem' }}>S čím počítáme?</strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Používáme vaši hodinovku <strong>{formatCZK(hourlyRate)}</strong>. Pokud projekt po odečtení času skončí v plusu, tvoříte nadhodnotu. Pokud v mínusu, dotujete klienta ze svého.
              </p>
            </div>
            <div style={{ minWidth: '200px' }}>
              <InputGroup
                label="Upravit testovací sazbu"
                unit="Kč/h"
                value={hourlyRate}
                onChange={(val) => setHourlyRate(parseFloat(val) || 0)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {projects.map((p, index) => (
            <div key={index} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: `1px solid ${expandedIndex === index ? 'var(--primary)' : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.3s' }}>
              <div 
                style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: expandedIndex === index ? 'rgba(59, 130, 246, 0.05)' : 'transparent' }} 
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {index + 1}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{p.name || `Nepojmenovaná zakázka`}</h3>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {p.price > 0 && <span style={{ fontWeight: 'bold', color: 'var(--text-dim)' }}>{formatCZK(p.price)}</span>}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={(e) => { e.stopPropagation(); removeProject(index); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}>
                      <Trash2 size={18} />
                    </button>
                    {expandedIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </div>

              {expandedIndex === index && (
                <div className="fade-in" style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <InputGroup label="Název projektu" type="text" value={p.name} onChange={(val) => handleChange(index, 'name', val)} />
                    <InputGroup label="Cena zakázky (fakturovaná)" unit="Kč" value={p.price} onChange={(val) => handleChange(index, 'price', parseFloat(val) || 0)} />
                    <InputGroup label="Časová rezerva (Riziko)" step={0.1} value={p.riskFactor} onChange={(val) => handleChange(index, 'riskFactor', parseFloat(val) || 0)} tooltip="0.1 = přičte 10 % času jako rezervu na vícepráce." />
                  </div>

                  <div className="smart-grid" style={{ marginTop: '25px', gap: '20px' }}>
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                      <h4 style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Časové náklady (hodiny)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px' }}>
                        <InputGroup label="Příprava" unit="h" value={p.prepHours} onChange={(val) => handleChange(index, 'prepHours', parseFloat(val) || 0)} />
                        <InputGroup label="Realizace" unit="h" value={p.workHours} onChange={(val) => handleChange(index, 'workHours', parseFloat(val) || 0)} />
                        <InputGroup label="Admin" unit="h" value={p.adminHours} onChange={(val) => handleChange(index, 'adminHours', parseFloat(val) || 0)} />
                      </div>
                    </div>
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                      <h4 style={{ margin: '0 0 15px 0', fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Přímé náklady (Kč)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                        <InputGroup label="Materiál" value={p.materialCosts} onChange={(val) => handleChange(index, 'materialCosts', parseFloat(val) || 0)} />
                        <InputGroup label="Software" value={p.softwareCosts} onChange={(val) => handleChange(index, 'softwareCosts', parseFloat(val) || 0)} />
                        <InputGroup label="Energie/Jiné" value={p.energyCosts} onChange={(val) => handleChange(index, 'energyCosts', parseFloat(val) || 0)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

<div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap' }}>
  <button
    onClick={addProject}
    className="btn btn-glass"
    style={{ flex: 1 }}
  >
    <Plus size={18} /> PŘIDAT DALŠÍ PROJEKT
  </button>

  <button
    onClick={handleCalculate}
    className="btn"
    style={{ flex: 2, fontWeight: 'bold' }}
  >
    <Calculator size={18} /> ANALYZOVAT ZISKOVOST
  </button>
</div>

        {results && chartData && (
          <div className="fade-in" style={{ marginTop: '50px', paddingTop: '40px', borderTop: '2px solid var(--border)' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>Srovnání reálného přínosu</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Sloupec pod nulou znamená, že na projektu reálně proděláváte svůj čas.</p>
            </div>
            <div style={{ height: '400px', width: '100%', background: 'rgba(0,0,0,0.1)', padding: 'var(--card-padding)', borderRadius: '20px', overflowX: 'auto' }}>
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                  }
                } as any} 
              />
            </div>
          </div>
        )}
      </GlassCard>

      {/* --- EDUKATIVNÍ SEKCE: STRATEGIE ZAKÁZEK --- */}
      <div className="no-print">
        <GlassCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
            <BookOpen size={32} color="var(--primary)" />
            <h2 style={{ margin: 0 }}>Jak číst výsledky?</h2>
          </div>

          <div className="smart-grid">
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target size={22} color="#10b981" /> Bod nuly
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Pokud je projekt na nule, znamená to, že jste si zaplatili svou hodinovku, ale nic navíc. To je v pořádku, ale 
                vaše firma neroste. Skutečný zisk začíná až nad touto hranicí.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingDown size={22} color="#ef4444" /> Past "hodného" klienta
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Záporné výsledky často ukazují na zakázky, které bereme z nostalgie nebo strachu. Každý projekt v mínusu 
                vám bere energii a čas, který byste mohli věnovat projektům v plusu.
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={22} color="#fbbf24" /> Neviditelný čas
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                Všimněte si, jak se zisk propadne, když poctivě připočítáte administrativu a přípravu. To jsou hodiny, 
                které většina freelancerů klientovi "daruje". Tady je vidíte černé na bílém.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProjectProfitCalculator;