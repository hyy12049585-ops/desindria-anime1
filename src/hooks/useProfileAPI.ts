// src/hooks/useProfileAPI.ts
import { useState, useCallback } from "react";
import type {
  UserProfile,
  UserSettings,
  AnimeItem,
  ContinueItem,
  FavoriteItem,
  RatingItem,
  DownloadItem,
  SessionInfo,
} from "../types/profile";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApiCall<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(`${API_BASE}${url}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          ...options,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.message || `خطای سرور: ${res.status}`
          );
        }

        const data = (await res.json()) as T;
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "خطای ناشناخته";
        setState({ data: null, loading: false, error: message });
        return null;
      }
    },
    []
  );

  return { ...state, execute };
}

export function useProfileAPI() {
  const profileApi = useApiCall<UserProfile>();
  const settingsApi = useApiCall<UserSettings>();
  const watchlistApi = useApiCall<AnimeItem[]>();
  const continueApi = useApiCall<ContinueItem[]>();
  const favoritesApi = useApiCall<FavoriteItem[]>();
  const ratingsApi = useApiCall<RatingItem[]>();
  const downloadsApi = useApiCall<DownloadItem[]>();
  const sessionsApi = useApiCall<SessionInfo[]>();

  // Profile
  const fetchProfile = useCallback(
    () => profileApi.execute("/profile"),
    [profileApi]
  );

  const updateProfile = useCallback(
    (data: Partial<UserProfile>) =>
      profileApi.execute("/profile", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    [profileApi]
  );

  // Settings
  const fetchSettings = useCallback(
    () => settingsApi.execute("/profile/settings"),
    [settingsApi]
  );

  const updateSettings = useCallback(
    (data: Partial<UserSettings>) =>
      settingsApi.execute("/profile/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    [settingsApi]
  );

  // Watchlist
  const fetchWatchlist = useCallback(
    () => watchlistApi.execute("/profile/watchlist"),
    [watchlistApi]
  );

  // Continue watching
  const fetchContinue = useCallback(
    () => continueApi.execute("/profile/continue"),
    [continueApi]
  );

  // Favorites
  const fetchFavorites = useCallback(
    () => favoritesApi.execute("/profile/favorites"),
    [favoritesApi]
  );

  const removeFavorite = useCallback(
    (id: number) =>
      favoritesApi.execute(`/profile/favorites/${id}`, { method: "DELETE" }),
    [favoritesApi]
  );

  // Ratings
  const fetchRatings = useCallback(
    () => ratingsApi.execute("/profile/ratings"),
    [ratingsApi]
  );

  // Downloads
  const fetchDownloads = useCallback(
    () => downloadsApi.execute("/profile/downloads"),
    [downloadsApi]
  );

  // Security / Sessions
  const fetchSessions = useCallback(
    () => sessionsApi.execute("/profile/sessions"),
    [sessionsApi]
  );

  const revokeSession = useCallback(
    (sessionId: string) =>
      sessionsApi.execute(`/profile/sessions/${sessionId}`, {
        method: "DELETE",
      }),
    [sessionsApi]
  );

  const revokeAllSessions = useCallback(
    () =>
      sessionsApi.execute("/profile/sessions/revoke-all", {
        method: "POST",
      }),
    [sessionsApi]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const api = useApiCall<{ message: string }>();
      return api.execute("/profile/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },
    []
  );

  const toggle2FA = useCallback(
    async (enable: boolean, code?: string) => {
      const api = useApiCall<{ qrCode?: string; message: string }>();
      return api.execute("/profile/2fa", {
        method: "POST",
        body: JSON.stringify({ enable, code }),
      });
    },
    []
  );

  const deleteAccount = useCallback(
    async (password: string, reason?: string) => {
      const api = useApiCall<{ message: string }>();
      return api.execute("/profile/delete-account", {
        method: "DELETE",
        body: JSON.stringify({ password, reason }),
      });
    },
    []
  );

  return {
    // Profile
    profile: profileApi,
    fetchProfile,
    updateProfile,
    // Settings
    settings: settingsApi,
    fetchSettings,
    updateSettings,
    // Data
    watchlist: watchlistApi,
    fetchWatchlist,
    continueWatching: continueApi,
    fetchContinue,
    favorites: favoritesApi,
    fetchFavorites,
    removeFavorite,
    ratings: ratingsApi,
    fetchRatings,
    downloads: downloadsApi,
    fetchDownloads,
    // Security
    sessions: sessionsApi,
    fetchSessions,
    revokeSession,
    revokeAllSessions,
    changePassword,
    toggle2FA,
    deleteAccount,
  };
}
