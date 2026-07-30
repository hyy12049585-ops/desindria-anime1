// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// =============================================
// Types
// =============================================

export interface DownloadItem {
  id: string;
  title: string;
  image: string;
  type: 'anime' | 'movie' | 'series';
  episode?: string;
  quality?: string;
  size?: string;
  downloadedAt: string;
  status: 'completed' | 'downloading' | 'paused' | 'failed';
}

export interface WatchlistItem {
  id: string;
  title: string;
  image: string;
  type: 'anime' | 'movie' | 'series';
  addedAt: string;
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold';
  progress?: number;
  totalEpisodes?: number;
}

export interface CharacterItem {
  id: string;
  name: string;
  image: string;
  anime: string;
  role?: 'main' | 'supporting' | 'antagonist';
}

export interface HistoryItem {
  id: string;
  title: string;
  image: string;
  type: 'anime' | 'movie' | 'series';
  episode?: string;
  watchedAt: string;
  progress?: number;
}

interface UserContextType {
  likedItems: string[];
  toggleLike: (itemId: string) => void;
  isLiked: (itemId: string) => boolean;
  downloads: DownloadItem[];
  addDownload: (item: DownloadItem) => void;
  removeDownload: (itemId: string) => void;
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (itemId: string) => void;
  isInWatchlist: (itemId: string) => boolean;
  followedCharacters: CharacterItem[];
  toggleFollowCharacter: (character: CharacterItem) => void;
  isCharacterFollowed: (characterId: string) => boolean;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

// =============================================
// Storage helpers
// =============================================

const STORAGE_KEY = 'desindria_user';

interface StoredUserData {
  likes: string[];
  downloads: DownloadItem[];
  watchlist: WatchlistItem[];
  followedCharacters: CharacterItem[];
  history: HistoryItem[];
}

const defaultUserData: StoredUserData = {
  likes: [],
  downloads: [],
  watchlist: [],
  followedCharacters: [],
  history: [],
};

function loadUserData(): StoredUserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultUserData, ...parsed };
    }
  } catch {}
  return { ...defaultUserData };
}

function saveUserData(data: StoredUserData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// =============================================
// Context
// =============================================

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [followedCharacters, setFollowedCharacters] = useState<CharacterItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const data = loadUserData();
    setLikedItems(data.likes);
    setDownloads(data.downloads);
    setWatchlist(data.watchlist);
    setFollowedCharacters(data.followedCharacters);
    setHistory(data.history);
  }, []);

  const persist = useCallback((partial: Partial<StoredUserData>) => {
    const current = loadUserData();
    const updated = { ...current, ...partial };
    saveUserData(updated);
  }, []);

  // Likes
  const toggleLike = useCallback((itemId: string) => {
    setLikedItems(prev => {
      const next = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      persist({ likes: next });
      return next;
    });
  }, [persist]);

  const isLiked = useCallback((itemId: string) => {
    return likedItems.includes(itemId);
  }, [likedItems]);

  // Downloads
  const addDownload = useCallback((item: DownloadItem) => {
    setDownloads(prev => {
      if (prev.find(d => d.id === item.id)) return prev;
      const next = [item, ...prev];
      persist({ downloads: next });
      return next;
    });
  }, [persist]);

  const removeDownload = useCallback((itemId: string) => {
    setDownloads(prev => {
      const next = prev.filter(d => d.id !== itemId);
      persist({ downloads: next });
      return next;
    });
  }, [persist]);

  // Watchlist
  const addToWatchlist = useCallback((item: WatchlistItem) => {
    setWatchlist(prev => {
      if (prev.find(w => w.id === item.id)) return prev;
      const next = [item, ...prev];
      persist({ watchlist: next });
      return next;
    });
  }, [persist]);

  const removeFromWatchlist = useCallback((itemId: string) => {
    setWatchlist(prev => {
      const next = prev.filter(w => w.id !== itemId);
      persist({ watchlist: next });
      return next;
    });
  }, [persist]);

  const isInWatchlist = useCallback((itemId: string) => {
    return watchlist.some(w => w.id === itemId);
  }, [watchlist]);

  // Characters
  const toggleFollowCharacter = useCallback((character: CharacterItem) => {
    setFollowedCharacters(prev => {
      const exists = prev.find(c => c.id === character.id);
      const next = exists
        ? prev.filter(c => c.id !== character.id)
        : [character, ...prev];
      persist({ followedCharacters: next });
      return next;
    });
  }, [persist]);

  const isCharacterFollowed = useCallback((characterId: string) => {
    return followedCharacters.some(c => c.id === characterId);
  }, [followedCharacters]);

  // History
  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== item.id);
      const next = [item, ...filtered].slice(0, 100);
      persist({ history: next });
      return next;
    });
  }, [persist]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    persist({ history: [] });
  }, [persist]);

  return (
    <UserContext.Provider
      value={{
        likedItems,
        toggleLike,
        isLiked,
        downloads,
        addDownload,
        removeDownload,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        followedCharacters,
        toggleFollowCharacter,
        isCharacterFollowed,
        history,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
