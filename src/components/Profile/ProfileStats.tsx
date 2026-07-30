import React from 'react';
import { useUserStore } from '../../store/userStore';

interface StatItem {
  label: string;
  value: number | string;
  icon: string;
  color: string;
}

const ProfileStats: React.FC = () => {
  const { stats } = useUserStore();

  const items: StatItem[] = [
    {
      label: 'انیمه لایک‌شده',
      value: stats.likedCount,
      icon: '❤️',
      color: 'from-red-500/20 to-pink-500/20',
    },
    {
      label: 'واچ‌لیست',
      value: stats.watchlistCount,
      icon: '📋',
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      label: 'ساعت تماشا',
      value: stats.watchHours,
      icon: '⏱️',
      color: 'from-purple-500/20 to-violet-500/20',
    },
    {
      label: 'قسمت دیده‌شده',
      value: stats.episodesWatched,
      icon: '📺',
      color: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'نقد و بررسی',
      value: stats.reviewsCount,
      icon: '✍️',
      color: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      label: 'دانلودها',
      value: stats.downloadedCount,
      icon: '💾',
      color: 'from-indigo-500/20 to-blue-500/20',
    },
    {
      label: 'انیمه تکمیل‌شده',
      value: stats.animeCompleted,
      icon: '🏆',
      color: 'from-amber-500/20 to-yellow-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={`
            relative overflow-hidden rounded-xl p-4
            bg-gradient-to-br ${item.color}
            backdrop-blur-xl border border-white/10
            hover:border-white/20 hover:scale-[1.02]
            transition-all duration-300 cursor-default group
          `}
        >
          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
            {item.icon}
          </div>
          <div className="text-2xl font-bold text-white">{item.value}</div>
          <div className="text-xs text-gray-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
