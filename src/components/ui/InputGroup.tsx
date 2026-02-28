import React from 'react';
import { HelpCircle } from 'lucide-react'; // Přidej tento import

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  type?: 'number' | 'range' | 'text';
  min?: number;
  max?: number;
  step?: number;
  tooltip?: string;
  unit?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ 
  label, value, onChange, type = 'number', min, max, step, tooltip, unit 
}) => {
  return (
    <div className="input-group">
      <div className="label-wrapper">
        <label>
          {label} {unit && <span className="unit-label">({unit})</span>}
        </label>
        
        {tooltip && (
          <div className="tooltip-container">
            <HelpCircle size={14} className="tooltip-trigger-icon" />
            <div className="tooltip-box">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className={type === 'range' ? 'range-input' : 'text-input'}
      />
    </div>
  );
};