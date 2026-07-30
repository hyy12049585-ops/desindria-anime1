// src/components/Profile/NeonToggle.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface NeonToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'purple' | 'pink' | 'green';
  className?: string;
}

const colorMap = {
  blue: {
    active: '#00d4ff',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0088cc 100%)',
    glow: 'rgba(0, 212, 255, 0.4)',
    shadow: '0 0 15px rgba(0, 212, 255, 0.4), 0 0 30px rgba(0, 212, 255, 0.15)',
  },
  purple: {
    active: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
    glow: 'rgba(168, 85, 247, 0.4)',
    shadow: '0 0 15px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.15)',
  },
  pink: {
    active: '#ff2d78',
    gradient: 'linear-gradient(135deg, #ff2d78 0%, #e0115f 100%)',
    glow: 'rgba(255, 45, 120, 0.4)',
    shadow: '0 0 15px rgba(255, 45, 120, 0.4), 0 0 30px rgba(255, 45, 120, 0.15)',
  },
  green: {
    active: '#06ffd2',
    gradient: 'linear-gradient(135deg, #06ffd2 0%, #39ff14 100%)',
    glow: 'rgba(6, 255, 210, 0.4)',
    shadow: '0 0 15px rgba(6, 255, 210, 0.4), 0 0 30px rgba(6, 255, 210, 0.15)',
  },
};

const sizeMap = {
  sm: { track: { width: 38, height: 20 }, thumb: 14, translate: 18, gap: 6 },
  md: { track: { width: 48, height: 26 }, thumb: 20, translate: 22, gap: 8 },
  lg: { track: { width: 58, height: 32 }, thumb: 26, translate: 26, gap: 10 },
};

const NeonToggle: React.FC<NeonToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const c = colorMap[color];
  const s = sizeMap[size];

  const handleToggle = () => {
    if (!disabled) onChange(!checked);
  };

  return (
    <div
      className={`neon-toggle-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        direction: 'rtl',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={handleToggle}
    >
      {/* Text Section */}
      {(label || description) && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {label && (
            <span
              style={{
                fontSize: size === 'sm' ? '13px' : '14px',
                fontWeight: 600,
                color: checked ? '#f0f0f5' : '#a0a0c0',
                fontFamily: "'Vazirmatn', sans-serif",
                transition: 'color 0.3s ease',
              }}
            >
              {label}
            </span>
          )}
          {description && (
            <span
              style={{
                fontSize: '12px',
                color: '#6a6a8a',
                fontFamily: "'Vazirmatn', sans-serif",
                lineHeight: 1.4,
              }}
            >
              {description}
            </span>
          )}
        </div>
      )}

      {/* Toggle Track */}
      <div
        style={{
          position: 'relative',
          width: s.track.width,
          height: s.track.height,
          borderRadius: s.track.height,
          flexShrink: 0,
        }}
      >
        {/* Track BG */}
        <motion.div
          animate={{
            background: checked ? c.gradient : 'rgba(255, 255, 255, 0.06)',
            boxShadow: checked ? c.shadow : 'none',
            borderColor: checked ? c.glow : 'rgba(255, 255, 255, 0.08)',
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: s.track.height,
            border: '1px solid',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />

        {/* Inner glow when active */}
        <motion.div
          animate={{
            opacity: checked ? 0.3 : 0,
            scale: checked ? 1 : 0.5,
          }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            inset: '2px',
            borderRadius: s.track.height,
            background: `radial-gradient(circle at ${checked ? '75%' : '25%'} 50%, ${c.glow}, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Thumb */}
        <motion.div
          animate={{
            x: checked ? s.translate : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: (s.track.height - s.thumb) / 2,
            width: s.thumb,
            height: s.thumb,
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          {/* Thumb body */}
          <motion.div
            animate={{
              background: checked ? '#ffffff' : '#6a6a8a',
              boxShadow: checked
                ? `0 0 10px ${c.glow}, 0 2px 8px rgba(0,0,0,0.3)`
                : '0 1px 4px rgba(0,0,0,0.3)',
            }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
            }}
          />

          {/* Thumb inner dot */}
          <motion.div
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{ duration: 0.2, delay: checked ? 0.1 : 0 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: s.thumb * 0.35,
              height: s.thumb * 0.35,
              borderRadius: '50%',
              background: c.active,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default NeonToggle;
