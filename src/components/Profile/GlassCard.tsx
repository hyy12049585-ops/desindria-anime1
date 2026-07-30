// src/components/Profile/GlassCard.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  neonBorder?: boolean;
  borderColor?: string;
  onClick?: () => void;
  delay?: number;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  padding = '24px',
  hover = true,
  glow = false,
  glowColor = 'rgba(0, 212, 255, 0.15)',
  neonBorder = false,
  borderColor = 'rgba(0, 212, 255, 0.25)',
  onClick,
  delay = 0,
  style = {},
}) => {
  const cardStyle: React.CSSProperties = {
    background: 'rgba(15, 15, 46, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: neonBorder
      ? `1px solid ${borderColor}`
      : '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding,
    position: 'relative',
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  return (
    <motion.div
      className={`glass-card ${className}`}
      style={cardStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={
        hover
          ? {
              y: -4,
              borderColor: 'rgba(0, 212, 255, 0.35)',
              boxShadow: glow
                ? `0 8px 32px ${glowColor}, 0 0 20px ${glowColor}`
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
              background: 'rgba(15, 15, 46, 0.8)',
            }
          : {}
      }
      onClick={onClick}
    >
      {/* Top shine line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '30px',
          height: '30px',
          borderTop: '2px solid rgba(0, 212, 255, 0.3)',
          borderLeft: '2px solid rgba(0, 212, 255, 0.3)',
          borderTopLeftRadius: '16px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '30px',
          height: '30px',
          borderBottom: '2px solid rgba(168, 85, 247, 0.3)',
          borderRight: '2px solid rgba(168, 85, 247, 0.3)',
          borderBottomRightRadius: '16px',
          pointerEvents: 'none',
        }}
      />

      {children}
    </motion.div>
  );
};

export default GlassCard;
