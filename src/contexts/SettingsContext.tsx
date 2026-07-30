// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { UserSettings } from "../types";
import { useAuth } from "./AuthContext";

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  accentColor: "#8B5CF6",
  language: "fa",
  autoplay: true,
  defaultQuality: "1080p",
  notifications: true,
  publicProfile: true,
  showActivity: true,
  subtitleSize: "medium",
  dubbed: false,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `desindria_settings_${user.id}` : "desindria_settings_guest";

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // وقتی کاربر عوض شد، تنظیماتش رو لود کن
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setSettings(saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS);
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, [storageKey]);

  // ذخیره تنظیمات
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));

    // اعمال تم
    const root = document.documentElement;
    if (settings.theme === "dark") {
      root.classList.add("dark");
    } else if (settings.theme === "light") {
      root.classList.remove("dark");
    } else {
      // auto
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }, [settings, storageKey]);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
