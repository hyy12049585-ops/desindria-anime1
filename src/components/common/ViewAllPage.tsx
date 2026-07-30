import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AnimeCard from '@/features/anime/components/AnimeCard/AnimeCard';

import {
  trendingAnimes,
  popularAnimes,
  smartPicks,
  seasonalAnimes,
} from '@/data/mockData';
import type { Anime } from '@/features/anime/types/anime';

// مپ کردن مسیر به داده و عنوان
const sections: Record<string, { title: string; data: Anime[]; color: string }> = {
  trending: {
    title: 'ترند روز',
    data: trendingAnimes,
    color: '#ff6b35',
  },
  popular: {
    title: 'محبوب‌ترین‌ها',
    data: popularAnimes,
    color: '#ffd700',
  },
  recommendations: {
    title: 'پیشنهاد هوشمند',
    data: smartPicks,
    color: '#a855f7',
  },
  seasonal: {
    title: 'انیمه‌های فصلی',
    data: seasonalAnimes,
    color: '#ec4899',
  },
};

const ViewAllPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const section = sections[category || ''];

  if (!section) {
    return (
     <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-white mb-4">صفحه پیدا نشد</h1>
          <Link to="/" className="text-purple-400 hover:underline">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* بردکرامب */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors">
            خانه
          </Link>
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span style={{ color: section.color }}>{section.title}</span>
        </div>

        {/* عنوان */}
        <h1
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ color: section.color }}
        >
          {section.title}
        </h1>

        {/* گرید ۵ ستونه */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {section.data.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

        {/* اگر داده بیشتری نیست */}
        {section.data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">انیمه‌ای یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAllPage;
