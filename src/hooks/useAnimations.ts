// src/hooks/useAnimations.ts
import { useState, useEffect, useMemo } from 'react';
import type { Animation } from '../data/animationData';
import { getAllAnimations } from '../services/animationService';

let _cache: Animation[] | null = null;
const _subscribers = new Set<(a: Animation[]) => void>();
let _loading = false;

async function ensureLoaded() {
  if (_cache || _loading) return;
  _loading = true;
  const data = await getAllAnimations();
  _cache = data;
  _loading = false;
  _subscribers.forEach((fn) => fn(data));
}

export function useAnimations() {
  const [animations, setAnimations] = useState<Animation[]>(_cache || []);
  const [loading, setLoading] = useState<boolean>(!_cache);

  useEffect(() => {
    let active = true;
    if (_cache) { setAnimations(_cache); setLoading(false); return; }
    const onData = (data: Animation[]) => {
      if (!active) return;
      setAnimations(data);
      setLoading(false);
    };
    _subscribers.add(onData);
    ensureLoaded();
    return () => { active = false; _subscribers.delete(onData); };
  }, []);

  const derived = useMemo(() => ({
    animations,
    trending: animations.filter((a) => a.isTrending),
    newest: animations.filter((a) => a.isNew),
    genres: Array.from(new Set(animations.flatMap((a) => a.genres))),
  }), [animations]);

  return { ...derived, loading };
}
