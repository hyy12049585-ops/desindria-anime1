import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Trophy, Flame, Crown, Timer, Users } from 'lucide-react';

interface PollOption {
  id: string;
  name: string;
  image: string;
  votes: number;
}

interface WeeklyPollProps {
  options: PollOption[];
}

const WeeklyPoll: React.FC<WeeklyPollProps> = ({ options }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  const sorted = [...options].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted[0]?.votes || 1;

  const handleVote = (id: string) => {
    if (hasVoted) return;
    setSelectedId(id);
    setHasVoted(true);
  };

  const getBarColor = (index: number) => {
    const colors = [
      'from-yellow-400 via-amber-500 to-orange-500',
      'from-slate-300 via-slate-400 to-slate-500',
      'from-amber-600 via-amber-700 to-amber-800',
      'from-purple-500 via-violet-500 to-indigo-500',
      'from-cyan-400 via-teal-500 to-emerald-500',
      'from-pink-400 via-rose-500 to-red-500',
    ];
    return colors[index % colors.length];
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown size={16} className="text-yellow-400" />;
    if (index === 1) return <Trophy size={16} className="text-slate-300" />;
    if (index === 2) return <Flame size={16} className="text-amber-600" />;
    return <span className="text-xs text-slate-500 font-bold">#{index + 1}</span>;
  };

  return (
    <section dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <BarChart3 size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-[8px] text-white font-bold">!</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">نظرسنجی این هفته</h2>
            <p className="text-sm text-slate-400">انیمه محبوب این هفته رو انتخاب کن</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Users size={14} />
            <span>{totalVotes.toLocaleString('fa-IR')} رأی</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Timer size={14} />
            <span>۳ روز مانده</span>
          </div>
        </div>
      </div>

      {/* Poll Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sorted.map((option, index) => {
          const pct = Math.round((option.votes / totalVotes) * 100);
          const isSelected = selectedId === option.id;
          const isLeader = index === 0;

          return (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleVote(option.id)}
              className={`
                relative rounded-2xl overflow-hidden cursor-pointer
                border transition-all duration-500 group
                ${isSelected
                  ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                  : isLeader
                    ? 'border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                    : 'border-white/5 hover:border-white/20'
                }
              `}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={option.image}
                  alt={option.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Rank badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                  {getRankIcon(index)}
                </div>

                {/* Selected checkmark */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Leader glow */}
                {isLeader && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-yellow-400/20 rounded-2xl" />
                )}

                {/* Bottom info */}
                <div className="absolute bottom-0 inset-x-0 p-3">
                  <p className="text-sm font-bold text-white mb-2 drop-shadow-lg">{option.name}</p>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(option.votes / maxVotes) * 100}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
                      className={`absolute inset-y-0 right-0 rounded-full bg-gradient-to-l ${getBarColor(index)}`}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-white/80 font-semibold">{pct}%</span>
                    <span className="text-[10px] text-slate-400">{option.votes.toLocaleString('fa-IR')} رأی</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WeeklyPoll;
