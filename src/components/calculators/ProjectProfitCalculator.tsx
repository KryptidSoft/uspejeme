import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { InputGroup } from '../ui/InputGroup';
import { calculateProjectProfit, type ProjectInput, type ProjectResult } from '../../utils/calculations/projectProfit';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Plus, Calculator, Trash2 } from 'lucide-react';

export const ProjectProfitCalculator: React.FC = () => {
  const [hourlyRate, setHourlyRate] = useState(500);
  const [projects, setProjects] = useState<ProjectInput[]>([
    {
      name: '',
      client: '',
      price: 0,
      materialCosts: 0,
      softwareCosts: 0,
      energyCosts: 0,
      otherCosts: 0,
      prepHours: 0,
      workHours: 0,
      adminHours: 0,
      riskFactor: 0.1,
    },
  ]);
  const [results, setResults] = useState<ProjectResult[] | null>(null);

  const handleCalculate = () => {
    const calculatedResults = calculateProjectProfit(projects, hourlyRate);
    setResults(calculatedResults);
  };

  const handleChange = (index: number, key: keyof ProjectInput, value: number | string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [key]: value };
    setProjects(newProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: '',
        client: '',
        price: 0,
        materialCosts: 0,
        softwareCosts: 0,
        energyCosts: 0,
        otherCosts: 0,
        prepHours: 0,
        workHours: 0,
        adminHours: 0,
        riskFactor: 0.1,
      },
    ]);
  };

  const removeProject = (index: number) => {
    const newProjects = projects.filter((_, i) => i !== index);
    setProjects(newProjects);
  };

  // Konfigurace barev a dat grafu
  const chartData = results ? {
    labels: results.map((r) => r.name || 'Projekt'),
    datasets: [
      {
        label: 'Očištěný zisk (Kč)',
        data: results.map((r) => r.adjustedProfit),
        backgroundColor: results.map((r) => {
          if (r.adjustedProfit <= 0) return 'rgba(239, 68, 68, 0.6)'; // Červená pro ztrátu
          return 'rgba(59, 130, 246, 0.6)'; // Modrá pro zisk
        }),
        borderColor: results.map((r) => {
          if (r.adjustedProfit <= 0) return '#ef4444';
          return '#3b82f6';
        }),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="fade-in">
      <GlassCard className="main-calculator-card">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>Profitabilní zakázky</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Analyzujte reálný výnos vašich projektů po odečtení nákladů a rizik.</p>
        </div>

        <div style={{ marginBottom: '30px', maxWidth: '300px' }}>
          <InputGroup
            label="Vaše hodnota času"
            unit="Kč/h"
            value={hourlyRate}
            onChange={(val) => setHourlyRate(parseFloat(val) || 0)}
            tooltip="Náklad na vaši vlastní práci, který kalkulačka započítá do výdajů projektu."
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {projects.map((p, index) => (
            <GlassCard key={index} style={{ borderLeft: '4px solid var(--primary)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>{p.name || `Nová zakázka ${index + 1}`}</h3>
                {projects.length > 1 && (
                  <button 
                    onClick={() => removeProject(index)}
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Trash2 size={16} /> Odstranit
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <InputGroup label="Název projektu" type="text" value={p.name} onChange={(val) => handleChange(index, 'name', val)} />
                <InputGroup label="Cena zakázky" unit="Kč" value={p.price} onChange={(val) => handleChange(index, 'price', parseFloat(val) || 0)} />
                <InputGroup label="Hodin práce" unit="h" value={p.workHours} onChange={(val) => handleChange(index, 'workHours', parseFloat(val) || 0)} />
                <InputGroup label="Riziko (0-1)" step={0.1} value={p.riskFactor} onChange={(val) => handleChange(index, 'riskFactor', parseFloat(val) || 0)} tooltip="0.1 = 10% rezerva na nečekané vícepráce." />
              </div>
              
              {/* Ostatní náklady - skryté v detailu nebo zjednodušené pro přehlednost */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                <InputGroup label="Materiál/Externisté" unit="Kč" value={p.materialCosts} onChange={(val) => handleChange(index, 'materialCosts', parseFloat(val) || 0)} />
                <InputGroup label="Ostatní náklady" unit="Kč" value={p.otherCosts} onChange={(val) => handleChange(index, 'otherCosts', parseFloat(val) || 0)} />
              </div>
            </GlassCard>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button 
            onClick={addProject} 
            className="calculate-btn"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
          >
            <Plus size={18} /> Přidat projekt
          </button>
          <button onClick={handleCalculate} className="calculate-btn">
            <Calculator size={18} /> Spočítat ziskovost
          </button>
        </div>

        {results && chartData && (
          <div className="fade-in" style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Vizualizace profitability</h3>
            <div style={{ height: '350px', width: '100%' }}>
              <Bar data={chartData} options={chartOptions as any} />
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};