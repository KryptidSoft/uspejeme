import React from 'react';

interface TableItem {
  label: string;
  value: number;
  unit: string;
  narust?: number; // procenta
}

interface GlassCardTableProps {
  data: TableItem[];
}

export const GlassCardTable: React.FC<GlassCardTableProps> = ({ data }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginTop: '40px' 
    }}>
      {data.map((item, i) => {
        const narustColor = item.narust !== undefined ? (item.narust >= 0 ? '#10b981' : '#ef4444') : 'inherit';
        const narustSign = item.narust !== undefined ? (item.narust >= 0 ? '▲ ' : '▼ ') : '';
        return (
          <div key={i} style={{ 
            flex: '1 1 250px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '5px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '5px' }}>
              {item.value.toLocaleString()} {item.unit}
            </div>
            {item.narust !== undefined && (
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: narustColor }}>
                {narustSign}{item.narust} %
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};