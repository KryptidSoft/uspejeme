import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Target, Settings2, Activity, Wallet, HeartPulse, 
  AlertTriangle, Printer, Share2, HelpCircle 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine 
} from 'recharts';

import { useBusinessData } from '../hooks/useBusinessData';
import { formatCZK } from '../utils/calculations/mathHelpers';
import { calculateDashboardStats } from '../utils/calculations/businessLogic';
import { exportToPDF } from '../utils/exportHelper';

const useMounted = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return mounted;
};

// --- TYPY A POMOCNÉ KOMPONENTY ---

interface MetricRowProps {
  label: string;
  value: string | number;
  color?: string;
  link?: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, color, link }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => link && navigate(link)}
      className="metric-row"
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px', borderRadius: '12px', transition: '0.2s',
        cursor: link ? 'pointer' : 'default',
        background: 'rgba(255,255,255,0.02)'
      }}
    >
      <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>{label}</span>
      <span style={{ fontWeight: 'bold', color: color || '#fbbf24' }}>{value}</span>
    </div>
  );
};

interface DashboardChartsProps {
  stats: any; // sem můžeš dát konkrétnější typ, pokud máš
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  const mounted = useMounted();
  // Detekce mobilu přímo v JS, aby se grafy nehádaly s CSS
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  // --- DATA PRO KOLÁČOVÝ GRAF ---
  const revenueData = [
    { name: 'Čistý zisk', value: stats.disposableNet, color: '#22c55e' },
    { name: 'Daně', value: stats.taxLiability, color: '#ef4444' },
    { name: 'Náklady', value: stats.exp, color: '#3b82f6' },
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0);
  const revenueDataWithPercent = revenueData.map(item => ({
    ...item,
    percent: totalRevenue > 0 ? (item.value / totalRevenue) : 0
  }));

  // --- DATA PRO BAR GRAF ---
  const workloadData = [
    { 
      name: 'Zátěž', 
      'Bod přežití': stats.survivalHours, 
      'Cílový počet hodin': stats.requiredHours 
    }
  ];

  return (
    <div className="calculator-grid" style={{ marginBottom: '30px' }}>
      
      {/* --- KOLÁČOVÝ GRAF --- */}
      <div className="glass-card" style={{ padding: '25px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Distribuce měsíčního příjmu
        </h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 250}>
            <PieChart>
              <Pie
                data={revenueDataWithPercent}
                innerRadius={isMobile ? 50 : 60}
                outerRadius={isMobile ? 70 : 85}
                paddingAngle={8}
                dataKey="value"
                cx="50%"
                cy={isMobile ? "40%" : "50%"} // Na mobilu výš, pod ním je legenda
                label={({ percent }) => {
  const val = percent ? Math.round(percent * 100) : 0;
  return `${val}%`;
}}
                labelLine={false}
              >
                {revenueDataWithPercent.map(entry => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                trigger="click"
                contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ fontSize: '0.8rem' }}
                formatter={(value: any) => [`${Number(value).toLocaleString()} Kč`, "Částka"]}
              />
              <Legend 
                iconType="circle" 
                layout={isMobile ? "horizontal" : "vertical"} 
                verticalAlign={isMobile ? "bottom" : "middle"} 
                align={isMobile ? "center" : "right"}
                wrapperStyle={isMobile ? { paddingTop: '20px' } : { paddingLeft: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- BAR GRAF --- */}
      <div className="glass-card" style={{ padding: '25px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>
          Analýza časové investice
        </h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workloadData} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <XAxis type="number" hide domain={[0, Math.max(stats.requiredHours, 160)]} />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              />
              <Legend verticalAlign="bottom" align="center" />
              <Bar dataKey="Bod přežití" fill="#ef4444" barSize={35} radius={[0,4,4,0]} />
              <Bar dataKey="Cílový počet hodin" fill="#fbbf24" barSize={35} radius={[0,4,4,0]} />
              <ReferenceLine 
                x={130} 
                stroke="#444" 
                strokeDasharray="3 3" 
                label={{ position: 'top', value: 'Kapacita (130h)', fill: '#666', fontSize: 10 }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
          {stats.workload > 100 ? '⚠️ Jste nad udržitelnou kapacitou!' : 'Vše v normě udržitelnosti.'}
        </div>
      </div>

    </div>
  );
};

// --- HLAVNÍ KOMPONENTA ---

export const Dashboard: React.FC = () => {
  const { data, updateData } = useBusinessData();
  const [_, setIsGuideOpen] = React.useState(false);
  const stats = useMemo(() => calculateDashboardStats(data), [data]);
  const handlePdfExport = () => {
    const filename = `Report_${data.companyName || 'OSVC'}_2026`;
    const title = `OSVČ Navigátor: ${data.companyName || 'Finanční report'}`;
    
    // Definujeme hlavičky tabulky pro tvůj exportér
    const tableHead = ["Ukazatel", "Hodnota"];
    
    // Připravíme data do řádků
    const tableRows = [
      ["Název subjektu", data.companyName || "Neuvedeno"],
      ["Roční obrat (odhad)", formatCZK(stats.targetRevenue)],
      ["Čistý měsíční zisk", formatCZK(stats.disposableNet)],
      ["Daňová zátěž", formatCZK(stats.taxLiability)],
      ["Hodinová sazba", formatCZK(data.hourlyRate)],
      ["Zdraví podnikání", `${Math.round(stats.healthScore)}%`],
      ["Finanční rezerva", `${Math.floor(stats.runway)} měsíců`],
      ["Pracovní vytížení", `${stats.workload}%`]
    ];

    // Zavoláme tvůj exportér se 4 parametry
    exportToPDF(filename, title, tableRows, tableHead);
  };
  // ----------------------------------
  const getHealthColor = () => {
    if (stats.healthScore > 80) return '#22c55e';
    if (stats.healthScore > 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="fade-in app-container">
      
      {/* 1. HEADER */}
<header style={{ 
  display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', 
  gap: '20px', marginBottom: '30px', background: 'rgba(255,255,255,0.03)', 
  padding: 'clamp(15px, 4vw, 24px)', borderRadius: '24px', border: '1px solid var(--glass-border)' 
}}>
        <div style={{ width: '420px' }}>
          <input 
            type="text"
			placeholder="Vaše jméno/firma"
            value={data.companyName ?? ""}
            onChange={(e) => updateData({ companyName: e.target.value })}
            style={{ 
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  outline: 'none',
  width: '100%'
}}
          />
          <div style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px', marginTop: '5px' }}>OSVČ NAVIGÁTOR 2026</div>
        </div>
<div style={{ display: 'flex', gap: '10px' }}>
  {/* Nápověda - Skleněná modrá */}
  <button 
    onClick={() => setIsGuideOpen(true)} 
    className="util-btn"
    style={{ 
      background: 'rgba(59, 130, 246, 0.08)', 
      border: '1px solid rgba(59, 130, 246, 0.2)',
      color: '#60a5fa'
    }}
  >
    <HelpCircle size={18} />
  </button>

{/* Tisk - Skleněná zelená */}
<button 
  onClick={handlePdfExport} // Tady voláme tu novou funkci, co jsme vytvořili
  className="util-btn"
  style={{ 
    background: 'rgba(34, 197, 94, 0.08)', 
    border: '1px solid rgba(34, 197, 94, 0.2)',
    color: '#4ade80' 
  }}
>
  <Printer size={18} />
</button>

  {/* Sdílet - Skleněná zlatá */}
  <button 
    className="util-btn" 
    style={{ 
      background: 'rgba(251, 191, 36, 0.08)', 
      border: '1px solid rgba(251, 191, 36, 0.3)',
      color: '#fbbf24'
    }}
  >
    <Share2 size={18} />
  </button>
</div>
      </header>

      {/* 2. HLAVNÍ METRIKY (Health Score atd.) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: 'clamp(15px, 5vw, 30px)', textAlign: 'center' }}>
          <HeartPulse size={48} color={getHealthColor()} style={{ marginBottom: '15px' }} />
          <div style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '5px' }}>ZDRAVÍ PODNIKÁNÍ</div>
          <div style={{ fontSize: '3.5rem', fontWeight: '900', color: getHealthColor() }}>{Math.round(stats.healthScore)}%</div>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            {stats.healthScore > 80 ? 'Systém je stabilní a profitabilní.' : 'Vyžaduje optimalizaci sazeb/času.'}
          </p>
        </div>

        <div className="glass-card" style={{ 
          padding: '30px', 
          background: stats.runway >= 3 ? 'linear-gradient(135deg, rgba(6,78,59,0.2), rgba(2,44,34,0.4))' : 'linear-gradient(135deg, rgba(69,10,10,0.2), rgba(26,5,5,0.4))'
        }}>
          <Shield size={32} color={stats.runway >= 3 ? '#22c55e' : '#ef4444'} />
          <div style={{ marginTop: '15px' }}>
            <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>FINANČNÍ REZERVA</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{Math.floor(stats.runway)} měsíců</div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '10px' }}>
              <div style={{ width: `${Math.min((stats.runway/12)*100, 100)}%`, height: '100%', background: '#22c55e', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Activity size={32} color={stats.workload > 110 ? '#ef4444' : '#fbbf24'} />
            {stats.workload > 110 && <AlertTriangle color="#ef4444" size={24} />}
          </div>
          <div style={{ marginTop: '15px' }}>
            <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>PRACOVNÍ VYTÍŽENÍ</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stats.workload > 110 ? '#ef4444' : 'white' }}>{stats.workload}%</div>
            <div style={{ opacity: 0.5, fontSize: '0.85rem' }}>K dosažení cíle stačí odpracovat {stats.requiredHours}hodin měsíčně</div>
          </div>
        </div>
      </div>

      {/* NOVÁ SEKCE: GRAFY */}
      <DashboardCharts stats={stats} />

      {/* 3. DETAILNÍ TABULKY */}
      <div className="smart-grid" style={{ marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Target color="#fbbf24" size={20} />
            <h3 style={{ margin: 0 }}>Ekonomické cíle</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <MetricRow label="Celkový příjem" value={formatCZK(stats.targetRevenue)} />
            <MetricRow label="Daňová povinnost" value={formatCZK(stats.taxLiability)} color="#ef4444" />
            <MetricRow label="Měsíční náklady (upravit)" value={formatCZK(stats.exp)} link="/planner" />
			<MetricRow label="Čistý měsíční přebytek" value={formatCZK(stats.disposableNet)} color="#22c55e" link="/investice" />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Wallet color="#3b82f6" size={20} />
            <h3 style={{ margin: 0 }}>Udržitelnost</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<MetricRow label="Efektivní hod. sazba" value={formatCZK(stats.effectiveRate)} />
            <MetricRow label="Bod přežití" value={`${stats.survivalHours} h / měs.`} color="#ef4444" />
            <MetricRow label="Riziko hl. klienta (upravit)" value={`${stats.singleClientRisk} %`} color={stats.singleClientRisk > 50 ? '#ef4444' : '#fbbf24'} link="/audit/rizika" />
            <MetricRow label="Bezpečná měs. investice" value={formatCZK(stats.investAmount)} color="#ec4899" link="/investice" />
          </div>
        </div>
      </div>

{/* 4. SIMULÁTOR */}
<div style={{ 
  marginTop: '30px', padding: 'clamp(15px, 5vw, 30px)', borderRadius: '24px', 
  background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' 
}}>
        <div style={{ marginBottom: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings2 size={24} color="#fbbf24" />
            <h3 style={{ margin: 0 }}>Rychlá simulace parametrů</h3>
          </div>
          <p style={{ 
            fontSize: '0.75rem', 
            opacity: 0.5, 
            margin: '8px 0 0 34px', 
            fontStyle: 'italic',
            lineHeight: '1.4',
            maxWidth: '600px'
          }}>
            Změna parametrů slouží pro plánování. Skutečné výsledky závisí na realizovaných fakturách a nákladech.
          </p>
        </div>

        <div className="smart-grid" style={{ gap: '30px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>Cílový čistý příjem: {formatCZK(data.desiredNetIncome)}</label>
            <input 
              type="range" min="30000" max="300000"
              step="5000"
              value={data.desiredNetIncome}
              onChange={(e) => updateData({ desiredNetIncome: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#fbbf24' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>Hodinová sazba: {formatCZK(data.hourlyRate)}</label>
            <input 
              type="range" min="300" max="5000" step="50"
              value={data.hourlyRate}
              onChange={(e) => updateData({ hourlyRate: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>Aktuální rezerva: {formatCZK(data.reserves)}</label>
            <input 
              type="range" min="0" max="3000000"
              step="30000"
              value={data.reserves}
              onChange={(e) => updateData({ reserves: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#22c55e' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};