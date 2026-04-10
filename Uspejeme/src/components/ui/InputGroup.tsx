import React, { useId } from 'react';
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
  max,
  placeholder,
  className = ""
}) => {
  // Vygeneruje unikátní ID pro propojení labelu a inputu
  const inputId = useId();
  const inputValue = value ?? "";

  return (
    <div className={`input-group ${className}`} style={{ marginBottom: '15px' }}>
      <div className="label-wrapper" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'center' }}>
        <label 
          htmlFor={inputId} // Propojení s inputem
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}
        >
          {label}
          
          {tooltip && (
            <span className="custom-tooltip" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Info size={14} style={{ opacity: 0.6 }} />
              <span className="tooltip-text">{tooltip}</span>
            </span>
          )}
        </label>
        {unit && <span className="unit-badge" style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 600 }}>{unit}</span>}
      </div>
      
      <input
        id={inputId} // Unikátní ID
        type={type}
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`text-input ${type === 'range' ? 'range-input' : ''}`}
        step={step}
        min={min}
        max={max}
        style={{
          width: '100%',
          padding: type === 'range' ? '5px 0' : '10px',
          borderRadius: '8px',
          border: type === 'range' ? 'none' : '1px solid var(--border)',
          background: type === 'range' ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
          color: 'white',
          outline: 'none',
          transition: 'border-color 0.2s, background 0.2s',
          cursor: type === 'range' ? 'pointer' : 'text'
        }}
      />
    </div>
  );
};