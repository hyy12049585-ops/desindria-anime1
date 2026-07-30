// src/store/userStore.ts

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './storage';

// ========================
// TYPES
// ========================

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  banner: string;
  bio: string;
  joinedAt: string;
}

export interface UserPreferences {
  defaultQuality: string;
  autoPlay: boolean;
  showSubtitle: boolean;
  theme: 'dark' | 'light' | 'auto';
  language: 'fa' | 'en' | 'ja';
  notifications: boolean;
  emailNotifications: boolean;
}

export interface UserStats {
  likedCount: number;
  watchlistCount: number;
  reviewsCount: number;
  watchHours: number;
  downloadedCount: number;
  episodesWatched: number;
  animeCompleted: number;
  followedCharactersCount: number;
}

export interface HistoryItem {
  animeId: string;
  animeName: string;
  animeCover: string;
  episode: number;
  episodeTitle: string;
  progress: number;
  duration: number;
  date: string;
}

export interface DownloadItem {
  id: string;
  animeId: string;
  animeName: string;
  animeCover: string;
  episode: number;
  episodeTitle: string;
  quality: string;
  size: string;
  date: string;
  status: 'completed' | 'downloading' | 'paused' | 'failed';
}

export interface ReviewItem {
  id: string;
  animeId: string;
  animeName: string;
  animeCover: string;
  text: string;
  rating: number;
  date: string;
  spoiler: boolean;
}

export interface WatchlistItem {
  animeId: string;
  animeName: string;
  animeCover: string;
  addedAt: string;
  status: 'planning' | 'watching' | 'completed' | 'dropped' | 'on-hold';
}

export interface LikedItem {
  animeId: string;
  animeName: string;
  animeCover: string;
  likedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'episode';
  read: boolean;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
}

export interface FollowedCharacter {
  characterId: string;
  characterName: string;
  characterImage: string;
  animeName: string;
  animeId: string;
  followedAt: string;
}

// ========================
// DEFAULT VALUES
// ========================

const defaultProfile: UserProfile = {
  id: crypto.randomUUID?.() || `user_${Date.now()}`,
  name: 'کاربر دسیندریا',
  email: 'user@desindria.com',
  avatar: '',
  banner: '',
  bio: 'عاشق انیمه 🎌',
  joinedAt: new Date().toISOString(),
};

const defaultPreferences: UserPreferences = {
  defaultQuality: '1080p',
  autoPlay: true,
  showSubtitle: true,
  theme: 'dark',
  language: 'fa',
  notifications: true,
  emailNotifications: false,
};

const defaultStats: UserStats = {
  likedCount: 0,
  watchlistCount: 0,
  reviewsCount: 0,
  watchHours: 0,
  downloadedCount: 0,
  episodesWatched: 0,
  animeCompleted: 0,
  followedCharactersCount: 0,
};

const defaultAchievements: Achievement[] = [
  {
    id: 'first_anime',
    title: 'اولین قدم',
    description: 'اولین انیمه رو به واچ‌لیست اضافه کن',
    icon: '🎯',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'watch_10',
    title: 'تماشاگر',
    description: '۱۰ قسمت تماشا کن',
    icon: '📺',
    unlockedAt: null,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'watch_50',
    title: 'اوتاکو',
    description: '۵۰ قسمت تماشا کن',
    icon: '🔥',
    unlockedAt: null,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'watch_100',
    title: 'ویبو',
    description: '۱۰۰ قسمت تماشا کن',
    icon: '⚡',
    unlockedAt: null,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'review_5',
    title: 'منتقد',
    description: '۵ نقد بنویس',
    icon: '✍️',
    unlockedAt: null,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'like_20',
    title: 'لایک‌بازان',
    description: '۲۰ انیمه رو لایک کن',
    icon: '❤️',
    unlockedAt: null,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'complete_5',
    title: 'تمام‌کننده',
    description: '۵ انیمه رو کامل تموم کن',
    icon: '🏆',
    unlockedAt: null,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'download_10',
    title: 'دانلودر',
    description: '۱۰ قسمت دانلود کن',
    icon: '💾',
    unlockedAt: null,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'follow_char_10',
    title: 'طرفدار واقعی',
    description: '۱۰ کاراکتر رو دنبال کن',
    icon: '⭐',
    unlockedAt: null,
    progress: 0,
    maxProgress: 10,
  },
];

// ========================
// STORE INTERFACE
// ========================

interface UserStore {
  // State
  profile: UserProfile;
  preferences: UserPreferences;
  stats: UserStats;
  watchlist: WatchlistItem[];
  likes: LikedItem[];
  history: HistoryItem[];
  downloads: DownloadItem[];
  reviews: ReviewItem[];
  notifications: NotificationItem[];
  achievements: Achievement[];
  followedCharacters: FollowedCharacter[];

  // Profile Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePreferences: (data: Partial<UserPreferences>) => void;

  // Watchlist Actions
  addToWatchlist: (item: Omit<WatchlistItem, 'addedAt' | 'status'>) => void;
  removeFromWatchlist: (animeId: string) => void;
  updateWatchlistStatus: (animeId: string, status: WatchlistItem['status']) => void;
  isInWatchlist: (animeId: string) => boolean;
  toggleWatchlist: (item: Omit<WatchlistItem, 'addedAt' | 'status'>) => void;

  // Like Actions
  likeAnime: (item: Omit<LikedItem, 'likedAt'>) => void;
  unlikeAnime: (animeId: string) => void;
  isLiked: (animeId: string) => boolean;
  toggleLike: (item: Omit<LikedItem, 'likedAt'>) => void;

  // History Actions
  addHistory: (item: Omit<HistoryItem, 'date'>) => void;
  clearHistory: () => void;
  removeHistoryItem: (animeId: string, episode: number) => void;

  // Download Actions
  addDownload: (item: Omit<DownloadItem, 'id' | 'date' | 'status'>) => void;
  removeDownload: (id: string) => void;
  updateDownloadStatus: (id: string, status: DownloadItem['status']) => void;
  clearDownloads: () => void;

  // Review Actions
  addReview: (item: Omit<ReviewItem, 'id' | 'date'>) => void;
  removeReview: (id: string) => void;
  updateReview: (id: string, data: Partial<ReviewItem>) => void;

  // Notification Actions
  addNotification: (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Followed Characters Actions
  followCharacter: (character: Omit<FollowedCharacter, 'followedAt'>) => void;
  unfollowCharacter: (characterId: string) => void;
  isCharacterFollowed: (characterId: string) => boolean;
  toggleFollowCharacter: (character: Omit<FollowedCharacter, 'followedAt'>) => void;

  // Achievement Actions
  checkAchievements: () => void;

  // Utility
  resetAllData: () => void;
}

// ========================
// CREATE STORE
// ========================

export const useUserStore = create<UserStore>()(
  subscribeWithSelector((set, get) => ({
    // ── Initial State ──
    profile: loadFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, defaultProfile),
    preferences: loadFromStorage<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, defaultPreferences),
    stats: loadFromStorage<UserStats>(STORAGE_KEYS.USER_STATS, defaultStats),
    watchlist: loadFromStorage<WatchlistItem[]>(STORAGE_KEYS.USER_WATCHLIST, []),
    likes: loadFromStorage<LikedItem[]>(STORAGE_KEYS.USER_LIKES, []),
    history: loadFromStorage<HistoryItem[]>(STORAGE_KEYS.USER_HISTORY, []),
    downloads: loadFromStorage<DownloadItem[]>(STORAGE_KEYS.USER_DOWNLOADS, []),
    reviews: loadFromStorage<ReviewItem[]>(STORAGE_KEYS.USER_REVIEWS, []),
    notifications: loadFromStorage<NotificationItem[]>(STORAGE_KEYS.USER_NOTIFICATIONS, []),
    achievements: loadFromStorage<Achievement[]>(STORAGE_KEYS.USER_ACHIEVEMENTS, defaultAchievements),
    followedCharacters: loadFromStorage<FollowedCharacter[]>(STORAGE_KEYS.USER_FOLLOWED_CHARACTERS, []),

    // ── Profile Actions ──
    updateProfile: (data) => {
      set((state) => {
        const updated = { ...state.profile, ...data };
        saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
        return { profile: updated };
      });
    },

    updatePreferences: (data) => {
      set((state) => {
        const updated = { ...state.preferences, ...data };
        saveToStorage(STORAGE_KEYS.USER_PREFERENCES, updated);
        return { preferences: updated };
      });
    },

    // ── Watchlist Actions ──
    addToWatchlist: (item) => {
      const { watchlist, stats } = get();
      if (watchlist.find((w) => w.animeId === item.animeId)) return;

      const newItem: WatchlistItem = {
        ...item,
        addedAt: new Date().toISOString(),
        status: 'planning',
      };
      const updated = [newItem, ...watchlist];
      const updatedStats = { ...stats, watchlistCount: updated.length };

      set({ watchlist: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_WATCHLIST, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    removeFromWatchlist: (animeId) => {
      const { watchlist, stats } = get();
      const updated = watchlist.filter((w) => w.animeId !== animeId);
      const updatedStats = { ...stats, watchlistCount: updated.length };

      set({ watchlist: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_WATCHLIST, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    },

    updateWatchlistStatus: (animeId, status) => {
      const { watchlist, stats } = get();
      const updated = watchlist.map((w) =>
        w.animeId === animeId ? { ...w, status } : w
      );
      let updatedStats = { ...stats };
      if (status === 'completed') {
        const prevItem = watchlist.find((w) => w.animeId === animeId);
        if (prevItem && prevItem.status !== 'completed') {
          updatedStats.animeCompleted += 1;
        }
      }
      set({ watchlist: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_WATCHLIST, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    isInWatchlist: (animeId) => {
      return get().watchlist.some((w) => w.animeId === animeId);
    },

    toggleWatchlist: (item) => {
      const { isInWatchlist, addToWatchlist, removeFromWatchlist } = get();
      if (isInWatchlist(item.animeId)) {
        removeFromWatchlist(item.animeId);
      } else {
        addToWatchlist(item);
      }
    },

    // ── Like Actions ──
    likeAnime: (item) => {
      const { likes, stats } = get();
      if (likes.find((l) => l.animeId === item.animeId)) return;

      const newItem: LikedItem = { ...item, likedAt: new Date().toISOString() };
      const updated = [newItem, ...likes];
      const updatedStats = { ...stats, likedCount: updated.length };

      set({ likes: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_LIKES, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    unlikeAnime: (animeId) => {
      const { likes, stats } = get();
      const updated = likes.filter((l) => l.animeId !== animeId);
      const updatedStats = { ...stats, likedCount: updated.length };

      set({ likes: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_LIKES, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    },

    isLiked: (animeId) => {
      return get().likes.some((l) => l.animeId === animeId);
    },

    toggleLike: (item) => {
      const { isLiked, likeAnime, unlikeAnime } = get();
      if (isLiked(item.animeId)) {
        unlikeAnime(item.animeId);
      } else {
        likeAnime(item);
      }
    },

    // ── History Actions ──
    addHistory: (item) => {
      const { history, stats } = get();
      const exists = history.findIndex(
        (h) => h.animeId === item.animeId && h.episode === item.episode
      );
      let updated: HistoryItem[];
      if (exists >= 0) {
        updated = [...history];
        updated[exists] = { ...item, date: new Date().toISOString() };
      } else {
        updated = [{ ...item, date: new Date().toISOString() }, ...history];
      }

      const totalMinutes = updated.reduce((sum, h) => {
        return sum + (h.duration * h.progress) / 100;
      }, 0);

      const updatedStats = {
        ...stats,
        watchHours: Math.round((totalMinutes / 60) * 10) / 10,
        episodesWatched: updated.filter((h) => h.progress >= 90).length,
      };

      set({ history: updated.slice(0, 500), stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_HISTORY, updated.slice(0, 500));
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    clearHistory: () => {
      set({ history: [] });
      saveToStorage(STORAGE_KEYS.USER_HISTORY, []);
    },

    removeHistoryItem: (animeId, episode) => {
      const { history } = get();
      const updated = history.filter(
        (h) => !(h.animeId === animeId && h.episode === episode)
      );
      set({ history: updated });
      saveToStorage(STORAGE_KEYS.USER_HISTORY, updated);
    },

    // ── Download Actions ──
    addDownload: (item) => {
      const { downloads, stats } = get();
      const newItem: DownloadItem = {
        ...item,
        id: crypto.randomUUID?.() || `dl_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'completed',
      };
      const updated = [newItem, ...downloads];
      const updatedStats = { ...stats, downloadedCount: updated.length };

      set({ downloads: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_DOWNLOADS, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    removeDownload: (id) => {
      const { downloads, stats } = get();
      const updated = downloads.filter((d) => d.id !== id);
      const updatedStats = { ...stats, downloadedCount: updated.length };

      set({ downloads: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_DOWNLOADS, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    },

    updateDownloadStatus: (id, status) => {
      const { downloads } = get();
      const updated = downloads.map((d) => (d.id === id ? { ...d, status } : d));
      set({ downloads: updated });
      saveToStorage(STORAGE_KEYS.USER_DOWNLOADS, updated);
    },

    clearDownloads: () => {
      const { stats } = get();
      const updatedStats = { ...stats, downloadedCount: 0 };
      set({ downloads: [], stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_DOWNLOADS, []);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    },

    // ── Review Actions ──
    addReview: (item) => {
      const { reviews, stats } = get();
      const newItem: ReviewItem = {
        ...item,
        id: crypto.randomUUID?.() || `rev_${Date.now()}`,
        date: new Date().toISOString(),
      };
      const updated = [newItem, ...reviews];
      const updatedStats = { ...stats, reviewsCount: updated.length };

      set({ reviews: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_REVIEWS, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    removeReview: (id) => {
      const { reviews, stats } = get();
      const updated = reviews.filter((r) => r.id !== id);
      const updatedStats = { ...stats, reviewsCount: updated.length };

      set({ reviews: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_REVIEWS, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    },

    updateReview: (id, data) => {
      const { reviews } = get();
      const updated = reviews.map((r) => (r.id === id ? { ...r, ...data } : r));
      set({ reviews: updated });
      saveToStorage(STORAGE_KEYS.USER_REVIEWS, updated);
    },

    // ── Notification Actions ──
    addNotification: (item) => {
      const { notifications } = get();
      const newItem: NotificationItem = {
        ...item,
        id: crypto.randomUUID?.() || `notif_${Date.now()}`,
        date: new Date().toISOString(),
        read: false,
      };
      const updated = [newItem, ...notifications].slice(0, 100);
      set({ notifications: updated });
      saveToStorage(STORAGE_KEYS.USER_NOTIFICATIONS, updated);
    },

    markNotificationRead: (id) => {
      const { notifications } = get();
      const updated = notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      set({ notifications: updated });
      saveToStorage(STORAGE_KEYS.USER_NOTIFICATIONS, updated);
    },

    markAllNotificationsRead: () => {
      const { notifications } = get();
      const updated = notifications.map((n) => ({ ...n, read: true }));
      set({ notifications: updated });
      saveToStorage(STORAGE_KEYS.USER_NOTIFICATIONS, updated);
    },

    clearNotifications: () => {
      set({ notifications: [] });
      saveToStorage(STORAGE_KEYS.USER_NOTIFICATIONS, []);
    },

    // ── Followed Characters Actions ──
    followCharacter: (character) => {
      const { followedCharacters, stats } = get();
      if (followedCharacters.find((c) => c.characterId === character.characterId)) return;

      const newChar: FollowedCharacter = {
        ...character,
        followedAt: new Date().toISOString(),
      };
      const updated = [newChar, ...followedCharacters];
      const updatedStats = { ...stats, followedCharactersCount: updated.length };

      set({ followedCharacters: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_FOLLOWED_CHARACTERS, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
      get().checkAchievements();
    },

    unfollowCharacter: (characterId) => {
      const { followedCharacters, stats } = get();
      const updated = followedCharacters.filter((c) => c.characterId !== characterId);
      const updatedStats = { ...stats, followedCharactersCount: updated.length };

      set({ followedCharacters: updated, stats: updatedStats });
      saveToStorage(STORAGE_KEYS.USER_FOLLOWED_CHARACTERS, updated);
      saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    },

    isCharacterFollowed: (characterId) => {
      return get().followedCharacters.some((c) => c.characterId === characterId);
    },

    toggleFollowCharacter: (character) => {
      const { isCharacterFollowed, followCharacter, unfollowCharacter } = get();
      if (isCharacterFollowed(character.characterId)) {
        unfollowCharacter(character.characterId);
      } else {
        followCharacter(character);
      }
    },

    // ── Achievement Check ──
    checkAchievements: () => {
      const { stats, achievements } = get();
      let changed = false;

      const updated = achievements.map((a) => {
        let progress = a.progress;

        switch (a.id) {
          case 'first_anime':
            progress = Math.min(stats.watchlistCount, 1);
            break;
          case 'watch_10':
            progress = Math.min(stats.episodesWatched, 10);
            break;
          case 'watch_50':
            progress = Math.min(stats.episodesWatched, 50);
            break;
          case 'watch_100':
            progress = Math.min(stats.episodesWatched, 100);
            break;
          case 'review_5':
            progress = Math.min(stats.reviewsCount, 5);
            break;
          case 'like_20':
            progress = Math.min(stats.likedCount, 20);
            break;
          case 'complete_5':
            progress = Math.min(stats.animeCompleted, 5);
            break;
          case 'download_10':
            progress = Math.min(stats.downloadedCount, 10);
            break;
          case 'follow_char_10':
            progress = Math.min(stats.followedCharactersCount, 10);
            break;
        }

        const wasUnlocked = a.unlockedAt !== null;
        const isNowUnlocked = progress >= a.maxProgress;

        if (progress !== a.progress || (!wasUnlocked && isNowUnlocked)) {
          changed = true;
          return {
            ...a,
            progress,
            unlockedAt: isNowUnlocked && !wasUnlocked ? new Date().toISOString() : a.unlockedAt,
          };
        }
        return a;
      });

      if (changed) {
        set({ achievements: updated });
        saveToStorage(STORAGE_KEYS.USER_ACHIEVEMENTS, updated);
      }
    },

    // ── Reset ──
    resetAllData: () => {
      set({
        profile: defaultProfile,
        preferences: defaultPreferences,
        stats: defaultStats,
        watchlist: [],
        likes: [],
        history: [],
        downloads: [],
        reviews: [],
        notifications: [],
        achievements: defaultAchievements,
        followedCharacters: [],
      });
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    },
  }))
);
