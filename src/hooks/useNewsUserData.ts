// src/hooks/useNewsUserData.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

interface NewsUserItem {
  id: string;
  title: string;
  image: string;
  category: string;
  date: string;
  summary: string;
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const LIKED_KEY = "news-liked-list";
const BOOKMARKED_KEY = "news-bookmarked-list";

export function useNewsUserData() {
  const { profile } = useAuth();
  const userId = profile?.id || "";
  const isLoggedIn = !!profile?.isLoggedIn && !!userId;

  const [likedNews, setLikedNews] = useState<NewsUserItem[]>(() => loadJSON(LIKED_KEY, []));
  const [bookmarkedNews, setBookmarkedNews] = useState<NewsUserItem[]>(() => loadJSON(BOOKMARKED_KEY, []));

  // ── بارگذاری از Supabase وقتی لاگین است ──
  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("news_items")
        .select("kind, item_id, title, image, category, date, summary")
        .eq("user_id", userId);
      if (!active || error) {
        if (error) console.error("خواندن دادهٔ خبر:", error.message);
        return;
      }
      const rows = data || [];
      const mapRow = (r: any): NewsUserItem => ({
        id: r.item_id, title: r.title || "", image: r.image || "",
        category: r.category || "", date: r.date || "", summary: r.summary || "",
      });
      setLikedNews(rows.filter((r) => r.kind === "liked").map(mapRow));
      setBookmarkedNews(rows.filter((r) => r.kind === "bookmarked").map(mapRow));
    })();
    return () => { active = false; };
  }, [isLoggedIn, userId]);

  const insertItem = (kind: string, a: NewsUserItem) =>
    supabase.from("news_items").insert({
      user_id: userId, kind, item_id: String(a.id),
      title: a.title, image: a.image, category: a.category, date: a.date, summary: a.summary,
    });

  const deleteItem = (kind: string, id: string) =>
    supabase.from("news_items").delete().eq("user_id", userId).eq("kind", kind).eq("item_id", String(id));

  const toggleNewsLike = useCallback((article: NewsUserItem) => {
    const exists = likedNews.some((a) => a.id === article.id);
    if (isLoggedIn) {
      if (exists) { setLikedNews((p) => p.filter((a) => a.id !== article.id)); deleteItem("liked", article.id).then(({ error }) => error && console.error(error.message)); }
      else { setLikedNews((p) => [...p, article]); insertItem("liked", article).then(({ error }) => error && console.error(error.message)); }
      return;
    }
    setLikedNews((prev) => {
      const next = exists ? prev.filter((a) => a.id !== article.id) : [...prev, article];
      saveJSON(LIKED_KEY, next); return next;
    });
  }, [likedNews, isLoggedIn, userId]);

  const toggleNewsBookmark = useCallback((article: NewsUserItem) => {
    const exists = bookmarkedNews.some((a) => a.id === article.id);
    if (isLoggedIn) {
      if (exists) { setBookmarkedNews((p) => p.filter((a) => a.id !== article.id)); deleteItem("bookmarked", article.id).then(({ error }) => error && console.error(error.message)); }
      else { setBookmarkedNews((p) => [...p, article]); insertItem("bookmarked", article).then(({ error }) => error && console.error(error.message)); }
      return;
    }
    setBookmarkedNews((prev) => {
      const next = exists ? prev.filter((a) => a.id !== article.id) : [...prev, article];
      saveJSON(BOOKMARKED_KEY, next); return next;
    });
  }, [bookmarkedNews, isLoggedIn, userId]);

  const isNewsLiked = useCallback((id: string) => likedNews.some((a) => a.id === id), [likedNews]);
  const isNewsBookmarked = useCallback((id: string) => bookmarkedNews.some((a) => a.id === id), [bookmarkedNews]);

  return {
    likedNews,
    bookmarkedNews,
    toggleNewsLike,
    toggleNewsBookmark,
    isNewsLiked,
    isNewsBookmarked,
  };
}

export type { NewsUserItem };
