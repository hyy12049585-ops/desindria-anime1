import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Award } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  anime: string;
  image: string;
  likes: number;
  rank: number;
}

interface PopularCharactersProps {
  characters: Character[];
}

const PopularCharacters: React.FC<PopularCharactersProps> = ({ characters }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <section dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Award size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">محبوب‌ترین شخصیت‌ها</h2>
            <p className="text-sm text-slate-400">رای بده به کاراکتر مورد علاقه‌ات</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
            <ChevronRight size={20} />
          </button>
          <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition">
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {characters.map((char) => (
          <motion.div
            key={char.id}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.98 }}
            className="
              flex-shrink-0 w-[160px] rounded-2xl overflow-hidden
              bg-gradient-to-b from-[#1a1f35] to-[#111827]
              border border-white/10 hover:border-pink-500/40
              shadow-lg shadow-black/50
              transition-all duration-300 cursor-pointer group
              relative
            "
          >
            {/* Rank badge */}
            <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white font-bold">
              #{char.rank}
            </div>

            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={char.image}
                alt={char.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2">
              <h3 className="text-sm font-bold text-white line-clamp-1">{char.name}</h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">{char.anime}</p>

              {/* Likes */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <button className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition group/like">
                  <Heart size={14} className="group-hover/like:fill-pink-400 transition" />
                  <span className="text-xs font-semibold">{char.likes.toLocaleString('fa-IR')}</span>
                </button>
                <button className="text-[10px] text-slate-500 hover:text-white transition">رأی</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularCharacters;
