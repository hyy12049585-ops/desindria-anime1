// src/utils/dataManager.ts

import {
  UserProfile,
  UserStats,
  UserSettings,
  UserSecurity,
  ThemeConfig,
  XPSystem,
  WatchItem,
  FavoriteItem,
  LikeItem,
  DownloadItem,
  HistoryItem,
  NotificationItem,
  BillingInfo,
  DeviceInfo,
  XP_VALUES,
} from '../types/profile';
import { saveToStorage, loadFromStorage, removeFromStorage } from './storage';

// ============================================
// Default Data
// ============================================

const defaultTheme: ThemeConfig = {
  mode: 'cyber',
  primaryColor: '#00d4ff',
  accentColor: '#a855f7',
  glowIntensity: 'medium',
};

const defaultProfile: UserProfile = {
  id: '',
  username: '',
  displayName: '',
  email: '',
  phone: '',
  bio: '',
  avatar: null,
  coverImage: null,
  website: '',
  location: '',
  birthDate: '',
  joinDate: new Date().toISOString(),
  lastSeen: new Date().toISOString(),
  isVerified: false,
  isPremium: false,
  premiumExpiry: '',
  level: 1,
  xp: 0,
  xpToNextLevel: XP_VALUES.PER_LEVEL,
  totalWatchTime: 0,
  theme: defaultTheme,
  isLoggedIn: false,
};

const defaultStats: UserStats = {
  totalWatched: 0,
  totalEpisodes: 0,
  totalHours: 0,
  totalDays: 0,
  meanScore: 0,
  level: 1,
  xp: 0,
  xpToNext: XP_VALUES.PER_LEVEL,
  rank: 'تازه‌کار',
  streak: 0,
  longestStreak: 0,
  completionRate: 0,
  favoriteGenre: '',
  monthlyActivity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
  genreDistribution: [],
  scoreDistribution: [],
};

const defaultSettings: UserSettings = {
  theme: 'dark',
  accentColor: '#a855f7',
  language: 'fa',
  fontSize: 'medium',
  autoPlay: true,
  autoNext: true,
  skipIntro: false,
  skipOutro: false,
  defaultQuality: '1080p',
  defaultSubtitle: 'fa',
  defaultDub: 'ja',
  playbackSpeed: 1,
  emailNotifications: true,
  pushNotifications: true,
  notifNewEpisode: true,
  notifRecommendation: true,
  notifNews: false,
  notifEmail: true,
  notifPush: true,
  privateProfile: false,
  profilePublic: true,
  showWatchlist: true,
  showStats: true,
  showActivity: true,
  downloadPath: '/downloads',
  downloadQuality: '1080p',
  autoDownload: false,
  downloadOnWifi: true,
  twoFactorEnabled: false,
  subtitleLanguage: 'fa',
  autoplay: true,
};

const defaultSecurity: UserSecurity = {
  twoFactorEnabled: false,
  twoFactorMethod: null,
  lastPasswordChange: new Date().toISOString(),
  activeSessions: [],
  loginHistory: [],
};

const defaultXPSystem: XPSystem = {
  currentXP: 0,
  level: 1,
  xpToNextLevel: XP_VALUES.PER_LEVEL,
  totalXPEarned: 0,
  rank: 'تازه‌کار',
  badges: [],
  streak: 0,
  lastActiveDate: new Date().toISOString(),
};

const defaultBilling: BillingInfo = {
  plan: 'free',
  startDate: '',
  nextBillingDate: '',
  price: 0,
  currency: 'IRR',
  paymentMethod: '',
  invoices: [],
};

// ============================================
// Data Manager Class
// ============================================

class DataManager {
  // ──── Profile ────
  getProfile(): UserProfile {
    return loadFromStorage<UserProfile>('profile', defaultProfile);
  }

  saveProfile(profile: UserProfile): void {
    saveToStorage('profile', profile);
  }

  updateProfile(data: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...data };
    this.saveProfile(updated);
    return updated;
  }

  // ──── Stats ────
  getStats(): UserStats {
    return loadFromStorage<UserStats>('stats', defaultStats);
  }

  saveStats(stats: UserStats): void {
    saveToStorage('stats', stats);
  }

  updateStats(data: Partial<UserStats>): UserStats {
    const current = this.getStats();
    const updated = { ...current, ...data };
    this.saveStats(updated);
    return updated;
  }

  // ──── Settings ────
  getSettings(): UserSettings {
    return loadFromStorage<UserSettings>('settings', defaultSettings);
  }

  saveSettings(settings: UserSettings): void {
    saveToStorage('settings', settings);
  }

  updateSettings(data: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...data };
    this.saveSettings(updated);
    return updated;
  }

  // ──── Security ────
  getSecurity(): UserSecurity {
    return loadFromStorage<UserSecurity>('security', defaultSecurity);
  }

  saveSecurity(security: UserSecurity): void {
    saveToStorage('security', security);
  }

  // ──── XP System ────
  getXPSystem(): XPSystem {
    return loadFromStorage<XPSystem>('xpSystem', defaultXPSystem);
  }

  saveXPSystem(xp: XPSystem): void {
    saveToStorage('xpSystem', xp);
  }

  // ──── Billing ────
  getBilling(): BillingInfo {
    return loadFromStorage<BillingInfo>('billing', defaultBilling);
  }

  saveBilling(billing: BillingInfo): void {
    saveToStorage('billing', billing);
  }

  // ──── Watchlist ────
  getWatchlist(): WatchItem[] {
    return loadFromStorage<WatchItem[]>('watchlist', []);
  }

  saveWatchlist(list: WatchItem[]): void {
    saveToStorage('watchlist', list);
  }

  addToWatchlist(item: WatchItem): WatchItem[] {
    const current = this.getWatchlist();
    if (current.find(w => w.id === item.id)) return current;
    const updated = [item, ...current];
    this.saveWatchlist(updated);
    return updated;
  }

  removeFromWatchlist(id: string): WatchItem[] {
    const updated = this.getWatchlist().filter(w => w.id !== id);
    this.saveWatchlist(updated);
    return updated;
  }

  // ──── Favorites ────
  getFavorites(): FavoriteItem[] {
    return loadFromStorage<FavoriteItem[]>('favorites', []);
  }

  saveFavorites(list: FavoriteItem[]): void {
    saveToStorage('favorites', list);
  }

    addToFavorites(item: FavoriteItem): FavoriteItem[] {
    const current = this.getFavorites();
    if (current.find(f => f.id === item.id)) return current;
    const updated = [item, ...current];
    this.saveFavorites(updated);
    return updated;
  }

  removeFromFavorites(id: string): FavoriteItem[] {
    const updated = this.getFavorites().filter(f => f.id !== id);
    this.saveFavorites(updated);
    return updated;
  }

  // ──── Likes ────
  getLikes(): LikeItem[] {
    return loadFromStorage<LikeItem[]>('likes', []);
  }

  saveLikes(list: LikeItem[]): void {
    saveToStorage('likes', list);
  }

  toggleLike(item: LikeItem): LikeItem[] {
    const current = this.getLikes();
    const exists = current.find(l => l.id === item.id);
    const updated = exists
      ? current.filter(l => l.id !== item.id)
      : [item, ...current];
    this.saveLikes(updated);
    return updated;
  }

  // ──── Downloads ────
  getDownloads(): DownloadItem[] {
    return loadFromStorage<DownloadItem[]>('downloads', []);
  }

  saveDownloads(list: DownloadItem[]): void {
    saveToStorage('downloads', list);
  }

  addDownload(item: DownloadItem): DownloadItem[] {
    const current = this.getDownloads();
    if (current.find(d => d.id === item.id)) return current;
    const updated = [item, ...current];
    this.saveDownloads(updated);
    return updated;
  }

  removeDownload(id: string): DownloadItem[] {
    const updated = this.getDownloads().filter(d => d.id !== id);
    this.saveDownloads(updated);
    return updated;
  }

  updateDownloadProgress(id: string, progress: number, status: DownloadItem['status']): DownloadItem[] {
    const updated = this.getDownloads().map(d =>
      d.id === id ? { ...d, progress, status } : d
    );
    this.saveDownloads(updated);
    return updated;
  }

  // ──── History ────
  getHistory(): HistoryItem[] {
    return loadFromStorage<HistoryItem[]>('history', []);
  }

  saveHistory(list: HistoryItem[]): void {
    saveToStorage('history', list);
  }

  addToHistory(item: HistoryItem): HistoryItem[] {
    const current = this.getHistory().filter(h => h.id !== item.id);
    const updated = [item, ...current].slice(0, 500);
    this.saveHistory(updated);
    return updated;
  }

  clearHistory(): void {
    this.saveHistory([]);
  }

  // ──── Notifications ────
  getNotifications(): NotificationItem[] {
    return loadFromStorage<NotificationItem[]>('notifications', []);
  }

  saveNotifications(list: NotificationItem[]): void {
    saveToStorage('notifications', list);
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem[] {
    const current = this.getNotifications();
    const newNotif: NotificationItem = {
      ...notif,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    const updated = [newNotif, ...current].slice(0, 200);
    this.saveNotifications(updated);
    return updated;
  }

  markNotificationRead(id: string): NotificationItem[] {
    const updated = this.getNotifications().map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications(updated);
    return updated;
  }

  markAllNotificationsRead(): NotificationItem[] {
    const updated = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
    return updated;
  }

  clearNotifications(): void {
    this.saveNotifications([]);
  }

  // ──── Devices ────
  getDevices(): DeviceInfo[] {
    return loadFromStorage<DeviceInfo[]>('devices', []);
  }

  saveDevices(list: DeviceInfo[]): void {
    saveToStorage('devices', list);
  }

  removeDevice(id: string): DeviceInfo[] {
    const updated = this.getDevices().filter(d => d.id !== id);
    this.saveDevices(updated);
    return updated;
  }

  // ──── Reset All Data ────
  resetAll(): void {
    removeFromStorage('profile');
    removeFromStorage('stats');
    removeFromStorage('settings');
    removeFromStorage('security');
    removeFromStorage('xpSystem');
    removeFromStorage('billing');
    removeFromStorage('watchlist');
    removeFromStorage('favorites');
    removeFromStorage('likes');
    removeFromStorage('downloads');
    removeFromStorage('history');
    removeFromStorage('notifications');
    removeFromStorage('devices');
  }

  // ──── Export / Import Data ────
  exportData(): string {
    const data = {
      profile: this.getProfile(),
      stats: this.getStats(),
      settings: this.getSettings(),
      security: this.getSecurity(),
      xpSystem: this.getXPSystem(),
      billing: this.getBilling(),
      watchlist: this.getWatchlist(),
      favorites: this.getFavorites(),
      likes: this.getLikes(),
      downloads: this.getDownloads(),
      history: this.getHistory(),
      notifications: this.getNotifications(),
      devices: this.getDevices(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importData(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.profile) this.saveProfile(data.profile);
      if (data.stats) this.saveStats(data.stats);
      if (data.settings) this.saveSettings(data.settings);
      if (data.security) this.saveSecurity(data.security);
      if (data.xpSystem) this.saveXPSystem(data.xpSystem);
      if (data.billing) this.saveBilling(data.billing);
      if (data.watchlist) this.saveWatchlist(data.watchlist);
      if (data.favorites) this.saveFavorites(data.favorites);
      if (data.likes) this.saveLikes(data.likes);
      if (data.downloads) this.saveDownloads(data.downloads);
      if (data.history) this.saveHistory(data.history);
      if (data.notifications) this.saveNotifications(data.notifications);
      if (data.devices) this.saveDevices(data.devices);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }
}

// ============================================
// Singleton Export
// ============================================

export const dataManager = new DataManager();
export default dataManager;
