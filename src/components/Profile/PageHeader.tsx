// src/components/Profile/PageHeader.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
  className?: string;
  glowColor?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  backButton = false,
  onBack,
  className = '',
  glowColor = '#00d4ff',
}) => {
  return (
    <motion.div
      className={`page-header ${className}`}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '24px 0',
        direction: 'rtl',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        marginBottom: '24px',
        position: 'relative',
      }}
    >
      {/* Bottom neon line */}
      <div
        style={{
          position: 'absolute',
          bottom: -1,
          right: 0,
          width: '120px',
          height: '2px',
          background: `linear-gradient(90deg, ${glowColor}, transparent)`,
          borderRadius: '2px',
          boxShadow: `0 0 10px ${glowColor}40`,
        }}
      />

      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
        {/* Back button */}
        {backButton && (
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#a0a0c0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        )}

        {/* Icon */}
        {icon && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
            style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: `linear-gradient(135deg, ${glowColor}20, ${glowColor}08)`,
              border: `1px solid ${glowColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: glowColor,
              fontSize: '22px',
              boxShadow: `0 0 15px ${glowColor}15`,
              flexShrink: 0,
            }}
          >
            {icon}
          </motion.div>
        )}

        {/* Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#f0f0f5',
              fontFamily: "'Vazirmatn', sans-serif",
              margin: 0,
              lineHeight: 1.3,
                            letterSpacing: '-0.01em',
            }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22, duration: 0.35 }}
              style={{
                fontSize: '13px',
                color: '#8b8bb3',
                fontFamily: "'Vazirmatn', sans-serif",
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </motion.span>
          )}
        </div>
      </div>

      {/* Right action */}
      {action && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PageHeader;
