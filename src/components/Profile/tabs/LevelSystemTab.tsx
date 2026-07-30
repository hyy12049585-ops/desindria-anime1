// components/Profile/tabs/LevelSystemTab.tsx

import React from 'react';
import { useProfile } from '../../../contexts/ProfileContext';
import { XP_VALUES, xpForNextLevel, xpForCurrentLevel } from '../../../types/profile';

const LevelSystemTab: React.FC = () => {
  const { state, computed } = useProfile();
  const { userProfile } = state;

  const xpBreakdown = [
    { action: 'تماشای اپیزود', xp: XP_VALUES.watch_episode, icon: '▶️' },
    { action: 'امتیاز دادن', xp: XP_VALUES.rate_anime, icon: '⭐' },
    { action: 'افزودن به علاقه‌مندی', xp: XP_VALUES.favorite_anime, icon: '❤️' },
    { action: 'تکمیل انیمه', xp: XP_VALUES.complete_anime, icon: '✅' },
    { action: 'افزودن به لیست تماشا', xp: XP_VALUES.add_watchlist, icon: '📋' },
  ];

  // محاسبه سطوح قبلی و بعدی
  const levelMilestones = Array.from({ length: Math.max(userProfile.level + 5, 10) }, (_, i) => ({
    level: i,
    xpRequired: Math.pow(i, 2) * 100,
    reached: userProfile.level >= i,
  }));

  return (
    <div className="level-system-tab">
      {/* نمایش سطح فعلی */}
      <div className="current-level-display">
        <div className="level-circle">
          <span className="level-num">{userProfile.level}</span>
          <span className="level-label">سطح</span>
        </div>
        <div className="level-details">
          <h2>سطح {userProfile.level}</h2>
          <p className="total-xp">{userProfile.xp.toLocaleString('fa-IR')} XP کل</p>
        </div>
      </div>

      {/* نوار پیشرفت */}
      <div className="xp-progress-section">
        <div className="xp-labels">
          <span>سطح {userProfile.level}</span>
          <span>سطح {userProfile.level + 1}</span>
        </div>
        <div className="xp-progress-bar">
          <div
            className="xp-progress-fill"
            style={{ width: `${computed.xpProgress}%` }}
          >
            <span className="xp-progress-text">
              {Math.round(computed.xpProgress)}%
            </span>
          </div>
        </div>
        <p className="xp-remaining-text">
          {(computed.xpForNext - userProfile.xp).toLocaleString('fa-IR')} XP تا سطح بعدی
        </p>
      </div>

      {/* راه‌های کسب XP */}
      <div className="xp-earning-section">
        <h3>راه‌های کسب XP</h3>
        <div className="xp-methods-grid">
          {xpBreakdown.map((method) => (
            <div key={method.action} className="xp-method-card">
              <span className="method-icon">{method.icon}</span>
              <span className="method-action">{method.action}</span>
              <span className="method-xp">+{method.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* نقشه سطوح */}
      <div className="level-roadmap">
        <h3>نقشه سطوح</h3>
        <div className="roadmap-list">
          {levelMilestones.slice(1).map((milestone) => (
            <div
              key={milestone.level}
              className={`roadmap-item ${milestone.reached ? 'reached' : ''} ${
                milestone.level === userProfile.level + 1 ? 'next' : ''
              }`}
            >
              <div className="roadmap-marker">
                {milestone.reached ? '✅' : milestone.level === userProfile.level + 1 ? '🔜' : '🔒'}
              </div>
              <div className="roadmap-info">
                <span className="roadmap-level">سطح {milestone.level}</span>
                <span className="roadmap-xp">
                  {milestone.xpRequired.toLocaleString('fa-IR')} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSystemTab;
