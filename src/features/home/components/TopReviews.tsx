import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Feather, BookOpen } from 'lucide-react';
import type { Review } from '@/features/anime/types/anime';

interface TopReviewsProps {
  reviews: Review[];
}

const ScoreCircle: React.FC<{ score: number; label: string; color: string; size?: number }> = ({
  score, label, color, size = 44,
}) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-[9px] text-slate-500">{label}</span>
    </div>
  );
};

const TopReviews: React.FC<TopReviewsProps> = ({ reviews }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  return (
    <section dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Feather size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">برترین نقدها</h2>
            <p className="text-sm text-slate-400">نقدهای برتر جامعه</p>
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
        {reviews.map((r) => (
          <motion.div
            key={r.id}
            whileHover={{ scale: 1.02, y: -4 }}
            className="
              flex-shrink-0 w-[340px] rounded-2xl overflow-hidden
              bg-[var(--bg-card)] border border-[var(--border-color)]
              hover:border-white/15
              shadow-lg shadow-black/40
              transition-all duration-300 cursor-pointer group
            "
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={r.animeImage}
                alt={r.animeName}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/50 to-transparent" />
              <div className="absolute bottom-3 right-3 left-3">
                <p className="text-xs text-slate-400 mb-0.5">{r.animeName}</p>
                <h3 className="text-sm font-bold text-white line-clamp-1">{r.title}</h3>
              </div>
              <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-2.5 py-1 rounded-lg shadow-lg">
                {r.overallScore}
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{r.excerpt}</p>

              <div className="flex items-center justify-around py-2">
                <ScoreCircle score={r.storyScore} label="داستان" color="#8b5cf6" />
                <ScoreCircle score={r.characterScore} label="شخصیت‌ها" color="#06b6d4" />
                <ScoreCircle score={r.artScore} label="گرافیک" color="#f59e0b" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <img src={r.authorAvatar} alt={r.authorName} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs text-slate-400">{r.authorName}</span>
                </div>
                <button className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition">
                  <BookOpen size={12} />
                  <span>ادامه مطلب</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopReviews;
