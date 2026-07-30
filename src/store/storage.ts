// src/store/storage.ts

export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_STATS: 'user_stats',
  USER_WATCHLIST: 'user_watchlist',
  USER_LIKES: 'user_likes',
  USER_HISTORY: 'user_history',
  USER_DOWNLOADS: 'user_downloads',
  USER_REVIEWS: 'user_reviews',
  USER_PREFERENCES: 'user_preferences',
  USER_NOTIFICATIONS: 'user_notifications',
  USER_ACHIEVEMENTS: 'user_achievements',
  USER_FOLLOWED_CHARACTERS: 'user_followed_characters',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage key="${key}"`, e);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to remove from localStorage key="${key}"`, e);
  }
}

export function clearAllUserData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
