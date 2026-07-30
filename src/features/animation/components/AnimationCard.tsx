import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Calendar, Clock, Heart, Bookmark, Download } from "lucide-react";
import type { Animation } from "@/data/animationData";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAnimationUserData } from "../../../hooks/useAnimationUserData";

interface AnimationCardProps {
  item: Animation;
}

export default function AnimationCard({ item }: AnimationCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showActions, setShowActions] = useState(false);

  const {
    toggleAnimationLike,
    isAnimationLiked,
    toggleAnimationWatchlist,
    isAnimationInWatchlist,
    setAnimationRating,
    getAnimationRating,
    addAnimationDownload,
  } = useAnimationUserData();

  const fallback = isDark
    ? "https://placehold.co/600x900/0a0a1e/a855f7?text=Animation"
    : "https://placehold.co/600x900/f3f0ff/7c3aed?text=Animation";

  const liked = isAnimationLiked(item.id);
  const inWatchlist = isAnimationInWatchlist(item.id);
  const rating = getAnimationRating(item.id);

  const payload = {
    id: item.id,
    title: item.title,
    poster: item.poster,
    year: (item as any).year,
    duration: (item as any).duration,
  };

  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };

  const onLike = (e: React.MouseEvent) => { stop(e); toggleAnimationLike(payload); };
  const onWatchlist = (e: React.MouseEvent) => { stop(e); toggleAnimationWatchlist(payload); };
  const onRate = (e: React.MouseEvent) => { stop(e); setAnimationRating(payload, rating >= 5 ? 0 : rating + 1); };
  const onDownload = (e: React.MouseEvent) => { stop(e); addAnimationDownload({ ...payload, quality: "1080p" }); };

  return (
    <Link
      to={`/animation/${item.id}`}
      aria-label={item.title}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
      className={`group block relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        isDark
          ? "bg-[#0a0a1e] border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
          : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10"
      }`}
    >
      {/* Poster */}
      <div className={`relative aspect-[2/3] overflow-hidden ${isDark ? "bg-[#10102a]" : "bg-gray-100"}`}>
        <img
          src={item.poster}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.currentTarget.src = fallback; }}
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isDark ? "from-black/70 via-black/15" : "from-black/30 via-black/5"
          }`}
        />

        {/* status badge */}
        {(item.isNew || item.isTrending) && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm text-white z-10 ${
              item.isNew ? "bg-emerald-500/85" : "bg-purple-600/85"
            }`}
          >
            {item.isNew ? "جدید" : "پرطرفدار"}
          </span>
        )}

        {/* rating badge (top-left, below status if present) */}
        <span className={`absolute left-2 flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg text-amber-300 bg-black/60 backdrop-blur-sm z-10 ${(item.isNew || item.isTrending) ? "top-11" : "top-2"}`}>
          <Star size={11} className="fill-amber-400 text-amber-400" />
          {item.rating}
        </span>

        {/* action buttons (hover) — right side */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 z-20 ${
            showActions ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <button onClick={onLike} aria-label="علاقه‌مندی"
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 ${liked ? "bg-red-500 shadow-lg shadow-red-500/30" : "bg-black/50 hover:bg-red-500/80"}`}>
            <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
          </button>
          <button onClick={onWatchlist} aria-label="لیست تماشا"
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 ${inWatchlist ? "bg-purple-500 shadow-lg shadow-purple-500/30" : "bg-black/50 hover:bg-purple-500/80"}`}>
            <Bookmark className={`w-4 h-4 ${inWatchlist ? "fill-white" : ""}`} />
          </button>
          <button onClick={onRate} aria-label="امتیاز"
            className={`relative w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 ${rating > 0 ? "bg-yellow-500 shadow-lg shadow-yellow-500/30" : "bg-black/50 hover:bg-yellow-400/80"}`}>
            <Star className={`w-4 h-4 ${rating > 0 ? "fill-white" : ""}`} />
            {rating > 0 && (
              <span className="absolute -bottom-1 -left-1 bg-white text-yellow-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">{rating}</span>
            )}
          </button>
          <button onClick={onDownload} aria-label="دانلود"
            className="w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm bg-black/50 text-white hover:bg-green-500/80 hover:scale-110 transition-all duration-200">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
          {item.title}
        </h3>
        <div className={`mt-1.5 flex items-center gap-3 text-[11px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          <span className="flex items-center gap-1">
            <Calendar size={11} /> {item.year}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {item.duration}
          </span>
        </div>
      </div>
    </Link>
  );
}
