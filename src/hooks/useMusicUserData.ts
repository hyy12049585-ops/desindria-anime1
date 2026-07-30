// src/hooks/useMusicUserData.ts
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabaseClient";

export interface MusicUserItem {
  id: string | number;
  title: string;
  cover: string;
  artist?: string;
  addedAt?: string;
}

export interface MusicRatingItem extends MusicUserItem {
  rating: number; // 1..5
  ratedAt?: string;
}

export interface MusicDownloadItem extends MusicUserItem {
  quality?: string;
  downloadedAt?: string;
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

const LIKED_KEY = "music-liked-list";
const PLAYLIST_KEY = "music-mylist";
const RATINGS_KEY = "music-ratings";
const DOWNLOADS_KEY = "music-downloads";

export function useMusicUserData() {
  const { profile } = useAuth();
  const userId = profile?.id || "";
  const isLoggedIn = !!profile?.isLoggedIn && !!userId;

  const [likedMusic, setLikedMusic] = useState<MusicUserItem[]>(() => loadJSON(LIKED_KEY, []));
  const [myMusicList, setMyMusicList] = useState<MusicUserItem[]>(() => loadJSON(PLAYLIST_KEY, []));
  const [ratedMusic, setRatedMusic] = useState<MusicRatingItem[]>(() => loadJSON(RATINGS_KEY, []));
  const [musicDownloads, setMusicDownloads] = useState<MusicDownloadItem[]>(() => loadJSON(DOWNLOADS_KEY, []));

  // ── بارگذاری از Supabase وقتی لاگین است ──
  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("music_items")
        .select("kind, item_id, title, cover, artist, rating, quality, created_at")
        .eq("user_id", userId);
      if (!active || error) {
        if (error) console.error("خواندن دادهٔ موزیک:", error.message);
        return;
      }
      const rows = data || [];
      const mapBase = (r: any): MusicUserItem => ({
        id: r.item_id, title: r.title || "", cover: r.cover || "", artist: r.artist || undefined, addedAt: r.created_at,
      });
      setLikedMusic(rows.filter((r) => r.kind === "liked").map(mapBase));
      setMyMusicList(rows.filter((r) => r.kind === "playlist").map(mapBase));
      setRatedMusic(rows.filter((r) => r.kind === "rating").map((r) => ({ ...mapBase(r), rating: r.rating || 0, ratedAt: r.created_at })));
      setMusicDownloads(rows.filter((r) => r.kind === "download").map((r) => ({ ...mapBase(r), quality: r.quality || undefined, downloadedAt: r.created_at })));
    })();
    return () => { active = false; };
  }, [isLoggedIn, userId]);

  const upsertItem = (kind: string, item: MusicUserItem, extra: Record<string, unknown> = {}) =>
    supabase.from("music_items").upsert(
      { user_id: userId, kind, item_id: String(item.id), title: item.title, cover: item.cover, artist: item.artist ?? null, ...extra },
      { onConflict: "user_id,kind,item_id" }
    );

  const deleteItem = (kind: string, id: string | number) =>
    supabase.from("music_items").delete().eq("user_id", userId).eq("kind", kind).eq("item_id", String(id));

  // ── لایک ──
  const toggleMusicLike = useCallback((item: MusicUserItem) => {
    const exists = likedMusic.some((a) => String(a.id) === String(item.id));
    if (isLoggedIn) {
      if (exists) { setLikedMusic((p) => p.filter((a) => String(a.id) !== String(item.id))); deleteItem("liked", item.id).then(({ error }) => error && console.error(error.message)); }
      else { setLikedMusic((p) => [...p, { ...item, addedAt: new Date().toISOString() }]); upsertItem("liked", item).then(({ error }) => error && console.error(error.message)); }
      return;
    }
    setLikedMusic((prev) => {
      const next = exists ? prev.filter((a) => String(a.id) !== String(item.id)) : [...prev, { ...item, addedAt: new Date().toISOString() }];
      saveJSON(LIKED_KEY, next); return next;
    });
  }, [likedMusic, isLoggedIn, userId]);

  const isMusicLiked = useCallback(
    (id: string | number) => likedMusic.some((a) => String(a.id) === String(id)),
    [likedMusic]
  );

  // ── لیست من ──
  const toggleMyMusic = useCallback((item: MusicUserItem) => {
    const exists = myMusicList.some((a) => String(a.id) === String(item.id));
    if (isLoggedIn) {
      if (exists) { setMyMusicList((p) => p.filter((a) => String(a.id) !== String(item.id))); deleteItem("playlist", item.id).then(({ error }) => error && console.error(error.message)); }
      else { setMyMusicList((p) => [...p, { ...item, addedAt: new Date().toISOString() }]); upsertItem("playlist", item).then(({ error }) => error && console.error(error.message)); }
      return;
    }
    setMyMusicList((prev) => {
      const next = exists ? prev.filter((a) => String(a.id) !== String(item.id)) : [...prev, { ...item, addedAt: new Date().toISOString() }];
      saveJSON(PLAYLIST_KEY, next); return next;
    });
  }, [myMusicList, isLoggedIn, userId]);

  const isInMyMusic = useCallback(
    (id: string | number) => myMusicList.some((a) => String(a.id) === String(id)),
    [myMusicList]
  );

  // ── امتیازها ──
  const setMusicRating = useCallback((item: MusicUserItem, rating: number) => {
    if (isLoggedIn) {
      setRatedMusic((prev) => {
        const without = prev.filter((a) => String(a.id) !== String(item.id));
        return rating <= 0 ? without : [...without, { ...item, rating, ratedAt: new Date().toISOString() }];
      });
      if (rating <= 0) deleteItem("rating", item.id).then(({ error }) => error && console.error(error.message));
      else upsertItem("rating", item, { rating }).then(({ error }) => error && console.error(error.message));
      return;
    }
    setRatedMusic((prev) => {
      const without = prev.filter((a) => String(a.id) !== String(item.id));
      const next = rating <= 0 ? without : [...without, { ...item, rating, ratedAt: new Date().toISOString() }];
      saveJSON(RATINGS_KEY, next); return next;
    });
  }, [isLoggedIn, userId]);

  const getMusicRating = useCallback(
    (id: string | number) => ratedMusic.find((a) => String(a.id) === String(id))?.rating ?? 0,
    [ratedMusic]
  );

  // ── دانلودها ──
  const addMusicDownload = useCallback((item: MusicDownloadItem) => {
    const exists = musicDownloads.some((a) => String(a.id) === String(item.id));
    if (isLoggedIn) {
      if (!exists) setMusicDownloads((p) => [...p, { ...item, downloadedAt: new Date().toISOString() }]);
      upsertItem("download", item, { quality: item.quality ?? null }).then(({ error }) => error && console.error(error.message));
      return;
    }
    setMusicDownloads((prev) => {
      if (exists) return prev;
      const next = [...prev, { ...item, downloadedAt: new Date().toISOString() }];
      saveJSON(DOWNLOADS_KEY, next); return next;
    });
  }, [musicDownloads, isLoggedIn, userId]);

  const removeMusicDownload = useCallback((id: string | number) => {
    if (isLoggedIn) {
      setMusicDownloads((p) => p.filter((a) => String(a.id) !== String(id)));
      deleteItem("download", id).then(({ error }) => error && console.error(error.message));
      return;
    }
    setMusicDownloads((prev) => {
      const next = prev.filter((a) => String(a.id) !== String(id));
      saveJSON(DOWNLOADS_KEY, next); return next;
    });
  }, [isLoggedIn, userId]);

  return {
    likedMusic,
    myMusicList,
    ratedMusic,
    musicDownloads,
    toggleMusicLike,
    isMusicLiked,
    toggleMyMusic,
    isInMyMusic,
    setMusicRating,
    getMusicRating,
    addMusicDownload,
    removeMusicDownload,
  };
}
