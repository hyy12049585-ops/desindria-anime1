import { useMemo } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useMusic } from "../../../../hooks/useMusic";
import {
  BarChart3,
  Clock,
  Music2,
  TrendingUp,
  Headphones,
  Calendar,
} from "lucide-react";

interface PlayRecord {
  trackId: string;
  playedAt: string;
  duration?: number;
}

// تبدیل duration رشته‌ای مثل "3:45" به ثانیه
function parseDuration(duration: string | number | undefined): number {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

export default function ListeningStats() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { tracks } = useMusic();

  const stats = useMemo(() => {
    const byId = new Map<string, typeof tracks[number]>();
    tracks.forEach((t) => byId.set(String(t.id), t));
    const getMusicById = (id: string) => byId.get(String(id));

    let history: PlayRecord[] = [];
    try {
      history = JSON.parse(localStorage.getItem("music_play_history") || "[]");
    } catch {
      history = [];
    }

    if (history.length === 0) return null;

    const totalPlays = history.length;
    const uniqueTracks = new Set(history.map((h) => h.trackId)).size;

    const counts: Record<string, number> = {};
    history.forEach((h) => {
      counts[h.trackId] = (counts[h.trackId] || 0) + 1;
    });

    const topTracksEntries = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topTracks = topTracksEntries.map(([id, count]) => {
      const track = getMusicById(id);
      return {
        id,
        title: track?.title || "نامشخص",
        artist: track?.artist || "نامشخص",
        cover: track?.coverImage || "",
        count,
      };
    });

    const artistCounts: Record<string, number> = {};
    history.forEach((h) => {
      const track = getMusicById(h.trackId);
      if (track?.artist) {
        artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
      }
    });

    const topArtists = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const genreCounts: Record<string, number> = {};
    history.forEach((h) => {
      const track = getMusicById(h.trackId);
      if (track?.genre) {
        genreCounts[track.genre] = (genreCounts[track.genre] || 0) + 1;
      }
    });

    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    let totalSeconds = 0;
    history.forEach((h) => {
      const track = getMusicById(h.trackId);
      if (track?.duration) {
        totalSeconds += parseDuration(track.duration);
      }
    });
    const totalMinutes = Math.round(totalSeconds / 60);

    const now = Date.now();
    const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
    const dailyCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
    history.forEach((h) => {
      const date = new Date(h.playedAt);
      const daysAgo = Math.floor((now - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < 7 && daysAgo >= 0) {
        dailyCounts[6 - daysAgo]++;
      }
    });

    const maxDaily = Math.max(...dailyCounts, 1);

    return {
      totalPlays,
      uniqueTracks,
      totalMinutes,
      topTracks,
      topArtists,
      topGenres,
      dailyCounts,
      maxDaily,
      weekDays,
    };
  }, [tracks]);

  if (!stats) {
    return (
      <div
        className={`text-center py-12 rounded-2xl border ${
          isDark
            ? "bg-gray-900/50 border-gray-800"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <BarChart3
          size={40}
          className={`mx-auto mb-3 ${isDark ? "text-gray-700" : "text-gray-300"}`}
        />
        <p className={`text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}>
          هنوز آهنگی گوش ندادید!
        </p>
        <p className={`text-xs mt-1 ${isDark ? "text-gray-700" : "text-gray-300"}`}>
          با پخش آهنگ‌ها، آمار شنیداری شما اینجا نمایش داده می‌شود
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: <Headphones size={18} />,
            label: "کل پخش‌ها",
            value: stats.totalPlays.toLocaleString("fa-IR"),
            color: "purple",
          },
          {
            icon: <Music2 size={18} />,
            label: "آهنگ یونیک",
            value: stats.uniqueTracks.toLocaleString("fa-IR"),
            color: "blue",
          },
          {
            icon: <Clock size={18} />,
            label: "دقیقه شنیداری",
            value: stats.totalMinutes.toLocaleString("fa-IR"),
            color: "green",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`p-4 rounded-2xl border text-center ${
              isDark
                ? "bg-gray-900/50 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`inline-flex p-2 rounded-xl mb-2 ${
                card.color === "purple"
                  ? isDark
                    ? "bg-purple-900/30 text-purple-400"
                    : "bg-purple-50 text-purple-600"
                  : card.color === "blue"
                  ? isDark
                    ? "bg-blue-900/30 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                  : isDark
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {card.icon}
            </div>
            <p
              className={`text-xl font-black ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {card.value}
            </p>
            <p
              className={`text-[11px] mt-1 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`p-5 rounded-2xl border ${
          isDark
            ? "bg-gray-900/50 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-sm font-black mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <Calendar size={15} className="text-purple-500" />
          فعالیت ۷ روز اخیر
        </h3>
        <div className="flex items-end justify-between gap-2 h-28">
          {stats.dailyCounts.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span
                className={`text-[10px] font-bold ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {count || ""}
              </span>
              <div
                className={`w-full rounded-lg transition-all ${
                  count > 0
                    ? "bg-gradient-to-t from-purple-600 to-purple-400"
                    : isDark
                    ? "bg-gray-800"
                    : "bg-gray-100"
                }`}
                style={{
                  height: `${Math.max((count / stats.maxDaily) * 80, 4)}px`,
                }}
              />
              <span
                className={`text-[10px] ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {stats.weekDays[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`p-5 rounded-2xl border ${
          isDark
            ? "bg-gray-900/50 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <h3
          className={`text-sm font-black mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <TrendingUp size={15} className="text-amber-500" />
          آهنگ‌های برتر شما
        </h3>
        <div className="space-y-2">
          {stats.topTracks.map((track, i) => (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-2 rounded-xl ${
                isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-5 text-xs font-black text-center ${
                  i === 0
                    ? "text-amber-500"
                    : i === 1
                    ? "text-gray-400"
                    : i === 2
                    ? "text-amber-700"
                    : isDark
                    ? "text-gray-600"
                    : "text-gray-400"
                }`}
              >
                {i + 1}
              </span>
              {track.cover && (
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-9 h-9 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-bold truncate ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {track.title}
                </p>
                <p
                  className={`text-[11px] ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {track.artist}
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  isDark
                    ? "bg-purple-900/20 text-purple-400"
                    : "bg-purple-50 text-purple-600"
                }`}
              >
                {track.count} بار
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-2xl border ${
            isDark
              ? "bg-gray-900/50 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h4
            className={`text-xs font-black mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            🎤 هنرمندان برتر
          </h4>
          <div className="space-y-2">
            {stats.topArtists.map(([artist, count], i) => (
              <div key={artist} className="flex items-center justify-between">
                <span
                  className={`text-xs truncate ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {i + 1}. {artist}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`p-4 rounded-2xl border ${
            isDark
              ? "bg-gray-900/50 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h4
            className={`text-xs font-black mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            🎵 ژانرهای برتر
          </h4>
          <div className="space-y-2">
            {stats.topGenres.map(([genre, count], i) => (
              <div key={genre} className="flex items-center justify-between">
                <span
                  className={`text-xs truncate ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {i + 1}. {genre}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
