// src/components/home/SmartSuggestions.tsx
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp } from 'lucide-react';
import { Anime, UserPreferences } from 'src/types/anime';
import { AnimeCard } from 'src/components/ui/AnimeCard';

interface SmartSuggestionsProps {
  allAnime: Anime[];
  preferences: UserPreferences;
}

// AI Recommendation Engine (mock)
const getSmartSuggestions = (allAnime: Anime[], prefs: UserPreferences): Anime[] => {
  const scored = allAnime.map(anime => {
    let score = 0;
    // Genre match
    const genreMatch = anime.genres.filter(g => prefs.favoriteGenres.includes(g)).length;
    score += genreMatch * 30;
    // Trending bonus
    if (anime.isTrending) score += 20;
    // Rating bonus
    score += anime.rating * 5;
    // New bonus
    if (anime.isNew) score += 15;
    // Not watched bonus
    if (!prefs.watchHistory.includes(anime.id)) score += 10;
    return { anime, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(s => s.anime);
};

export const SmartSuggestions = ({ allAnime, preferences }: SmartSuggestionsProps) => {
  const suggestions = useMemo(
    () => getSmartSuggestions(allAnime, preferences),
    [allAnime, preferences]
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      {/* Header */}
      <div className="px-4 md:px-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/20">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              پیشنهاد هوشمند
              <Sparkles className="w-5 h-5 text-purple-400" />
            </h2>
            <p className="text-white/40 text-sm">بر اساس سلیقه و تاریخچه تماشای شما</p>
          </div>
        </div>

        {/* AI Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {preferences.favoriteGenres.map(g => (
            <span key={g} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-4 md:px-6">
        {suggestions.map((anime, i) => (
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
          >
            <AnimeCard anime={anime} size="md" />
            {/* Match Score */}
            <div className="mt-1 px-1">
              <div className="flex items-center gap-1">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${70 + Math.random() * 25}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
                <span className="text-purple-400 text-[10px]">{Math.floor(70 + Math.random() * 25)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
