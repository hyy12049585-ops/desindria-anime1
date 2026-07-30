// components/RecentlyPlayed.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useGlobalMusic } from '../../../../contexts/GlobalMusicContext';
import { useMusic } from '../../../../hooks/useMusic';
import { Play, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlayHistory {
  trackId: number;
  playedAt: string;
  progress: number;
  timestamp: number;
}

export function RecentlyPlayed() {
  const { theme } = useTheme();
const isDark = theme === "dark";

  const { playTrack } = useGlobalMusic();
  const { tracks } = useMusic();
  const byId = useMemo(() => {
    const m = new Map<string, typeof tracks[number]>();
    tracks.forEach((t) => m.set(String(t.id), t));
    return m;
  }, [tracks]);
  const [recentTracks, setRecentTracks] = useState<PlayHistory[]>([]);

  const loadHistory = () => {
    const history: PlayHistory[] = JSON.parse(
      localStorage.getItem('music_play_history') || '[]'
    );
    setRecentTracks(history.slice(0, 6)); // فقط ۶ تای آخر
  };

  useEffect(() => {
    loadHistory();

    // گوش دادن به تغییرات
    const handleUpdate = () => loadHistory();
    window.addEventListener('music-history-updated', handleUpdate);
    return () => window.removeEventListener('music-history-updated', handleUpdate);
  }, []);

  if (recentTracks.length === 0) {
    return (
      <div
        className={`rounded-2xl p-6 text-center ${
          isDark
            ? 'bg-gray-900/30 border border-purple-800/20'
            : 'bg-white border border-gray-100 shadow-sm'
        }`}
      >
        <Clock
          size={48}
          className={`mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}
        />
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          هنوز آهنگی پخش نکردی
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden ${
        isDark
          ? 'bg-gray-900/30 border border-purple-800/20'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-purple-400" />
          <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            اخیراً پخش شده
          </h3>
        </div>
        <Link
          to="/user/music?tab=history"
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
        >
          مشاهده همه
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-800/30">
        {recentTracks.map((item, index) => {
         const track = byId.get(String(item.trackId));

          if (!track) return null;

          return (
            <div
              key={`${item.trackId}-${item.timestamp}`}
              className={`group flex items-center gap-3 px-6 py-3 transition-colors ${
                isDark ? 'hover:bg-purple-900/10' : 'hover:bg-purple-50/50'
              }`}
            >
              {/* شماره */}
              <span
                className={`w-6 text-center text-sm font-bold ${
                  isDark ? 'text-gray-600' : 'text-gray-300'
                }`}
              >
                {(index + 1).toLocaleString('fa-IR')}
              </span>

              {/* کاور */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>

                {/* Play Button */}
                <button
                  onClick={() => playTrack(track)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                >
                  <Play
                    size={16}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="white"
                  />
                </button>
              </div>

              {/* اطلاعات */}
              <div className="flex-1 min-w-0">
                <Link to={`/music/${track.id}`}>
                  <h4
                    className={`text-sm font-bold truncate hover:text-purple-400 transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {track.title}
                  </h4>
                </Link>
                <p
                  className={`text-xs truncate ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {track.artist}
                </p>
              </div>

              {/* زمان پخش */}
              <div className="text-left">
                <p
                  className={`text-[10px] ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {item.playedAt}
                </p>
                <p
                  className={`text-xs font-mono mt-0.5 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {track.duration}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
