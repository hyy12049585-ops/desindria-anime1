// src/components/Profile/NeonProgressBar.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface NeonProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  valueFormat?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'pink' | 'green' | 'orange' | 'gradient';
  animated?: boolean;
  glow?: boolean;
}

const colorMap: Record<string, { gradient: string; shadow: string; text: string }> = {
  blue: {
    gradient: 'linear-gradient(90deg, #00d4ff, #0099cc)',
    shadow: 'rgba(0, 212, 255, 0.4)',
    text: '#00d4ff',
  },
  purple: {
    gradient: 'linear-gradient(90deg, #a855f7, #7c3aed)',
    shadow: 'rgba(168, 85, 247, 0.4)',
    text: '#a855f7',
  },
  pink: {
    gradient: 'linear-gradient(90deg, #ff2d78, #e91e63)',
    shadow: 'rgba(255, 45, 120, 0.4)',
    text: '#ff2d78',
  },
  green: {
    gradient: 'linear-gradient(90deg, #39ff14, #00e676)',
    shadow: 'rgba(57, 255, 20, 0.4)',
    text: '#39ff14',
  },
  orange: {
    gradient: 'linear-gradient(90deg, #ff6a00, #ff9800)',
    shadow: 'rgba(255, 106, 0, 0.4)',
    text: '#ff6a00',
  },
  gradient: {
    gradient: 'linear-gradient(90deg, #00d4ff, #a855f7, #ff2d78)',
    shadow: 'rgba(168, 85, 247, 0.3)',
    text: '#a855f7',
  },
};

const sizeMap = {
  sm: { height: 6, borderRadius: 3, fontSize: 11 },
  md: { height: 10, borderRadius: 5, fontSize: 13 },
  lg: { height: 14, borderRadius: 7, fontSize: 15 },
};

const NeonProgressBar: React.FC<NeonProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  valueFormat = '%',
  size = 'md',
  color = 'blue',
  animated = false,
  glow = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const colors = colorMap[color];
  const sizeConfig = sizeMap[size];

  return (
    <div style={{ width: '100%', direction: 'rtl' }}>
      {/* Header — label and value */}
      {(label || showValue) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          {label && (
            <span
              style={{
                fontSize: sizeConfig.fontSize,
                fontWeight: 600,
                color: '#c0c0e0',
                fontFamily: "'Vazirmatn', sans-serif",
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <motion.span
              key={value}
              initial={{ scale: 1.2, color: colors.text }}
              animate={{ scale: 1, color: '#8b8bb3' }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: sizeConfig.fontSize - 1,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {value}
              <span style={{ fontSize: sizeConfig.fontSize - 3, opacity: 0.6 }}>
                /{max}
              </span>
              {valueFormat && (
                <span style={{ fontSize: sizeConfig.fontSize - 3, opacity: 0.5 }}>
                  {valueFormat}
                </span>
              )}
            </motion.span>
          )}
        </div>
      )}

      {/* Track */}
      <div
        style={{
          width: '100%',
          height: sizeConfig.height,
          borderRadius: sizeConfig.borderRadius,
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill bar */}
        <motion.div
          initial={animated ? { width: '0%' } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }
              : { duration: 0.5, ease: 'easeOut' }
          }
          style={{
            height: '100%',
            borderRadius: sizeConfig.borderRadius,
            background: colors.gradient,
            boxShadow: glow ? `0 0 12px ${colors.shadow}, 0 0 4px ${colors.shadow}` : 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shimmer effect */}
          {animated && (
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 1.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                borderRadius: sizeConfig.borderRadius,
              }}
            />
          )}
        </motion.div>

        {/* Glow dot at the end */}
        {glow && percentage > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              right: `${100 - percentage}%`,
              transform: 'translate(50%, -50%)',
              width: sizeConfig.height + 6,
              height: sizeConfig.height + 6,
              borderRadius: '50%',
              background: colors.text,
              filter: 'blur(4px)',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NeonProgressBar;
