// components/GlobalMusicPlayer.tsx
import React from 'react';
import { useGlobalMusic } from '../../../../contexts/GlobalMusicContext';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GlobalMusicPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, volume, togglePlay, seekTo, setVolume, nextTrack, prevTrack } = useGlobalMusic();
  const { theme } = useTheme();
const isDark = theme === "dark";


  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl ${
        isDark
          ? 'bg-gray-900/95 border-purple-800/30'
          : 'bg-white/95 border-gray-200'
      }`}
    >
      {/* Progress Bar */}
      <div
        className="h-1 bg-gray-700 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seekTo(percent * duration);
        }}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 relative"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link to={`/music/${currentTrack.id}`}>
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-lg object-cover hover:scale-105 transition-transform"
              />
            </Link>
            <div className="min-w-0">
              <Link to={`/music/${currentTrack.id}`}>
                <h4 className={`font-bold text-sm truncate hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentTrack.title}
                </h4>
              </Link>
              <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <button
                onClick={prevTrack}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <SkipBack size={18} />
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
              </button>

              <button
                onClick={nextTrack}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Volume & Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <Heart size={18} />
            </button>
            <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
              <Bookmark size={18} />
            </button>

            <div className="flex items-center gap-2">
              <button onClick={() => setVolume(volume > 0 ? 0 : 0.7)}>
                {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
