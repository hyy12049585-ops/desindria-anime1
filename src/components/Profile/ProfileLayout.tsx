// src/components/Profile/ProfileLayout.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSidebar from './ProfileSidebar';

interface ProfileLayoutProps {
  children: React.ReactNode;
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
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  userInfo,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close mobile menu on section change
  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (isMobile) setMobileMenuOpen(false);
  };

  return (
    <div
      className="profile-layout"
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.03) 0%, transparent 50%), #0a0a2e',
        direction: 'rtl',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: '15%',
          right: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 30, -25, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          bottom: '20%',
          left: '15%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08), transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Mobile header bar */}
      {isMobile && (
        <motion.div
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background: 'rgba(10, 10, 46, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            zIndex: 1000,
            direction: 'rtl',
          }}
        >
          {/* Hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              cursor: 'pointer',
              color: '#a0a0c0',
            }}
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              style={{
                width: 18,
                height: 2,
                background: '#00d4ff',
                borderRadius: 2,
                display: 'block',
              }}
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              style={{
                width: 18,
                height: 2,
                background: '#00d4ff',
                borderRadius: 2,
                display: 'block',
              }}
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              style={{
                width: 18,
                height: 2,
                background: '#00d4ff',
                borderRadius: 2,
                display: 'block',
              }}
            />
          </motion.button>

          {/* User quick info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#f0f0f5',
                fontFamily: "'Vazirmatn', sans-serif",
              }}
            >
              {userInfo.displayName}
            </span>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '2px solid #00d4ff',
                overflow: 'hidden',
                background: 'rgba(0,212,255,0.1)',
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
                    fontSize: 14,
                    color: '#00d4ff',
                    fontWeight: 700,
                  }}
                >
                  {userInfo.displayName.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 998,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || mobileMenuOpen) && (
          <motion.div
            initial={isMobile ? { x: 300 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: 300 } : {}}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            style={{
              position: isMobile ? 'fixed' : 'sticky',
              top: 0,
              right: 0,
              height: isMobile ? '100vh' : '100vh',
              zIndex: isMobile ? 999 : 10,
              flexShrink: 0,
            }}
          >
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              userInfo={userInfo}
              collapsed={!isMobile && sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <motion.main
        style={{
          flex: 1,
          padding: isMobile ? '76px 16px 24px' : '32px 40px',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
        layout
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default ProfileLayout;
