// src/components/Profile/ProfileSidebar.tsx

import React from 'react';
import { motion } from 'framer-motion';
import NeonProgressBar from './NeonProgressBar';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  badge?: number;
}

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userInfo: {
    displayName: string;
    username: string;
    avatar?: string;
    level: number;
    xp: number;
    maxXp: number;
    badge?: string;
  };
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'نمای کلی',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: '#00d4ff',
  },
  {
    id: 'account',
    label: 'حساب کاربری',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: '#a855f7',
  },
  {
    id: 'security',
    label: 'امنیت',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    color: '#ff2d78',
  },
  {
    id: 'preferences',
    label: 'ترجیحات',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    color: '#06ffd2',
  },
  {
    id: 'achievements',
    label: 'دستاوردها',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    color: '#ff6a00',
    badge: 3,
  },
  {
    id: 'activity',
    label: 'فعالیت‌ها',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: '#39ff14',
  },
];

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeSection,
  onSectionChange,
  userInfo,
  collapsed,
  onToggleCollapse,
  isMobile,
}) => {
  const sidebarWidth = collapsed ? 76 : 280;

  return (
    <motion.aside
      animate={{ width: isMobile ? 280 : sidebarWidth }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: '100vh',
        background: 'rgba(10, 10, 46, 0.97)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Side glow line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '10%',
          width: '1px',
          height: '80%',
          background: 'linear-gradient(180deg, transparent, rgba(0, 212, 255, 0.15), rgba(168, 85, 247, 0.15), transparent)',
        }}
      />

      {/* Top section — User info */}
      <div
        style={{
          padding: collapsed ? '24px 12px 20px' : '28px 22px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: collapsed ? 8 : 14,
          transition: 'padding 0.35s ease',
        }}
      >
        {/* Avatar */}
        <motion.div
          layout
          style={{
            width: collapsed ? 44 : 80,
            height: collapsed ? 44 : 80,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(0, 212, 255, 0.4)',
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)',
            background: 'rgba(0, 212, 255, 0.1)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: collapsed ? 16 : 28,
                fontWeight: 800,
                color: '#00d4ff',
                fontFamily: "'Vazirmatn', sans-serif",
              }}
            >
              {userInfo.displayName.charAt(0)}
            </div>
          )}

          {/* Level badge on avatar */}
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              minWidth: collapsed ? 18 : 24,
              height: collapsed ? 18 : 24,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: collapsed ? 9 : 11,
              fontWeight: 800,
              color: '#fff',
              border: '2px solid #0a0a2e',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            {userInfo.level}
          </div>
        </motion.div>

        {/* Name & username */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#f0f0f5',
                fontFamily: "'Vazirmatn', sans-serif",
              }}
            >
              {userInfo.displayName}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: '#6a6a8a',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              @{userInfo.username}
            </span>

            {userInfo.badge && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '11px',
                  color: '#ff6a00',
                  fontWeight: 600,
                  marginTop: 4,
                  fontFamily: "'Vazirmatn', sans-serif",
                }}
              >
                ✨ {userInfo.badge}
              </span>
            )}
          </motion.div>
        )}

        {/* XP Progress */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ width: '100%', marginTop: 4 }}
          >
            <NeonProgressBar
              value={userInfo.xp}
              max={userInfo.maxXp}
              size="sm"
              color="gradient"
              showValue
              valueFormat=" XP"
              animated
              glow
            />
          </motion.div>
        )}
      </div>

      {/* Navigation items */}
      <div
        className="profile-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '16px 8px' : '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {sidebarItems.map((item, index) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.1 }}
              onClick={() => onSectionChange(item.id)}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: collapsed ? '12px' : '12px 16px',
                borderRadius: 12,
                background: isActive
                  ? `linear-gradient(135deg, ${item.color}18, ${item.color}08)`
                  : 'transparent',
                border: isActive
                  ? `1px solid ${item.color}35`
                  : '1px solid transparent',
                cursor: 'pointer',
                width: '100%',
                justifyContent: collapsed ? 'center' : 'flex-start',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? `0 0 15px ${item.color}15, inset 0 0 15px ${item.color}05` : 'none',
                color: isActive ? item.color : '#8b8bb3',
                outline: 'none',
                fontFamily: "'Vazirmatn', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = '#c0c0e0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8b8bb3';
                }
              }}
            >
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '20%',
                    width: 3,
                    height: '60%',
                    borderRadius: '0 3px 3px 0',
                    background: item.color,
                    boxShadow: `0 0 10px ${item.color}60`,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>

              {/* Label */}
              {!collapsed && (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 500,
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textAlign: 'right',
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {item.badge && item.badge > 0 && !collapsed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#fff',
                    padding: '0 5px',
                  }}
                >
                  {item.badge}
                </motion.div>
              )}

              {/* Tooltip for collapsed */}
              {collapsed && (
                <div
                  className="sidebar-tooltip"
                  style={{
                    position: 'absolute',
                    right: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginRight: 8,
                    padding: '6px 12px',
                    background: 'rgba(10, 10, 46, 0.98)',
                    border: `1px solid ${item.color}40`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#f0f0f5',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 10px ${item.color}20`,
                    zIndex: 100,
                  }}
                >
                  {item.label}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Bottom section */}
      <div
        style={{
          padding: collapsed ? '16px 8px' : '16px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* Collapse button (desktop only) */}
        {!isMobile && (
          <motion.button
            onClick={onToggleCollapse}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px',
              borderRadius: 10,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              color: '#6a6a8a',
              fontSize: 13,
              fontFamily: "'Vazirmatn', sans-serif",
              transition: 'all 0.3s',
              outline: 'none',
              width: '100%',
            }}
          >
                        <motion.svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </motion.svg>
            {!collapsed && (
              <span style={{ fontSize: 12, fontWeight: 500 }}>جمع کردن</span>
            )}
          </motion.button>
        )}
      </div>

      {/* Tooltip hover CSS — inject once */}
      <style>{`
        .sidebar-tooltip {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        button:hover .sidebar-tooltip {
          opacity: 1;
        }
      `}</style>
    </motion.aside>
  );
};

export default ProfileSidebar;
