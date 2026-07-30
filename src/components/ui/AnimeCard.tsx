// src/components/ui/AnimeCard.tsx
import { motion } from 'framer-motion';
import { Star, Play, Plus } from 'lucide-react';
import { Anime } from '../../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimeCard = ({ anime, onClick, size = 'md' }: AnimeCardProps) => {
  const sizeMap = {
    sm: 'w-32 md:w-36',
    md: 'w-40 md:w-48',
    lg: 'w-48 md:w-56',
  };

  return (
    <motion.div
      className={`flex-shrink-0 ${sizeMap[size]} cursor-pointer group`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
        {/* Poster */}
        <img
          src={anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {anime.isNew && (
            <span className="px-1.5 py-0.5 bg-cyan-500 text-black text-[10px] font-bold rounded">
              جدید
            </span>
          )}
          {anime.isTrending && (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded">
              ترند
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-[11px] font-semibold">{anime.rating}</span>
        </div>

        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/30"
          >
            <Play className="w-4 h-4 text-black fill-black" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
          >
            <Plus className="w-4 h-4 text-white" />
          </motion.button>
        </div>

        {/* Episode Progress */}
        {anime.status === 'ongoing' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
              style={{ width: `${(anime.currentEpisode / anime.episodes) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 px-0.5">
        <h3 className="text-white text-sm font-semibold line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {anime.title}
        </h3>
        <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{anime.titleEn}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-white/30 text-[10px]">{anime.episodes} قسمت</span>
          <span className="w-0.5 h-0.5 bg-white/20 rounded-full" />
          <span className="text-white/30 text-[10px]">{anime.year}</span>
        </div>
      </div>
    </motion.div>
  );
};
