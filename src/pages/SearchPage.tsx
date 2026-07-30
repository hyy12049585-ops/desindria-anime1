// src/pages/SearchPage.tsx

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterSidebar } from '../components/Filter/FilterSidebar';
import { useFilter } from '../hooks/useFilter';

const MOCK_ANIME = [
  { id: 1, title: 'Attack on Titan', titleJp: '進撃の巨人', image: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', rating: 9.0, year: 2013, type: 'series', genres: ['Action', 'Drama', 'Fantasy'], episodes: 87 },
  { id: 2, title: 'Demon Slayer', titleJp: '鬼滅の刃', image: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', rating: 8.5, year: 2019, type: 'series', genres: ['Action', 'Supernatural'], episodes: 44 },
  { id: 3, title: 'Jujutsu Kaisen', titleJp: '呪術廻戦', image: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', rating: 8.7, year: 2020, type: 'series', genres: ['Action', 'Supernatural'], episodes: 47 },
  { id: 4, title: 'One Piece', titleJp: 'ワンピース', image: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg', rating: 8.7, year: 1999, type: 'series', genres: ['Action', 'Adventure', 'Comedy'], episodes: 1100 },
  { id: 5, title: 'Naruto Shippuden', titleJp: 'ナルト 疾風伝', image: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg', rating: 8.3, year: 2007, type: 'series', genres: ['Action', 'Adventure'], episodes: 500 },
  { id: 6, title: 'Chainsaw Man', titleJp: 'チェンソーマン', image: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg', rating: 8.5, year: 2022, type: 'series', genres: ['Action', 'Supernatural'], episodes: 12 },
  { id: 7, title: 'Spy x Family', titleJp: 'スパイファミリー', image: 'https://cdn.myanimelist.net/images/anime/1441/139629.jpg', rating: 8.6, year: 2022, type: 'series', genres: ['Action', 'Comedy'], episodes: 37 },
  { id: 8, title: 'Your Name', titleJp: '君の名は。', image: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg', rating: 8.9, year: 2016, type: 'movie', genres: ['Romance', 'Drama', 'Fantasy'], episodes: 1 },
  { id: 9, title: 'Spirited Away', titleJp: '千と千尋の神隠し', image: 'https://cdn.myanimelist.net/images/anime/6/79597.jpg', rating: 8.8, year: 2001, type: 'movie', genres: ['Adventure', 'Fantasy', 'Supernatural'], episodes: 1 },
  { id: 10, title: 'Violet Evergarden', titleJp: 'ヴァイオレット・エヴァーガーデン', image: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg', rating: 8.7, year: 2018, type: 'series', genres: ['Drama', 'Fantasy', 'Slice of Life'], episodes: 13 },
  { id: 11, title: 'Death Note', titleJp: 'デスノート', image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg', rating: 8.6, year: 2006, type: 'series', genres: ['Mystery', 'Psychological', 'Thriller'], episodes: 37 },
  { id: 12, title: 'Fullmetal Alchemist: Brotherhood', titleJp: '鋼の錬金術師', image: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg', rating: 9.1, year: 2009, type: 'series', genres: ['Action', 'Adventure', 'Drama', 'Fantasy'], episodes: 64 },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    filters,
    toggleContentType,
    toggleGenre,
    toggleStudio,
    toggleAudio,
    setYearRange,
    setSortBy,
    setSearchQuery,
    clearAll,
    activeCount,
  } = useFilter();

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearchInput(q);
    }
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (value.trim()) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const filteredAnime = useMemo(() => {
    let results = [...MOCK_ANIME];

    if (searchInput) {
      const q = searchInput.toLowerCase();
      results = results.filter(a =>
        a.title.toLowerCase().includes(q) || a.titleJp.includes(q)
      );
    }

    if (filters.contentTypes.length > 0) {
      results = results.filter(a => filters.contentTypes.includes(a.type as any));
    }

    if (filters.genres.length > 0) {
      results = results.filter(a =>
        filters.genres.some(g => a.genres.includes(g))
      );
    }

    results = results.filter(a =>
      a.year >= filters.yearRange[0] && a.year <= filters.yearRange[1]
    );

    switch (filters.sortBy) {
      case 'top-rated':
      case 'imdb':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }

    return results;
  }, [filters, searchInput]);

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--bg-primary)]">
      {/* Search Header */}
      <div className="border-b border-[#2a2a35]/50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="text"
                value={searchInput}
                onChange={e => handleSearchChange(e.target.value)}
                placeholder="جستجوی انیمه..."
                dir="rtl"
                className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl pr-11 pl-10 py-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-purple-500/50 focus:shadow-lg focus:shadow-purple-500/10 transition-all font-[Vazirmatn]"
              />
              {searchInput && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMobileFilter(!showMobileFilter)}
              className="lg:hidden flex items-center gap-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/30 transition-all"
            >
              <SlidersHorizontal size={16} />
              <span className="text-[13px] font-medium">فیلتر</span>
              {activeCount > 0 && (
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold rounded-full px-1.5">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          {activeCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[11px] text-white/30">فعال:</span>
              {filters.contentTypes.map(ct => (
                <span key={ct} className="flex items-center gap-1 bg-purple-500/15 border border-purple-500/20 text-purple-300 text-[11px] px-2.5 py-1 rounded-lg">
                  {ct}
                  <X size={10} className="cursor-pointer hover:text-red-400" onClick={() => toggleContentType(ct)} />
                </span>
              ))}
              {filters.genres.map(g => (
                <span key={g} className="flex items-center gap-1 bg-pink-500/15 border border-pink-500/20 text-pink-300 text-[11px] px-2.5 py-1 rounded-lg">
                  {g}
                  <X size={10} className="cursor-pointer hover:text-red-400" onClick={() => toggleGenre(g)} />
                </span>
              ))}
              {filters.studios.map(s => (
                <span key={s} className="flex items-center gap-1 bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-[11px] px-2.5 py-1 rounded-lg">
                  {s}
                  <X size={10} className="cursor-pointer hover:text-red-400" onClick={() => toggleStudio(s)} />
                </span>
              ))}
              <button onClick={clearAll} className="text-[11px] text-white/30 hover:text-red-400 underline">
                پاک کردن همه
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-[13px] text-white/40">
              <span className="text-white/70 font-semibold">{filteredAnime.length}</span> انیمه پیدا شد
            </p>
          </div>
        </div>
      </div>

      {/* Main Content — فیلتر سمت راست، گرید سمت چپ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Desktop Filter Sidebar — سمت راست */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onToggleContentType={toggleContentType}
              onToggleGenre={toggleGenre}
              onToggleStudio={toggleStudio}
              onToggleAudio={toggleAudio}
              onYearChange={setYearRange}
              onSortChange={setSortBy}
              onClearAll={clearAll}
              activeCount={activeCount}
            />
          </div>

          {/* Anime Grid — سمت چپ */}
          <div className="flex-1 min-w-0">
            {filteredAnime.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredAnime.map((anime, i) => (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/anime/${anime.id}`)}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#2a2a35] group-hover:border-purple-500/40 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-purple-500/10">
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                        <span className="text-yellow-400 text-[10px]">★</span>
                        <span className="text-white/90 text-[11px] font-bold">{anime.rating}</span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                          {anime.type === 'series' ? 'سریال' : 'فیلم'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <h3 className="text-[13px] font-bold text-white leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {anime.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-white/40">{anime.year}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[10px] text-white/40">{anime.episodes} قسمت</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {anime.genres.slice(0, 2).map(g => (
                            <span key={g} className="text-[9px] text-purple-300/70 bg-purple-500/10 px-1.5 py-0.5 rounded">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                  <Search size={32} className="text-white/15" />
                </div>
                <p className="text-white/40 text-[14px] font-medium">انیمه‌ای پیدا نشد</p>
                <p className="text-white/20 text-[12px] mt-1">فیلترها رو تغییر بده</p>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="mt-4 text-[12px] text-purple-400 hover:text-purple-300 underline">
                    پاک کردن همه فیلترها
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[320px] z-50 lg:hidden overflow-y-auto"
            >
              <FilterSidebar
                filters={filters}
                onToggleContentType={toggleContentType}
                onToggleGenre={toggleGenre}
                onToggleStudio={toggleStudio}
                onToggleAudio={toggleAudio}
                onYearChange={setYearRange}
                onSortChange={setSortBy}
                onClearAll={clearAll}
                activeCount={activeCount}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
