// src/types/index.ts

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatar: string;
  bio: string;
  joinDate: string;
  xp: number;
  level: number;
  rank: string;
  rankColor: string;
}

export interface AnimeItem {
  id: string;
  title: string;
  titleJa?: string;
  image: string;
  score?: number;
  episodes: number;
  watchedEpisodes: number;
  status: "watching" | "completed" | "planned" | "dropped" | "on-hold";
  rating?: number;
  genre?: string[];
  addedAt: string;
  updatedAt: string;
}

export interface DownloadItem {
  id: string;
  animeId: string;
  title: string;
  image: string;
  episode: number;
  quality: string;
  size: string;
  progress: number;
  status: "downloading" | "paused" | "completed" | "failed";
  startedAt: string;
}

export interface Notification {
  id: string;
  type: "episode" | "achievement" | "system" | "social";
  title: string;
  message: string;
  image?: string;
  read: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface UserSettings {
  theme: "dark" | "light" | "auto";
  accentColor: string;
  language: "fa" | "en" | "ja";
  autoplay: boolean;
  defaultQuality: "480p" | "720p" | "1080p" | "4K";
  notifications: boolean;
  publicProfile: boolean;
  showActivity: boolean;
  subtitleSize: "small" | "medium" | "large";
  dubbed: boolean;
}
