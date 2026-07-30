// src/features/home/components/HeroBanner.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Check, Plus, Star, Subtitles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Anime } from 'src/features/anime/types/anime';
import { useUserData } from '../../../contexts/UserDataContext';

interface HeroBannerProps {
  animeList: Anime[];
}

const AUTOPLAY_MS = 7000;

export const HeroBanner = ({ animeList }: HeroBannerProps) => {
  const featured = animeList.filter((a) => a.isTrending).slice(0, 6);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { toggleWatchlist, isInWatchlist } = useUserData();

  const count = featured.length;
  const goTo = useCallback((i: number) => count && setCurrent(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [count, current]);

  if (count === 0) return null;
  const anime = featured[current];
  const inList = isInWatchlist(anime.id);

  const episodesCount =
    typeof anime.episodes === 'number' ? anime.episodes
    : Array.isArray(anime.episodes) ? anime.episodes.length : null;

  const openAnime = () => navigate(`/anime/${anime.id}`);
  const addToList = () =>
    toggleWatchlist({ id: anime.id, title: anime.title, poster: anime.poster, type: 'anime' });

  return (
    <section className="hero-banner relative w-full px-4 md:px-8 pt-4" dir="rtl" aria-roledescription="carousel">
      <div className="relative w-full h-[80vh] min-h-[520px] max-h-[820px] overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl shadow-black/50">
        {/* تصویر */}
        <AnimatePresence mode="sync">
          <motion.img
            key={anime.id}
            src={anime.banner || anime.poster}
            alt={anime.title}
            className="absolute inset-0 w-full h-full object-cover select-none"
            style={{ objectPosition: 'center 20%' }}
            draggable={false}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1 }, scale: { duration: AUTOPLAY_MS / 1000 + 1, ease: 'linear' } }}
          />
        </AnimatePresence>

        {/* گرادیان‌ها */}
        <div className="hero-scrim pointer-events-none absolute inset-0 bg-gradient-to-l from-black/95 via-black/45 to-transparent" />
        <div className="hero-scrim pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
        {/* هالهٔ accent گوشه */}
        <div className="hero-scrim pointer-events-none absolute -bottom-32 -right-24 w-[460px] h-[460px] rounded-full blur-[120px] opacity-30"
          style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }} />

        {/* محتوا (راست‌چین) */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-8 md:px-16">
            <AnimatePresence mode="wait">
              <motion.div key={anime.id} className="max-w-xl text-right"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>

                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="text-5xl md:text-7xl font-black text-white mb-3 leading-[1.08] drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
                  {anime.title}
                </motion.h1>

                {/* خط accent ظریف زیر عنوان */}
                <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                  className="h-1 w-24 rounded-full mb-5 origin-right"
                  style={{ background: 'linear-gradient(to left, var(--accent), transparent)' }} />

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                  className="flex items-center gap-4 md:gap-5 mb-6 flex-wrap text-white/85">
                  {anime.genres?.[0] && (
                    <span className="px-3 py-1 rounded-md text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' }}>{anime.genres[0]}</span>
                  )}
                  {anime.rating != null && (
                    <span className="flex items-center gap-1.5 text-sm font-bold"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{anime.rating}</span>
                  )}
                  {anime.year && <span className="text-sm font-medium">{anime.year}</span>}
                  {episodesCount != null && <span className="text-sm font-medium">{episodesCount} قسمت</span>}
                  {anime.status && (
                    <span className="flex items-center gap-1.5 text-sm font-medium"><Clock className="w-4 h-4 text-white/50" />{anime.status === 'ongoing' ? 'در حال پخش' : 'تکمیل شده'}</span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm font-medium text-white/70"><Subtitles className="w-4 h-4" />زیرنویس</span>
                </motion.div>

                {anime.synopsis && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
                    className="text-white/65 text-sm md:text-[15px] leading-relaxed mb-8 line-clamp-2 max-w-lg">
                    {anime.synopsis}
                  </motion.p>
                )}

                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}
                  className="flex items-center gap-3">
                  <motion.button onClick={openAnime} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2.5 px-9 py-3.5 text-white font-bold rounded-xl text-lg"
                    style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', boxShadow: '0 12px 34px var(--accent-glow)' }}>
                    <Play className="w-5 h-5 fill-white" />پخش
                  </motion.button>
                  <motion.button onClick={addToList} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
                    {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {inList ? 'در لیست' : 'افزودن به لیست'}
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* فلش‌ها + شمارنده (پایین-راست) */}
        {count > 1 && (
          <div className="absolute bottom-6 right-8 md:right-16 flex items-center gap-2.5 z-10">
            <span className="me-2 text-sm font-bold text-white/60 tabular-nums">
              {String(current + 1).padStart(2, '0')}<span className="text-white/30"> / {String(count).padStart(2, '0')}</span>
            </span>
            <button onClick={() => goTo(current - 1)} aria-label="قبلی" className="w-11 h-11 grid place-items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-110"><ChevronRight className="w-5 h-5 text-white" /></button>
            <button onClick={() => goTo(current + 1)} aria-label="بعدی" className="w-11 h-11 grid place-items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-110"><ChevronLeft className="w-5 h-5 text-white" /></button>
          </div>
        )}

        {/* نقطه‌ها (پایین-وسط) */}
        {count > 1 && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {featured.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`اسلاید ${i + 1}`}
                className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? '2.5rem' : '0.5rem', background: 'rgba(255,255,255,0.25)' }}>
                {i === current && (
                  <motion.span key={`f-${current}`} className="absolute inset-y-0 right-0" style={{ background: 'var(--accent)' }}
                    initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
