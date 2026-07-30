// src/components/home/TopCharacters.tsx
import { motion } from 'framer-motion';
import { Crown, Heart } from 'lucide-react';
import { Character } from 'src/types/anime';

interface TopCharactersProps {
  characters: Character[];
}

export const TopCharacters = ({ characters }: TopCharactersProps) => {
  const sorted = [...characters].sort((a, b) => b.votes - a.votes);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8 px-4 md:px-6"
    >
      <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent mb-1 flex items-center gap-2">
        <Crown className="w-5 h-5 text-yellow-400" />
        محبوب‌ترین کاراکترها
      </h2>
      <p className="text-white/40 text-sm mb-6">رأی بده به کاراکتر مورد علاقه‌ات</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sorted.map((char, i) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

              {/* Rank Badge */}
              {i < 3 && (
                <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  i === 0 ? 'bg-yellow-500 text-black' :
                  i === 1 ? 'bg-gray-300 text-black' :
                  'bg-orange-600 text-white'
                }`}>
                  {i + 1}
                </div>
              )}

              {/* Vote Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="absolute top-2 left-2 p-1.5 bg-black/40 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="w-4 h-4 text-pink-400" />
              </motion.button>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-sm font-bold line-clamp-1">{char.name}</h3>
                <p className="text-white/50 text-xs">{char.anime}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                  <span className="text-pink-300 text-xs">{(char.votes / 1000).toFixed(1)}K</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
