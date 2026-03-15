import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Target, Settings2, Activity, Wallet, HeartPulse, 
  AlertTriangle, Printer, Share2 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine 
} from 'recharts';

import { useBusinessData } from '../hooks/useBusinessData';
import { formatCZK } from '../utils/calculations/mathHelpers';
import { calculateDashboardStats } from '../utils/calculations/businessLogic';

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

// --- KOMPONENTA GRAFŮ ---

const DashboardCharts = ({ stats }: { stats: any }) => {
  // Data pro prstencový graf (Měsíční distribuce)
  const revenueData = [
    { name: 'Čistý zisk', value: stats.disposableNet, color: '#22c55e' },
    { name: 'Daně (odhad)', value: stats.taxLiability, color: '#ef4444' },
    { name: 'Fixní náklady', value: stats.exp, color: '#3b82f6' },
  ];

  // Data pro horizontální bar (Pracovní zatížení)
  const workloadData = [
    { 
      name: 'Hodinová zátěž', 
      'Bod přežití': stats.survivalHours, 
      'Cílový nájezd': stats.requiredHours 
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      
      {/* Koláč: Kam tečou peníze */}
      <div className="glass-card" style={{ padding: '25px', height: '320px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Distribuce měsíčního příjmu</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={revenueData}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
            >
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ fontSize: '0.8rem' }}
              formatter={(value: number) => formatCZK(value)}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar: Srovnání hodin */}
      <div className="glass-card" style={{ padding: '25px', height: '320px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px' }}>Analýza časové investice</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={workloadData} layout="vertical" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis type="number" hide domain={[0, Math.max(stats.requiredHours, 160)]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            />
            <Legend />
            <Bar dataKey="Bod přežití" fill="#ef4444" barSize={35} radius={[0, 4, 4, 0]} />
            <Bar dataKey="Cílový nájezd" fill="#fbbf24" barSize={35} radius={[0, 4, 4, 0]} />
            <ReferenceLine x={130} stroke="#444" strokeDasharray="3 3" label={{ position: 'top', value: 'Kapacita (130h)', fill: '#666', fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 'auto', fontSize: '0.8rem', opacity: 0.5, textAlign: 'center' }}>
          {stats.workload > 100 ? '⚠️ Jste nad udržitelnou kapacitou!' : 'Vše v normě udržitelnososti.'}
        </div>
      </div>

    </div>
  );
};

// --- HLAVNÍ KOMPONENTA ---

export const Dashboard: React.FC = () => {
  const { data, updateData } = useBusinessData();
  const navigate = useNavigate();
  const stats = useMemo(() => calculateDashboardStats(data), [data]);

  const getHealthColor = () => {
    if (stats.healthScore > 80) return '#22c55e';
    if (stats.healthScore > 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="dashboard-wrapper" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', color: 'white' }}>
      
      {/* 1. HEADER */}
      <header style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        marginBottom: '30px', background: 'rgba(255,255,255,0.03)', 
        padding: '20px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' 
      }}>
        <div>
          <input 
            type="text"
            value={data.companyName || "Strategický přehled"}
            onChange={(e) => updateData({ companyName: e.target.value })}
            style={{ 
              background: 'transparent', border: 'none', color: 'white', 
              fontSize: '1.5rem', fontWeight: 'bold', outline: 'none', width: '400px' 
            }}
          />
          <div style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px', marginTop: '5px' }}>OSVČ NAVIGÁTOR 2026</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => window.print()} className="util-btn"><Printer size={18} /> Tisk</button>
          <button className="util-btn" style={{ background: '#fbbf24', color: 'black', border: 'none' }}><Share2 size={18} /> Sdílet</button>
        </div>
      </header>

      {/* 2. HLAVNÍ METRIKY (Health Score atd.) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <HeartPulse size={48} color={getHealthColor()} style={{ marginBottom: '15px' }} />
          <div style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '5px' }}>HEALTH SCORE</div>
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
            <div style={{ opacity: 0.5, fontSize: '0.8rem' }}>AKTUÁLNÍ WORKLOAD</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stats.workload > 110 ? '#ef4444' : 'white' }}>{stats.workload}%</div>
            <div style={{ opacity: 0.5, fontSize: '0.85rem' }}>Potřebujete {stats.requiredHours}h / měsíc</div>
          </div>
        </div>
      </div>

      {/* NOVÁ SEKCE: GRAFY */}
      <DashboardCharts stats={stats} />

      {/* 3. DETAILNÍ TABULKY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Target color="#fbbf24" size={20} />
            <h3 style={{ margin: 0 }}>Ekonomické cíle</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <MetricRow label="Cílový obrat (Brutto)" value={formatCZK(stats.targetRevenue)} />
            <MetricRow label="Daňová povinnost" value={formatCZK(stats.taxLiability)} color="#ef4444" />
            <MetricRow label="Čistý měsíční přebytek" value={formatCZK(stats.disposableNet)} color="#22c55e" />
            <MetricRow label="Efektivní hod. sazba" value={formatCZK(stats.effectiveRate)} />
            <MetricRow label="Marže čistého zisku" value={`${stats.profitMargin.toFixed(1)} %`} color={stats.profitMargin > 30 ? '#22c55e' : '#fbbf24'} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Wallet color="#3b82f6" size={20} />
            <h3 style={{ margin: 0 }}>Udržitelnost</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <MetricRow label="Měsíční náklady (Fixní)" value={formatCZK(stats.exp)} />
            <MetricRow label="Bod přežití (Break-even)" value={`${stats.survivalHours} h / měs.`} color="#ef4444" />
            <MetricRow label="Závislost na hl. klientovi" value={`${stats.singleClientRisk} %`} color={stats.singleClientRisk > 50 ? '#ef4444' : '#fbbf24'} />
            <MetricRow label="Safe-to-Spend (Radost)" value={formatCZK(stats.safeToSpend)} color="#10b981" />
            <MetricRow label="Měsíční investice (ROI)" value={formatCZK(stats.investAmount)} color="#ec4899" link="/investice" />
          </div>
        </div>
      </div>

      {/* 4. SIMULÁTOR */}
      <div style={{ 
        marginTop: '30px', padding: '30px', borderRadius: '24px', 
        background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.1)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <Settings2 size={24} color="#fbbf24" />
          <h3 style={{ margin: 0 }}>Rychlá simulace parametrů</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '10px' }}>Cílový čistý příjem: {formatCZK(data.desiredNetIncome)}</label>
            <input 
              type="range" min="30000" max="300000" step="5000"
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
              type="range" min="0" max="2000000" step="10000"
              value={data.reserves}
              onChange={(e) => updateData({ reserves: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#22c55e' }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .util-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 10px 18px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: 0.2s;
        }
        .util-btn:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.02);
        }
        @media print {
          .util-btn, .dashboard-wrapper > div:last-child { display: none !important; }
          .dashboard-wrapper { background: white !important; color: black !important; padding: 0 !important; }
          .glass-card { border: 1px solid #eee !important; color: black !important; box-shadow: none !important; background: transparent !important; }
        }
      `}</style>
    </div>
  );
};