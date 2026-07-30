import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';
import AnimeCard from '../AnimeCard';

const FavoritesTab: React.FC = () => {
  const { likes, unlikeAnime } = useUserStore();
  const [search, setSearch] = useState('');

  const filtered = likes.filter((item) =>
    item.animeName.toLowerCase().includes(search.toLowerCase())
  );

  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">❤️</span>
        <h3 className="text-xl font-bold text-white mb-2">هنوز لایکی نزدی!</h3>
        <p className="text-gray-400 text-sm">
          انیمه‌هایی که دوست داری رو لایک کن تا اینجا نشون داده بشن
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو در لایک‌ها..."
        className="w-full sm:max-w-sm px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition text-sm"
        dir="rtl"
      />

      <div className="text-sm text-gray-400" dir="rtl">
        {filtered.length} انیمه
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <AnimeCard
            key={item.animeId}
            animeId={item.animeId}
            animeName={item.animeName}
            animeCover={item.animeCover}
            subtitle={new Date(item.likedAt).toLocaleDateString('fa-IR')}
            onRemove={() => unlikeAnime(item.animeId)}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesTab;
