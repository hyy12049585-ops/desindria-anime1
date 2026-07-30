// components/Profile/ToggleSwitch.tsx

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className={`toggle-switch-wrapper ${disabled ? 'disabled' : ''}`}>
      {label && <span className="toggle-switch-label">{label}</span>}
      <div className="toggle-switch-container">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="toggle-input"
        />
        <span className={`toggle-track ${checked ? 'active' : ''}`}>
          <span className="toggle-thumb" />
        </span>
      </div>
    </label>
  );
};

export default ToggleSwitch;
