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
  min?: number; // PŘIDÁNO
  max?: number; // PŘIDÁNO
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = "number",
  unit,
  tooltip,
  step,
  min, // PŘIDÁNO
  max  // PŘIDÁNO
}) => {
  return (
    <div className="input-group">
      <div className="label-wrapper">
        <label>
          {label}
          {tooltip && (
            <span className="tooltip-container">
              <Info size={14} className="tooltip-trigger-icon" />
              <span className="tooltip-box">{tooltip}</span>
            </span>
          )}
        </label>
        {unit && <span className="unit-badge">{unit}</span>}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-input"
        step={step}
        min={min} // PŘIDÁNO
        max={max} // PŘIDÁNO
      />
    </div>
  );
};