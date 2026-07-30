import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useGlobalMusic } from "../../../../contexts/GlobalMusicContext";
import { useDragReorder } from "../../../../hooks/useDragReorder";
import { MusicItem } from "@/features/music/user/data/musicData";
import { useMusic } from "../../../../hooks/useMusic";

import {
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  removeTrackFromPlaylist,
  reorderPlaylistTracks,
  Playlist,
} from "../data/playlistData";
import {
  Play,
  Pause,
  Shuffle,
  Trash2,
  Edit3,
  Check,
  X,
  ArrowRight,
  Clock,
  Music2,
  GripVertical,
  Globe,
  Lock,
} from "lucide-react";

// تبدیل duration رشته‌ای مثل "3:45" به ثانیه
function parseDuration(duration: string | number | undefined): number {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 1) return parts[0];
  return 0;
}

// فرمت ثانیه به "m:ss"
function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { playTrack, currentTrack, isPlaying, togglePlay, setPlaylist } =
    useGlobalMusic();
  const { tracks: catalog } = useMusic();

  const [playlist, setPlaylistState] = useState<Playlist | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPublic, setEditPublic] = useState(false);

  // بارگذاری پلی‌لیست
  useEffect(() => {
    if (!id) return;
    const found = getPlaylistById(Number(id));
    if (found) {
      setPlaylistState(found);
      setEditName(found.name);
      setEditDesc(found.description);
      setEditPublic(found.isPublic);
    } else {
      setNotFound(true);
    }
  }, [id]);

// آهنگ‌های پلی‌لیست
const tracks = useMemo(() => {
  if (!playlist) return [];
  const byId = new Map<string, MusicItem>();
  catalog.forEach((t) => byId.set(String(t.id), t));
  return playlist.trackIds
    .map((tid) => byId.get(String(tid)))
    .filter((track): track is MusicItem => track !== undefined);
}, [playlist, catalog]);

  // Drag & Drop
  const handleReorder = (newTracks: any[]) => {
    if (!playlist) return;
    const newIds = newTracks.map((t: any) => Number(t.id));
    const updated = reorderPlaylistTracks(playlist.id, newIds);
    if (updated) setPlaylistState(updated);
  };

  const {
    dragIndex,
    overIndex,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  } = useDragReorder(tracks, handleReorder);

  // مدت زمان کل
  const totalDuration = useMemo(() => {
    const totalSec = tracks.reduce((sum, t: any) => {
      return sum + parseDuration(t?.duration);
    }, 0);
    return formatDuration(totalSec);
  }, [tracks]);

  // پخش همه
  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    setPlaylist(tracks);
    playTrack(tracks[0]);
  };

  // شافل
  const handleShuffle = () => {
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    playTrack(shuffled[0]);
  };

  // حذف آهنگ
  const handleRemoveTrack = (trackId: number) => {
    if (!playlist) return;
    removeTrackFromPlaylist(playlist.id, trackId);
    setPlaylistState({
      ...playlist,
      trackIds: playlist.trackIds.filter((t) => t !== trackId),
    });
  };

  // ذخیره ویرایش
  const handleSaveEdit = () => {
    if (!playlist || !editName.trim()) return;
    updatePlaylist(playlist.id, {
      name: editName.trim(),
      description: editDesc.trim(),
      isPublic: editPublic,
    });
    setPlaylistState({
      ...playlist,
      name: editName.trim(),
      description: editDesc.trim(),
      isPublic: editPublic,
    });
    setIsEditing(false);
  };

  // حذف پلی‌لیست
  const handleDeletePlaylist = () => {
    if (!playlist) return;
    if (!confirm("آیا از حذف این پلی‌لیست مطمئنید؟")) return;
    deletePlaylist(playlist.id);
    navigate(-1);
  };

  // ═══ 404 ═══
  if (notFound) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <Music2 size={60} className="mx-auto mb-4 text-gray-500" />
          <h1 className="text-2xl font-black mb-2">پلی‌لیست یافت نشد</h1>
          <p className={`text-sm mb-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            این پلی‌لیست وجود ندارد یا حذف شده است.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div
  className={`min-h-screen pt-30 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
  dir="rtl"
>
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
      dir="rtl"
    >
      {/* ═══ هدر ═══ */}
      <section
  className={`relative pt-28 pb-10 px-4 ${
    isDark
      ? "bg-gradient-to-b from-purple-950/40 to-gray-950"
      : "bg-gradient-to-b from-purple-100 to-gray-50"
  }`}
>

        <div className="max-w-4xl mx-auto">
          {/* دکمه بازگشت */}
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-1 text-sm mb-6 transition-colors ${
              isDark
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <ArrowRight size={16} />
            بازگشت
          </button>

          {/* اطلاعات پلی‌لیست */}
          {isEditing ? (
            <div className="space-y-4">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className={`w-full text-2xl font-black rounded-xl px-4 py-3 outline-none ${
                  isDark
                    ? "bg-gray-900 text-white border border-gray-700 focus:border-purple-500"
                    : "bg-white text-gray-900 border border-gray-200 focus:border-purple-400"
                }`}
                placeholder="نام پلی‌لیست"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={2}
                className={`w-full rounded-xl px-4 py-3 text-sm resize-none outline-none ${
                  isDark
                    ? "bg-gray-900 text-white border border-gray-700 focus:border-purple-500"
                    : "bg-white text-gray-900 border border-gray-200 focus:border-purple-400"
                }`}
                placeholder="توضیحات (اختیاری)"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPublic}
                  onChange={(e) => setEditPublic(e.target.checked)}
                  className="accent-purple-600"
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  عمومی
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700"
                >
                  <Check size={15} />
                  ذخیره
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold ${
                    isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <X size={15} />
                  انصراف
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1
                      className={`text-3xl font-black ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {playlist.name}
                    </h1>
                    <span
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        playlist.isPublic
                          ? isDark
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-100 text-green-700"
                          : isDark
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {playlist.isPublic ? (
                        <Globe size={10} />
                      ) : (
                        <Lock size={10} />
                      )}
                      {playlist.isPublic ? "عمومی" : "خصوصی"}
                    </span>
                  </div>
                  {playlist.description && (
                    <p
                      className={`text-sm mb-3 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {playlist.description}
                    </p>
                  )}
                  <div
                    className={`flex items-center gap-4 text-xs ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <span>{tracks.length} آهنگ</span>
                    <span>
                      <Clock size={12} className="inline ml-1" />
                      {totalDuration}
                    </span>
                  </div>
                </div>

                {/* دکمه‌های مدیریت */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                    }`}
                    title="ویرایش"
                  >
                    <Edit3 size={17} />
                  </button>
                  <button
                    onClick={handleDeletePlaylist}
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? "text-red-500/60 hover:bg-red-900/20 hover:text-red-400"
                        : "text-red-400 hover:bg-red-50 hover:text-red-600"
                    }`}
                    title="حذف پلی‌لیست"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              {/* دکمه‌های پخش */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handlePlayAll}
                  disabled={tracks.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Play size={16} fill="white" />
                  پخش همه
                </button>
                <button
                  onClick={handleShuffle}
                  disabled={tracks.length === 0}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-40 ${
                    isDark
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <Shuffle size={15} />
                  شافل
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══ لیست آهنگ‌ها با Drag & Drop ═══ */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {tracks.length === 0 ? (
          <div className="text-center py-16">
            <Music2
              size={50}
              className={isDark ? "text-gray-700 mx-auto mb-4" : "text-gray-300 mx-auto mb-4"}
            />
            <p
              className={`text-sm ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              هنوز آهنگی به این پلی‌لیست اضافه نشده
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* هدر جدول */}
            <div
              className={`grid grid-cols-[40px_1fr_120px_80px_50px] gap-3 px-4 py-2 text-[11px] font-bold ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            >
              <span>#</span>
              <span>آهنگ</span>
              <span>هنرمند</span>
              <span className="text-center">مدت</span>
              <span />
            </div>

            {/* آیتم‌ها */}
            {tracks.map((track: any, index: number) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isDragging = dragIndex === index;
              const isOver = overIndex === index;

              return (
                <div
                  key={track.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  className={`
                    grid grid-cols-[40px_1fr_120px_80px_50px] gap-3 items-center px-4 py-3 rounded-xl
                    cursor-grab active:cursor-grabbing select-none
                    transition-all duration-200
                    ${
                      isDragging
                        ? "opacity-40 scale-[0.98]"
                        : "opacity-100"
                    }
                    ${
                      isOver && !isDragging
                        ? isDark
                          ? "border-t-2 border-purple-500"
                          : "border-t-2 border-purple-400"
                        : "border-t-2 border-transparent"
                    }
                    ${
                      isCurrentTrack
                        ? isDark
                          ? "bg-purple-900/20 border-purple-800/30"
                          : "bg-purple-50 border-purple-200"
                        : isDark
                        ? "hover:bg-gray-900/50"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {/* شماره + آیکون درگ */}
                  <div className="flex items-center gap-1">
                    <GripVertical
                      size={14}
                      className={`flex-shrink-0 ${
                        isDark ? "text-gray-700" : "text-gray-300"
                      }`}
                    />
                    <span
                      className={`text-xs font-bold ${
                        isCurrentTrack
                          ? "text-purple-500"
                          : isDark
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* اطلاعات آهنگ */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={track.coverImage || "/default-cover.jpg"}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isCurrentTrack && isPlaying) {
                            togglePlay();
                          } else {
                            setPlaylist(tracks);
                            playTrack(track);
                          }
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                      >
                        {isCurrentTrack && isPlaying ? (
                          <Pause size={16} className="text-white" fill="white" />
                        ) : (
                          <Play size={16} className="text-white" fill="white" />
                        )}
                      </button>
                    </div>
                    <Link
                      to={`/music/${track.id}`}
                      className={`text-sm font-bold truncate hover:underline ${
                        isCurrentTrack
                          ? "text-purple-500"
                          : isDark
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {track.title}
                    </Link>
                  </div>

                  {/* هنرمند */}
                  <span
                    className={`text-xs truncate ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {track.artist}
                  </span>

                  {/* مدت */}
                  <span
                    className={`text-xs text-center ${
                      isDark ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {formatDuration(parseDuration(track.duration))}
                  </span>

                  {/* حذف */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(Number(track.id));
                    }}
                    className={`p-1.5 rounded-lg transition-colors mx-auto ${
                      isDark
                        ? "text-gray-700 hover:text-red-400 hover:bg-red-900/20"
                        : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                    }`}
                    title="حذف از پلی‌لیست"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="h-28" />
    </div>
  );
}
