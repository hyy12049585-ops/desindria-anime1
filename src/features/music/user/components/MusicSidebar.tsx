// src/features/music/user/components/MusicSidebar.tsx
import { Link } from "react-router-dom";
import { Flame, Music2, Tag, Eye, Heart } from "lucide-react";
import { type MusicItem } from "../../../music/user/data/musicData";
import { useMusic } from "../../../../hooks/useMusic";
import { useTheme } from "../../../../contexts/ThemeContext";

interface MusicSidebarProps {
  hotTracks?: MusicItem[];
}

export default function MusicSidebar({ hotTracks }: MusicSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { hot: hotAll, genres, tags: allTags } = useMusic();
  const hot = hotTracks || hotAll.slice(0, 5);
  const tags = allTags.slice(0, 15);

  const panel = isDark
    ? "bg-[#0a0a1e] border border-cyan-500/15"
    : "bg-white border border-gray-200 shadow-sm";

  return (
    <aside className="space-y-6">
      {/* ═══ ترندهای موزیک ═══ */}
      <div className={`rounded-2xl p-5 ${panel}`}>
        <h3 className={`flex items-center gap-2 text-lg font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          <Flame size={20} className="text-orange-500" />
          ترندهای موزیک
        </h3>

        <div className="space-y-3">
          {hot.map((track: MusicItem, idx: number) => (
            <Link
              key={track.id}
              to={`/music/${track.id}`}
              className={`flex items-center gap-3 p-2 rounded-xl transition-colors group ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${
                  idx < 3
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                    : isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600"
                }`}
              >
                {idx + 1}
              </span>

              <img src={track.coverImage} alt={track.title} loading="lazy" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>{track.title}</p>
                <p className={`text-xs truncate ${isDark ? "text-gray-500" : "text-gray-500"}`}>{track.artist}</p>
              </div>

              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className={`flex items-center gap-1 text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  <Eye size={10} />
                  {track.views >= 1000000 ? `${(track.views / 1000000).toFixed(1)}M` : track.views >= 1000 ? `${(track.views / 1000).toFixed(0)}K` : track.views}
                </span>
                <span className={`flex items-center gap-1 text-[10px] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  <Heart size={10} />
                  {track.likes >= 1000 ? `${(track.likes / 1000).toFixed(0)}K` : track.likes}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══ ژانرها ═══ */}
      <div className={`rounded-2xl p-5 ${panel}`}>
        <h3 className={`flex items-center gap-2 text-lg font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          <Music2 size={20} style={{ color: "var(--accent)" }} />
          ژانرها
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre: string) => (
            <span
              key={genre}
              className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                color: "var(--accent)",
                border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
              }}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ تگ‌ها ═══ */}
      <div className={`rounded-2xl p-5 ${panel}`}>
        <h3 className={`flex items-center gap-2 text-lg font-black mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          <Tag size={20} className="text-blue-500" />
          تگ‌های پرکاربرد
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all hover:scale-105 ${
                isDark ? "bg-blue-900/25 text-blue-300 hover:bg-blue-800/40 border border-blue-800/30" : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
