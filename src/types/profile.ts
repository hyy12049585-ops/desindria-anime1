// src/types/profile.ts

// ============================================
// XP System Constants & Helpers
// ============================================

export const XP_VALUES = {
  // سطح‌بندی
  PER_LEVEL: 1000,
  MAX_LEVEL: 100,

  // فعالیت‌ها
  WATCH_EPISODE: 10,
  COMPLETE_ANIME: 50,
  WRITE_REVIEW: 25,
  RATE_ANIME: 5,
  ADD_TO_LIST: 3,
  DAILY_LOGIN: 15,
  FIRST_REVIEW: 100,
  STREAK_BONUS: 5,
  SHARE_ANIME: 8,
  FOLLOW_USER: 2,
  COMPLETE_ACHIEVEMENT: 30,
  UPDATE_PROFILE: 10,

  // === اضافه شده برای ProfileContext ===
  watch_episode: 10,
  complete_anime: 50,
  rate_anime: 5,
  add_watchlist: 3,
  favorite_anime: 5,
  write_review: 25,
  daily_login: 15,
  share_anime: 8,
  follow_user: 2,
};

export const LEVEL_TITLES: Record<number, string> = {
  1: 'تازه‌کار',
  5: 'تماشاگر',
  10: 'علاقه‌مند',
  15: 'حرفه‌ای',
  20: 'اوتاکو',
  30: 'استاد',
  40: 'افسانه‌ای',
  50: 'سنسی',
  60: 'شوگون',
  70: 'میتو',
  80: 'کاگه',
  90: 'هوکاگه',
  100: 'خدای انیمه',
};

export const calculateLevel = (xp: number): number => {
  return Math.min(Math.floor(xp / XP_VALUES.PER_LEVEL) + 1, XP_VALUES.MAX_LEVEL);
};

export const xpForNextLevel = (xp: number): number => {
  return XP_VALUES.PER_LEVEL - (xp % XP_VALUES.PER_LEVEL);
};

export const xpProgress = (xp: number): number => {
  return ((xp % XP_VALUES.PER_LEVEL) / XP_VALUES.PER_LEVEL) * 100;
};

export const getLevelTitle = (level: number): string => {
  const levels = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const lvl of levels) {
    if (level >= lvl) return LEVEL_TITLES[lvl];
  }
  return 'تازه‌کار';
};

// ============================================
// Anime (re-export for convenience)
// ============================================

export interface Anime {
  id: string;
  title: string;
  poster: string;
  banner?: string;
  description?: string;
  rating?: number;
  year?: number;
  type?: string;
  genres: string[];
  titleEn?: string;
  japaneseTitle?: string;
  season?: string;
  ageRating?: string;
  source?: string;
  duration?: string;
  status?: string;
  episodes?: number | string;
  studio?: string;
  totalEpisodes: number;
  characters?: {
    id?: string;
    name: string;
    image: string;
    role?: string;
  }[];
  synopsis?: string;
  rank?: number;
}

// ============================================
// XP Action Type
// ============================================

export type XPAction =
  | 'watch_episode'
  | 'complete_anime'
  | 'rate_anime'
  | 'add_watchlist'
  | 'favorite_anime'
  | 'write_review'
  | 'daily_login'
  | 'share_anime'
  | 'follow_user';

// ============================================
// User Profile
// ============================================

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone?: string;
  bio: string;
  avatar: string | null;
  banner: string | null;
  coverImage?: string | null;
  website?: string;
  location?: string;
  birthDate?: string;
  joinDate?: string;
  joinedAt: string;
  lastSeen?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  premiumExpiry?: string;
  level: number;
  xp: number;
  xpToNextLevel?: number;
  totalWatchTime?: number;
  theme?: ThemeConfig;
  isLoggedIn?: boolean;
  settings: ProfileSettings;
}

export interface ProfileSettings {
  theme: string;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  privateProfile: boolean;
  autoplay: boolean;
  notifyAchievements: boolean;
  notifyRecommendations: boolean;
  notifyUpdates: boolean;
  publicProfile: boolean;
  showWatchlist: boolean;
  showStats: boolean;
}

export interface ThemeConfig {
  mode: 'dark' | 'light' | 'cyber';
  primaryColor: string;
  accentColor: string;
  glowIntensity: 'low' | 'medium' | 'high';
}

// ============================================
// Settings
// ============================================

export interface UserSettings {
  // Appearance
  theme: 'dark' | 'light' | 'auto';
  accentColor?: string;
  language: string;
  fontSize?: 'small' | 'medium' | 'large';

  // Playback
  autoPlay?: boolean;
  autoNext?: boolean;
  skipIntro?: boolean;
  skipOutro?: boolean;
  defaultQuality?: '480p' | '720p' | '1080p' | '4K';
  defaultSubtitle?: string;
  defaultDub?: string;
  playbackSpeed?: number;

  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifNewEpisode?: boolean;
  notifRecommendation?: boolean;
  notifNews?: boolean;
  notifEmail?: boolean;
  notifPush?: boolean;

  // Privacy
  privateProfile: boolean;
  profilePublic?: boolean;
  showWatchlist: boolean;
  showStats: boolean;
  showActivity?: boolean;

  // Download
  downloadPath?: string;
  downloadQuality?: string;
  autoDownload?: boolean;
  downloadOnWifi?: boolean;

  // Security
  twoFactorEnabled?: boolean;
  subtitleLanguage?: string;
  autoplay: boolean;

  // ProfileContext extras
  notifyAchievements?: boolean;
  notifyRecommendations?: boolean;
  notifyUpdates?: boolean;
  publicProfile?: boolean;
}

// ============================================
// Security
// ============================================

export interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LoginRecord {
  id: string;
  date: string;
  ip: string;
  device: string;
  location: string;
  success: boolean;
}

export interface UserSecurity {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'sms' | 'email' | 'authenticator' | null;
  lastPasswordChange: string;
  activeSessions: Session[];
  loginHistory: LoginRecord[];
}

// ============================================
// User Stats
// ============================================

export interface GenreItem {
  name: string;
  value: number;
  color: string;
}

export interface ScoreItem {
  score: number;
  count: number;
}

export interface UserStats {
  totalWatched: number;
  totalEpisodes: number;
  totalHours: number;
  totalDays: number;
  meanScore: number;
  level: number;
  xp: number;
  xpToNext: number;
  rank: string;
  streak: number;
  longestStreak: number;
  completionRate: number;
  favoriteGenre: string;
  monthlyActivity: number[];
  weeklyActivity: number[];
  genreDistribution: GenreItem[];
  scoreDistribution: ScoreItem[];
}

// ============================================
// Watch / Content Items (اصلی‌ها حفظ + اضافه شده‌ها)
// ============================================

export interface WatchItem {
  id: string;
  animeId: string;
  title: string;
  titleJa: string;
  cover: string;
  episode: number;
  totalEpisodes: number;
  progress: number;
  lastWatched: string;
  duration: number;
  rating?: number;
}

// === اضافه شده برای ProfileContext ===
export interface WatchHistoryItem {
  animeId: string;
  anime: Anime;
  episodesWatched: number;
  lastWatchedEpisode: number;
  lastWatchedAt: string;
  completed: boolean;
  totalWatchTimeMinutes: number;
}

// === اضافه شده برای ProfileContext ===
export interface WatchlistItem {
  animeId: string;
  anime: Anime;
  addedAt: string;
  episodesWatched: number;
}

export interface FavoriteItem {
  id?: string;
  animeId: string;
  anime?: Anime;
  title?: string;
  titleJa?: string;
  cover?: string;
  genre?: string[];
  rating?: number;
  addedAt: string;
  type?: 'anime' | 'movie' | 'ova';
}

export interface LikeItem {
  id: string;
  animeId: string;
  title: string;
  cover: string;
  likedAt: string;
  type: 'anime' | 'episode' | 'character';
  episodeNumber?: number;
}

// === اضافه شده برای ProfileContext ===
export interface RatingItem {
  animeId: string;
  anime: Anime;
  score: number;
  ratedAt: string;
  review?: string;
}

export interface DownloadItem {
  id: string;
  animeId: string;
  anime?: Anime;
  title?: string;
  cover?: string;
  episode?: number;
  episodeNumber?: number;
  quality: '480p' | '720p' | '1080p' | '4K';
  fileSize?: string;
  sizeMB?: number;
  downloadedAt: string;
  status: 'completed' | 'paused' | 'downloading';
  progress: number;
}

export interface HistoryItem {
  id: string;
  animeId: string;
  title: string;
  cover: string;
  episode: number;
  watchedAt: string;
  duration: number;
  watchedDuration: number;
  progress: number;
}

// ============================================
// XP & Achievements
// ============================================

export interface XPSystem {
  currentXP: number;
  level: number;
  xpToNextLevel: number;
  totalXPEarned: number;
  rank: string;
  badges: Badge[];
  streak: number;
  lastActiveDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// === اضافه شده برای ProfileContext ===
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'watching' | 'social' | 'collection' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  target: number;
}

// ============================================
// Notifications
// ============================================

export interface NotificationItem {
  id: string;
  type: 'system' | 'info' | 'success' | 'warning' | 'episode' | 'achievement' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  image?: string;
  link?: string;
}

// === اضافه شده برای ProfileContext ===
export interface Notification {
  id: string;
  type: 'system' | 'info' | 'success' | 'warning' | 'episode' | 'achievement' | 'security' | 'level_up' | 'achievement_unlock';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  image?: string;
  link?: string;
}

// ============================================
// Billing
// ============================================

export interface BillingInfo {
  plan: 'free' | 'basic' | 'premium' | 'ultimate';
  startDate: string;
  nextBillingDate: string;
  price: number;
  currency: string;
  paymentMethod: string;
  invoices: Invoice[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
}

// ============================================
// Devices
// ============================================

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
  location: string;
}

// ============================================
// Profile Page Types
// ============================================

export type ProfilePage =
  | 'dashboard'
  | 'edit-profile'
  | 'account-settings'
  | 'security'
  | 'watchlist'
  | 'favorites'
  | 'likes'
  | 'downloads'
  | 'history'
  | 'notifications'
  | 'billing'
  | 'logout';

// ============================================
// Activity Types
// ============================================

export interface ActivityItem {
  id: string;
  type: 'watch' | 'rate' | 'review' | 'achievement' | 'follow' | 'list' | 'favorite' | 'complete' | 'download' | 'watchlist';
  title?: string;
  description: string;
  timestamp: string;
  icon?: string;
  color?: string;
  anime?: Anime;
  metadata?: Record<string, unknown>;
}

// ============================================
// Stats (Profile Page)
// ============================================

export interface ProfileStats {
  totalAnimeWatched: number;
  totalEpisodesWatched: number;
  totalWatchTimeHours: number;
  totalReviews: number;
  followers: number;
  following: number;
  favoriteGenre: string;
  averageRating: number;
  currentStreak: number;
  longestStreak: number;
}

// ============================================
// Profile State (برای ProfileContext)
// ============================================

export interface ProfileState {
  userProfile: UserProfile;
  watchHistory: WatchHistoryItem[];
  watchlist: WatchlistItem[];
  favorites: FavoriteItem[];
  ratings: RatingItem[];
  downloads: DownloadItem[];
  achievements: Achievement[];
  notifications: Notification[];
  activityLog: ActivityItem[];
  isLoading: boolean;
}

// ============================================
// Followed Characters
// ============================================

export interface FollowedCharacter {
  id: string;
  name: string;
  nameJa?: string;
  image: string;
  animeName: string;
  animeId?: string;
  followedAt: string;
  isFavorite: boolean;
}
