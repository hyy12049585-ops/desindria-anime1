// components/Profile/tabs/DashboardTab.tsx

import React from 'react';
import { useProfile } from '../../../contexts/ProfileContext';
import { useAnimeStats } from '../../../hooks/useAnimeStats';
import { useRecommendationEngine } from '../../../hooks/useRecommendationEngine';
import { xpForNextLevel, xpForCurrentLevel } from '../../../types/profile';

const DashboardTab: React.FC = () => {
  const { state, computed } = useProfile();
  const stats = useAnimeStats();
  const { topPicks } = useRecommendationEngine();

  const { userProfile } = state;

  return (
    <div className="dashboard-tab">
      {/* سطح و XP */}
      <section className="level-section">
        <div className="level-badge">
          <span className="level-number">سطح {userProfile.level}</span>
          <span className="xp-text">
            {userProfile.xp} / {computed.xpForNext} XP
          </span>
        </div>
        <div className="xp-bar-container">
          <div
            className="xp-bar-fill"
            style={{ width: `${computed.xpProgress}%` }}
          />
        </div>
        <p className="xp-remaining">
          {computed.xpForNext - userProfile.xp} XP تا سطح بعدی
        </p>
      </section>

      {/* آمار سریع */}
      <section className="quick-stats">
        <div className="stat-card">
          <span className="stat-icon">📺</span>
          <span className="stat-value">{stats.totalAnimeCompleted}</span>
          <span className="stat-label">انیمه تکمیل شده</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎬</span>
          <span className="stat-value">{stats.totalEpisodesWatched}</span>
          <span className="stat-label">اپیزود تماشا شده</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{stats.totalWatchTimeHours}h</span>
          <span className="stat-label">ساعت تماشا</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{stats.averageRating}</span>
          <span className="stat-label">میانگین امتیاز</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{stats.watchingStreak}</span>
          <span className="stat-label">روز متوالی</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{stats.completionRate}%</span>
          <span className="stat-label">نرخ تکمیل</span>
        </div>
      </section>

      {/* ادامه تماشا */}
      {computed.continueWatching.length > 0 && (
        <section className="continue-watching-section">
          <h3>ادامه تماشا</h3>
          <div className="continue-grid">
            {computed.continueWatching.slice(0, 4).map((item) => (
              <div key={item.animeId} className="continue-card">
                <img src={item.anime.poster} alt={item.anime.title} />
                <div className="continue-info">
                  <h4>{item.anime.title}</h4>
                  <p>
                    اپیزود {item.lastWatchedEpisode} از {item.anime.totalEpisodes}
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(item.episodesWatched / item.anime.totalEpisodes) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* فعالیت اخیر */}
      <section className="recent-activity-section">
        <h3>فعالیت اخیر</h3>
        {state.activityLog.length === 0 ? (
          <p className="empty-state">هنوز فعالیتی ثبت نشده</p>
        ) : (
          <div className="activity-list">
            {state.activityLog.slice(0, 5).map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-icon">
                  {activity.type === 'watch' && '▶️'}
                  {activity.type === 'rate' && '⭐'}
                  {activity.type === 'favorite' && '❤️'}
                  {activity.type === 'watchlist' && '📋'}
                  {activity.type === 'complete' && '✅'}
                  {activity.type === 'achievement' && '🏆'}
                  {activity.type === 'download' && '⬇️'}
                </span>
                <div className="activity-content">
                  <p>{activity.description}</p>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                {activity.anime && (
                  <img
                    src={activity.anime.poster}
                    alt={activity.anime.title}
                    className="activity-poster"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* پیشنهادات */}
      {topPicks.length > 0 && (
        <section className="recommendations-section">
          <h3>پیشنهاد برای تو</h3>
          <div className="recommendations-grid">
            {topPicks.map((anime) => (
              <div key={anime.id} className="recommendation-card">
                <img src={anime.poster} alt={anime.title} />
                <div className="rec-info">
                  <h4>{anime.title}</h4>
                  <span className="match-score">{anime.matchScore}% تطابق</span>
                  <div className="match-reasons">
                    {anime.matchReasons.map((reason, i) => (
                      <span key={i} className="reason-tag">{reason}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardTab;
