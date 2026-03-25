import React from 'react';
import { Info } from 'lucide-react';

interface InputGroupProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  unit?: string;
  tooltip?: string;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = "number",
  unit,
  tooltip,
  step,
  min,
  max
}) => {
  // Zajistíme, že hodnota nebude null nebo undefined pro input
  const inputValue = value ?? "";

  return (
    <div className="input-group" style={{ marginBottom: '15px' }}>
      <div className="label-wrapper" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', fontWeight: 500 }}>
          {label}
          
          {/* BEZPEČNÁ ÚPRAVA TOOLTIPU */}
          {tooltip && (
            <span className="custom-tooltip">
              <Info size={14} style={{ opacity: 0.6 }} />
              <span className="tooltip-text">{tooltip}</span>
            </span>
          )}
        </label>
        {unit && <span className="unit-badge" style={{ fontSize: '0.75rem', opacity: 0.7 }}>{unit}</span>}
      </div>
      <input
        type={type}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        className="text-input"
        step={step}
        min={min}
        max={max}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          outline: 'none'
        }}
      />
    </div>
  );
};