// src/components/ui/ToggleSwitch.tsx
import React from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
}) => {
  const sizes = {
    sm: { track: "w-9 h-5", thumb: "w-3.5 h-3.5", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-4.5 h-4.5", translate: "translate-x-5" },
  };

  const s = sizes[size];

  return (
    <label
      className={`flex items-center justify-between gap-4 group
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* متن */}
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <span className="text-sm font-medium text-white/90 block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-white/40 block mt-0.5 leading-relaxed">
              {description}
            </span>
          )}
        </div>
      )}

      {/* سوییچ */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex items-center ${s.track} rounded-full 
          transition-all duration-300 ease-in-out flex-shrink-0
          ${checked 
            ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/20" 
            : "bg-white/10 hover:bg-white/15"
          }
          ${!disabled ? "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-transparent" : ""}
        `}
      >
        <span
          className={`inline-block ${s.thumb} rounded-full bg-white shadow-md
            transform transition-all duration-300 ease-in-out
            ${checked ? s.translate : "translate-x-0.5"}
            ${checked ? "scale-100" : "scale-90 opacity-70"}`}
        />
      </button>
    </label>
  );
};

export default ToggleSwitch;
