// src/contexts/ProfileContext.tsx

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  ProfileState,
  UserProfile,
  Anime,
  WatchHistoryItem,
  WatchlistItem,
  FavoriteItem,
  RatingItem,
  DownloadItem,
  Achievement,
  Notification,
  ActivityItem,
  XPAction,
  XP_VALUES,
  calculateLevel,
  UserSettings,
} from "../types/profile";

// ======== داده‌های اولیه ========

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_watch",
    title: "اولین تماشا",
    description: "اولین اپیزود انیمه رو تماشا کردی",
    icon: "🎬",
    unlocked: false,
    category: "watching",
    rarity: "common",
    progress: 0,
    target: 1,
  },
  {
    id: "ten_episodes",
    title: "۱۰ اپیزود",
    description: "۱۰ اپیزود تماشا کردی",
    icon: "📺",
    unlocked: false,
    category: "watching",
    rarity: "common",
    progress: 0,
    target: 10,
  },
  {
    id: "first_rating",
    title: "اولین امتیاز",
    description: "اولین امتیازت رو ثبت کردی",
    icon: "⭐",
    unlocked: false,
    category: "social",
    rarity: "common",
    progress: 0,
    target: 1,
  },
  {
    id: "ten_favorites",
    title: "۱۰ علاقه‌مندی",
    description: "۱۰ انیمه رو به علاقه‌مندی‌ها اضافه کردی",
    icon: "❤️",
    unlocked: false,
    category: "collection",
    rarity: "rare",
    progress: 0,
    target: 10,
  },
  {
    id: "level_5",
    title: "سطح ۵",
    description: "به سطح ۵ رسیدی",
    icon: "🏆",
    unlocked: false,
    category: "milestone",
    rarity: "rare",
    progress: 0,
    target: 5,
  },
  {
    id: "first_complete",
    title: "اولین تکمیل",
    description: "اولین انیمه رو کامل تماشا کردی",
    icon: "✅",
    unlocked: false,
    category: "watching",
    rarity: "common",
    progress: 0,
    target: 1,
  },
  {
    id: "fifty_episodes",
    title: "۵۰ اپیزود",
    description: "۵۰ اپیزود تماشا کردی",
    icon: "🔥",
    unlocked: false,
    category: "watching",
    rarity: "epic",
    progress: 0,
    target: 50,
  },
  {
    id: "hundred_episodes",
    title: "۱۰۰ اپیزود",
    description: "۱۰۰ اپیزود تماشا کردی",
    icon: "💯",
    unlocked: false,
    category: "milestone",
    rarity: "legendary",
    progress: 0,
    target: 100,
  },
  {
    id: "level_10",
    title: "سطح ۱۰",
    description: "به سطح ۱۰ رسیدی",
    icon: "👑",
    unlocked: false,
    category: "milestone",
    rarity: "legendary",
    progress: 0,
    target: 10,
  },
  {
    id: "five_ratings",
    title: "۵ امتیاز",
    description: "۵ انیمه رو امتیاز دادی",
    icon: "🌟",
    unlocked: false,
    category: "social",
    rarity: "rare",
    progress: 0,
    target: 5,
  },
];

const initialProfile: UserProfile = {
  id: "user_001",
  username: "AnimeWatcher",
  displayName: "انیمه واچر",
  email: "user@example.com",
  avatar: "/default-avatar.png",
  banner: "/default-banner.jpg",
  bio: "عاشق انیمه 🎌",
  joinedAt: new Date().toISOString(),
  xp: 0,
  level: 0,
  settings: {
    theme: "dark",
    language: "fa",
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

const initialState: ProfileState = {
  userProfile: initialProfile,
  watchHistory: [],
  watchlist: [],
  favorites: [],
  ratings: [],
  downloads: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  notifications: [],
  activityLog: [],
  isLoading: false,
};

// ======== Action Types ========

type ProfileAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_PROFILE"; payload: Partial<UserProfile> }
  | { type: "UPDATE_SETTINGS"; payload: Partial<UserSettings> }
  | { type: "ADD_XP"; payload: { action: XPAction; amount?: number } }
  | { type: "WATCH_EPISODE"; payload: { anime: Anime; episodeNumber: number } }
  | { type: "ADD_TO_WATCHLIST"; payload: Anime }
  | { type: "REMOVE_FROM_WATCHLIST"; payload: string }
  | { type: "ADD_TO_FAVORITES"; payload: Anime }
  | { type: "REMOVE_FROM_FAVORITES"; payload: string }
  | {
      type: "RATE_ANIME";
      payload: { anime: Anime; score: number; review?: string };
    }
  | {
      type: "UPDATE_RATING";
      payload: { animeId: string; score: number; review?: string };
    }
  | {
      type: "ADD_DOWNLOAD";
      payload: {
        anime: Anime;
        episodeNumber: number;
        quality: "480p" | "720p" | "1080p" | "4K";
        sizeMB: number;
      };
    }
  | { type: "REMOVE_DOWNLOAD"; payload: string }
  | { type: "UNLOCK_ACHIEVEMENT"; payload: string }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "createdAt">;
    }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "ADD_ACTIVITY"; payload: Omit<ActivityItem, "id" | "timestamp"> }
  | { type: "LOAD_STATE"; payload: ProfileState };

// ======== Helpers ========

const generateId = (): string =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const now = (): string => new Date().toISOString();

// ======== Reducer ========

function profileReducer(
  state: ProfileState,
  action: ProfileAction
): ProfileState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_PROFILE":
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          settings: { ...state.userProfile.settings, ...action.payload },
        },
      };

    case "ADD_XP": {
      const xpGain = action.payload.amount ?? XP_VALUES[action.payload.action];
      const newXP = state.userProfile.xp + xpGain;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > state.userProfile.level;

      let newState: ProfileState = {
        ...state,
        userProfile: { ...state.userProfile, xp: newXP, level: newLevel },
      };

      if (leveledUp) {
        newState = {
          ...newState,
          notifications: [
            

            ...newState.notifications,
          ],
          activityLog: [
            {
              id: generateId(),
              type: "achievement",
              description: `به سطح ${newLevel} رسید`,
              timestamp: now(),
            },
            ...newState.activityLog,
          ],
        };
      }
      return newState;
    }

    case "WATCH_EPISODE": {
      const { anime, episodeNumber } = action.payload;
      const existingIdx = state.watchHistory.findIndex(
        (w) => w.animeId === anime.id
      );
      let newHistory: WatchHistoryItem[];
      const completed = episodeNumber >= anime.totalEpisodes;

      if (existingIdx >= 0) {
        newHistory = [...state.watchHistory];
        const existing = newHistory[existingIdx];
        newHistory[existingIdx] = {
          ...existing,
          episodesWatched: Math.max(existing.episodesWatched, episodeNumber),
          lastWatchedEpisode: episodeNumber,
          lastWatchedAt: now(),
          completed,
          totalWatchTimeMinutes: existing.totalWatchTimeMinutes + 24,
        };
      } else {
        newHistory = [
          {
            animeId: anime.id,
            anime,
            episodesWatched: episodeNumber,
            lastWatchedEpisode: episodeNumber,
            lastWatchedAt: now(),
            completed,
            totalWatchTimeMinutes: 24,
          },
          ...state.watchHistory,
        ];
      }

      const newActivity: ActivityItem = {
        id: generateId(),
        type: completed ? "complete" : "watch",
        description: completed
          ? `${anime.title} رو کامل تماشا کرد`
          : `اپیزود ${episodeNumber} از ${anime.title} رو تماشا کرد`,
        anime,
        timestamp: now(),
        metadata: { episodeNumber },
      };

      return {
        ...state,
        watchHistory: newHistory,
        activityLog: [newActivity, ...state.activityLog],
      };
    }

    case "ADD_TO_WATCHLIST": {
      const anime = action.payload;
      if (state.watchlist.some((w) => w.animeId === anime.id)) return state;
      return {
        ...state,
        watchlist: [
          { animeId: anime.id, anime, addedAt: now(), episodesWatched: 0 },
          ...state.watchlist,
        ],
        activityLog: [
          {
            id: generateId(),
            type: "watchlist",
            description: `${anime.title} رو به لیست تماشا اضافه کرد`,
            anime,
            timestamp: now(),
          },
          ...state.activityLog,
        ],
      };
    }

    case "REMOVE_FROM_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (w) => w.animeId !== action.payload
        ),
      };

    case "ADD_TO_FAVORITES": {
      const anime = action.payload;
      if (state.favorites.some((f) => f.animeId === anime.id)) return state;
      return {
        ...state,
        favorites: [
          { animeId: anime.id, anime, addedAt: now() },
          ...state.favorites,
        ],
        activityLog: [
          {
            id: generateId(),
            type: "favorite",
            description: `${anime.title} رو به علاقه‌مندی‌ها اضافه کرد`,
            anime,
            timestamp: now(),
          },
          ...state.activityLog,
        ],
      };
    }

    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter(
          (f) => f.animeId !== action.payload
        ),
      };

    case "RATE_ANIME": {
      const { anime, score, review } = action.payload;
      const existingIdx = state.ratings.findIndex(
        (r) => r.animeId === anime.id
      );
      let newRatings: RatingItem[];

      if (existingIdx >= 0) {
        newRatings = [...state.ratings];
        newRatings[existingIdx] = {
          ...newRatings[existingIdx],
          score,
          review,
          ratedAt: now(),
        };
      } else {
        newRatings = [
          { animeId: anime.id, anime, score, ratedAt: now(), review },
          ...state.ratings,
        ];
      }

      return {
        ...state,
        ratings: newRatings,
        activityLog: [
          {
            id: generateId(),
            type: "rate",
            description: `به ${anime.title} امتیاز ${score}/۱۰ داد`,
            anime,
            timestamp: now(),
            metadata: { score },
          },
          ...state.activityLog,
        ],
      };
    }

    case "UPDATE_RATING": {
      const { animeId, score, review } = action.payload;
      return {
        ...state,
        ratings: state.ratings.map((r) =>
          r.animeId === animeId ? { ...r, score, review, ratedAt: now() } : r
        ),
      };
    }

    case "ADD_DOWNLOAD": {
      const { anime, episodeNumber, quality, sizeMB } = action.payload;
      const newDownload: DownloadItem = {
        id: generateId(),
        animeId: anime.id,
        anime,
        episodeNumber,
        quality,
        sizeMB,
        status: "completed",
        progress: 100,
        downloadedAt: now(),
      };
      return {
        ...state,
        downloads: [newDownload, ...state.downloads],
        activityLog: [
          {
            id: generateId(),
            type: "download",
            description: `اپیزود ${episodeNumber} از ${anime.title} رو دانلود کرد`,
            anime,
            timestamp: now(),
          },
          ...state.activityLog,
        ],
      };
    }

    case "REMOVE_DOWNLOAD":
      return {
        ...state,
        downloads: state.downloads.filter((d) => d.id !== action.payload),
      };

    case "UNLOCK_ACHIEVEMENT": {
      const achIdx = state.achievements.findIndex(
        (a) => a.id === action.payload
      );
      if (achIdx < 0 || state.achievements[achIdx].unlocked) return state;

      const newAchievements = [...state.achievements];
      newAchievements[achIdx] = {
        ...newAchievements[achIdx],
        unlocked: true,
        unlockedAt: now(),
      };

      return {
        ...state,
        achievements: newAchievements,
        notifications: [

          ...state.notifications,
        ],
        activityLog: [
          {
            id: generateId(),
            type: "achievement",
            description: `نشان "${newAchievements[achIdx].title}" رو کسب کرد`,
            timestamp: now(),
          },
          ...state.activityLog,
        ],
      };
    }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          { ...action.payload, id: generateId(), createdAt: now() },
          ...state.notifications,
        ],
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case "ADD_ACTIVITY":
      return {
        ...state,
        activityLog: [
          { ...action.payload, id: generateId(), timestamp: now() },
          ...state.activityLog,
        ],
      };

    case "LOAD_STATE":
      return action.payload;

    default:
      return state;
  }
}

// ======== Context Type ========

interface ProfileContextType {
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
  watchEpisode: (anime: Anime, episodeNumber: number) => void;
  addToWatchlist: (anime: Anime) => void;
  removeFromWatchlist: (animeId: string) => void;
  addToFavorites: (anime: Anime) => void;
  removeFromFavorites: (animeId: string) => void;
  rateAnime: (anime: Anime, score: number, review?: string) => void;
  updateRating: (animeId: string, score: number, review?: string) => void;
  addDownload: (
    anime: Anime,
    episodeNumber: number,
    quality: "480p" | "720p" | "1080p" | "4K",
    sizeMB: number
  ) => void;
  removeDownload: (id: string) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  updateSettings: (data: Partial<UserSettings>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  computed: {
    totalEpisodesWatched: number;
    totalAnimeWatched: number;
    totalWatchTimeHours: number;
    averageRating: number;
    favoriteGenre: string;
    xpProgress: number;
    xpForNext: number;
    xpForCurrent: number;
    unreadNotifications: number;
    continueWatching: WatchHistoryItem[];
    genreDistribution: Record<string, number>;
  };
}

const ProfileContext = createContext<ProfileContextType | null>(null);

// ======== Achievement Checker ========

function checkAchievements(
  state: ProfileState,
  dispatch: React.Dispatch<ProfileAction>
) {
  const totalEps = state.watchHistory.reduce(
    (sum, w) => sum + w.episodesWatched,
    0
  );
  const completedCount = state.watchHistory.filter((w) => w.completed).length;

  const checks: Array<{ id: string; condition: boolean }> = [
    { id: "first_watch", condition: totalEps >= 1 },
    { id: "ten_episodes", condition: totalEps >= 10 },
    { id: "fifty_episodes", condition: totalEps >= 50 },
    { id: "hundred_episodes", condition: totalEps >= 100 },
    { id: "first_rating", condition: state.ratings.length >= 1 },
    { id: "five_ratings", condition: state.ratings.length >= 5 },
    { id: "ten_favorites", condition: state.favorites.length >= 10 },
    { id: "first_complete", condition: completedCount >= 1 },
    { id: "level_5", condition: state.userProfile.level >= 5 },
    { id: "level_10", condition: state.userProfile.level >= 10 },
  ];

  checks.forEach(({ id, condition }) => {
    const ach = state.achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked && condition) {
      dispatch({ type: "UNLOCK_ACHIEVEMENT", payload: id });
    }
  });
}

// ======== Provider ========

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(profileReducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem("animeProfileState");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed };
      }
    } catch {
      /* ignore */
    }
    return init;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("animeProfileState", JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  React.useEffect(() => {
    checkAchievements(state, dispatch);
  }, [
    state.watchHistory,
    state.ratings,
    state.favorites,
    state.userProfile.level,
  ]);

  const watchEpisode = useCallback(
    (anime: Anime, episodeNumber: number) => {
      dispatch({ type: "WATCH_EPISODE", payload: { anime, episodeNumber } });
      dispatch({ type: "ADD_XP", payload: { action: "watch_episode" } });
      if (episodeNumber >= anime.totalEpisodes) {
        dispatch({ type: "ADD_XP", payload: { action: "complete_anime" } });
      }
    },
    []
  );

  const addToWatchlist = useCallback((anime: Anime) => {
    dispatch({ type: "ADD_TO_WATCHLIST", payload: anime });
    dispatch({ type: "ADD_XP", payload: { action: "add_watchlist" } });
  }, []);

  const removeFromWatchlist = useCallback((animeId: string) => {
    dispatch({ type: "REMOVE_FROM_WATCHLIST", payload: animeId });
  }, []);

  const addToFavorites = useCallback((anime: Anime) => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: anime });
    dispatch({ type: "ADD_XP", payload: { action: "favorite_anime" } });
  }, []);

  const removeFromFavorites = useCallback((animeId: string) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: animeId });
  }, []);

  const rateAnime = useCallback(
    (anime: Anime, score: number, review?: string) => {
      dispatch({ type: "RATE_ANIME", payload: { anime, score, review } });
      dispatch({ type: "ADD_XP", payload: { action: "rate_anime" } });
    },
    []
  );

  const updateRating = useCallback(
    (animeId: string, score: number, review?: string) => {
      dispatch({
        type: "UPDATE_RATING",
        payload: { animeId, score, review },
      });
    },
    []
  );

  const addDownload = useCallback(
    (
      anime: Anime,
      episodeNumber: number,
      quality: "480p" | "720p" | "1080p" | "4K",
      sizeMB: number
    ) => {
      dispatch({
        type: "ADD_DOWNLOAD",
        payload: { anime, episodeNumber, quality, sizeMB },
      });
    },
    []
  );

  const removeDownload = useCallback((id: string) => {
    dispatch({ type: "REMOVE_DOWNLOAD", payload: id });
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    dispatch({ type: "SET_PROFILE", payload: data });
  }, []);

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: data });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" });
  }, []);

  // ======== Computed Values ========

  const computed = useMemo(() => {
    const totalEpisodesWatched = state.watchHistory.reduce(
      (sum, w) => sum + w.episodesWatched,
      0
    );
    const totalAnimeWatched = state.watchHistory.length;    const totalWatchTimeHours = Math.round(
      state.watchHistory.reduce(
        (sum, w) => sum + w.totalWatchTimeMinutes,
        0
      ) / 60
    );
    const averageRating =
      state.ratings.length > 0
        ? Math.round(
            (state.ratings.reduce((sum, r) => sum + r.score, 0) /
              state.ratings.length) *
              10
          ) / 10
        : 0;

    const genreCount: Record<string, number> = {};
    state.watchHistory.forEach((w) => {
      w.anime.genres.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + w.episodesWatched;
      });
    });
    const favoriteGenre =
      Object.entries(genreCount).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";

    const { xp, level } = state.userProfile;
    const xpForCurrent = Math.pow(level, 2) * 100;
    const xpForNext = Math.pow(level + 1, 2) * 100;
    const xpProgress =
      xpForNext - xpForCurrent > 0
        ? ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100
        : 0;

    const unreadNotifications = state.notifications.filter(
      (n) => !n.read
    ).length;

    const continueWatching = state.watchHistory
      .filter((w) => !w.completed)
      .sort(
        (a, b) =>
          new Date(b.lastWatchedAt).getTime() -
          new Date(a.lastWatchedAt).getTime()
      )
      .slice(0, 10);

    return {
      totalEpisodesWatched,
      totalAnimeWatched,
      totalWatchTimeHours,
      averageRating,
      favoriteGenre,
      xpProgress,
      xpForNext,
      xpForCurrent,
      unreadNotifications,
      continueWatching,
      genreDistribution: genreCount,
    };
  }, [state]);

  const value: ProfileContextType = {
    state,
    dispatch,
    watchEpisode,
    addToWatchlist,
    removeFromWatchlist,
    addToFavorites,
    removeFromFavorites,
    rateAnime,
    updateRating,
    addDownload,
    removeDownload,
    updateProfile,
    updateSettings,
    markNotificationRead,
    markAllNotificationsRead,
    computed,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

// ======== useProfile Hook ========

export function useProfile(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}

export default ProfileContext;
