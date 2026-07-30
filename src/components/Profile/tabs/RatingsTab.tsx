// components/Profile/tabs/RatingsTab.tsx

import React, { useState } from 'react';
import { useProfile } from '../../../contexts/ProfileContext';

type SortMode = 'date' | 'score-high' | 'score-low';

const RatingsTab: React.FC = () => {
  const { state, rateAnime } = useProfile();
  const [sortMode, setSortMode] = useState<SortMode>('date');

  const sortedRatings = [...state.ratings].sort((a, b) => {
    switch (sortMode) {
      case 'score-high':
        return b.score - a.score;
      case 'score-low':
        return a.score - b.score;
      case 'date':
      default:
        return new Date(b.ratedAt).getTime() - new Date(a.ratedAt).getTime();
    }
  });

  const averageScore =
    state.ratings.length > 0
      ? (state.ratings.reduce((s, r) => s + r.score, 0) / state.ratings.length).toFixed(1)
      : '0';

  return (
    <div className="ratings-tab">
      <div className="tab-header">
        <h3>امتیازات من</h3>
        <div className="ratings-summary">
          <span className="count-badge">{state.ratings.length} امتیاز</span>
          <span className="avg-badge">میانگین: {averageScore}/10</span>
        </div>
      </div>

      <div className="sort-controls">
        <button
          className={`sort-btn ${sortMode === 'date' ? 'active' : ''}`}
          onClick={() => setSortMode('date')}
        >
          جدیدترین
        </button>
        <button
          className={`sort-btn ${sortMode === 'score-high' ? 'active' : ''}`}
          onClick={() => setSortMode('score-high')}
        >
          بالاترین امتیاز
        </button>
        <button
          className={`sort-btn ${sortMode === 'score-low' ? 'active' : ''}`}
          onClick={() => setSortMode('score-low')}
        >
          پایین‌ترین امتیاز
        </button>
      </div>

      {sortedRatings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">⭐</span>
          <p>هنوز امتیازی ثبت نکرده‌اید</p>
        </div>
      ) : (
        <div className="ratings-list">
          {sortedRatings.map((rating) => (
            <div key={rating.animeId} className="rating-card">
              <img src={rating.anime.poster} alt={rating.anime.title} className="rating-poster" />
              <div className="rating-info">
                <h4>{rating.anime.title}</h4>
                <div className="rating-genres">
                  {rating.anime.genres.slice(0, 3).map((g) => (
                    <span key={g} className="genre-tag">{g}</span>
                  ))}
                </div>
                <p className="rated-date">
                  {new Date(rating.ratedAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              <div className="rating-score-section">
                <div className="score-display">
                  <span className="score-number">{rating.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="star-display">
                  {Array.from({ length: 10 }, (_, i) => (
                    <span
                      key={i}
                      className={`star ${i < rating.score ? 'filled' : ''}`}
                      onClick={() => rateAnime(rating.anime, i + 1)}
                      role="button"
                      aria-label={`امتیاز ${i + 1}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {rating.review && (
                  <p className="rating-review">{rating.review}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingsTab;
