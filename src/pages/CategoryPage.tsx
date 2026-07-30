import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import AnimeCard from '@/features/anime/components/AnimeCard/AnimeCard';
import {
  trendingAnimes,
  popularAnimes,
  smartPicks,
  seasonalAnimes,
} from '../data/mockData';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();


  console.log('Category from URL:', category); // برای دیباگ

  const getCategoryData = () => {
    switch (category) {
      case 'trending':
        return { title: 'ترند روز', data: trendingAnimes, color: '#ff6b35' };
      case 'popular':
        return { title: 'محبوب‌ترین‌ها', data: popularAnimes, color: '#ffd700' };
      case 'recommendations':
        return { title: 'پیشنهاد هوشمند', data: smartPicks, color: '#a855f7' };
      case 'seasonal':
        return { title: 'انیمه‌های فصلی', data: seasonalAnimes, color: '#ec4899' };
      default:
        return { title: 'همه انیمه‌ها', data: trendingAnimes, color: '#e94560' };
    }
  };

  const { title, data, color } = getCategoryData();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20">
      <div className="bg-gradient-to-b from-black/40 to-transparent py-8 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronRight className="w-4 h-4" />
            <span>بازگشت به خانه</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold" style={{ color }}>
            {title}
          </h1>
          <p className="text-gray-400 mt-2">{data.length} انیمه</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {data.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">هیچ انیمه‌ای پیدا نشد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
