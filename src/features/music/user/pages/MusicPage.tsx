// src/features/music/pages/MusicPage.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Play,
  Music2,
  Star,
  Headphones,
} from "lucide-react";
import { useMusic } from "@/hooks/useMusic";
import type { MusicItem } from "../../../music/user/data/musicData";
import MusicCard from "../components/MusicCard";
import MusicSidebar from "../components/MusicSidebar";
import { useTheme } from "../../../../contexts/ThemeContext";

export default function MusicPage() {
  const { theme } = useTheme();
const isDark = theme === "dark";

  const { tracks, featured, types: allTypes } = useMusic();
  const types = useMemo(() => ["همه", ...allTypes], [allTypes]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("همه");
  const [filteredTracks, setFilteredTracks] = useState<MusicItem[]>([]);

  // ═══ Hero Slider ═══
  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  const goSlide = useCallback(
    (dir: "prev" | "next") => {
      setCurrentSlide((prev) =>
        dir === "next"
          ? (prev + 1) % featured.length
          : (prev - 1 + featured.length) % featured.length
      );
    },
    [featured.length]
  );

  // ═══ فیلتر و جستجو ═══
  useEffect(() => {
    let result = tracks;

    if (activeType !== "همه") {
      result = result.filter((t) => t.type === activeType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.anime.toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    setFilteredTracks(result);
  }, [searchQuery, activeType, tracks]);

  const heroTrack = featured[currentSlide];

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a1a]" : "bg-gray-50"} pt-20`}>
 
      {/* ════════════════ Hero Slider ════════════════ */}
      {featured.length > 0 && heroTrack && (
        <section className="relative h-[420px] sm:h-[480px] overflow-hidden">
          {/* پس‌زمینه */}
          <div className="absolute inset-0">
            <img
              src={heroTrack.coverImage}
              alt=""
              className="w-full h-full object-cover blur-2xl scale-110 opacity-40"
            />
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-t from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent"
                  : "bg-gradient-to-t from-gray-50 via-white/80 to-transparent"
              }`}
            />
          </div>

          {/* محتوا */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center">
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full">
              {/* کاور */}
              <Link
                to={`/music/${heroTrack.id}`}
                className="relative group flex-shrink-0"
              >
                <img
                  src={heroTrack.coverImage}
                  alt={heroTrack.title}
                  className="w-52 h-52 sm:w-64 sm:h-64 rounded-2xl object-cover shadow-2xl shadow-purple-900/30 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-purple-600/90 flex items-center justify-center backdrop-blur-sm">
                    <Play size={28} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <Star size={12} fill="white" /> ویژه
                </span>
              </Link>

              {/* اطلاعات */}
              <div className="flex-1 text-center sm:text-right">
                <p className="text-purple-400 text-sm font-bold mb-2 flex items-center justify-center sm:justify-start gap-1">
                  <Headphones size={14} />
                  {heroTrack.type} • {heroTrack.genre}
                </p>
                <Link to={`/music/${heroTrack.id}`}>
                  <h1
                    className={`text-3xl sm:text-4xl font-black mb-3 hover:text-purple-400 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {heroTrack.title}
                  </h1>
                </Link>
                <p className={`text-lg mb-2 ${isDark ? "text-purple-300" : "text-purple-600"} font-semibold`}>
                  {heroTrack.artist}
                </p>
                <p className={`text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  <Music2 size={14} className="inline ml-1" />
                  {heroTrack.anime}
                </p>
                <p className={`text-sm mt-3 max-w-lg leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {heroTrack.summary}
                </p>

                {/* دات‌های اسلایدر */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-6">
                  {featured.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? "w-8 bg-purple-500"
                          : `w-2 ${isDark ? "bg-gray-700" : "bg-gray-300"} hover:bg-purple-400`
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* دکمه‌های ناوبری */}
            <button
              onClick={() => goSlide("next")}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-black/10 hover:bg-black/20 text-gray-800"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goSlide("prev")}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-black/10 hover:bg-black/20 text-gray-800"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      )}

      {/* ════════════════ فیلتر + لیست ════════════════ */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* نوار جستجو و فیلتر */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          {/* جستجو */}
          <div className="relative flex-1 w-full">
            <Search
              size={18}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی عنوان، هنرمند یا انیمه..."
              className={`w-full pr-10 pl-4 py-3 rounded-xl text-sm outline-none transition-all ${
                isDark
                  ? "bg-purple-900/20 border border-purple-800/30 text-white placeholder:text-gray-600 focus:border-purple-600"
                  : "bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-purple-400"
              }`}
            />
          </div>

          {/* فیلتر نوع */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter
              size={16}
              className={isDark ? "text-gray-500" : "text-gray-400"}
            />
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeType === type
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : isDark
                    ? "bg-purple-900/20 text-gray-400 hover:bg-purple-900/40 border border-purple-800/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* گرید اصلی */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* لیست موزیک‌ها */}
          <div className="flex-1">
            {filteredTracks.length > 0 ? (
              <div className="space-y-4">
                {filteredTracks.map((track) => (
                  <MusicCard key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-20 rounded-2xl ${
                  isDark ? "bg-purple-900/10 border border-purple-800/20" : "bg-white border border-gray-100"
                }`}
              >
                <Music2
                  size={48}
                  className={isDark ? "text-gray-700 mx-auto mb-4" : "text-gray-300 mx-auto mb-4"}
                />
                <p className={`text-lg font-bold ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  موزیکی پیدا نشد!
                </p>
                <p className={`text-sm mt-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  فیلتر یا عبارت جستجو رو تغییر بده
                </p>
              </div>
            )}
          </div>

          {/* سایدبار */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <MusicSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
