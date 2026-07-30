// src/components/Profile/NeonButton.tsx

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

type NeonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
type NeonSize = 'sm' | 'md' | 'lg' | 'xl';

interface NeonButtonProps {
  children: React.ReactNode;
  variant?: NeonVariant;
  size?: NeonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  glow?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<NeonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
    color: '#fff',
    border: '1px solid rgba(0, 212, 255, 0.4)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #a855f7 0%, #ff2d78 100%)',
    color: '#fff',
    border: '1px solid rgba(168, 85, 247, 0.4)',
  },
  danger: {
    background: 'linear-gradient(135deg, #ff2d78 0%, #ff6a00 100%)',
    color: '#fff',
    border: '1px solid rgba(255, 45, 120, 0.4)',
  },
  success: {
    background: 'linear-gradient(135deg, #06ffd2 0%, #39ff14 100%)',
    color: '#0a0a1a',
    border: '1px solid rgba(6, 255, 210, 0.4)',
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#f0f0f5',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  outline: {
    background: 'transparent',
    color: '#00d4ff',
    border: '1px solid rgba(0, 212, 255, 0.4)',
  },
};

const variantHoverShadow: Record<NeonVariant, string> = {
  primary: '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.15)',
  secondary: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.15)',
  danger: '0 0 20px rgba(255, 45, 120, 0.4), 0 0 40px rgba(255, 45, 120, 0.15)',
  success: '0 0 20px rgba(6, 255, 210, 0.4), 0 0 40px rgba(6, 255, 210, 0.15)',
  ghost: '0 0 15px rgba(255, 255, 255, 0.08)',
  outline: '0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 15px rgba(0, 212, 255, 0.05)',
};

const sizeStyles: Record<NeonSize, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: '12px', borderRadius: '8px', gap: '6px' },
  md: { padding: '10px 22px', fontSize: '14px', borderRadius: '10px', gap: '8px' },
  lg: { padding: '14px 30px', fontSize: '16px', borderRadius: '12px', gap: '10px' },
  xl: { padding: '18px 40px', fontSize: '18px', borderRadius: '14px', gap: '12px' },
};

const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled = false,
  glow = true,
  onClick,
  className = '',
  type = 'button',
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Ripple
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { x, y, id }]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    }

    onClick?.(e);
  };

  const baseStyle: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontFamily: "'Vazirmatn', sans-serif",
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.5px',
    textDecoration: 'none',
    userSelect: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
  };

  return (
    <motion.button
      ref={btnRef}
      type={type}
      className={`neon-btn ${className}`}
      style={baseStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={
        !disabled && !loading
          ? {
              scale: 1.03,
              boxShadow: glow ? variantHoverShadow[variant] : undefined,
              y: -2,
            }
          : {}
      }
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)',
            transform: 'translate(-50%, -50%)',
            animation: 'ripple 0.6s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{
            width: size === 'sm' ? 14 : size === 'md' ? 16 : 20,
            height: size === 'sm' ? 14 : size === 'md' ? 16 : 20,
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            display: 'inline-block',
          }}
        />
      )}

      {/* Icon */}
      {!loading && icon && (
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.1em' }}>
          {icon}
        </span>
      )}

      {/* Text */}
      {!loading && <span>{children}</span>}
    </motion.button>
  );
};

export default NeonButton;
