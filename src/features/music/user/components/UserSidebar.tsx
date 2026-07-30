import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Bookmark,
  Heart,
  Music2,
  History,
  Star,
} from "lucide-react";
import { useTheme } from"../../../../contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function UserSidebar() {
const { theme } = useTheme();
const isDark = theme === "dark";

  const location = useLocation();

  const [musicBookmarks, setMusicBookmarks] = useState<number>(0);
  const [musicLikes, setMusicLikes] = useState<number>(0);
  const [musicHistory, setMusicHistory] = useState<number>(0);

  /* ---- لود آمار از localStorage ---- */
  useEffect(() => {
    const bookmarks = JSON.parse(
      localStorage.getItem("user_music_bookmarks") || "[]"
    );
    setMusicBookmarks(bookmarks.length);

    let likeCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("music_") && key.endsWith("_liked")) {
        if (localStorage.getItem(key) === "true") likeCount++;
      }
    }
    setMusicLikes(likeCount);

    const history = JSON.parse(
      localStorage.getItem("user_music_history") || "[]"
    );
    setMusicHistory(history.length);
  }, []);

  const navItems = [
    {
      title: "داشبورد",
      url: "/user",
      icon: <Home size={18} />,
    },
    {
      title: "پروفایل",
      url: "/user/profile",
      icon: <User size={18} />,
    },
    {
      title: "بوکمارک‌ها",
      url: "/user/bookmarks",
      icon: <Bookmark size={18} />,
    },
    {
      title: "علاقه‌مندی‌ها",
      url: "/user/likes",
      icon: <Heart size={18} />,
    },

    /* --- گزینه جدید موزیک‌های من --- */
    {
      title: "موزیک‌های من",
      url: "/user/music",
      icon: <Music2 size={18} />,
      badge:
        musicBookmarks > 0
          ? musicBookmarks
          : musicLikes > 0
          ? musicLikes
          : musicHistory,
      badgeColor: "purple",
    },
  ];

  return (
    <aside
      className={`w-full sm:w-64 border-l p-5 h-full ${
        isDark
          ? "bg-[#0b0b20] border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;

          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex justify-between items-center px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? isDark
                    ? "bg-purple-700 text-white shadow-md"
                    : "bg-purple-100 text-purple-700 shadow-sm"
                  : isDark
                  ? "text-gray-400 hover:bg-gray-900 hover:text-gray-200"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.title}
              </span>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    item.badgeColor === "purple"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {item.badge.toLocaleString("fa-IR")}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
