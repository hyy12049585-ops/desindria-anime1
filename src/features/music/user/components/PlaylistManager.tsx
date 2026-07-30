// components/PlaylistManager.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { getUserPlaylists, createPlaylist, deletePlaylist, Playlist } from '../data/playlistData';
import { Plus, Music, Trash2, Lock, Globe, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlaylistManager() {
  const { theme } = useTheme();
const isDark = theme === "dark";

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const loadPlaylists = () => {
    setPlaylists(getUserPlaylists());
  };

  useEffect(() => {
    loadPlaylists();

    const handleUpdate = () => loadPlaylists();
    window.addEventListener('playlists-updated', handleUpdate);
    return () => window.removeEventListener('playlists-updated', handleUpdate);
  }, []);

  const handleCreate = () => {
    if (!newPlaylistName.trim()) return;

    createPlaylist(newPlaylistName, newPlaylistDesc);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowCreateModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('آیا از حذف این پلی‌لیست مطمئنی؟')) {
      deletePlaylist(id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          لیست‌های پخش من
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          ساخت پلی‌لیست
        </button>
      </div>

      {/* Empty State */}
      {playlists.length === 0 && (
        <div
          className={`rounded-2xl p-12 text-center ${
            isDark
              ? 'bg-gray-900/30 border border-purple-800/20'
              : 'bg-white border border-gray-100 shadow-sm'
          }`}
        >
          <Music size={64} className={`mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            هنوز پلی‌لیستی نساختی
          </h3>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            آهنگ‌های موردعلاقت رو توی یه پلی‌لیست جمع کن
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
          >
            ساخت اولین پلی‌لیست
          </button>
        </div>
      )}

      {/* Grid */}
      {playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`group rounded-2xl overflow-hidden transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-gray-900/30 border border-purple-800/20 hover:border-purple-600/40'
                  : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Cover */}
              <Link to={`/user/playlist/${playlist.id}`}>
                <div className="relative aspect-square bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  {playlist.coverImage ? (
                    <img
                      src={playlist.coverImage}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music size={64} className="text-white/30" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-purple-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                      <Music size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-2 right-2">
                    {playlist.isPublic ? (
                      <Globe size={14} className="text-white/70" />
                    ) : (
                      <Lock size={14} className="text-white/70" />
                    )}
                  </div>

                  {/* Track Count */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-bold">
                    {playlist.trackIds.length.toLocaleString('fa-IR')} آهنگ
                  </div>
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link to={`/user/playlist/${playlist.id}`}>
                  <h3
                    className={`font-bold text-sm truncate hover:text-purple-400 transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {playlist.name}
                  </h3>
                </Link>

                {playlist.description && (
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {playlist.description}
                  </p>
                )}

                <p
                  className={`text-[10px] mt-2 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  ساخته شده در {playlist.createdAt}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3">
                  <Link
                    to={`/user/playlist/${playlist.id}/edit`}
                    className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      isDark
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Edit2 size={12} />
                    ویرایش
                  </Link>

                  <button
                    onClick={() => handleDelete(playlist.id)}
                    className="px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md rounded-2xl p-6 ${
              isDark ? 'bg-gray-900 border border-purple-800/30' : 'bg-white'
            }`}
          >
            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ساخت پلی‌لیست جدید
            </h3>

            <input
              type="text"
              placeholder="نام پلی‌لیست"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl mb-3 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700 text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}
            />

            <textarea
              placeholder="توضیحات (اختیاری)"
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 rounded-xl mb-4 resize-none ${
                isDark
                  ? 'bg-gray-800 border border-gray-700 text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}
            />

            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={!newPlaylistName.trim()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              >
                ساخت
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName('');
                  setNewPlaylistDesc('');
                }}
                className={`px-6 py-3 rounded-xl font-bold ${
                  isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
