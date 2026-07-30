import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimeCard from '../features/anime/components/AnimeCard/AnimeCard';
import {
  trendingAnimes,
  popularAnimes,
  smartPicks,
  seasonalAnimes,
} from '../data/mockData';

const categoryMap: Record<string, { title: string; data: any[]; accent: string }> = {
  trending:        { title: 'ترند روز',         data: trendingAnimes,  accent: '#ff6b35' },
  popular:         { title: 'محبوب‌ترین‌ها',     data: popularAnimes,   accent: '#ffd700' },
  recommendations: { title: 'پیشنهاد هوشمند',   data: smartPicks,      accent: '#a855f7' },
  seasonal:        { title: 'انیمه‌های فصلی',    data: seasonalAnimes,  accent: '#ec4899' },
};

const AnimeCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const info = categoryMap[category || ''];

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-xl">دسته‌بندی پیدا نشد</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </Link>
          <h1
            className="text-3xl font-bold"
            style={{ color: info.accent }}
          >
            {info.title}
          </h1>
          <span className="text-gray-500 text-lg">
            ({info.data.length} انیمه)
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {info.data.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeCategoryPage;
