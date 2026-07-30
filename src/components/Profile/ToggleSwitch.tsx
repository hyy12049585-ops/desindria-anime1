// src/components/profile/ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { track: "w-8 h-4", thumb: "h-3 w-3", translate: "translate-x-4 rtl:-translate-x-4" },
  md: { track: "w-11 h-6", thumb: "h-5 w-5", translate: "translate-x-5 rtl:-translate-x-5" },
  lg: { track: "w-14 h-7", thumb: "h-6 w-6", translate: "translate-x-7 rtl:-translate-x-7" },
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
}) => {
  const s = sizeMap[size];

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-sm font-medium text-white block truncate">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-400 block mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex flex-shrink-0 ${s.track} rounded-full
          cursor-pointer transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
          ${enabled ? "bg-purple-600" : "bg-gray-600"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block ${s.thumb} rounded-full bg-white
            shadow-lg transform transition-transform duration-200 ease-in-out
            ${enabled ? s.translate : "translate-x-0.5"}
            mt-0.5 ms-0.5
          `}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
