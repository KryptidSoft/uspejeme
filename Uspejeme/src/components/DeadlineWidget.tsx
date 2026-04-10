import React from 'react';
import { Calendar } from 'lucide-react';
import { ALL_DEADLINES } from '../data/deadlines';
import type { BusinessType } from '../types/index';

interface DeadlineWidgetProps {
  userType: BusinessType;
  setUserType: React.Dispatch<React.SetStateAction<BusinessType>>;
  onNavigate?: (view: string) => void;
}

export const DeadlineWidget: React.FC<DeadlineWidgetProps> = ({ userType, setUserType, onNavigate }) => {  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysLeftText = (targetDate: string) => {
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Dnes!";
    if (diffDays === 1) return "Zítra";
    if (diffDays < 0) return "Proběhlo";
    return `Za ${diffDays} d.`;
  };

  const upcoming = ALL_DEADLINES
    .filter(d => {
      if (userType === 'all') return true;
      return d.for.includes(userType) || d.for.includes('all');
    })
    .filter(d => new Date(d.date).getTime() >= today.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  // SYNCHRONIZOVANÉ BARVY A ŠTÍTKY
  const getStyles = (type: string) => {
    switch (type) {
      case 'dan': 
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'Daň' };
      case 'pojistne': 
        return { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Pojistné' };
      case 'svatek': 
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Svátek' };
      case 'mzdy':
        return { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', label: 'Mzdy' };
      default: 
        return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: 'Ostatní' };
    }
  };

  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: '24px',
      display: 'flex', 
      flexDirection: 'column',
      background: 'rgba(30, 41, 59, 0.5)', // Tmavší pozadí pro lepší kontrast
      backdropFilter: 'blur(10px)'
    }}>
      {/* HLAVIČKA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: '#10b981', padding: '6px', borderRadius: '8px', flexShrink: 0 }}>
          <Calendar size={18} color="#fff" />
        </div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: '#fff' }}>Hlídač termínů</h3>
      </div>

      {/* PŘEPÍNAČ */}
      <div style={{ 
        display: 'flex', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', 
        padding: '4px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.05)' 
      }}>
        {[
          { id: 'all', label: 'Vše' },
          { id: 'osvc_pausal', label: 'Paušál' },
          { id: 'osvc_hlavni', label: 'OSVČ' },
          { id: 'sro', label: 'Firmy' }
        ].map(f => (
          <button 
            key={f.id} 
            onClick={() => setUserType(f.id as BusinessType)}
            style={{ 
              flex: 1, padding: '6px 2px', borderRadius: '8px', border: 'none',
              background: userType === f.id ? '#10b981' : 'transparent', 
              color: userType === f.id ? '#fff' : '#94a3b8', 
              fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SEZNAM TERMÍNŮ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {upcoming.map((item) => {
          const s = getStyles(item.type);
          const itemDate = new Date(item.date);
          return (
            <div key={item.id} style={{ 
              display: 'flex', alignItems: 'center', padding: '12px', 
              background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
              borderLeft: `4px solid ${s.color}`, gap: '12px'
            }}>
              <div style={{ minWidth: '40px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fff', lineHeight: '1' }}>
                  {itemDate.getDate()}.
                </div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px' }}>
                  {itemDate.toLocaleString('cs-CZ', { month: 'short' }).replace('.', '')}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '0.85rem', fontWeight: '600', color: '#f8fafc', 
                  lineHeight: '1.2', marginBottom: '2px'
                }}>
                  {item.title}
                </div>
                <span style={{ 
                  fontSize: '0.6rem', 
                  color: s.color, 
                  background: s.bg,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {s.label}
                </span>
              </div>

              <div style={{ textAlign: 'right', minWidth: '50px', flexShrink: 0 }}>
                <div style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: '800', 
                  color: s.color,
                  filter: 'brightness(1.2)'
                }}>
                  {getDaysLeftText(item.date.toISOString())}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => onNavigate?.('kalendar')}
        style={{ 
          width: '100%', marginTop: '16px', padding: '12px', borderRadius: '14px',
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)'}
        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}
      >
        Celý kalendář 2026
      </button>
    </div>
  );
};