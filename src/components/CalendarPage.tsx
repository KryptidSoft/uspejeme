import React, { useState } from 'react';
import { ALL_DEADLINES } from '../data/deadlines';
import { GlassCard } from './ui/GlassCard';
import { ArrowLeft, Calendar as CalendarIcon, Filter } from 'lucide-react';

type BusinessType = 'osvc_pausal' | 'osvc_hlavni' | 'sro' | 'vse';

export const CalendarPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeYear, setActiveYear] = useState(2026);
  const [filter, setFilter] = useState<BusinessType | 'all'>('all');
  
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
    <div className="fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER & FILTRY */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <button 
          onClick={onBack} 
          style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={18} /> Zpět
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {/* Volba roku */}
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

          {/* Přepínátko druhů živnosti */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { id: 'all', label: 'Vše' },
              { id: 'osvc_pausal', label: 'Paušál' },
              { id: 'osvc_hlavni', label: 'OSVČ' },
              { id: 'sro', label: 'Firmy' }
            ].map(f => (
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

      {/* KALENDÁŘ - MŘÍŽKA MĚSÍCŮ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
        {months.map((monthName, monthIdx) => {
          const items = ALL_DEADLINES.filter(d => {
            const dDate = new Date(d.date);
            const yearMatch = dDate.getFullYear() === activeYear;
            const monthMatch = dDate.getMonth() === monthIdx;
            const typeMatch = filter === 'all' || d.for.includes(filter as any) || d.for.includes('vse');
            return yearMatch && monthMatch && typeMatch;
          }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          if (items.length === 0) return null;

          return (
            <div key={monthName} style={{ animation: `slideUp 0.4s ease-out` }}>
              <h3 style={{ marginBottom: '15px', color: '#888', fontSize: '1.1rem', borderLeft: '3px solid #f59e0b', paddingLeft: '10px' }}>{monthName}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map(item => {
                  const s = getTypeStyle(item.type);
                  const dDate = new Date(item.date);
                  const dayName = days[dDate.getDay()];
                  const isWeekend = dDate.getDay() === 0 || dDate.getDay() === 6;

                  return (
                    <GlassCard key={item.id} style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: '900', color: '#fff' }}>{dDate.getDate()}.</span>
                          <span style={{ fontSize: '0.7rem', color: isWeekend ? '#ef4444' : '#888', fontWeight: 'bold' }}>{dayName}</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', color: s.color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginTop: '5px', color: '#eee' }}>{item.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '3px', lineHeight: '1.4' }}>{item.description}</div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};