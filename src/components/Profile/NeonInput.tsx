// src/components/Profile/NeonInput.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NeonInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  dir?: 'rtl' | 'ltr';
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  className?: string;
  name?: string;
}

const NeonInput: React.FC<NeonInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
  dir = 'rtl',
  maxLength,
  multiline = false,
  rows = 4,
  className = '',
  name,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    direction: dir,
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: multiline ? '14px 16px' : '0 16px',
    height: multiline ? 'auto' : '52px',
    background: 'rgba(10, 10, 31, 0.8)',
    backdropFilter: 'blur(10px)',
    border: error
      ? '1px solid rgba(255, 45, 120, 0.5)'
      : focused
      ? '1px solid rgba(0, 212, 255, 0.5)'
      : '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    boxShadow: error
      ? '0 0 15px rgba(255, 45, 120, 0.15)'
      : focused
      ? '0 0 20px rgba(0, 212, 255, 0.15), inset 0 0 10px rgba(0, 212, 255, 0.03)'
      : 'none',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    position: 'relative',
    overflow: 'hidden',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f0f0f5',
    fontSize: '14px',
    fontFamily: "'Vazirmatn', sans-serif",
    fontWeight: 500,
    direction: dir,
    textAlign: dir === 'rtl' ? 'right' : 'left',
    padding: multiline ? '0' : '0',
    resize: multiline ? 'vertical' : 'none',
    width: '100%',
    minHeight: multiline ? `${rows * 24}px` : 'auto',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: error ? '#ff2d78' : focused ? '#00d4ff' : '#a0a0c0',
    transition: 'color 0.3s ease',
    fontFamily: "'Vazirmatn', sans-serif",
  };

  const iconStyle: React.CSSProperties = {
    color: error ? '#ff2d78' : focused ? '#00d4ff' : '#6a6a8a',
    fontSize: '18px',
    transition: 'color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className={`neon-input-container ${className}`} style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      <div style={wrapperStyle}>
        {/* Focus glow line */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            height: '2px',
            background: error
              ? 'linear-gradient(90deg, transparent, #ff2d78, transparent)'
              : 'linear-gradient(90deg, transparent, #00d4ff, transparent)',
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
          }}
          animate={{ width: focused ? '80%' : '0%', opacity: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {icon && <span style={iconStyle}>{icon}</span>}

        <InputComponent
          name={name}
          type={multiline ? undefined : inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange(e.target.value)
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          maxLength={maxLength}
          rows={multiline ? rows : undefined}
          style={inputStyle}
          autoComplete="off"
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6a6a8a',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6a6a8a')}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}

        {maxLength && (
                    <span
            style={{
              fontSize: '11px',
              color: value.length >= maxLength ? '#ff2d78' : '#6a6a8a',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <AnimatePresence>
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize: '12px',
              color: error ? '#ff2d78' : '#6a6a8a',
              fontFamily: "'Vazirmatn', sans-serif",
              paddingRight: '4px',
            }}
          >
            {error || helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NeonInput;
