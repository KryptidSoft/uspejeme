import React from 'react';
import { Printer, Share2, FileText } from 'lucide-react';

interface ToolProps {
  onPrint?: boolean;
  onShare?: () => void;
  onReport?: boolean;
}

export const CalculatorTools: React.FC<ToolProps> = ({ onPrint, onShare, onReport }) => {
  return (
    <div className="no-print" style={{ 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '20px', 
      justifyContent: 'flex-end' 
    }}>
      {onShare && (
        <button onClick={onShare} className="nav-item" style={{ 
          background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
          fontSize: '0.8rem', padding: '8px 15px', borderRadius: '8px' 
        }}>
          <Share2 size={14} /> SDÍLET
        </button>
      )}

      {onPrint && (
        <button onClick={() => window.print()} className="nav-item" style={{ 
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
          fontSize: '0.8rem', padding: '8px 15px', color: '#10b981', borderRadius: '8px' 
        }}>
          <Printer size={14} /> EXPORT PDF
        </button>
      )}

      {onReport && (
        <button onClick={() => window.print()} className="nav-item" style={{ 
          background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', 
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
          fontSize: '0.8rem', padding: '8px 15px', borderRadius: '8px' 
        }}>
          <FileText size={14} /> REPORT
        </button>
      )}
    </div>
  );
};