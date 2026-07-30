import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Film, Play, Eye, Heart } from 'lucide-react';

interface Reel {
  id: number;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
}

interface AnimeReelsProps {
  reels: Reel[];
}

const AnimeReels: React.FC<AnimeReelsProps> = ({ reels }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
  };

  return (
    <section dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
            <Film size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">ریلز انیمه</h2>
            <p className="text-sm text-slate-400">کلیپ‌های کوتاه و جذاب</p>
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
        {reels.map((reel) => (
          <motion.div
            key={reel.id}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.98 }}
            className="
              flex-shrink-0 w-[180px] rounded-2xl overflow-hidden
              bg-gradient-to-b from-[#1a1f35] to-[#111827]
              border border-white/10 hover:border-pink-500/40
              shadow-lg shadow-black/50
              transition-all duration-300 cursor-pointer group
              relative
            "
          >
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] overflow-hidden">
              <img
                src={reel.thumbnail}
                alt={reel.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Play icon (appears on hover) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
              </motion.div>

              {/* Duration badge */}
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] text-white font-bold">
                {reel.duration}
              </div>

              {/* Bottom info */}
              <div className="absolute bottom-0 inset-x-0 p-3">
                <p className="text-xs font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">{reel.title}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/80">
                  <div className="flex items-center gap-1">
                    <Eye size={11} />
                    <span>{reel.views.toLocaleString('fa-IR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart size={11} />
                    <span>{reel.likes.toLocaleString('fa-IR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AnimeReels;
