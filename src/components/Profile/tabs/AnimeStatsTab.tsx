// components/Profile/tabs/AnimeStatsTab.tsx

import React from 'react';
import { useAnimeStats } from '../../../hooks/useAnimeStats';

const AnimeStatsTab: React.FC = () => {
  const stats = useAnimeStats();

  return (
    <div className="anime-stats-tab">
      {/* کارت‌های آمار اصلی */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">📺</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAnimeStarted}</span>
            <span className="stat-label">انیمه شروع شده</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAnimeCompleted}</span>
            <span className="stat-label">انیمه تکمیل شده</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">🎬</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalEpisodesWatched}</span>
            <span className="stat-label">اپیزود تماشا شده</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalWatchTimeHours}h</span>
            <span className="stat-label">ساعت تماشا</span>
          </div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <span className="stat-value">{stats.averageRating}/10</span>
            <span className="stat-label">میانگین امتیاز</span>
          </div>
        </div>
        <div className="stat-card fire">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.watchingStreak}</span>
            <span className="stat-label">روز متوالی تماشا</span>
          </div>
        </div>
      </div>

      {/* نرخ تکمیل */}
      <section className="completion-section">
        <h3>نرخ تکمیل</h3>
        <div className="completion-ring">
          <svg viewBox="0 0 120 120" className="ring-svg">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-surface-alt, #2a2a3e)" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-primary, #6c5ce7)" strokeWidth="10"
              strokeDasharray={`${stats.completionRate * 3.14} ${314 - stats.completionRate * 3.14}`}
              strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 60 60)" />
            <text x="60" y="55" textAnchor="middle" fill="var(--color-text, #fff)" fontSize="22" fontWeight="bold">
              {stats.completionRate}%
            </text>
            <text x="60" y="75" textAnchor="middle" fill="var(--color-text-secondary, #aaa)" fontSize="10">
              تکمیل شده
            </text>
          </svg>
        </div>
      </section>

      {/* توزیع ژانر */}
      <section className="genre-distribution-section">
        <h3>توزیع ژانرها</h3>
        {stats.genreDistribution.length === 0 ? (
          <p className="empty-state">هنوز داده‌ای ثبت نشده</p>
        ) : (
          <div className="genre-bars">
            {stats.genreDistribution.map((item) => (
              <div key={item.genre} className="genre-bar-row">
                <span className="genre-name">{item.genre}</span>
                <div className="genre-bar-track">
                  <div className="genre-bar-fill" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="genre-count">{item.count} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* توزیع امتیازات */}
      <section className="rating-distribution-section">
        <h3>توزیع امتیازات</h3>
        {stats.ratingDistribution.every((r) => r.count === 0) ? (
          <p className="empty-state">هنوز امتیازی ثبت نشده</p>
        ) : (
          <div className="rating-chart">
            {stats.ratingDistribution.map((item) => {
              const maxCount = Math.max(...stats.ratingDistribution.map((r) => r.count), 1);
              const heightPercent = (item.count / maxCount) * 100;
              return (
                <div key={item.score} className="rating-bar-col">
                  <span className="bar-count">{item.count}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ height: `${heightPercent}%` }} />
                  </div>
                  <span className="bar-score">{item.score}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* فعالیت ماهانه */}
      <section className="monthly-activity-section">
        <h3>فعالیت ماهانه</h3>
        {stats.monthlyActivity.length === 0 ? (
          <p className="empty-state">هنوز فعالیتی ثبت نشده</p>
        ) : (
          <div className="monthly-chart">
            {stats.monthlyActivity.map((item) => {
              const maxEp = Math.max(...stats.monthlyActivity.map((m) => m.episodes), 1);
              const heightPercent = (item.episodes / maxEp) * 100;
              return (
                <div key={item.month} className="monthly-bar-col">
                  <span className="monthly-count">{item.episodes}</span>
                  <div className="monthly-bar-track">
                    <div className="monthly-bar-fill" style={{ height: `${heightPercent}%` }} />
                  </div>
                  <span className="monthly-label">{item.month}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* استودیوهای برتر */}
      <section className="top-studios-section">
        <h3>استودیوهای برتر</h3>
        {stats.topStudios.length === 0 ? (
          <p className="empty-state">هنوز داده‌ای ثبت نشده</p>
        ) : (
          <div className="studios-list">
            {stats.topStudios.map((item, index) => (
              <div key={item.studio} className="studio-item">
                <span className="studio-rank">#{index + 1}</span>
                <span className="studio-name">{item.studio}</span>
                <span className="studio-count">{item.count} انیمه</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ژانر مورد علاقه */}
      <section className="favorite-genre-section">
        <div className="favorite-genre-card">
          <span className="fav-icon">🎭</span>
          <div className="fav-info">
            <span className="fav-label">ژانر مورد علاقه</span>
            <span className="fav-value">{stats.favoriteGenre}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimeStatsTab;
