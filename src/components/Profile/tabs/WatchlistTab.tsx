import React, { useState } from 'react';
import { useUserStore, WatchlistItem } from '../../../store/userStore';
import AnimeCard from '../AnimeCard';

type FilterStatus = 'all' | WatchlistItem['status'];

const statusLabels: Record<string, string> = {
  all: 'همه',
  planning: 'برنامه‌ریزی',
  watching: 'در حال تماشا',
  completed: 'تکمیل‌شده',
  'on-hold': 'متوقف',
  dropped: 'رها شده',
};

const statusColors: Record<string, string> = {
  planning: 'bg-blue-500',
  watching: 'bg-green-500',
  completed: 'bg-purple-500',
  'on-hold': 'bg-yellow-500',
  dropped: 'bg-red-500',
};

const WatchlistTab: React.FC = () => {
  const { watchlist, removeFromWatchlist, updateWatchlistStatus } = useUserStore();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = watchlist.filter((item) => {
    const matchStatus = filter === 'all' || item.status === filter;
    const matchSearch = item.animeName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">📋</span>
        <h3 className="text-xl font-bold text-white mb-2">واچ‌لیست خالیه!</h3>
        <p className="text-gray-400 text-sm">
          انیمه‌هایی که می‌خوای ببینی رو اینجا اضافه کن
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در واچ‌لیست..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
          dir="rtl"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key as FilterStatus)}
              className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                filter === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="text-sm text-gray-400" dir="rtl">
        {filtered.length} انیمه
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <AnimeCard
            key={item.animeId}
            animeId={item.animeId}
            animeName={item.animeName}
            animeCover={item.animeCover}
            badge={statusLabels[item.status]}
            badgeColor={statusColors[item.status]}
            onRemove={() => removeFromWatchlist(item.animeId)}
            actions={
              <select
                value={item.status}
                onChange={(e) => {
                  e.stopPropagation();
                  updateWatchlistStatus(
                    item.animeId,
                    e.target.value as WatchlistItem['status']
                  );
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-2 py-1.5 rounded-lg bg-black/80 text-white text-xs border border-white/20 focus:outline-none"
                dir="rtl"
              >
                {Object.entries(statusLabels)
                  .filter(([k]) => k !== 'all')
                  .map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
              </select>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default WatchlistTab;
