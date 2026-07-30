// src/components/ui/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  value: number;          // 0-100
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;         // tailwind gradient class
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  glow?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  color = "from-violet-500 to-fuchsia-500",
  showLabel = false,
  label,
  animated = true,
  glow = false,
}) => {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      {/* لیبل بالا */}
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-white/50">{label}</span>}
          {showLabel && (
            <span className="text-xs font-mono text-white/60">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}

      {/* بار */}
      <div className={`w-full ${heights[size]} rounded-full bg-white/5 overflow-hidden relative`}>
        <div
          className={`${heights[size]} rounded-full bg-gradient-to-r ${color} 
            transition-all duration-700 ease-out relative
            ${animated ? "animate-pulse-subtle" : ""}`}
          style={{ width: `${percent}%` }}
        >
          {/* شاین افکت */}
          {percent > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
              animate-shimmer" />
          )}
        </div>

        {/* گلو */}
        {glow && percent > 0 && (
          <div
            className={`absolute top-0 ${heights[size]} rounded-full bg-gradient-to-r ${color} 
              blur-md opacity-40`}
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
