import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Play, Star, Download } from 'lucide-react';
import { useUserData } from '../../../../contexts/UserDataContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import type { Anime } from '../../types/anime';


interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const [showActions, setShowActions] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // placeholder بسته به تم: تیره برای dark، روشن برای light
  const FALLBACK_POSTER = isDark
    ? 'https://placehold.co/300x400/1a1a2e/a855f7?text=Anime'
    : 'https://placehold.co/300x400/f3f0ff/7c3aed?text=Anime';

  const {
    toggleFavorite,
    toggleWatchlist,
    isInFavorites,
    isInWatchlist,
    getRating,
    setRating,
    addDownload,
  } = useUserData();

  const liked = isInFavorites(anime.id);
  const bookmarked = isInWatchlist(anime.id);
  const rating = getRating(anime.id) || 0;

  const posterSrc = anime.poster || anime.image || FALLBACK_POSTER;
  const score = anime.score ?? anime.rating;

  const basePayload = {
    id: String(anime.id),
    title: anime.title,
    poster: anime.poster || anime.image || '',
    type: anime.type || 'anime',
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(basePayload);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(basePayload);
  };

  const handleRating = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newRating = rating >= 5 ? 0 : rating + 1;
    setRating({ ...basePayload, rating: newRating });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addDownload({ ...basePayload, quality: '1080p' });
  };

  return (
    <div
      className={`block group cursor-pointer relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? 'bg-[#0a0a1e] border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
          : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
    >
      <Link to={`/anime/${anime.id}`} className="block">
        <div
          className={`relative aspect-[3/4] overflow-hidden ${
            isDark ? 'bg-[#10102a]' : 'bg-gray-100'
          }`}
        >
          <img
            src={posterSrc}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_POSTER;
            }}
          />

          <div
            className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              isDark
                ? 'from-black/80 via-black/20'
                : 'from-black/30 via-black/5'
            }`}
          />

          {anime.status && (
            <div className="absolute top-2 right-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium text-white ${
                  anime.status === 'ongoing'
                    ? 'bg-green-500/80'
                    : 'bg-blue-500/80'
                }`}
              >
                {anime.status === 'ongoing' ? 'در حال پخش' : 'تکمیل شده'}
              </span>
            </div>
          )}

          {score != null && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-white">{score}</span>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
              showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <button
              onClick={handleLike}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 ${
                liked
                  ? 'bg-red-500 shadow-lg shadow-red-500/30'
                  : 'bg-black/50 hover:bg-red-500/80'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleBookmark}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 ${
                bookmarked
                  ? 'bg-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-black/50 hover:bg-purple-500/80'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleRating}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200 ${
                rating > 0
                  ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30'
                  : 'bg-black/50 hover:bg-yellow-400/80'
              }`}
            >
              <Star className={`w-4 h-4 ${rating > 0 ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleDownload}
              className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/50 text-white hover:bg-green-500/80 hover:scale-110 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* PLAY BTN */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-600/90 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-purple-600/30">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="p-3">
          <h3
            className={`text-sm font-medium truncate ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {anime.type && (
              <span
                className={`text-[11px] ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {anime.type}
              </span>
            )}
            {anime.year && (
              <span
                className={`text-[11px] ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {anime.year}
              </span>
            )}
            {anime.episodes && (
              <span
                className={`text-[11px] ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {anime.episodes} قسمت
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AnimeCard;
