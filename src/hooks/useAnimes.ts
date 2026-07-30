// src/hooks/useAnimes.ts
import { useState, useEffect, useMemo } from 'react';
import type { Anime } from '../features/anime/types/anime';
import { getAllAnimes } from '../services/animeService';

// کش سادهٔ درون‌حافظه‌ای تا هر صفحه دوباره از شبکه نخواند
let _cache: Anime[] | null = null;
const _subscribers = new Set<(a: Anime[]) => void>();
let _loading = false;

async function ensureLoaded() {
  if (_cache || _loading) return;
  _loading = true;
  const data = await getAllAnimes();
  _cache = data;
  _loading = false;
  _subscribers.forEach((fn) => fn(data));
}

/**
 * همان آرایه‌هایی که قبلاً از mockData می‌آمدند، حالا از دیتابیس.
 * استفاده: const { animes, trendingAnimes, popularAnimes, loading } = useAnimes();
 */
export function useAnimes() {
  const [animes, setAnimes] = useState<Anime[]>(_cache || []);
  const [loading, setLoading] = useState<boolean>(!_cache);

  useEffect(() => {
    let active = true;
    if (_cache) {
      setAnimes(_cache);
      setLoading(false);
      return;
    }
    const onData = (data: Anime[]) => {
      if (!active) return;
      setAnimes(data);
      setLoading(false);
    };
    _subscribers.add(onData);
    ensureLoaded();
    return () => {
      active = false;
      _subscribers.delete(onData);
    };
  }, []);

  const derived = useMemo(() => ({
    animes,
    trendingAnimes: animes.filter((a) => a.isTrending),
    popularAnimes: [...animes]
      .sort((a, b) => (((b as { viewCount?: number }).viewCount ?? 0) - ((a as { viewCount?: number }).viewCount ?? 0)) || (b.rating - a.rating))
      .slice(0, 12),
    smartPicks: animes.slice(2, 10),
    seasonalAnimes: animes.filter((a) => a.season),
    recentlyUpdated: animes.filter((a) => a.isNew),
  }), [animes]);

  return { ...derived, loading };
}
