import { List, Heart, Trash2, Star } from 'lucide-react';

const watchlist = [
  { title: 'Naruto Shippuden', rating: 8.7, poster: 'https://cdn.myanimelist.net/images/anime/5/17407.jpg' },
  { title: 'Death Note', rating: 9.0, poster: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg' },
  { title: 'Fullmetal Alchemist', rating: 9.1, poster: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg' },
  { title: 'My Hero Academia', rating: 8.0, poster: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg' },
  { title: 'Tokyo Ghoul', rating: 7.8, poster: 'https://cdn.myanimelist.net/images/anime/5/64449.jpg' },
  { title: 'Steins;Gate', rating: 9.1, poster: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg' },
];

export function Watchlist() {
  return (
    <div className="fade-in fade-in-delay-3">
      <div className="section-title">
        <h3>
          <List size={18} />
          {'\u0644\u06CC\u0633\u062A \u062A\u0645\u0627\u0634\u0627'}
        </h3>
        <button>{'\u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647'}</button>
      </div>

      <div className="watchlist-grid">
        {watchlist.map((anime, i) => (
          <div key={i} className="watchlist-card">
            <img src={anime.poster} alt={anime.title} className="watchlist-poster" />
            <div className="watchlist-overlay">
              <button className="watchlist-action-btn watchlist-fav-btn">
                <Heart size={14} />
              </button>
              <button className="watchlist-action-btn watchlist-remove-btn">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="watchlist-info">
              <div className="watchlist-title">{anime.title}</div>
              <div className="watchlist-rating">
                <Star size={12} fill="#fbbf24" />
                {anime.rating}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
