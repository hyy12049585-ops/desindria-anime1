import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabaseClient';

// =============================================
// Types
// =============================================

export interface FavoriteItem {
  id: string | number;
  title: string;
  poster: string;
  type: string;
  addedAt: string;
}

export interface WatchlistItem {
  id: string | number;
  title: string;
  poster: string;
  type: string;
  addedAt: string;
}

export interface ContinueItem {
  id: string | number;
  title: string;
  poster: string;
  episode: number;
  progress: number;
  updatedAt: string;
}

export interface RatingItem {
  id: string | number;
  title: string;
  poster: string;
  rating: number;
  ratedAt: string;
}

export interface DownloadItem {
  id: string | number;
  title: string;
  poster: string;
  episode?: number;
  quality?: string;
  downloadedAt: string;
}

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface FollowedCharacter {
  id: string | number;
  name: string;
  image: string;
  animeName: string;
  animeId: string | number;
  followedAt: string;
}

export interface UserStats {
  totalWatched: number;
  totalHours: number;
  totalDownloads: number;
  totalFavorites: number;
  totalFollowedCharacters: number;
  level: number;           // ← اضافه کن
  achievements: number;    // ← اضافه کن
}


interface StoredData {
  watchlist: WatchlistItem[];
  continueWatching: ContinueItem[];
  favorites: FavoriteItem[];
  ratings: RatingItem[];
  downloads: DownloadItem[];
  notifications: NotificationItem[];
  followedCharacters: FollowedCharacter[];
  stats: UserStats;
}

interface UserDataContextType {
  watchlist: WatchlistItem[];
  continueWatching: ContinueItem[];
  favorites: FavoriteItem[];
  ratings: RatingItem[];
  downloads: DownloadItem[];
  notifications: NotificationItem[];
  followedCharacters: FollowedCharacter[];
  stats: UserStats;
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  isInFavorites: (id: string | number) => boolean;
  toggleWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  isInWatchlist: (id: string | number) => boolean;
  updateContinueWatching: (item: Omit<ContinueItem, 'updatedAt'>) => void;
  removeContinueWatching: (id: string | number) => void;
  setRating: (item: Omit<RatingItem, 'ratedAt'>) => void;
  getRating: (id: string | number) => number;
  addDownload: (item: Omit<DownloadItem, 'downloadedAt'>) => void;
  removeDownload: (id: string | number) => void;
  addNotification: (item: Omit<NotificationItem, 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string | number) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  followCharacter: (char: Omit<FollowedCharacter, 'followedAt'>) => void;
  unfollowCharacter: (id: string | number) => void;
  isCharacterFollowed: (id: string | number) => boolean;
  toggleFollowCharacter: (char: Omit<FollowedCharacter, 'followedAt'>) => void;
}

// =============================================
// Constants
// =============================================

const STORAGE_KEY = 'desindria_userdata';

const defaultData: StoredData = {
  watchlist: [],
  continueWatching: [],
  favorites: [],
  ratings: [],
  downloads: [],
  notifications: [],
  followedCharacters: [],
  stats: {
    totalWatched: 0,
    totalHours: 0,
    totalDownloads: 0,
    totalFavorites: 0,
    totalFollowedCharacters: 0,
    level: 1,           // ← اضافه کن
    achievements: 0     // ← اضافه کن
  },
};


// =============================================
// Helpers
// =============================================

function loadData(username: string): StoredData {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${username}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultData, ...parsed, stats: { ...defaultData.stats, ...parsed.stats } };
    }
  } catch {}
  return { ...defaultData };
}

function saveData(username: string, data: StoredData) {
  localStorage.setItem(`${STORAGE_KEY}_${username}`, JSON.stringify(data));
}

// =============================================
// Context
// =============================================

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// =============================================
// Provider
// =============================================

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const username = profile?.username || profile?.displayName || "__guest__";
  const userId = profile?.id || '';
  const isLoggedIn = !!profile?.isLoggedIn && !!userId;

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [followedCharacters, setFollowedCharacters] = useState<FollowedCharacter[]>([]);
  const [stats, setStats] = useState<UserStats>(defaultData.stats);

  useEffect(() => {
    const data = loadData(username);
    setWatchlist(data.watchlist);
    setContinueWatching(data.continueWatching);
    setFavorites(data.favorites);
    setRatings(data.ratings);
    setDownloads(data.downloads);
    setNotifications(data.notifications);
    setFollowedCharacters(data.followedCharacters);
    setStats(data.stats);
  }, [username]);

  // وقتی کاربر لاگین است، واچ‌لیست را از Supabase بخوان (روی هر دستگاهی یکسان)
  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('anime_id, title, poster, type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('خطا در خواندن واچ‌لیست از Supabase:', error.message);
        return;
      }
      setWatchlist(
        (data || []).map((r) => ({
          id: r.anime_id as string,
          title: (r.title as string) || '',
          poster: (r.poster as string) || '',
          type: (r.type as string) || 'anime',
          addedAt: (r.created_at as string) || new Date().toISOString(),
        }))
      );
    })();

    // علاقه‌مندی‌ها از Supabase
    (async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('anime_id, title, poster, type, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('خطا در خواندن علاقه‌مندی‌ها از Supabase:', error.message);
        return;
      }
      setFavorites(
        (data || []).map((r) => ({
          id: r.anime_id as string,
          title: (r.title as string) || '',
          poster: (r.poster as string) || '',
          type: (r.type as string) || 'anime',
          addedAt: (r.created_at as string) || new Date().toISOString(),
        }))
      );
    })();
    (async () => {

  const { data, error } = await supabase
    .from('continue_watching')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (!active) return;

  if (error) {
    console.error(error);
    return;
  }

  setContinueWatching(
    (data || []).map(r => ({
      id: r.anime_id,
      title: r.title,
      poster: r.poster,
      episode: r.episode,
      progress: r.progress,
      updatedAt: r.updated_at,
    }))
  );

})();

    // امتیازها از Supabase
    (async () => {
      const { data, error } = await supabase
        .from('ratings')
        .select('anime_id, title, poster, rating, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('خطا در خواندن امتیازها از Supabase:', error.message);
        return;
      }
      setRatings(
        (data || []).map((r) => ({
          id: r.anime_id as string,
          title: (r.title as string) || '',
          poster: (r.poster as string) || '',
          rating: (r.rating as number) || 0,
          ratedAt: (r.created_at as string) || new Date().toISOString(),
        }))
      );
    })();

    // دانلودها از Supabase
    (async () => {
      const { data, error } = await supabase
        .from('downloads')
        .select('anime_id, title, poster, episode, quality, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('خطا در خواندن دانلودها از Supabase:', error.message);
        return;
      }
      setDownloads(
        (data || []).map((r) => ({
          id: r.anime_id as string,
          title: (r.title as string) || '',
          poster: (r.poster as string) || '',
          episode: (r.episode as number) ?? undefined,
          quality: (r.quality as string) ?? undefined,
          downloadedAt: (r.created_at as string) || new Date().toISOString(),
        }))
      );
    })();

    // کاراکترهای فالوشده از Supabase
    (async () => {
      const { data, error } = await supabase
        .from('followed_characters')
        .select('character_id, name, image, anime_name, anime_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('خطا در خواندن کاراکترها از Supabase:', error.message);
        return;
      }
      setFollowedCharacters(
        (data || []).map((r) => ({
          id: r.character_id as string,
          name: (r.name as string) || '',
          image: (r.image as string) || '',
          animeName: (r.anime_name as string) || '',
          animeId: (r.anime_id as string) || '',
          followedAt: (r.created_at as string) || new Date().toISOString(),
        }))
      );
    })();

    // اعلان‌ها از Supabase
    (async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, message, type, read, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) {
        console.error('خطا در خواندن اعلان‌ها از Supabase:', error.message);
        return;
      }
      setNotifications(
        (data || []).map((r) => ({
          id: r.id as string,
          title: (r.title as string) || '',
          message: (r.message as string) || '',
          type: ((r.type as string) || 'info') as NotificationItem['type'],
          read: !!r.read,
          createdAt: (r.created_at as string) || new Date().toISOString(),
        }))
      );
    })();

    return () => {
      active = false;
    };
  }, [isLoggedIn, userId]);

  const persist = useCallback((partial: Partial<StoredData>) => {
    const current = loadData(username);
    const updated = { ...current, ...partial };
    updated.stats = {
      ...updated.stats,
      totalFavorites: updated.favorites.length,
      totalDownloads: updated.downloads.length,
      totalFollowedCharacters: updated.followedCharacters.length,
    };
    saveData(username, updated);
    setStats(updated.stats);
  }, [username]);

  // Favorites
  const isInFavorites = useCallback((id: string | number): boolean => {
    return favorites.some(f => String(f.id) === String(id));
  }, [favorites]);

  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'addedAt'>) => {
    const exists = favorites.some(f => String(f.id) === String(item.id));

    // کاربر لاگین: ذخیره/حذف در Supabase
    if (isLoggedIn) {
      if (exists) {
        setFavorites(prev => prev.filter(f => String(f.id) !== String(item.id)));
        supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('anime_id', String(item.id))
          .then(({ error }) => { if (error) console.error('حذف علاقه‌مندی:', error.message); });
      } else {
        const newItem: FavoriteItem = { ...item, addedAt: new Date().toISOString() };
        setFavorites(prev => [newItem, ...prev]);
        supabase
          .from('favorites')
          .insert({
            user_id: userId,
            anime_id: String(item.id),
            title: item.title,
            poster: item.poster,
            type: item.type,
          })
          .then(({ error }) => { if (error) console.error('افزودن علاقه‌مندی:', error.message); });
      }
      return;
    }

    // مهمان: مثل قبل با localStorage
    let next: FavoriteItem[];
    if (exists) {
      next = favorites.filter(f => String(f.id) !== String(item.id));
    } else {
      next = [...favorites, { ...item, addedAt: new Date().toISOString() }];
    }
    setFavorites(next);
    persist({ favorites: next });
  }, [favorites, isLoggedIn, userId, persist]);

  // Watchlist
  const isInWatchlist = useCallback((id: string | number): boolean => {
    return watchlist.some(w => String(w.id) === String(id));
  }, [watchlist]);

  const toggleWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    const exists = watchlist.some(w => String(w.id) === String(item.id));

    // کاربر لاگین: ذخیره/حذف در Supabase
    if (isLoggedIn) {
      if (exists) {
        setWatchlist(prev => prev.filter(w => String(w.id) !== String(item.id)));
        supabase
          .from('watchlist')
          .delete()
          .eq('user_id', userId)
          .eq('anime_id', String(item.id))
          .then(({ error }) => { if (error) console.error('حذف واچ‌لیست:', error.message); });
      } else {
        const newItem: WatchlistItem = { ...item, addedAt: new Date().toISOString() };
        setWatchlist(prev => [newItem, ...prev]);
        supabase
          .from('watchlist')
          .insert({
            user_id: userId,
            anime_id: String(item.id),
            title: item.title,
            poster: item.poster,
            type: item.type,
          })
          .then(({ error }) => { if (error) console.error('افزودن واچ‌لیست:', error.message); });
      }
      return;
    }

    // مهمان: مثل قبل با localStorage
    let next: WatchlistItem[];
    if (exists) {
      next = watchlist.filter(w => String(w.id) !== String(item.id));
    } else {
      next = [...watchlist, { ...item, addedAt: new Date().toISOString() }];
    }
    setWatchlist(next);
    persist({ watchlist: next });
  }, [watchlist, isLoggedIn, userId, persist]);

const updateContinueWatching = useCallback(async (item: Omit<ContinueItem, 'updatedAt'>) => {
  if (isLoggedIn) {
    const updatedAt = new Date().toISOString();

    setContinueWatching(prev => {
      const filtered = prev.filter(c => String(c.id) !== String(item.id));
      return [{ ...item, updatedAt }, ...filtered];
    });

    const { error } = await supabase
  .from('continue_watching')
  .upsert(
    {
      user_id: userId,
      anime_id: String(item.id),
      title: item.title,
      poster: item.poster,
      episode: item.episode,
      progress: item.progress,
      updated_at: updatedAt,
    },
    {
      onConflict: 'user_id,anime_id'
    }
  );

if (error) console.error(error);

    return;
  }

  setContinueWatching(prev => {
    const filtered = prev.filter(c => String(c.id) !== String(item.id));
    const next = [{ ...item, updatedAt: new Date().toISOString() }, ...filtered];
    persist({ continueWatching: next });
    return next;
  });
}, [isLoggedIn, userId, persist]);
const removeContinueWatching = useCallback(async (id: string | number) => {

  if (isLoggedIn) {

    setContinueWatching(prev =>
      prev.filter(c => String(c.id) !== String(id))
    );

    const { error } = await supabase
      .from('continue_watching')
      .delete()
      .eq('user_id', userId)
      .eq('anime_id', String(id));

    if (error) console.error(error);

    return;
  }

  setContinueWatching(prev => {
    const next = prev.filter(c => String(c.id) !== String(id));
    persist({ continueWatching: next });
    return next;
  });

}, [isLoggedIn, userId, persist]);
  // Ratings
  const setRating = useCallback((item: Omit<RatingItem, 'ratedAt'>) => {
    if (isLoggedIn) {
      setRatings(prev => {
        const filtered = prev.filter(r => String(r.id) !== String(item.id));
        return [{ ...item, ratedAt: new Date().toISOString() }, ...filtered];
      });
      supabase
        .from('ratings')
        .upsert(
          {
            user_id: userId,
            anime_id: String(item.id),
            title: item.title,
            poster: item.poster,
            rating: item.rating,
          },
          { onConflict: 'user_id,anime_id' }
        )
        .then(({ error }) => { if (error) console.error('ثبت امتیاز:', error.message); });
      return;
    }

    // مهمان: localStorage
    setRatings(prev => {
      const filtered = prev.filter(r => String(r.id) !== String(item.id));
      const next = [...filtered, { ...item, ratedAt: new Date().toISOString() }];
      persist({ ratings: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  const getRating = useCallback((id: string | number): number => {
    return ratings.find(r => String(r.id) === String(id))?.rating || 0;
  }, [ratings]);

  // Downloads
  const addDownload = useCallback((item: Omit<DownloadItem, 'downloadedAt'>) => {
    if (isLoggedIn) {
      const newItem: DownloadItem = { ...item, downloadedAt: new Date().toISOString() };
      setDownloads(prev => [newItem, ...prev.filter(d => String(d.id) !== String(item.id))]);
      supabase
        .from('downloads')
        .upsert(
          {
            user_id: userId,
            anime_id: String(item.id),
            title: item.title,
            poster: item.poster,
            episode: item.episode ?? null,
            quality: item.quality ?? null,
          },
          { onConflict: 'user_id,anime_id' }
        )
        .then(({ error }) => { if (error) console.error('افزودن دانلود:', error.message); });
      return;
    }

    setDownloads(prev => {
      const next = [...prev, { ...item, downloadedAt: new Date().toISOString() }];
      persist({ downloads: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  const removeDownload = useCallback((id: string | number) => {
    if (isLoggedIn) {
      setDownloads(prev => prev.filter(d => String(d.id) !== String(id)));
      supabase
        .from('downloads')
        .delete()
        .eq('user_id', userId)
        .eq('anime_id', String(id))
        .then(({ error }) => { if (error) console.error('حذف دانلود:', error.message); });
      return;
    }

    setDownloads(prev => {
      const next = prev.filter(d => String(d.id) !== String(id));
      persist({ downloads: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  // Notifications
  const addNotification = useCallback((item: Omit<NotificationItem, 'createdAt' | 'read'>) => {
    if (isLoggedIn) {
      supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: item.title,
          message: item.message,
          type: item.type,
          read: false,
        })
        .select('id, title, message, type, read, created_at')
        .single()
        .then(({ data, error }) => {
          if (error || !data) { console.error('افزودن اعلان:', error?.message); return; }
          setNotifications(prev => [{
            id: data.id as string,
            title: (data.title as string) || '',
            message: (data.message as string) || '',
            type: ((data.type as string) || 'info') as NotificationItem['type'],
            read: !!data.read,
            createdAt: (data.created_at as string) || new Date().toISOString(),
          }, ...prev]);
        });
      return;
    }

    setNotifications(prev => {
      const next = [{ ...item, read: false, createdAt: new Date().toISOString() }, ...prev];
      persist({ notifications: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  const markNotificationRead = useCallback((id: string | number) => {
    if (isLoggedIn) {
      setNotifications(prev => prev.map(n => String(n.id) === String(id) ? { ...n, read: true } : n));
      supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('id', String(id))
        .then(({ error }) => { if (error) console.error('خواندن اعلان:', error.message); });
      return;
    }

    setNotifications(prev => {
      const next = prev.map(n => String(n.id) === String(id) ? { ...n, read: true } : n);
      persist({ notifications: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  const markAllNotificationsRead = useCallback(() => {
    if (isLoggedIn) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)
        .then(({ error }) => { if (error) console.error('خواندن همهٔ اعلان‌ها:', error.message); });
      return;
    }

    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      persist({ notifications: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Followed Characters
  const isCharacterFollowed = useCallback((id: string | number): boolean => {
    return followedCharacters.some(c => String(c.id) === String(id));
  }, [followedCharacters]);

  const followCharacter = useCallback((char: Omit<FollowedCharacter, 'followedAt'>) => {
    if (followedCharacters.some(c => String(c.id) === String(char.id))) return;

    if (isLoggedIn) {
      const newChar: FollowedCharacter = { ...char, followedAt: new Date().toISOString() };
      setFollowedCharacters(prev => [newChar, ...prev]);
      supabase
        .from('followed_characters')
        .insert({
          user_id: userId,
          character_id: String(char.id),
          name: char.name,
          image: char.image,
          anime_name: char.animeName,
          anime_id: String(char.animeId),
        })
        .then(({ error }) => { if (error) console.error('فالو کاراکتر:', error.message); });
      return;
    }

    setFollowedCharacters(prev => {
      const next = [...prev, { ...char, followedAt: new Date().toISOString() }];
      persist({ followedCharacters: next });
      return next;
    });
  }, [followedCharacters, isLoggedIn, userId, persist]);

  const unfollowCharacter = useCallback((id: string | number) => {
    if (isLoggedIn) {
      setFollowedCharacters(prev => prev.filter(c => String(c.id) !== String(id)));
      supabase
        .from('followed_characters')
        .delete()
        .eq('user_id', userId)
        .eq('character_id', String(id))
        .then(({ error }) => { if (error) console.error('آنفالو کاراکتر:', error.message); });
      return;
    }

    setFollowedCharacters(prev => {
      const next = prev.filter(c => String(c.id) !== String(id));
      persist({ followedCharacters: next });
      return next;
    });
  }, [isLoggedIn, userId, persist]);

  const toggleFollowCharacter = useCallback((char: Omit<FollowedCharacter, 'followedAt'>) => {
    if (isCharacterFollowed(char.id)) {
      unfollowCharacter(char.id);
    } else {
      followCharacter(char);
    }
  }, [isCharacterFollowed, unfollowCharacter, followCharacter]);

  // Context Value
  const value: UserDataContextType = {
    watchlist,
    continueWatching,
    favorites,
    ratings,
    downloads,
    notifications,
    followedCharacters,
    stats,
    toggleFavorite,
    isInFavorites,
    toggleWatchlist,
    isInWatchlist,
    updateContinueWatching,
    removeContinueWatching,
    setRating,
    getRating,
    addDownload,
    removeDownload,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
    followCharacter,
    unfollowCharacter,
    isCharacterFollowed,
    toggleFollowCharacter,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

// =============================================
// Hook
// =============================================

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider');
  }
  return context;
}

export default UserDataContext;
