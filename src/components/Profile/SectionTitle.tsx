// src/components/Profile/SectionTitle.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  color?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
  color = '#00d4ff',
}) => {
  return (
    <motion.div
      className={`section-title ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        direction: 'rtl',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${color}22, transparent)`,
              border: `1px solid ${color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color,
              fontSize: '18px',
              boxShadow: `0 0 10px ${color}20`,
            }}
          >
            {icon}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#f0f0f5',
              fontFamily: "'Vazirmatn', sans-serif",
            }}
          >
            {title}
          </span>

          {subtitle && (
            <span
              style={{
                fontSize: '12px',
                color: '#8b8bb3',
                fontFamily: "'Vazirmatn', sans-serif",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </motion.div>
  );
};

export default SectionTitle;
