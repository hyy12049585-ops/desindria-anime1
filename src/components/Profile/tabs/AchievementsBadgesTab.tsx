// components/Profile/tabs/AchievementsBadgesTab.tsx

import React from 'react';
import { useProfile } from '../../../contexts/ProfileContext';

const AchievementsBadgesTab: React.FC = () => {
  const { state } = useProfile();

  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;
  const totalCount = state.achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="achievements-tab">
      <div className="tab-header">
        <h3>دستاوردها و نشان‌ها</h3>
        <div className="achievements-summary">
          <span className="count-badge">
            {unlockedCount}/{totalCount} باز شده
          </span>
          <span className="progress-badge">{progressPercent}%</span>
        </div>
      </div>

      {/* نوار پیشرفت کلی */}
      <div className="achievements-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🏆</span>
          <p>دستاوردی تعریف نشده</p>
        </div>
      ) : (
        <div className="achievements-grid">
          {state.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">
                <span className={achievement.unlocked ? '' : 'locked-icon'}>
                  {achievement.icon}
                </span>
              </div>
              <div className="achievement-info">
                <h4>{achievement.title}</h4>
                <p className="achievement-desc">{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="unlock-date">
                    باز شده: {new Date(achievement.unlockedAt).toLocaleDateString('fa-IR')}
                  </span>
                )}
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="achievement-progress">
                    <div className="mini-progress-bar">
                      <div
                        className="mini-progress-fill"
                        style={{
                          width: `${
                            achievement.target
                              ? (achievement.progress / achievement.target) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="progress-text">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                )}
              </div>
              <div className="achievement-rarity">
                <span className={`rarity-badge rarity-${achievement.rarity}`}>
                  {achievement.rarity === 'common' && '🟢 معمولی'}
                  {achievement.rarity === 'rare' && '🔵 کمیاب'}
                  {achievement.rarity === 'epic' && '🟣 حماسی'}
                  {achievement.rarity === 'legendary' && '🟡 افسانه‌ای'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementsBadgesTab;
