// src/hooks/useMusic.ts
import { useState, useEffect, useMemo } from 'react';
import type { MusicItem } from '../features/music/user/data/musicData';
import { getAllMusic } from '../services/musicService';

let _cache: MusicItem[] | null = null;
const _subscribers = new Set<(a: MusicItem[]) => void>();
let _loading = false;

async function ensureLoaded() {
  if (_cache || _loading) return;
  _loading = true;
  const data = await getAllMusic();
  _cache = data;
  _loading = false;
  _subscribers.forEach((fn) => fn(data));
}

export function useMusic() {
  const [tracks, setTracks] = useState<MusicItem[]>(_cache || []);
  const [loading, setLoading] = useState<boolean>(!_cache);

  useEffect(() => {
    let active = true;
    if (_cache) { setTracks(_cache); setLoading(false); return; }
    const onData = (data: MusicItem[]) => {
      if (!active) return;
      setTracks(data);
      setLoading(false);
    };
    _subscribers.add(onData);
    ensureLoaded();
    return () => { active = false; _subscribers.delete(onData); };
  }, []);

  const derived = useMemo(() => ({
    tracks,
    featured: tracks.filter((t) => t.isFeatured),
    hot: tracks.filter((t) => t.isHot).sort((a, b) => b.views - a.views),
    genres: Array.from(new Set(tracks.map((t) => t.genre))),
    types: Array.from(new Set(tracks.map((t) => t.type))),
    tags: Array.from(new Set(tracks.flatMap((t) => t.tags || []))),
  }), [tracks]);

  return { ...derived, loading };
}
