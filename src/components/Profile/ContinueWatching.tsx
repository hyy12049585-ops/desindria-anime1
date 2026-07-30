import { Play } from 'lucide-react';

const animeList = [
  {
    title: 'Attack on Titan',
    episode: '\u0642\u0633\u0645\u062A 12 / 24',
    progress: 50,
    poster: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
  },
  {
    title: 'Demon Slayer',
    episode: '\u0642\u0633\u0645\u062A 20 / 26',
    progress: 77,
    poster: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
  },
  {
    title: 'Jujutsu Kaisen',
    episode: '\u0642\u0633\u0645\u062A 8 / 24',
    progress: 33,
    poster: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
  },
  {
    title: 'One Piece',
    episode: '\u0642\u0633\u0645\u062A 1045 / 1100',
    progress: 95,
    poster: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
  },
  {
    title: 'Spy x Family',
    episode: '\u0642\u0633\u0645\u062A 6 / 12',
    progress: 50,
    poster: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
  },
  {
    title: 'Chainsaw Man',
    episode: '\u0642\u0633\u0645\u062A 4 / 12',
    progress: 33,
    poster: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
  },
];

export function ContinueWatching() {
  return (
    <div className="fade-in fade-in-delay-2">
      <div className="section-title">
        <h3>
          <Play size={18} />
          {'\u0627\u062F\u0627\u0645\u0647 \u062A\u0645\u0627\u0634\u0627'}
        </h3>
        <button>{'\u0645\u0634\u0627\u0647\u062F\u0647 \u0647\u0645\u0647'}</button>
      </div>

      <div className="continue-slider">
        {animeList.map((anime, i) => (
          <div key={i} className="continue-card">
            <img src={anime.poster} alt={anime.title} className="continue-poster" />
            <div className="continue-play-overlay">
              <div className="continue-play-btn">
                <Play size={20} fill="#fff" />
              </div>
            </div>
            <div className="continue-info">
              <div className="continue-title">{anime.title}</div>
              <div className="continue-episode">{anime.episode}</div>
              <div className="continue-progress">
                <div className="continue-progress-fill" style={{ width: `${anime.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
