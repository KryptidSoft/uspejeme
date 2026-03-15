import React from 'react';
import { ALL_DEADLINES } from '../data/deadlines';
import { Bell, AlertTriangle, Info, Calendar } from 'lucide-react';

type BusinessType = 'osvc_pausal' | 'osvc_hlavni' | 'sro' | 'vse';

interface DeadlineWidgetProps {
  userType: BusinessType;
  limit?: number; // Přidáno pro flexibilitu na Landing Page
}

export const DeadlineWidget: React.FC<DeadlineWidgetProps> = ({ userType, limit = 5 }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysLeftText = (targetDate: Date) => {
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Dnes!";
    if (diffDays === 1) return "Zítra";
    if (diffDays < 0) return "Proběhlo";
    return `Za ${diffDays} d.`;
  };

const upcoming = ALL_DEADLINES
  .filter(d => {
    // Pokud je vybráno "Vše", pustíme dál úplně každý termín
    if (userType === 'all') return true;
    
    // Jinak filtrujeme podle typu uživatele nebo termínů pro "vse"chny
    return d.for.includes(userType) || d.for.includes('vse');
  })
  .filter(d => new Date(d.date).getTime() >= today.getTime())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, limit);

  const getStyles = (type: string) => {
    switch (type) {
      case 'dan': return { color: '#ef4444', label: 'Daň' };
      case 'pojistne': return { color: '#3b82f6', label: 'Pojistné' };
      case 'svatek': return { color: '#10b981', label: 'Svátek' };
      case 'strategie': return { color: '#f59e0b', label: 'Strategie' };
      default: return { color: '#94a3b8', label: 'Ostatní' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {upcoming.map((item) => {
        const s = getStyles(item.type);
        const itemDate = new Date(item.date);
        
        return (
          <div key={item.id} style={{ 
            display: 'flex', alignItems: 'center', padding: '12px 16px', 
            background: 'rgba(255,255,255,0.03)', borderRadius: '14px',
            borderLeft: `4px solid ${s.color}`, gap: '16px'
          }}>
            {/* VELKÁ DATUMOVKA */}
            <div style={{ minWidth: '50px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#fff', lineHeight: '1' }}>
                {itemDate.getDate()}.
              </div>
              <div style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>
                {itemDate.toLocaleString('cs-CZ', { month: 'short' }).replace('.', '')}
              </div>
            </div>

            {/* TEXT A DODATEČNÝ KOMENTÁŘ */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title}
              </div>
              {/* VRÁCENÝ DOPLŇKOVÝ KOMENTÁŘ */}
              <div style={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.description}
              </div>
            </div>

            {/* ODPOČET */}
            <div style={{ textAlign: 'right', minWidth: '60px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: item.type === 'dan' ? '#ef4444' : '#888' }}>
                {getDaysLeftText(item.date)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};