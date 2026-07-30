// src/features/music/user/components/MusicCard.tsx
import { Link } from "react-router-dom";
import { Clock, Eye, Heart, Play, Music2, Bookmark, Star, Download } from "lucide-react";
import { type MusicItem } from "../../../music/user/data/musicData";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useMusicUserData } from "../../../../hooks/useMusicUserData";

interface MusicCardProps {
  track: MusicItem;
  onSaveToggle?: (id: string) => void;
}

export default function MusicCard({ track, onSaveToggle }: MusicCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    toggleMusicLike, isMusicLiked,
    toggleMyMusic, isInMyMusic,
    setMusicRating, getMusicRating,
    addMusicDownload,
  } = useMusicUserData();

  const liked = isMusicLiked(track.id);
  const inList = isInMyMusic(track.id);
  const rating = getMusicRating(track.id);

  const payload = {
    id: track.id,
    title: track.title,
    cover: (track as any).coverImage,
    artist: (track as any).artist,
  };

  const stop = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); };
  const onLike = (e: React.MouseEvent) => { stop(e); toggleMusicLike(payload); };
  const onList = (e: React.MouseEvent) => { stop(e); toggleMyMusic(payload); if (onSaveToggle) onSaveToggle(String(track.id)); };
  const onRate = (e: React.MouseEvent) => { stop(e); setMusicRating(payload, rating >= 5 ? 0 : rating + 1); };
  const onDownload = (e: React.MouseEvent) => { stop(e); addMusicDownload({ ...payload, quality: "320kbps" }); };

  return (
    <Link to={`/music/${track.id}`} className="block group">
      <div
        className={`relative flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all duration-300 ${
          isDark
            ? "bg-[#0a0a1e] border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
            : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/10"
        }`}
      >
        {/* کاور */}
        <div className={`relative w-full sm:w-44 h-44 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 ${isDark ? "bg-[#10102a]" : "bg-gray-100"}`}>
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg"
              style={{ background: "var(--accent)", boxShadow: "0 8px 24px var(--accent-glow)" }}
            >
              <Play size={22} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {track.isHot && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold z-10">
              🔥 داغ
            </span>
          )}
          {track.isFeatured && !track.isHot && (
            <span className="absolute top-2 right-2 text-white text-[10px] px-2 py-0.5 rounded-full font-bold z-10" style={{ background: "var(--accent)" }}>
              ⭐ ویژه
            </span>
          )}
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-md backdrop-blur-sm">
            {track.duration}
          </span>
        </div>

        {/* اطلاعات */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className={`text-lg font-black leading-tight transition-colors line-clamp-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                {track.title}
              </h3>

              {/* اکشن‌ها */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={onLike} aria-label="علاقه‌مندی" className={`p-1.5 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                  <Heart size={17} className={liked ? "text-red-500 fill-red-500" : isDark ? "text-gray-500" : "text-gray-400"} />
                </button>
                <button onClick={onRate} aria-label="امتیاز" className={`relative p-1.5 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                  <Star size={17} className={rating > 0 ? "text-yellow-400 fill-yellow-400" : isDark ? "text-gray-500" : "text-gray-400"} />
                  {rating > 0 && <span className="absolute -top-1 -left-1 bg-yellow-400 text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">{rating}</span>}
                </button>
                <button onClick={onDownload} aria-label="دانلود" className={`p-1.5 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                  <Download size={17} className={isDark ? "text-gray-500" : "text-gray-400"} />
                </button>
                <button onClick={onList} aria-label="لیست من" className={`p-1.5 rounded-full transition-colors ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                  <Bookmark size={17} className={inList ? "text-purple-400 fill-purple-400" : isDark ? "text-gray-500" : "text-gray-400"} />
                </button>
              </div>
            </div>
            <p className="text-sm mb-1.5 font-medium" style={{ color: "var(--accent)" }}>
              {track.artist}
            </p>
            <p className={`text-xs mb-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              <Music2 size={12} className="inline ml-1" />
              {track.anime}
            </p>
            <p className={`text-sm line-clamp-2 leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {track.summary}
            </p>
          </div>

          {/* متادیتا */}
          <div className={`flex items-center justify-between mt-3 pt-2 border-t border-dashed ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="flex items-center gap-3 text-xs">
              <span className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                <Eye size={13} /> {track.views.toLocaleString("fa-IR")}
              </span>
              <span className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                <Heart size={13} /> {track.likes.toLocaleString("fa-IR")}
              </span>
              <span className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                <Clock size={13} /> {track.duration}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: "color-mix(in srgb, var(--accent) 18%, transparent)", color: "var(--accent)" }}>
                {track.type}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isDark ? "bg-pink-900/50 text-pink-300" : "bg-pink-100 text-pink-700"}`}>
                {track.genre}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
