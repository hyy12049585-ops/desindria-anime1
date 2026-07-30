// src/hooks/useAnimationUserData.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

export interface AnimationUserItem {
  id: string | number;
  title: string;
  poster: string;
  year?: number | string;
  duration?: string;
  addedAt?: string;
}

export interface AnimationRatingItem extends AnimationUserItem {
  rating: number; // 1..5
  ratedAt?: string;
}

export interface AnimationDownloadItem extends AnimationUserItem {
  quality?: string;
  downloadedAt?: string;
}

export interface AnimationCharacterItem {
  id: string | number;
  name: string;
  image: string;
  animationTitle?: string;
  animationId?: string | number;
  role?: string;
  followedAt?: string;
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

const LIKED_KEY = "animation-liked-list";
const WATCHLIST_KEY = "animation-watchlist";
const RATINGS_KEY = "animation-ratings";
const DOWNLOADS_KEY = "animation-downloads";
const CHARACTERS_KEY = "animation-followed-characters";

export function useAnimationUserData() {
  const { profile } = useAuth();
  const userId = profile?.id || "";
  const isLoggedIn = !!profile?.isLoggedIn && !!userId;

  const [likedAnimations, setLikedAnimations] = useState<AnimationUserItem[]>(() => loadJSON(LIKED_KEY, []));
  const [animationWatchlist, setAnimationWatchlist] = useState<AnimationUserItem[]>(() => loadJSON(WATCHLIST_KEY, []));
  const [ratedAnimations, setRatedAnimations] = useState<AnimationRatingItem[]>(() => loadJSON(RATINGS_KEY, []));
  const [animationDownloads, setAnimationDownloads] = useState<AnimationDownloadItem[]>(() => loadJSON(DOWNLOADS_KEY, []));
  const [followedAnimationCharacters, setFollowedAnimationCharacters] = useState<AnimationCharacterItem[]>(() => loadJSON(CHARACTERS_KEY, []));

  // ── بارگذاری از Supabase وقتی کاربر لاگین است ──
  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from("animation_items")
        .select("kind, item_id, title, poster, year, duration, rating, quality, created_at")
        .eq("user_id", userId);
      if (!active || error) {
        if (error) console.error("خواندن دادهٔ انیمیشن:", error.message);
        return;
      }
      const rows = data || [];
      const mapBase = (r: any): AnimationUserItem => ({
        id: r.item_id, title: r.title || "", poster: r.poster || "",
        year: r.year || undefined, duration: r.duration || undefined, addedAt: r.created_at,
      });
      setLikedAnimations(rows.filter((r) => r.kind === "liked").map(mapBase));
      setAnimationWatchlist(rows.filter((r) => r.kind === "watchlist").map(mapBase));
      setRatedAnimations(rows.filter((r) => r.kind === "rating").map((r) => ({ ...mapBase(r), rating: r.rating || 0, ratedAt: r.created_at })));
      setAnimationDownloads(rows.filter((r) => r.kind === "download").map((r) => ({ ...mapBase(r), quality: r.quality || undefined, downloadedAt: r.created_at })));
    })();

    (async () => {
      const { data, error } = await supabase
        .from("animation_characters")
        .select("character_id, name, image, animation_title, animation_id, role, created_at")
        .eq("user_id", userId);
      if (!active || error) {
        if (error) console.error("خواندن کاراکترهای انیمیشن:", error.message);
        return;
      }
      setFollowedAnimationCharacters((data || []).map((r) => ({
        id: r.character_id, name: r.name || "", image: r.image || "",
        animationTitle: r.animation_title || "", animationId: r.animation_id || "",
        role: r.role || "", followedAt: r.created_at,
      })));
    })();

    return () => { active = false; };
  }, [isLoggedIn, userId]);

  // ── کمک‌کننده برای نوشتن در animation_items ──
  const upsertItem = (kind: string, item: AnimationUserItem, extra: Record<string, unknown> = {}) =>
    supabase.from("animation_items").upsert(
      {
        user_id: userId, kind, item_id: String(item.id),
        title: item.title, poster: item.poster,
        year: item.year != null ? String(item.year) : null,
        duration: item.duration ?? null,
        ...extra,
      },
      { onConflict: "user_id,kind,item_id" }
    );

  const deleteItem = (kind: string, id: string | number) =>
    supabase.from("animation_items").delete().eq("user_id", userId).eq("kind", kind).eq("item_id", String(id));

  // ── لایک ──
  const toggleAnimationLike = useCallback((item: AnimationUserItem) => {
    const exists = likedAnimations.some((a) => String(a.id) === String(item.id));
    if (isLoggedIn) {
      if (exists) { setLikedAnimations((p) => p.filter((a) => String(a.id) !== String(item.id))); deleteItem("liked", item.id).then(({ error }) => error && console.error(error.message)); }
      else { setLikedAnimations((p) => [...p, { ...item, addedAt: new Date().toISOString() }]); upsertItem("liked", item).then(({ error }) => error && console.error(error.message)); }
      return;
    }
    setLikedAnimations((prev) => {
      const next = exists ? prev.filter((a) => String(a.id) !== String(item.id)) : [...prev, { ...item, addedAt: new Date().toISOString() }];
      saveJSON(LIKED_KEY, next); return next;
    });
  }, [likedAnimations, isLoggedIn, userId]);

  const isAnimationLiked = useCallback(
    (id: string | number) => likedAnimations.some((a) => String(a.id) === String(id)),
    [likedAnimations]
  );

  // ── واچ‌لیست ──
  const toggleAnimationWatchlist = useCallback((item: AnimationUserItem) => {
    const exists = animationWatchlist.some((a) => String(a.id) === String(item.id));
    if (isLoggedIn) {
      if (exists) { setAnimationWatchlist((p) => p.filter((a) => String(a.id) !== String(item.id))); deleteItem("watchlist", item.id).then(({ error }) => error && console.error(error.message)); }
      else { setAnimationWatchlist((p) => [...p, { ...item, addedAt: new Date().toISOString() }]); upsertItem("watchlist", item).then(({ error }) => error && console.error(error.message)); }
      return;
    }
    setAnimationWatchlist((prev) => {
      const next = exists ? prev.filter((a) => String(a.id) !== String(item.id)) : [...prev, { ...item, addedAt: new Date().toISOString() }];
      saveJSON(WATCHLIST_KEY, next); return next;
    });
  }, [animationWatchlist, isLoggedIn, userId]);

  const isAnimationInWatchlist = useCallback(
    (id: string | number) => animationWatchlist.some((a) => String(a.id) === String(id)),
    [animationWatchlist]
  );

  // ── امتیازها ──
  const setAnimationRating = useCallback((item: AnimationUserItem, rating: number) => {
    if (isLoggedIn) {
      setRatedAnimations((prev) => {
        const without = prev.filter((a) => String(a.id) !== String(item.id));
        return rating <= 0 ? without : [...without, { ...item, rating, ratedAt: new Date().toISOString() }];
      });
      if (rating <= 0) deleteItem("rating", item.id).then(({ error }) => error && console.error(error.message));
      else upsertItem("rating", item, { rating }).then(({ error }) => error && console.error(error.message));
      return;
    }
    setRatedAnimations((prev) => {
      const without = prev.filter((a) => String(a.id) !== String(item.id));
      const next = rating <= 0 ? without : [...without, { ...item, rating, ratedAt: new Date().toISOString() }];
      saveJSON(RATINGS_KEY, next); return next;
    });
  }, [isLoggedIn, userId]);

  const getAnimationRating = useCallback(
    (id: string | number) => ratedAnimations.find((a) => String(a.id) === String(id))?.rating ?? 0,
    [ratedAnimations]
  );

  // ── دانلودها ──
  const addAnimationDownload = useCallback((item: AnimationDownloadItem) => {
    const exists = animationDownloads.some((a) => String(a.id) === String(item.id));
    if (isLoggedIn) {
      if (!exists) setAnimationDownloads((p) => [...p, { ...item, downloadedAt: new Date().toISOString() }]);
      upsertItem("download", item, { quality: item.quality ?? null }).then(({ error }) => error && console.error(error.message));
      return;
    }
    setAnimationDownloads((prev) => {
      if (exists) return prev;
      const next = [...prev, { ...item, downloadedAt: new Date().toISOString() }];
      saveJSON(DOWNLOADS_KEY, next); return next;
    });
  }, [animationDownloads, isLoggedIn, userId]);

  const removeAnimationDownload = useCallback((id: string | number) => {
    if (isLoggedIn) {
      setAnimationDownloads((p) => p.filter((a) => String(a.id) !== String(id)));
      deleteItem("download", id).then(({ error }) => error && console.error(error.message));
      return;
    }
    setAnimationDownloads((prev) => {
      const next = prev.filter((a) => String(a.id) !== String(id));
      saveJSON(DOWNLOADS_KEY, next); return next;
    });
  }, [isLoggedIn, userId]);

  // ── کاراکترهای فالوشده ──
  const isAnimationCharacterFollowed = useCallback(
    (id: string | number) => followedAnimationCharacters.some((c) => String(c.id) === String(id)),
    [followedAnimationCharacters]
  );

  const toggleAnimationCharacter = useCallback((char: AnimationCharacterItem) => {
    const exists = followedAnimationCharacters.some((c) => String(c.id) === String(char.id));
    if (isLoggedIn) {
      if (exists) {
        setFollowedAnimationCharacters((p) => p.filter((c) => String(c.id) !== String(char.id)));
        supabase.from("animation_characters").delete().eq("user_id", userId).eq("character_id", String(char.id)).then(({ error }) => error && console.error(error.message));
      } else {
        setFollowedAnimationCharacters((p) => [...p, { ...char, followedAt: new Date().toISOString() }]);
        supabase.from("animation_characters").insert({
          user_id: userId, character_id: String(char.id), name: char.name, image: char.image,
          animation_title: char.animationTitle ?? null, animation_id: char.animationId != null ? String(char.animationId) : null, role: char.role ?? null,
        }).then(({ error }) => error && console.error(error.message));
      }
      return;
    }
    setFollowedAnimationCharacters((prev) => {
      const next = exists ? prev.filter((c) => String(c.id) !== String(char.id)) : [...prev, { ...char, followedAt: new Date().toISOString() }];
      saveJSON(CHARACTERS_KEY, next); return next;
    });
  }, [followedAnimationCharacters, isLoggedIn, userId]);

  return {
    likedAnimations,
    animationWatchlist,
    ratedAnimations,
    animationDownloads,
    followedAnimationCharacters,
    toggleAnimationLike,
    isAnimationLiked,
    toggleAnimationWatchlist,
    isAnimationInWatchlist,
    setAnimationRating,
    getAnimationRating,
    addAnimationDownload,
    removeAnimationDownload,
    isAnimationCharacterFollowed,
    toggleAnimationCharacter,
  };
}
