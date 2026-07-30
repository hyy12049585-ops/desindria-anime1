import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
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
  Badge,
  ActivityItem,
  FollowedCharacter,
  calculateLevel,
  xpForNextLevel,
  getLevelTitle,
  XP_VALUES,
} from '../types/profile';
import type {
  LoginRequest,
  RegisterRequest,
  OtpVerifyRequest,
  StoredUser,
  ApiResponse,
} from '../types/auth.types';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { authApi } from '../services/api/authApi';
import { supabase } from '../lib/supabaseClient';

// ============================================
// Default Values
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
  banner: null,
  coverImage: null,
  website: '',
  location: '',
  birthDate: '',
  joinDate: new Date().toISOString(),
  joinedAt: new Date().toISOString(),
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
  settings: {
    theme: 'dark',
    language: 'fa',
    emailNotifications: true,
    pushNotifications: true,
    privateProfile: false,
    autoplay: true,
    notifyAchievements: true,
    notifyRecommendations: true,
    notifyUpdates: true,
    publicProfile: true,
    showWatchlist: true,
    showStats: true,
  },
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
// Context Type
// ============================================

interface AuthContextType {
  // State
  profile: UserProfile;
  stats: UserStats;
  settings: UserSettings;
  security: UserSecurity;
  xpSystem: XPSystem;
  billing: BillingInfo;
  watchlist: WatchItem[];
  favorites: FavoriteItem[];
  likes: LikeItem[];
  downloads: DownloadItem[];
  history: HistoryItem[];
  notifications: NotificationItem[];
  devices: DeviceInfo[];
  activities: ActivityItem[];
  followedCharacters: FollowedCharacter[];
  isLoading: boolean;
  isAuthenticated: boolean;

  // Profile Actions
  updateProfile: (data: Partial<UserProfile>) => void;
  setAvatar: (url: string | null) => void;
  setCoverImage: (url: string | null) => void;

  // OTP-based Auth Actions
  loginWithOtp: (data: LoginRequest) => Promise<ApiResponse<{ phone: string; otpCode?: string }>>;
  registerWithOtp: (data: RegisterRequest) => Promise<ApiResponse<{ phone: string; otpCode?: string }>>;
  verifyOtp: (data: OtpVerifyRequest) => Promise<ApiResponse<{ user: StoredUser; token: string }>>;
  resendOtp: (phone: string) => Promise<ApiResponse>;
  forgotPassword: (phone: string) => Promise<ApiResponse>;
  resetPassword: (phone: string, newPassword: string) => Promise<ApiResponse>;

  // Legacy Auth
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;

  // Settings Actions
  updateSettings: (data: Partial<UserSettings>) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;

  // Security Actions
  updateSecurity: (data: Partial<UserSecurity>) => void;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  toggle2FA: (method: 'sms' | 'email' | 'authenticator') => Promise<boolean>;
  terminateSession: (sessionId: string) => void;

  // XP & Level Actions
  addXP: (amount: number, reason: string) => void;
  unlockBadge: (badge: Badge) => void;

  // Content Actions
  addToWatchlist: (item: WatchItem) => void;
  removeFromWatchlist: (id: string) => void;
  updateWatchProgress: (id: string, progress: number, episode: number) => void;
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  toggleLike: (item: LikeItem) => void;
  addDownload: (item: DownloadItem) => void;
  removeDownload: (id: string) => void;
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;

  // Character Actions
  followCharacter: (character: Omit<FollowedCharacter, 'followedAt' | 'isFavorite'>) => void;
  unfollowCharacter: (id: string) => void;
  toggleFavoriteCharacter: (id: string) => void;
  isCharacterFollowed: (id: string) => boolean;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Billing
  updateBilling: (data: Partial<BillingInfo>) => void;

  // Device Actions
  removeDevice: (id: string) => void;
}

// ============================================
// Create Context
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ──── State ────
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>('profile', defaultProfile)
  );
  const [stats, setStats] = useState<UserStats>(() =>
    loadFromStorage<UserStats>('stats', defaultStats)
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage<UserSettings>('settings', defaultSettings)
  );
  const [security, setSecurity] = useState<UserSecurity>(() =>
    loadFromStorage<UserSecurity>('security', defaultSecurity)
  );
  const [xpSystem, setXPSystem] = useState<XPSystem>(() =>
    loadFromStorage<XPSystem>('xpSystem', defaultXPSystem)
  );
  const [billing, setBilling] = useState<BillingInfo>(() =>
    loadFromStorage<BillingInfo>('billing', defaultBilling)
  );
  const [watchlist, setWatchlist] = useState<WatchItem[]>(() =>
    loadFromStorage<WatchItem[]>('watchlist', [])
  );
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    loadFromStorage<FavoriteItem[]>('favorites', [])
  );
  const [likes, setLikes] = useState<LikeItem[]>(() =>
    loadFromStorage<LikeItem[]>('likes', [])
  );
  const [downloads, setDownloads] = useState<DownloadItem[]>(() =>
    loadFromStorage<DownloadItem[]>('downloads', [])
  );
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    loadFromStorage<HistoryItem[]>('history', [])
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage<NotificationItem[]>('notifications', [])
  );
  const [devices, setDevices] = useState<DeviceInfo[]>(() =>
    loadFromStorage<DeviceInfo[]>('devices', [])
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadFromStorage<ActivityItem[]>('activities', [])
  );
  const [followedCharacters, setFollowedCharacters] = useState<FollowedCharacter[]>(() =>
    loadFromStorage<FollowedCharacter[]>('followedCharacters', [])
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = profile.isLoggedIn;

  const profileRef = useRef(profile);
  profileRef.current = profile;

  // ──── Restore Supabase session on mount + listen for changes ────
  useEffect(() => {
    // بازیابی نشست فعلی هنگام لود صفحه
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const name =
          (u.user_metadata?.display_name as string) ||
          u.email?.split('@')[0] ||
          'کاربر';
        setProfile((prev) => ({
          ...prev,
          id: u.id,
          email: u.email || '',
          username: prev.username || name,
          displayName: prev.displayName || name,
          isLoggedIn: true,
          isVerified: !!u.email_confirmed_at,
          lastSeen: new Date().toISOString(),
        }));
      }
    });

    // گوش‌دادن به تغییرات احراز هویت (ورود/خروج در هر تب)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const name =
          (u.user_metadata?.display_name as string) ||
          u.email?.split('@')[0] ||
          'کاربر';
        setProfile((prev) => ({
          ...prev,
          id: u.id,
          email: u.email || '',
          username: prev.username || name,
          displayName: prev.displayName || name,
          isLoggedIn: true,
          lastSeen: new Date().toISOString(),
        }));
      } else {
        setProfile((prev) => ({ ...prev, isLoggedIn: false }));
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ──── Persist to storage ────
  useEffect(() => { saveToStorage('profile', profile); }, [profile]);
  useEffect(() => { saveToStorage('stats', stats); }, [stats]);
  useEffect(() => { saveToStorage('settings', settings); }, [settings]);
  useEffect(() => { saveToStorage('security', security); }, [security]);
  useEffect(() => { saveToStorage('xpSystem', xpSystem); }, [xpSystem]);
  useEffect(() => { saveToStorage('billing', billing); }, [billing]);
  useEffect(() => { saveToStorage('watchlist', watchlist); }, [watchlist]);
  useEffect(() => { saveToStorage('favorites', favorites); }, [favorites]);
  useEffect(() => { saveToStorage('likes', likes); }, [likes]);
  useEffect(() => { saveToStorage('downloads', downloads); }, [downloads]);
  useEffect(() => { saveToStorage('history', history); }, [history]);
  useEffect(() => { saveToStorage('notifications', notifications); }, [notifications]);
  useEffect(() => { saveToStorage('devices', devices); }, [devices]);
  useEffect(() => { saveToStorage('activities', activities); }, [activities]);
  useEffect(() => { saveToStorage('followedCharacters', followedCharacters); }, [followedCharacters]);

  // ============================================
  // Profile Actions
  // ============================================

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  const setAvatar = useCallback((url: string | null) => {
    setProfile((prev) => ({ ...prev, avatar: url }));
  }, []);

  const setCoverImage = useCallback((url: string | null) => {
    setProfile((prev) => ({ ...prev, coverImage: url }));
  }, []);

  // ============================================
  // XP & Level Actions
  // ============================================

  const addXP = useCallback((amount: number, reason: string) => {
    setXPSystem((prev) => {
      const newTotalXP = prev.totalXPEarned + amount;
      const newCurrentXP = prev.currentXP + amount;
      const newLevel = calculateLevel(newTotalXP);
      const newRank = getLevelTitle(newLevel);
      return {
        ...prev,
        currentXP: newCurrentXP,
        totalXPEarned: newTotalXP,
        level: newLevel,
        xpToNextLevel: xpForNextLevel(newTotalXP),
        rank: newRank,
        lastActiveDate: new Date().toISOString(),
      };
    });

    setProfile((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: xpForNextLevel(newXP),
      };
    });

    const activity: ActivityItem = {
      id: Date.now().toString(),
      type: 'watch',
      title: reason,
      description: `+${amount} XP`,
      timestamp: new Date().toISOString(),
      color: '#00d4ff',
    };
    setActivities((prev) => [activity, ...prev].slice(0, 100));
  }, []);

  // ============================================
  // Notification helper
  // ============================================

  const addNotification = useCallback(
    (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: NotificationItem = {
        ...notif,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, 200));
    },
    []
  );

  // ============================================
  // OTP-based Auth Actions
  // ============================================

  const loginWithOtp = useCallback(
    async (data: LoginRequest): Promise<ApiResponse<{ phone: string; otpCode?: string }>> => {
      setIsLoading(true);
      try {
        const res = await authApi.login(data);
        return res as ApiResponse<{ phone: string; otpCode?: string }>;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const registerWithOtp = useCallback(
    async (data: RegisterRequest): Promise<ApiResponse<{ phone: string; otpCode?: string }>> => {
      setIsLoading(true);
      try {
        const res = await authApi.register(data);
        return res as ApiResponse<{ phone: string; otpCode?: string }>;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const verifyOtp = useCallback(
    async (
      data: OtpVerifyRequest
    ): Promise<ApiResponse<{ user: StoredUser; token: string }>> => {
      setIsLoading(true);
      try {
        const res = await authApi.verifyOtp(data);

        if (res.success && res.data) {
          const verified = res.data as { user: StoredUser; token: string };
          const { user } = verified;

          setProfile((prev) => ({
            ...prev,
            id: user.id,
            displayName: user.fullName,
            username: user.fullName,
            phone: user.phone,
            isLoggedIn: true,
            isVerified: true,
            joinDate: user.createdAt,
            lastSeen: new Date().toISOString(),
          }));

          const loginXP =
            'LOGIN' in XP_VALUES
              ? (XP_VALUES as Record<string, number>).LOGIN
              : XP_VALUES.DAILY_LOGIN;

          addXP(loginXP, 'ورود به حساب کاربری');

          addNotification({
            type: 'system',
            title: 'خوش آمدید! 🎉',
            message: `${user.fullName} عزیز، به سیندریا خوش آمدید`,
          });
        }

        return res as ApiResponse<{ user: StoredUser; token: string }>;
      } finally {
        setIsLoading(false);
      }
    },
    [addXP, addNotification]
  );

  const resendOtp = useCallback(
    async (phone: string): Promise<ApiResponse> => {
      setIsLoading(true);
      try {
        return await authApi.resendOtp(phone);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const forgotPassword = useCallback(
    async (phone: string): Promise<ApiResponse> => {
      setIsLoading(true);
      try {
        return await authApi.forgotPassword(phone);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (phone: string, newPassword: string): Promise<ApiResponse> => {
      setIsLoading(true);
      try {
        return await authApi.resetPassword(phone, newPassword);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============================================
  // Legacy Auth
  // ============================================

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error || !data.user) {
          console.error('Supabase login error:', error?.message);
          return false;
        }
        const u = data.user;
        const name =
          (u.user_metadata?.display_name as string) ||
          u.email?.split('@')[0] ||
          'کاربر';
        setProfile((prev) => ({
          ...prev,
          id: u.id,
          email: u.email || '',
          username: name,
          displayName: name,
          isLoggedIn: true,
          lastSeen: new Date().toISOString(),
        }));
        addXP(XP_VALUES.DAILY_LOGIN, 'ورود به حساب');
        return true;
      } catch (e) {
        console.error('Login exception:', e);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [addXP]
  );

  const logout = useCallback(() => {
    supabase.auth.signOut();
    setProfile(defaultProfile);
    setStats(defaultStats);
    setXPSystem(defaultXPSystem);
    setFollowedCharacters([]);
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: username } },
        });
        if (error || !data.user) {
          console.error('Supabase register error:', error?.message);
          return false;
        }
        const u = data.user;
        setProfile((prev) => ({
          ...prev,
          id: u.id,
          username,
          displayName: username,
          email: u.email || email,
          isLoggedIn: true,
          joinDate: new Date().toISOString(),
        }));

        const firstLoginXP =
          'FIRST_LOGIN' in XP_VALUES
            ? (XP_VALUES as Record<string, number>).FIRST_LOGIN
            : 25;

        addXP(firstLoginXP, 'ثبت‌نام در سیندریا');
        return true;
      } catch (e) {
        console.error('Register exception:', e);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [addXP]
  );

  // ============================================
  // Settings Actions
  // ============================================

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }));
  }, []);

  const updateTheme = useCallback((theme: Partial<ThemeConfig>) => {
    setProfile((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...theme },
    }));
  }, []);

  // ============================================
  // Security Actions
  // ============================================

  const updateSecurity = useCallback((data: Partial<UserSecurity>) => {
    setSecurity((prev) => ({ ...prev, ...data }));
  }, []);

  const changePassword = useCallback(
    async (_current: string, _newPass: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 1000));
        setSecurity((prev) => ({
          ...prev,
          lastPasswordChange: new Date().toISOString(),
        }));
        addNotification({
          type: 'security',
          title: 'تغییر رمز عبور',
          message: 'رمز عبور شما با موفقیت تغییر کرد',
        });
        return true;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [addNotification]
  );

  const toggle2FA = useCallback(
    async (method: 'sms' | 'email' | 'authenticator'): Promise<boolean> => {
      setIsLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 1000));
        setSecurity((prev) => ({
          ...prev,
          twoFactorEnabled: !prev.twoFactorEnabled,
          twoFactorMethod: !prev.twoFactorEnabled ? method : null,
        }));
        return true;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const terminateSession = useCallback((sessionId: string) => {
    setSecurity((prev) => ({
      ...prev,
      activeSessions: prev.activeSessions.filter((s) => s.id !== sessionId),
    }));
  }, []);

  // ============================================
  // XP (badge unlock)
  // ============================================

  const unlockBadge = useCallback((badge: Badge) => {
    setXPSystem((prev) => {
      if (prev.badges.find((b) => b.id === badge.id)) return prev;
      return { ...prev, badges: [...prev.badges, badge] };
    });
  }, []);

  // ============================================
  // Content Actions
  // ============================================

  const addToWatchlist = useCallback((item: WatchItem) => {
    setWatchlist((prev) => {
      if (prev.find((w) => w.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const updateWatchProgress = useCallback(
    (id: string, progress: number, episode: number) => {
      setWatchlist((prev) =>
        prev.map((w) =>
          w.id === id
            ? {
                ...w,
                progress,
                currentEpisode: episode,
                lastWatched: new Date().toISOString(),
              }
            : w
        )
      );
    },
    []
  );

  const addToFavorites = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeFromFavorites = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleLike = useCallback((item: LikeItem) => {
    setLikes((prev) => {
      const exists = prev.find((l) => l.id === item.id);
      if (exists) return prev.filter((l) => l.id !== item.id);
      return [item, ...prev];
    });
  }, []);

  const addDownload = useCallback((item: DownloadItem) => {
    setDownloads((prev) => {
      if (prev.find((d) => d.id === item.id)) return prev;
      return [item, ...prev];
    });
  }, []);

  const removeDownload = useCallback((id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const addToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      return [item, ...filtered].slice(0, 500);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // ============================================
  // Character Actions (NEW)
  // ============================================

  const followCharacter = useCallback(
    (character: Omit<FollowedCharacter, 'followedAt' | 'isFavorite'>) => {
      setFollowedCharacters((prev) => {
        if (prev.find((c) => c.id === character.id)) return prev;
        const newChar: FollowedCharacter = {
          ...character,
          followedAt: new Date().toISOString(),
          isFavorite: false,
        };
        return [newChar, ...prev];
      });

      addXP(XP_VALUES.DAILY_LOGIN, `فالو کاراکتر: ${character.name}`);

      addNotification({
        type: 'system',
        title: 'کاراکتر فالو شد ✨',
        message: `${character.name} به لیست کاراکترهای شما اضافه شد`,
      });
    },
    [addXP, addNotification]
  );

  const unfollowCharacter = useCallback((id: string) => {
    setFollowedCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const toggleFavoriteCharacter = useCallback((id: string) => {
    setFollowedCharacters((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  }, []);

  const isCharacterFollowed = useCallback(
    (id: string) => {
      return followedCharacters.some((c) => c.id === id);
    },
    [followedCharacters]
  );

  // ============================================
  // Notification Actions
  // ============================================

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ============================================
  // Billing & Device Actions
  // ============================================

  const updateBilling = useCallback((data: Partial<BillingInfo>) => {
    setBilling((prev) => ({ ...prev, ...data }));
  }, []);

  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const value: AuthContextType = {
    profile,
    stats,
    settings,
    security,
    xpSystem,
    billing,
    watchlist,
    favorites,
    likes,
    downloads,
    history,
    notifications,
    devices,
    activities,
    followedCharacters,
    isLoading,
    isAuthenticated,

    updateProfile,
    setAvatar,
    setCoverImage,

    loginWithOtp,
    registerWithOtp,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,

    login,
    logout,
    register,

    updateSettings,
    updateTheme,
    updateSecurity,
    changePassword,
    toggle2FA,
    terminateSession,
    addXP,
    unlockBadge,
    addToWatchlist,
    removeFromWatchlist,
    updateWatchProgress,
    addToFavorites,
    removeFromFavorites,
    toggleLike,
    addDownload,
    removeDownload,
    addToHistory,
    clearHistory,

    followCharacter,
    unfollowCharacter,
    toggleFavoriteCharacter,
    isCharacterFollowed,

    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    addNotification,

    updateBilling,
    removeDevice,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// Hook
// ============================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
