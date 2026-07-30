// src/hooks/useNews.ts
import { useState, useEffect, useMemo } from 'react';
import type { NewsArticle } from '../data/newsData';
import { getAllNews } from '../services/newsService';

let _cache: NewsArticle[] | null = null;
const _subscribers = new Set<(a: NewsArticle[]) => void>();
let _loading = false;

async function ensureLoaded() {
  if (_cache || _loading) return;
  _loading = true;
  const data = await getAllNews();
  _cache = data;
  _loading = false;
  _subscribers.forEach((fn) => fn(data));
}

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>(_cache || []);
  const [loading, setLoading] = useState<boolean>(!_cache);

  useEffect(() => {
    let active = true;
    if (_cache) { setArticles(_cache); setLoading(false); return; }
    const onData = (data: NewsArticle[]) => {
      if (!active) return;
      setArticles(data);
      setLoading(false);
    };
    _subscribers.add(onData);
    ensureLoaded();
    return () => { active = false; _subscribers.delete(onData); };
  }, []);

  const derived = useMemo(() => ({
    articles,
    featured: articles.filter((a) => a.isFeatured),
    hot: articles.filter((a) => a.isHot),
    categories: Array.from(new Set(articles.map((a) => a.category))),
    tags: Array.from(new Set(articles.flatMap((a) => a.tags || []))),
  }), [articles]);

  return { ...derived, loading };
}
