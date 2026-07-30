import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, ThumbsUp, ThumbsDown, Reply, BadgeCheck, Shield, Star } from 'lucide-react';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  animeName: string;
  comment: string;
  rating: number;
  likes: number;
  dislikes: number;
  replies: number;
  date: string;
  isPro: boolean;
  level: number;
}

interface UserCommentsProps {
  comments: Comment[];
}

const getLevelInfo = (level: number) => {
  if (level >= 50) return { label: 'افسانه‌ای', color: 'from-yellow-400 to-amber-600', textColor: 'text-yellow-400' };
  if (level >= 30) return { label: 'حرفه‌ای', color: 'from-purple-400 to-violet-600', textColor: 'text-purple-400' };
  if (level >= 15) return { label: 'باتجربه', color: 'from-cyan-400 to-blue-600', textColor: 'text-cyan-400' };
  return { label: 'تازه‌کار', color: 'from-slate-400 to-slate-600', textColor: 'text-slate-400' };
};

const UserComments: React.FC<UserCommentsProps> = ({ comments }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
            <MessageCircle size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">آخرین نظرات کاربران</h2>
            <p className="text-sm text-slate-400">نظرات تازه از جامعه سیندریا</p>
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
        {comments.map((c) => {
          const levelInfo = getLevelInfo(c.level);
          return (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.02, y: -4 }}
              className="
                flex-shrink-0 w-[310px] rounded-2xl p-4
                bg-[var(--bg-card)] backdrop-blur-md
                border border-white/5 hover:border-white/15
                shadow-lg shadow-black/40
                transition-all duration-300 cursor-pointer group
                flex flex-col gap-3
              "
            >
              {/* Header: avatar + username + badge */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={c.avatar}
                    alt={c.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                  />
                  {/* Level ring */}
                  <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r ${levelInfo.color} text-[8px] text-white font-bold`}>
                    Lv.{c.level}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white truncate">{c.username}</span>
                    {c.isPro && (
                      <BadgeCheck size={15} className="text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold ${levelInfo.textColor}`}>{levelInfo.label}</span>
                    <span className="text-[10px] text-slate-500">• {c.animeName}</span>
                  </div>
                </div>
                {/* Rating */}
                <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {c.rating}
                </div>
              </div>

              {/* Comment text */}
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{c.comment}</p>

              {/* Footer: like/dislike/reply */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 text-slate-400 hover:text-green-400 transition text-xs">
                    <ThumbsUp size={13} />
                    <span>{c.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition text-xs">
                    <ThumbsDown size={13} />
                    <span>{c.dislikes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition text-xs">
                    <Reply size={13} />
                    <span>{c.replies}</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-500">{c.date}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default UserComments;
