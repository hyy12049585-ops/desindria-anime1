// src/components/home/LatestUpdates.tsx
import { motion } from 'framer-motion';
import { Clock, Play } from 'lucide-react';
import { Anime } from 'src/types/anime';

interface LatestUpdatesProps {
  animeList: Anime[];
}

export const LatestUpdates = ({ animeList }: LatestUpdatesProps) => {
  const ongoing = animeList.filter(a => a.status === 'ongoing');

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8 px-4 md:px-6"
    >
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-1 flex items-center gap-2">
        <Clock className="w-5 h-5 text-green-400" />
        آخرین به‌روزرسانی‌ها
      </h2>
      <p className="text-white/40 text-sm mb-6">جدیدترین قسمت‌های منتشر شده</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ongoing.map((anime, i) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer group"
          >
            {/* Poster */}
            <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
              <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="text-white text-sm font-bold line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {anime.title}
                </h3>
                <p className="text-white/40 text-xs mt-0.5">{anime.titleEn}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px]">
                    قسمت {anime.currentEpisode}
                  </span>
                  <span>{anime.studio}</span>
                </div>
                {/* Progress */}
                <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    style={{ width: `${(anime.currentEpisode / anime.episodes) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
