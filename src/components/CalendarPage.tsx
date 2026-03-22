import React, { useState } from 'react';
import { ALL_DEADLINES } from '../data/deadlines';
import { GlassCard } from './ui/GlassCard';
import { ArrowLeft, ChevronRight, CheckCircle2, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type BusinessType = 'osvc_pausal' | 'osvc_hlavni' | 'sro' | 'vse';

interface CalendarPageProps {
  userType: 'osvc_pausal' | 'osvc_hlavni' | 'sro' | 'vse';
}
export const CalendarPage: React.FC<CalendarPageProps> = ({ userType }) => {
  const [activeYear, setActiveYear] = useState(2026);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BusinessType | 'all'>('all');
  
  const today = new Date();
  const months = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
  const days = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

  const getTypeStyle = (type: string) => {
    switch(type) {
      case 'dan': return { color: '#ef4444', label: 'Daň' };
      case 'pojistne': return { color: '#3b82f6', label: 'Pojistné' };
      case 'svatek': return { color: '#10b981', label: 'Svátek' };
      case 'strategie': return { color: '#f59e0b', label: 'Strategie' };
      default: return { color: '#94a3b8', label: 'Ostatní' };
    }
  };

  return (
    <div className="fade-in app-container">
      
{/* HEADER & FILTRY - STICKY VERZE */}
      <div style={{ 
        zIndex: 100,
		backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        padding: 0,
        marginBottom: '20px',
        borderBottom: 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <button 
            onClick={() => navigate('/')} 
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={18} /> Zpět na přehled
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '4px' }}>
              {[2026, 2027].map(y => (
                <button 
                  key={y} 
                  onClick={() => setActiveYear(y)} 
                  style={{ padding: '8px 25px', borderRadius: '10px', border: 'none', background: activeYear === y ? '#f59e0b' : 'transparent', color: activeYear === y ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                >
                  {y}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[{ id: 'all', label: 'Vše' }, { id: 'osvc_pausal', label: 'Paušál' }, { id: 'osvc_hlavni', label: 'OSVČ' }, { id: 'sro', label: 'Firmy' }].map(f => (
                <button 
                  key={f.id} 
                  onClick={() => setFilter(f.id as any)} 
                  style={{ padding: '6px 15px', borderRadius: '8px', border: 'none', background: filter === f.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: filter === f.id ? '#f59e0b' : '#888', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '100px' }} className="hidden-mobile" />
        </div>
      </div>

      {/* KALENDÁŘ - MŘÍŽKA MĚSÍCŮ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '25px' }}>
        {months.map((monthName, monthIdx) => {
          const items = ALL_DEADLINES.filter(d => {
            const dDate = new Date(d.date);
            return dDate.getFullYear() === activeYear && dDate.getMonth() === monthIdx && (filter === 'all' || d.for.includes(filter as any) || d.for.includes('vse'));
          }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          if (items.length === 0) return null;

          return (
            <div key={monthName} className="month-section">
              <h3 style={{ marginBottom: '15px', color: '#fff', fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarIcon size={18} color="#f59e0b" /> {monthName}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
{items.map(item => {
  const s = getTypeStyle(item.type);
  const dDate = new Date(item.date);
  const isPast = dDate.getTime() < new Date().setHours(0,0,0,0);
  const isToday = dDate.toDateString() === new Date().toDateString();

  return (
    <GlassCard 
      key={item.id}
className=""	  
      style={{ 
        padding: '16px', 
        // Pokud je v minulosti, linka je jemně zelená (symbol klidu), jinak barva kategorie
        borderLeft: isToday ? '4px solid #f59e0b' : `3px solid ${isPast ? 'rgba(16, 185, 129, 0.4)' : s.color + '66'}`,
        transition: 'all 0.3s ease',
        background: isToday ? 'rgba(245, 158, 11, 0.05)' : 'rgba(255, 255, 255, 0.02)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Datum a ikona pro minulost */}
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', color: isPast ? '#666' : (isToday ? '#f59e0b' : '#fff') }}>
              {dDate.getDate()}.
            </span>
            {isPast && (
              <CheckCircle2 size={12} color="#10b981" style={{ position: 'absolute', top: -5, right: -8 }} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>{days[dDate.getDay()]}</span>
            {isToday && <span style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: '900', letterSpacing: '1px' }}>DNES</span>}
          </div>
        </div>
        
{/* KATEGORIE - Čistý text bez ohraničení, v minulosti zešedne */}
        <span style={{ 
          fontSize: '0.65rem', 
          color: isPast ? '#555' : s.color, 
          fontWeight: 'bold', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {isPast ? 'Splněno' : s.label}
        </span>
      </div>

      <div style={{ 
        fontWeight: 'bold', 
        fontSize: '0.95rem', 
        marginTop: '6px',
        color: isPast ? '#777' : '#eee',
        textDecoration: isPast ? 'line-through' : 'none', 
        textDecorationColor: 'rgba(16, 185, 129, 0.3)'
      }}>
        {item.title}
      </div>
      
      {!isPast && (
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px', lineHeight: '1.5', margin: 0 }}>
          {item.description}
        </p>
      )}
    </GlassCard>
  );
})}
              </div>
            </div>
          );
        })}
      </div>

      {/* INFORMATIVNÍ PATIČKA */}
      <div style={{ 
        marginTop: '60px', 
        padding: '30px', 
        borderTop: '1px solid rgba(255,255,255,0.1)', 
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        textAlign: 'center'
      }}>
        <p style={{ maxWidth: '800px', margin: '0 auto' }}>
          <strong>Poznámka k termínům:</strong> Termíny mají informativní charakter. 
          V případě, že konec lhůty připadá na sobotu, neděli nebo svátek, je podle českého daňového řádu 
          posledním dnem lhůty nejbližší příští pracovní den. Doporučujeme však plnit povinnosti s předstihem.
        </p>
      </div>

      <style>{`
        .month-section { animation: slideUp 0.5s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};