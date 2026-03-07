import React from 'react';
import { ALL_DEADLINES } from '../data/deadlines';
import { Bell, AlertTriangle, Info, Calendar } from 'lucide-react';

// Sjednocení typů s deadlines.ts
type BusinessType = 'osvc_pausal' | 'osvc_hlavni' | 'sro' | 'vse';

interface DeadlineWidgetProps {
  userType: BusinessType;
}

export const DeadlineWidget: React.FC<DeadlineWidgetProps> = ({ userType }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysLeftText = (targetDate: Date) => {
    // Vytvoříme kopii data, aby nedošlo k chybě v referenci
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Dnes!";
    if (diffDays === 1) return "Zítra";
    if (diffDays < 0) return "Proběhlo";
    if (diffDays < 5) return `Za ${diffDays} dny`;
    return `Za ${diffDays} dní`;
  };

  const upcoming = ALL_DEADLINES
    .filter(d => d.for.includes(userType) || d.for.includes('vse'))
    // OPRAVA: Bezpečné porovnání dat pomocí getTime()
    .filter(d => new Date(d.date).getTime() >= today.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const getStyles = (type: string) => {
    switch (type) {
      case 'dan': return { icon: <AlertTriangle size={14} />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'pojistne': return { icon: <Bell size={14} />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
      case 'svatek': return { icon: <Calendar size={14} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'strategie': return { icon: <Info size={14} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
      default: return { icon: <Info size={14} />, color: '#94a3b8', bg: 'rgba(255, 255, 255, 0.05)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {upcoming.length > 0 ? upcoming.map((item) => {
        const s = getStyles(item.type);
        const itemDate = new Date(item.date);
        
        return (
          <div 
            key={item.id}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '10px 16px', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              gap: '12px'
            }}
          >
            {/* Datumovka */}
            <div style={{ minWidth: '45px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>{itemDate.getDate()}.</div>
              <div style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase' }}>
                {itemDate.toLocaleString('cs-CZ', { month: 'short' })}
              </div>
            </div>

            {/* Ikona typu */}
            <div style={{ padding: '8px', borderRadius: '8px', background: s.bg, color: s.color }}>
              {s.icon}
            </div>

            {/* Text termínu */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.description}
              </div>
            </div>

            {/* Výpočet zbývajících dnů */}
            <div style={{ 
              fontSize: '0.75rem', 
              fontWeight: 'bold', 
              color: item.type === 'dan' ? '#ef4444' : '#888',
              whiteSpace: 'nowrap',
              textAlign: 'right'
            }}>
              {getDaysLeftText(item.date)}
            </div>
          </div>
        );
      }) : (
        <div style={{ padding: '20px', color: '#888', fontSize: '0.8rem', textAlign: 'center' }}>
          Žádné blízké termíny pro tento profil.
        </div>
      )}
    </div>
  );
};