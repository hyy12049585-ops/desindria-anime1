// components/AddToPlaylistButton.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import {
  getUserPlaylists,
  createPlaylist,
  addTrackToPlaylist,
  Playlist,
} from '../data/playlistData';
import { ListPlus, Plus, Check, Music, X } from 'lucide-react';

interface Props {
  trackId: number;
}

export function AddToPlaylistButton({ trackId }: Props) {
  const { theme } = useTheme();
const isDark = theme === "dark";

  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [addedTo, setAddedTo] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      const pls = getUserPlaylists();
      setPlaylists(pls);

      // بررسی اینکه آهنگ در کدوم پلی‌لیست‌ها هست
      const existing = pls
        .filter((p) => p.trackIds.includes(trackId))
        .map((p) => p.id);
      setAddedTo(existing);
    }
  }, [isOpen, trackId]);

  const handleAdd = (playlistId: number) => {
    const success = addTrackToPlaylist(playlistId, trackId);
    if (success) {
      setAddedTo((prev) => [...prev, playlistId]);
    }
  };

  const handleCreateAndAdd = () => {
    if (!newName.trim()) return;
    const newPlaylist = createPlaylist(newName);
    addTrackToPlaylist(newPlaylist.id, trackId);
    setPlaylists((prev) => [...prev, newPlaylist]);
    setAddedTo((prev) => [...prev, newPlaylist.id]);
    setNewName('');
    setShowCreate(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
          isOpen
            ? 'bg-purple-500 text-white'
            : isDark
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <ListPlus size={18} />
        افزودن به پلی‌لیست
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div
            className={`absolute top-full mt-2 right-0 w-72 rounded-2xl overflow-hidden shadow-2xl z-50 ${
              isDark
                ? 'bg-gray-900 border border-purple-800/30'
                : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${
                isDark ? 'border-gray-800' : 'border-gray-100'
              }`}
            >
              <span
                className={`text-sm font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                افزودن به پلی‌لیست
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-lg ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>

            {/* Playlist List */}
            <div className="max-h-60 overflow-y-auto">
              {playlists.length === 0 && !showCreate && (
                <div className="p-6 text-center">
                  <Music
                    size={32}
                    className={`mx-auto mb-2 ${
                      isDark ? 'text-gray-700' : 'text-gray-300'
                    }`}
                  />
                  <p
                    className={`text-xs ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    هنوز پلی‌لیستی نداری
                  </p>
                </div>
              )}

              {playlists.map((pl) => {
                const isAdded = addedTo.includes(pl.id);

                return (                  // ادامه map در AddToPlaylistButton.tsx
                  <button
                    key={pl.id}
                    onClick={() => !isAdded && handleAdd(pl.id)}
                    disabled={isAdded}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                      isAdded
                        ? isDark
                          ? 'bg-purple-900/20'
                          : 'bg-purple-50'
                        : isDark
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Cover Thumbnail */}
                    <div
                      className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
                        isDark
                          ? 'bg-gradient-to-br from-purple-700 to-pink-700'
                          : 'bg-gradient-to-br from-purple-400 to-pink-400'
                      }`}
                    >
                      <Music size={16} className="text-white/50" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-right">
                      <h4
                        className={`text-sm font-bold truncate ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {pl.name}
                      </h4>
                      <p
                        className={`text-[10px] ${
                          isDark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {pl.trackIds.length.toLocaleString('fa-IR')} آهنگ
                      </p>
                    </div>

                    {/* Status Icon */}
                    {isAdded ? (
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Check size={16} className="text-purple-400" />
                      </div>
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isDark ? 'bg-gray-800' : 'bg-gray-100'
                        }`}
                      >
                        <Plus size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Create New Section */}
            <div
              className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
            >
              {showCreate ? (
                <div className="p-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="نام پلی‌لیست جدید..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateAndAdd();
                      if (e.key === 'Escape') {
                        setShowCreate(false);
                        setNewName('');
                      }
                    }}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm mb-2 ${
                      isDark
                        ? 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500'
                        : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateAndAdd}
                      disabled={!newName.trim()}
                      className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-xs font-bold disabled:opacity-50 hover:bg-purple-600 transition-colors"
                    >
                      ساخت و افزودن
                    </button>
                    <button
                      onClick={() => {
                        setShowCreate(false);
                        setNewName('');
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${
                        isDark
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      لغو
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreate(true)}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors ${
                    isDark
                      ? 'text-purple-400 hover:bg-purple-900/20'
                      : 'text-purple-500 hover:bg-purple-50'
                  }`}
                >
                  <Plus size={18} />
                  ساخت پلی‌لیست جدید
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
