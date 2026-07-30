import { Sparkles, Plus, Star } from 'lucide-react';

const recommendations = [
  {
    title: 'Vinland Saga',
    genre: '\u0627\u06A9\u0634\u0646 \u2022 \u0645\u0627\u062C\u0631\u0627\u062C\u0648\u06CC\u06CC',
    rating: 8.8,
    poster: 'https://cdn.myanimelist.net/images/anime/1500/103005.jpg',
  },
  {
    title: 'Mob Psycho 100',
    genre: '\u0627\u06A9\u0634\u0646 \u2022 \u06A9\u0645\u062F\u06CC',
    rating: 8.6,
    poster: 'https://cdn.myanimelist.net/images/anime/8/80356.jpg',
  },
  {
    title: 'Made in Abyss',
    genre: '\u0641\u0627\u0646\u062A\u0632\u06CC \u2022 \u0645\u0627\u062C\u0631\u0627\u062C\u0648\u06CC\u06CC',
    rating: 8.7,
    poster: 'https://cdn.myanimelist.net/images/anime/6/86733.jpg',
  },
  {
    title: 'Violet Evergarden',
    genre: '\u062F\u0631\u0627\u0645 \u2022 \u0641\u0627\u0646\u062A\u0632\u06CC',
    rating: 8.6,
    poster: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg',
  },
];

export function AnimeRecommendations() {
  return (
    <div className="glass-card recommendations-panel fade-in fade-in-delay-5">
      <div className="section-title" style={{ padding: 0, marginBottom: 12 }}>
        <h3>
          <Sparkles size={18} />
          {'\u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0628\u0631\u0627\u06CC \u0634\u0645\u0627'}
        </h3>
      </div>

      <div className="recommendations-list">
        {recommendations.map((anime, i) => (
          <div key={i} className="recommendation-item">
            <img src={anime.poster} alt={anime.title} className="recommendation-poster" />
            <div className="recommendation-info">
              <div className="recommendation-title">{anime.title}</div>
              <div className="recommendation-genre">{anime.genre}</div>
              <div className="recommendation-rating">
                <Star size={11} fill="#fbbf24" stroke="#fbbf24" />
                {anime.rating}
              </div>
            </div>
            <button className="recommendation-add-btn" title={'\u0627\u0641\u0632\u0648\u062F\u0646 \u0628\u0647 \u0644\u06CC\u0633\u062A'}>
              <Plus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
