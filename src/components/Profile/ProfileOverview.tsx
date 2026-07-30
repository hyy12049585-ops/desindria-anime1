// src/pages/Profile/ProfileOverview.tsx

import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/Profile/GlassCard';
import NeonProgressBar from '../../components/Profile/NeonProgressBar';
import PageHeader from '../../components/Profile/PageHeader';
import SectionTitle from '../../components/Profile/SectionTitle';
import AvatarUploader from '../../components/Profile/AvatarUploader';

interface ProfileOverviewProps {
  userInfo: {
    displayName: string;
    username: string;
    avatar?: string;
    level: number;
    xp: number;
    maxXp: number;
    badge?: string;
    joinDate: string;
    rank: string;
  };
  stats: {
    animeWatched: number;
    episodesWatched: number;
    hoursWatched: number;
    favoriteGenre: string;
    reviews: number;
    followers: number;
    following: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'watch' | 'review' | 'achievement' | 'follow';
    title: string;
    description: string;
    timestamp: string;
    color: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    icon: string;
    progress: number;
    maxProgress: number;
    unlocked: boolean;
    color: string;
  }>;
  onAvatarUpload: (base64: string) => void;
}

// Activity type icons
const activityIcons: Record<string, React.ReactNode> = {
  watch: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  review: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  achievement: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  follow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  ),
};

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  userInfo,
  stats,
  recentActivity,
  achievements,
  onAvatarUpload,
}) => {
  const statsCards = [
    { label: 'انیمه تماشا شده', value: stats.animeWatched, icon: '🎬', color: '#00d4ff' },
    { label: 'قسمت‌ها', value: stats.episodesWatched, icon: '📺', color: '#a855f7' },
    { label: 'ساعت تماشا', value: stats.hoursWatched, icon: '⏱️', color: '#ff2d78' },
    { label: 'نقد و بررسی', value: stats.reviews, icon: '✍️', color: '#06ffd2' },
    { label: 'دنبال‌کننده', value: stats.followers, icon: '👥', color: '#ff6a00' },
    { label: 'دنبال شده', value: stats.following, icon: '➡️', color: '#39ff14' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <PageHeader
        title="نمای کلی"
        subtitle="خلاصه‌ای از حساب کاربری و فعالیت‌های شما"
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        }
        glowColor="#00d4ff"
      />

      {/* Profile Hero Card */}
      <GlassCard hover glow glowColor="rgba(0, 212, 255, 0.08)" padding="28px">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
            direction: 'rtl',
          }}
        >
          {/* Avatar */}
          <AvatarUploader
            currentAvatar={userInfo.avatar}
            onUpload={onAvatarUpload}
            size={100}
            editable
            level={userInfo.level}
            showLevel
            borderColor="#00d4ff"
          />

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#f0f0f5',
                  fontFamily: "'Vazirmatn', sans-serif",
                }}
              >
                {userInfo.displayName}
              </h2>
              {userInfo.badge && (
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, rgba(255, 106, 0, 0.15), rgba(255, 106, 0, 0.05))',
                    border: '1px solid rgba(255, 106, 0, 0.3)',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#ff6a00',
                  }}
                >
                  {userInfo.badge}
                </span>
              )}
            </div>

            <p
              style={{
                margin: '0 0 4px',
                fontSize: 13,
                color: '#6a6a8a',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              @{userInfo.username}
            </p>

            <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#8b8bb3',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                عضویت از {userInfo.joinDate}
              </span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#a855f7',
                  fontWeight: 600,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                رتبه: {userInfo.rank}
              </span>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#00d4ff',
                  fontWeight: 600,
                }}
              >
                ❤️ ژانر مورد علاقه: {stats.favoriteGenre}
              </span>
            </div>

            {/* Level progress */}
            <div style={{ marginTop: 16, maxWidth: 360 }}>
              <NeonProgressBar
                value={userInfo.xp}
                max={userInfo.maxXp}
                label={`سطح ${userInfo.level}`}
                showValue
                valueFormat=" XP"
                size="md"
                color="gradient"
                animated
                glow
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div>
        <SectionTitle
          title="آمار شما"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          }
          color="#00d4ff"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 14,
            marginTop: 16,
          }}
        >
          {statsCards.map((stat, index) => (
            <GlassCard key={stat.label} hover glow glowColor={`${stat.color}12`} padding="20px" delay={index * 0.06}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 28 }}>{stat.icon}</span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 + 0.3, type: 'spring', stiffness: 300 }}
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: stat.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    textShadow: `0 0 20px ${stat.color}40`,
                  }}
                >
                  {stat.value.toLocaleString('fa-IR')}
                </motion.span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#8b8bb3',
                    fontWeight: 500,
                    fontFamily: "'Vazirmatn', sans-serif",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Two column layout: Recent Activity + Achievements */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}
      >
        {/* Recent Activity */}
        <div>
          <SectionTitle
            title="فعالیت اخیر"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
            color="#39ff14"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {recentActivity.length === 0 ? (
              <GlassCard padding="24px">
                <p
                  style={{
                    textAlign: 'center',
                    color: '#6a6a8a',
                    fontSize: 14,
                    margin: 0,
                    fontFamily: "'Vazirmatn', sans-serif",
                  }}
                >
                  هنوز فعالیتی ثبت نشده 🌙
                </p>
              </GlassCard>
            ) : (
              recentActivity.slice(0, 5).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 + 0.2 }}
                >
                  <GlassCard hover padding="16px" delay={index * 0.05}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, direction: 'rtl' }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: `${activity.color}15`,
                          border: `1px solid ${activity.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: activity.color,
                          flexShrink: 0,
                        }}
                      >
                        {activityIcons[activity.type]}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#e0e0f0',
                            fontFamily: "'Vazirmatn', sans-serif",
                          }}
                        >
                          {activity.title}
                        </p>
                        <p
                          style={{
                            margin: '3px 0 0',
                            fontSize: 12,
                            color: '#6a6a8a',
                            fontFamily: "'Vazirmatn', sans-serif",
                            lineHeight: 1.5,
                          }}
                        >
                          {activity.description}
                        </p>
                      </div>

                      {/* Timestamp */}
                      <span
                        style={{
                          fontSize: 10,
                          color: '#4a4a6a',
                          whiteSpace: 'nowrap',
                          fontFamily: "'JetBrains Mono', monospace",
                          flexShrink: 0,
                        }}
                      >
                        {activity.timestamp}
                      </span>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Achievements Preview */}
        <div>
          <SectionTitle
            title="دستاوردها"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            }
            color="#ff6a00"
            action={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '5px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 106, 0, 0.1)',
                  border: '1px solid rgba(255, 106, 0, 0.25)',
                  color: '#ff6a00',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: "'Vazirmatn', sans-serif",
                }}
              >
                مشاهده همه
              </motion.button>
            }
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            {achievements.length === 0 ? (
              <GlassCard padding="24px">
                <p
                  style={{
                    textAlign: 'center',
                    color: '#6a6a8a',
                    fontSize: 14,
                    margin: 0,
                    fontFamily: "'Vazirmatn', sans-serif",
                  }}
                >
                  هنوز دستاوردی کسب نشده 🏆
                </p>
              </GlassCard>
            ) : (
              achievements.slice(0, 4).map((ach, index) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 + 0.2 }}
                >
                  <GlassCard hover glow={ach.unlocked} glowColor={`${ach.color}10`} padding="16px" delay={index * 0.05}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl' }}>
                      {/* Icon */}
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: ach.unlocked
                            ? `linear-gradient(135deg, ${ach.color}25, ${ach.color}10)`
                            : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${ach.unlocked ? `${ach.color}40` : 'rgba(255,255,255,0.06)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          flexShrink: 0,
                          boxShadow: ach.unlocked ? `0 0 15px ${ach.color}20` : 'none',
                          filter: ach.unlocked ? 'none' : 'grayscale(0.8) opacity(0.5)',
                        }}
                      >
                        {ach.icon}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 13,
                            fontWeight: 700,
                            color: ach.unlocked ? '#e0e0f0' : '#5a5a7a',
                            fontFamily: "'Vazirmatn', sans-serif",
                          }}
                        >
                          {ach.title}
                        </p>
                        <div style={{ marginTop: 8 }}>
                          <NeonProgressBar
                            value={ach.progress}
                            max={ach.maxProgress}
                            size="sm"
                            color={
                              ach.color === '#00d4ff'
                                ? 'blue'
                                : ach.color === '#a855f7'
                                  ? 'purple'
                                  : ach.color === '#ff2d78'
                                    ? 'pink'
                                    : ach.color === '#39ff14'
                                      ? 'green'
                                      : ach.color === '#ff6a00'
                                        ? 'orange'
                                        : 'blue'
                            }
                            showValue
                            animated
                            glow={ach.unlocked}
                          />
                        </div>
                      </div>

                      {/* Unlocked badge */}
                      {ach.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, delay: index * 0.1 + 0.4 }}
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${ach.color}, ${ach.color}cc)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 0 12px ${ach.color}50`,
                          }}
                        >
                                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionTitle
          title="دسترسی سریع"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          }
          color="#06ffd2"
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 12,
            marginTop: 16,
          }}
        >
          {[
            { label: 'لیست تماشا', icon: '📋', color: '#00d4ff', route: 'watchlist' },
            { label: 'علاقه‌مندی‌ها', icon: '❤️', color: '#ff2d78', route: 'favorites' },
            { label: 'تاریخچه', icon: '🕐', color: '#a855f7', route: 'history' },
            { label: 'دانلودها', icon: '📥', color: '#39ff14', route: 'downloads' },
            { label: 'اعلان‌ها', icon: '🔔', color: '#ff6a00', route: 'notifications' },
            { label: 'تنظیمات', icon: '⚙️', color: '#06ffd2', route: 'preferences' },
          ].map((item, index) => (
            <motion.button
              key={item.route}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 + 0.3 }}
              whileHover={{
                scale: 1.04,
                y: -4,
                boxShadow: `0 8px 25px ${item.color}20`,
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '20px 14px',
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = `${item.color}40`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#c0c0e0',
                  fontFamily: "'Vazirmatn', sans-serif",
                }}
              >
                {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Watching Now / Continue Watching */}
      <div>
        <SectionTitle
          title="ادامه تماشا"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          }
          color="#a855f7"
        />

        <div
          style={{
            display: 'flex',
            gap: 14,
            marginTop: 16,
            overflowX: 'auto',
            paddingBottom: 8,
            direction: 'rtl',
          }}
          className="horizontal-scroll"
        >
          {/* Placeholder cards for continue watching */}
          {[1, 2, 3, 4].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.03, y: -4 }}
              style={{
                minWidth: 200,
                borderRadius: 16,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {/* Thumbnail placeholder */}
              <div
                style={{
                  width: '100%',
                  height: 110,
                  background: `linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(0, 212, 255, 0.1))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </motion.div>

                {/* Progress bar on thumbnail */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: 'rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${30 + index * 18}%` }}
                    transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #a855f7, #00d4ff)',
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#e0e0f0',
                    fontFamily: "'Vazirmatn', sans-serif",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  انیمه نمونه {index + 1}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 11,
                    color: '#6a6a8a',
                    fontFamily: "'Vazirmatn', sans-serif",
                  }}
                >
                  قسمت {index * 3 + 5} از {24}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
