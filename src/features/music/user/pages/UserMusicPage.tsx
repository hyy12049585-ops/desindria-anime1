// src/features/user/pages/UserMusicPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Music2,
  Bookmark,
  Heart,
  Clock,
  Eye,
  Play,
  Trash2,
  Search,
  Filter,
  Star,
  ChevronDown,
  LayoutGrid,
  List,
  Calendar,
} from "lucide-react";
import { getTrackById, type MusicItem } from "../../../music/user/data/musicData";
import { useTheme } from "../../../../contexts/ThemeContext";

/* ─── تایپ‌ها ─── */
type TabType = "bookmarks" | "likes" | "history" | "rated";

interface HistoryItem {
  trackId: string;
  playedAt: string;
  progress: number;
}

interface RatedItem {
  trackId: string;
  rating: number;
}

export default function UserMusicPage() {
  const { theme } = useTheme();
const isDark = theme === "dark";


  const [activeTab, setActiveTab] = useState<TabType>("bookmarks");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [bookmarkedTracks, setBookmarkedTracks] = useState<MusicItem[]>([]);
  const [likedTracks, setLikedTracks] = useState<MusicItem[]>([]);
  const [historyItems, setHistoryItems] = useState<
    (HistoryItem & { track: MusicItem })[]
  >([]);
  const [ratedItems, setRatedItems] = useState<
    (RatedItem & { track: MusicItem })[]
  >([]);

  /* ─── لود از localStorage ─── */
  useEffect(() => {
    loadBookmarks();
    loadLikes();
    loadHistory();
    loadRated();
  }, []);

  const loadBookmarks = () => {
    const savedIds: string[] = JSON.parse(
      localStorage.getItem("user_music_bookmarks") || "[]"
    );
    const tracks = savedIds
      .map((id) => getTrackById(id))
      .filter(Boolean) as MusicItem[];
    setBookmarkedTracks(tracks);
  };

  const loadLikes = () => {
    const likedIds: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("music_") && key.endsWith("_liked")) {
        if (localStorage.getItem(key) === "true") {
          const id = key.replace("music_", "").replace("_liked", "");
          likedIds.push(id);
        }
      }
    }
    const tracks = likedIds
      .map((id) => getTrackById(id))
      .filter(Boolean) as MusicItem[];
    setLikedTracks(tracks);
  };

  const loadHistory = () => {
    const saved: HistoryItem[] = JSON.parse(
      localStorage.getItem("user_music_history") || "[]"
    );
    const items = saved
      .map((item) => {
        const track = getTrackById(item.trackId);
        if (!track) return null;
        return { ...item, track };
      })
      .filter(Boolean) as (HistoryItem & { track: MusicItem })[];
    setHistoryItems(items);
  };

  const loadRated = () => {
    const ratedList: RatedItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("music_") && key.endsWith("_rating")) {
        const val = localStorage.getItem(key);
        if (val && Number(val) > 0) {
          const id = key.replace("music_", "").replace("_rating", "");
          ratedList.push({ trackId: id, rating: Number(val) });
        }
      }
    }
    const items = ratedList
      .map((item) => {
        const track = getTrackById(item.trackId);
        if (!track) return null;
        return { ...item, track };
      })
      .filter(Boolean) as (RatedItem & { track: MusicItem })[];
    setRatedItems(items);
  };

  /* ─── حذف ─── */
  const removeBookmark = (trackId: string) => {
    const savedIds: string[] = JSON.parse(
      localStorage.getItem("user_music_bookmarks") || "[]"
    );
    const filtered = savedIds.filter((id) => id !== trackId);
    localStorage.setItem("user_music_bookmarks", JSON.stringify(filtered));
    localStorage.removeItem(`music_${trackId}_bookmarked`);
    setBookmarkedTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const removeLike = (trackId: string) => {
    localStorage.setItem(`music_${trackId}_liked`, "false");
    setLikedTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const removeHistory = (trackId: string) => {
    const saved: HistoryItem[] = JSON.parse(
      localStorage.getItem("user_music_history") || "[]"
    );
    const filtered = saved.filter((item) => item.trackId !== trackId);
    localStorage.setItem("user_music_history", JSON.stringify(filtered));
    setHistoryItems((prev) => prev.filter((item) => item.trackId !== trackId));
  };

  const clearAllHistory = () => {
    localStorage.removeItem("user_music_history");
    setHistoryItems([]);
  };

  /* ─── فیلتر و سورت ─── */
  const filterAndSort = (tracks: MusicItem[]) => {
    let result = [...tracks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.anime.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "oldest":
        result.reverse();
        break;
      case "newest":
      default:
        break;
    }

    return result;
  };

  const getCurrentTracks = (): MusicItem[] => {
    switch (activeTab) {
      case "bookmarks":
        return filterAndSort(bookmarkedTracks);
      case "likes":
        return filterAndSort(likedTracks);
      case "history":
        return filterAndSort(historyItems.map((h) => h.track));
      case "rated":
        return filterAndSort(ratedItems.map((r) => r.track));
      default:
        return [];
    }
  };

  const currentTracks = getCurrentTracks();

  const tabs: {
    key: TabType;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      key: "bookmarks",
      label: "بوکمارک‌ها",
      icon: <Bookmark size={16} />,
      count: bookmarkedTracks.length,
    },
    {
      key: "likes",
      label: "لایک‌شده‌ها",
      icon: <Heart size={16} />,
      count: likedTracks.length,
    },
    {
      key: "history",
      label: "تاریخچه پخش",
      icon: <Clock size={16} />,
      count: historyItems.length,
    },
    {
      key: "rated",
      label: "امتیازداده‌ها",
      icon: <Star size={16} />,
      count: ratedItems.length,
    },
  ];

  const handleRemove = (trackId: string) => {
    switch (activeTab) {
      case "bookmarks":
        removeBookmark(trackId);
        break;
      case "likes":
        removeLike(trackId);
        break;
      case "history":
        removeHistory(trackId);
        break;
    }
  };

  /* ═══════════════════ رندر ═══════════════════ */
  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a1a]" : "bg-gray-50"} pt-20`}>

      {/* ═══ هدر ═══ */}
      <div
        className={`border-b ${
          isDark
            ? "border-purple-900/30 bg-[#0d0d20]"
            : "border-gray-200 bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                isDark
                  ? "bg-purple-900/30 text-purple-400"
                  : "bg-purple-100 text-purple-600"
              }`}
            >
              <Music2 size={24} />
            </div>
            <div>
              <h1
                className={`text-2xl font-black ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                موزیک‌های من
              </h1>
              <p
                className={`text-sm mt-0.5 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                مدیریت آهنگ‌های ذخیره‌شده، لایک‌شده و تاریخچه پخش
              </p>
            </div>
          </div>

          {/* آمار کلی */}
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              {
                label: "بوکمارک",
                count: bookmarkedTracks.length,
                icon: <Bookmark size={14} />,
                color: "purple",
              },
              {
                label: "لایک",
                count: likedTracks.length,
                icon: <Heart size={14} />,
                color: "pink",
              },
              {
                label: "پخش شده",
                count: historyItems.length,
                icon: <Play size={14} />,
                color: "blue",
              },
              {
                label: "امتیاز داده",
                count: ratedItems.length,
                icon: <Star size={14} />,
                color: "yellow",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
                  isDark
                    ? "bg-gray-900/50 border border-gray-800/50"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <span
                  className={
                    stat.color === "purple"
                      ? "text-purple-400"
                      : stat.color === "pink"
                      ? "text-pink-400"
                      : stat.color === "blue"
                      ? "text-blue-400"
                      : "text-yellow-400"
                  }
                >
                  {stat.icon}
                </span>
                <span
                  className={`font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {stat.count.toLocaleString("fa-IR")}
                </span>
                <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ═══ تب‌ها ═══ */}
        <div
          className={`flex flex-wrap gap-2 p-1.5 rounded-2xl mb-6 ${
            isDark ? "bg-gray-900/60" : "bg-gray-100"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? isDark
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "bg-white text-purple-700 shadow-md"
                  : isDark
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-500"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ═══ نوار ابزار ═══ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          {/* جستجو */}
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="جستجو در موزیک‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pr-10 pl-4 py-2.5 rounded-xl text-sm outline-none transition-all ${
                isDark
                  ? "bg-gray-900/60 border border-purple-800/30 text-white placeholder:text-gray-600 focus:border-purple-600"
                  : "bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* مرتب‌سازی */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-gray-900/60 border border-purple-800/30 text-gray-300 hover:bg-gray-800"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter size={14} />
                {sortBy === "newest"
                  ? "جدیدترین"
                  : sortBy === "oldest"
                  ? "قدیمی‌ترین"
                  : "نام"}
                <ChevronDown size={14} />
              </button>

              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div
                    className={`absolute top-full left-0 mt-1 w-36 rounded-xl shadow-xl z-20 overflow-hidden ${
                      isDark
                        ? "bg-gray-900 border border-purple-800/40"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {(
                      [
                        { key: "newest", label: "جدیدترین" },
                        { key: "oldest", label: "قدیمی‌ترین" },
                        { key: "name", label: "نام" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setSortBy(option.key);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-right px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.key
                            ? isDark
                              ? "bg-purple-900/30 text-purple-300"
                              : "bg-purple-50 text-purple-700"
                            : isDark
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* حالت نمایش */}
            <div
              className={`flex items-center rounded-xl overflow-hidden ${
                isDark
                  ? "bg-gray-900/60 border border-purple-800/30"
                  : "bg-white border border-gray-200"
              }`}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid"
                    ? isDark
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                    : isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${
                  viewMode === "list"
                    ? isDark
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                    : isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List size={16} />
              </button>
            </div>

            {/* پاک کردن تاریخچه */}
            {activeTab === "history" && historyItems.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
                پاک کردن همه
              </button>
            )}
          </div>
        </div>

        {/* ═══ حالت خالی ═══ */}
        {currentTracks.length === 0 && (
          <div
            className={`text-center py-20 rounded-2xl ${
              isDark
                ? "bg-gray-900/30 border border-purple-800/20"
                : "bg-white border border-gray-100"
            }`}
          >
            <Music2
              size={56}
              className={`mx-auto mb-4 ${
                isDark ? "text-gray-700" : "text-gray-300"
              }`}
            />
            <p
              className={`text-lg font-bold mb-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {searchQuery
                ? "نتیجه‌ای یافت نشد!"
                : activeTab === "bookmarks"
                ? "هنوز آهنگی بوکمارک نکردی"
                : activeTab === "likes"
                ? "هنوز آهنگی لایک نکردی"
                : activeTab === "history"
                ? "تاریخچه پخش خالیه"
                : "هنوز به آهنگی امتیاز ندادی"}
            </p>
            <p
              className={`text-sm mb-5 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              از بخش موزیک آهنگ‌های مورد علاقه‌ات رو پیدا کن!
            </p>
            <Link
              to="/music"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors"
            >
              <Music2 size={16} />
              رفتن به بخش موزیک
            </Link>
          </div>
        )}

        {/* ═══ نمایش گرید ═══ */}
        {currentTracks.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentTracks.map((track) => {
              const rating = ratedItems.find(
                (r) => r.trackId === track.id
              )?.rating;
              const histItem = historyItems.find(
                (h) => h.trackId === track.id
              );

              return (
                <div
                  key={track.id}
                  className={`group rounded-2xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl ${
                    isDark
                      ? "bg-gray-900/50 border border-purple-800/20 hover:border-purple-600/40"
                      : "bg-white border border-gray-100 hover:border-purple-300 shadow-sm"
                  }`}
                >
                  {/* کاور */}
                  <div className="relative aspect-square overflow-hidden">
                    <Link to={`/music/${track.id}`}>
                      <img
                        src={track.coverImage}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                               <div className="w-12 h-12 rounded-full bg-purple-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                          <Play size={20} className="text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </Link>

                    {/* بج‌ها */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {track.isFeatured && (
                        <span className="bg-purple-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                          ⭐ ویژه
                        </span>
                      )}
                      {track.isHot && (
                        <span className="bg-orange-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                          🔥 داغ
                        </span>
                      )}
                    </div>

                    {/* مدت زمان */}
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                      {track.duration}
                    </span>

                    {/* پروگرس تاریخچه */}
                    {activeTab === "history" && histItem && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${histItem.progress}%` }}
                        />
                      </div>
                    )}

                    {/* دکمه حذف */}
                    {activeTab !== "rated" && (
                      <button
                        onClick={() => handleRemove(track.id)}
                        className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/50 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                        title="حذف"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  {/* اطلاعات */}
                  <div className="p-3">
                    <Link to={`/music/${track.id}`}>
                      <h3
                        className={`text-sm font-bold truncate hover:text-purple-400 transition-colors ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {track.title}
                      </h3>
                    </Link>

                    <p
                      className={`text-xs mt-1 truncate ${
                        isDark ? "text-purple-300" : "text-purple-600"
                      }`}
                    >
                      {track.artist}
                    </p>

                    <p
                      className={`text-[11px] mt-0.5 truncate ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {track.anime}
                    </p>

                    {/* آمار */}
                    <div
                      className={`flex items-center justify-between mt-3 pt-2 border-t text-[11px] ${
                        isDark
                          ? "border-gray-800 text-gray-500"
                          : "border-gray-100 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye size={11} />
                          {track.views.toLocaleString("fa-IR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={11} />
                          {track.likes.toLocaleString("fa-IR")}
                        </span>
                      </div>

                      {/* امتیاز (در تب rated) */}
                      {activeTab === "rated" && rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={
                                s <= rating
                                  ? "text-yellow-400"
                                  : isDark
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              }
                              fill={s <= rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      )}

                      {/* تاریخ پخش */}
                      {activeTab === "history" && histItem && (
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {histItem.playedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ نمایش لیست ═══ */}
        {currentTracks.length > 0 && viewMode === "list" && (
          <div
            className={`rounded-2xl overflow-hidden ${
              isDark
                ? "bg-gray-900/30 border border-purple-800/20"
                : "bg-white border border-gray-100 shadow-sm"
            }`}
          >
            {currentTracks.map((track, index) => {
              const rating = ratedItems.find(
                (r) => r.trackId === track.id
              )?.rating;
              const histItem = historyItems.find(
                (h) => h.trackId === track.id
              );

              return (
                <div
                  key={track.id}
                  className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
                    isDark
                      ? "hover:bg-purple-900/10 border-b border-gray-800/50"
                      : "hover:bg-purple-50/50 border-b border-gray-50"
                  } ${index === currentTracks.length - 1 ? "border-b-0" : ""}`}
                >
                  {/* شماره */}
                  <span
                    className={`w-6 text-center text-sm font-bold flex-shrink-0 ${
                      isDark ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>

                  {/* کاور */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <Link to={`/music/${track.id}`}>
                      <img
                        src={track.coverImage}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Play
                          size={16}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="white"
                        />
                      </div>
                    </Link>

                    {activeTab === "history" && histItem && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${histItem.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* اطلاعات اصلی */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link to={`/music/${track.id}`}>
                        <h3
                          className={`text-sm font-bold truncate hover:text-purple-400 transition-colors ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {track.title}
                        </h3>
                      </Link>

                      {track.isFeatured && (
                        <span className="bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                          ⭐
                        </span>
                      )}
                      {track.isHot && (
                        <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                          🔥
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-xs ${
                          isDark ? "text-purple-300" : "text-purple-600"
                        }`}
                      >
                        {track.artist}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isDark ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        •
                      </span>
                      <span
                        className={`text-[11px] truncate ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {track.anime}
                      </span>
                    </div>
                  </div>

                  {/* آمار وسط */}
                  <div
                    className={`hidden md:flex items-center gap-4 text-[11px] flex-shrink-0 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Eye size={12} />
                      {track.views.toLocaleString("fa-IR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {track.likes.toLocaleString("fa-IR")}
                    </span>
                  </div>

                  {/* مدت زمان */}
                  <span
                    className={`text-xs font-mono flex-shrink-0 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {track.duration}
                  </span>

                  {/* امتیاز (در تب rated) */}
                  {activeTab === "rated" && rating && (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={
                            s <= rating
                              ? "text-yellow-400"
                              : isDark
                              ? "text-gray-700"
                              : "text-gray-300"
                          }
                          fill={s <= rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  )}

                  {/* تاریخ پخش (در تب history) */}
                  {activeTab === "history" && histItem && (
                    <span
                      className={`hidden sm:flex items-center gap-1 text-[10px] flex-shrink-0 ${
                        isDark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      <Calendar size={10} />
                      {histItem.playedAt}
                    </span>
                  )}

                  {/* دکمه حذف */}
                  {activeTab !== "rated" && (
                    <button
                      onClick={() => handleRemove(track.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all ${
                        isDark
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-red-400 hover:bg-red-50"
                      }`}
                      title="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
