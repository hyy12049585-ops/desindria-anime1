import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, Calendar, ChevronRight, Clock, Download, Heart,
  Music, Pause, Play, Share2, User, Plus, Check, Star,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUserData } from "../../../../contexts/UserDataContext";
import { useMusicUserData } from "../../../../hooks/useMusicUserData";
import CommentsSection from "../../../comments/components/CommentsSection";
import { addRecent } from "../../../../services/recentService";
import { getMusicById, getRelatedTracks } from "../../../../services/musicService";
import AnimeDownloadSection from "@/components/anime/AnimeDownloadSection";
import type { MusicItem } from "../../../../features/music/user/data/musicData";

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: string | number;
  genre?: string;
  duration?: string;
  cover?: string;
  audioUrl?: string;
  description?: string;
  plays?: number;
  likes?: number;
  downloads?: number;
  createdAt?: string;
}

const fallbackCover =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop";

// تبدیل آیتم دیتابیس به شکلی که این صفحه می‌شناسد
function toTrack(m: MusicItem): MusicTrack {
  return {
    id: m.id,
    title: m.title,
    artist: m.artist,
    album: m.anime,
    year: m.releaseDate,
    genre: m.genre,
    duration: m.duration,
    cover: m.coverImage,
    audioUrl: m.audioUrl,
    description: m.summary,
    plays: m.views,
    likes: m.likes,
    downloads: m.bookmarks,
    createdAt: m.releaseDate,
  };
}

function formatNumber(value?: number): string {
  if (typeof value !== "number") return "0";
  return new Intl.NumberFormat("fa-IR").format(value);
}
function getTrackDate(track: MusicTrack): string {
  if (!track.createdAt) return "نامشخص";
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(track.createdAt));
  } catch { return "نامشخص"; }
}

export default function MusicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addNotification } = useUserData();

  // ── هوک واقعی: لایک/امتیاز/دانلود/لیست من (ذخیره در localStorage) ──
  const {
    toggleMusicLike, isMusicLiked,
    toggleMyMusic, isInMyMusic,
    setMusicRating, getMusicRating,
    addMusicDownload,
  } = useMusicUserData();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [track, setTrack] = useState<MusicTrack | undefined>(undefined);
  const [relatedTracks, setRelatedTracks] = useState<MusicTrack[]>([]);
  const [loadingTrack, setLoadingTrack] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingTrack(true);
    (async () => {
      if (!id) { if (active) { setTrack(undefined); setLoadingTrack(false); } return; }
      const item = await getMusicById(id);
      if (!active) return;
      setTrack(item ? toTrack(item) : undefined);
      const rel = await getRelatedTracks(id, 4);
      if (!active) return;
      setRelatedTracks(rel.map(toTrack));
      setLoadingTrack(false);
    })();
    return () => { active = false; };
  }, [id]);

  // وضعیت زندهٔ لایک/لیست/امتیاز از هوک
  const liked = track ? isMusicLiked(track.id) : false;
  const inList = track ? isInMyMusic(track.id) : false;
  const rating = track ? getMusicRating(track.id) : 0;

  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [track?.id]);

  // ثبت در «اخیراً پخش‌شده» (برای تب پروفایل)
  useEffect(() => {
    if (!track) return;
    addRecent('music', {
      id: track.id,
      title: track.title,
      poster: track.cover || fallbackCover,
      subtitle: track.artist || '',
      linkTo: `/music/${track.id}`,
    });
  }, [track?.id]);

  if (loadingTrack) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-[#0b0b12] dark:text-white">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-white/5 opacity-60">
          در حال بارگذاری...
        </div>
      </main>
    );
  }

  if (!track) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900 dark:bg-[#0b0b12] dark:text-white">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-white/5">
          <h1 className="text-2xl font-bold">موزیک پیدا نشد</h1>
          <button onClick={() => navigate(-1)} className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700">بازگشت</button>
        </div>
      </main>
    );
  }

  const payload = { id: track.id, title: track.title, cover: track.cover || fallbackCover, artist: track.artist };

  const handlePlay = async () => {
    if (!track.audioUrl) { setIsPlaying((p) => !p); return; }
    if (!audioRef.current) {
      audioRef.current = new Audio(track.audioUrl);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }
    try {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
      else { await audioRef.current.play(); setIsPlaying(true); }
    } catch { setIsPlaying(false); }
  };

  const handleLike = () => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    toggleMusicLike(payload);
  };

  const handleAddList = () => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    const wasIn = inList;
    toggleMyMusic(payload);
    if (!wasIn) addNotification({ title: "به لیست موزیک اضافه شد", message: `«${track.title}» به لیست موزیک تو اضافه شد`, type: "success" });
  };

  const handleRate = (n: number) => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    setMusicRating(payload, rating === n ? 0 : n);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: track.title, text: `${track.title} از ${track.artist}`, url: shareUrl }); } catch { /* canceled */ }
      return;
    }
    try { await navigator.clipboard.writeText(shareUrl); alert("لینک کپی شد."); } catch { alert("امکان کپی لینک وجود ندارد."); }
  };

  const handleDownload = () => {
    if (!isAuthenticated) { navigate("/auth/login"); return; }
    addMusicDownload({ ...payload, quality: "320kbps" }); // ذخیره در پروفایل
    addNotification({ title: "دانلود شروع شد", message: `دانلود «${track.title}» به لیست دانلودها اضافه شد`, type: "info" });
    if (track.audioUrl) {
      const a = document.createElement("a");
      a.href = track.audioUrl; a.download = `${track.title}.mp3`; a.click();
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0b0b12] dark:text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/15">
            <ArrowRight size={18} /> بازگشت
          </button>

          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <div className="relative">
              <img src={track.cover || fallbackCover} alt={track.title}
                onError={(e) => { e.currentTarget.src = fallbackCover; }}
                className="aspect-square w-full rounded-3xl object-cover shadow-xl" />
              <button onClick={handlePlay} aria-label={isPlaying ? "توقف" : "پخش"}
                className="absolute bottom-4 left-4 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-105"
                style={{ background: "var(--accent)" }}>
                {isPlaying ? <Pause size={34} fill="currentColor" /> : <Play size={34} fill="currentColor" className="mr-1" />}
              </button>
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {track.genre && <span className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>{track.genre}</span>}
                <span className="rounded-full bg-white px-4 py-2 text-sm text-gray-600 shadow-sm dark:bg-white/10 dark:text-gray-300">{getTrackDate(track)}</span>
              </div>

              <h1 className="text-4xl font-black leading-tight text-gray-950 dark:text-white md:text-5xl">{track.title}</h1>
              <p className="mt-4 flex items-center gap-2 text-xl text-gray-600 dark:text-gray-300"><User size={22} />{track.artist}</p>

              {/* امتیاز کاربر */}
              <div className="mt-5 flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">امتیاز شما:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = n <= (hoveredStar || rating);
                    return (
                      <Star key={n} size={22} className="cursor-pointer transition-all"
                        style={{ color: active ? "#fbbf24" : "var(--text-muted)", fill: active ? "#fbbf24" : "none", transform: active ? "scale(1.1)" : "none" }}
                        onMouseEnter={() => setHoveredStar(n)} onMouseLeave={() => setHoveredStar(0)} onClick={() => handleRate(n)} />
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-white/5">
                  <p className="text-sm text-gray-500 dark:text-gray-400">پخش</p>
                  <p className="mt-1 text-xl font-bold">{formatNumber(track.plays)}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-white/5">
                  <p className="text-sm text-gray-500 dark:text-gray-400">پسندیدن</p>
                  <p className="mt-1 text-xl font-bold">{formatNumber((track.likes || 0) + (liked ? 1 : 0))}</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-white/5">
                  <p className="text-sm text-gray-500 dark:text-gray-400">دانلود</p>
                  <p className="mt-1 text-xl font-bold">{formatNumber(track.downloads)}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={handlePlay} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white transition hover:opacity-90" style={{ background: "var(--accent)" }}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}{isPlaying ? "توقف" : "پخش"}
                </button>

                <button onClick={handleLike}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${liked ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-500/10" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"}`}>
                  <Heart size={20} fill={liked ? "currentColor" : "none"} />{liked ? "پسندیدی" : "پسندیدن"}
                </button>

                <button onClick={handleAddList}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-semibold transition ${inList ? "border-purple-500 bg-purple-50 text-purple-600 dark:bg-purple-500/10" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"}`}>
                  {inList ? <Check size={20} /> : <Plus size={20} />}{inList ? "در لیست من" : "لیست من"}
                </button>

                <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  <Share2 size={20} /> اشتراک
                </button>

                <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  <Download size={20} /> دانلود
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white/5">
              <h2 className="mb-5 flex items-center gap-2 text-2xl font-bold"><Music size={24} style={{ color: "var(--accent)" }} />اطلاعات موزیک</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-black/20"><span className="text-gray-500 dark:text-gray-400">خواننده:</span><span className="font-semibold">{track.artist}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-black/20"><span className="text-gray-500 dark:text-gray-400">آلبوم:</span><span className="font-semibold">{track.album || "نامشخص"}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-black/20"><span className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Calendar size={18} />سال انتشار:</span><span className="font-semibold">{track.year || "نامشخص"}</span></div>
                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4 dark:bg-black/20"><span className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Clock size={18} />مدت زمان:</span><span className="font-semibold">{track.duration || "نامشخص"}</span></div>
              </div>
            </div>

            <AnimeDownloadSection contentId={track.id} type="music" />

            {track.description && (
              <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white/5">
                <h2 className="mb-4 text-2xl font-bold">درباره این آهنگ</h2>
                <p className="whitespace-pre-line leading-9 text-gray-700 dark:text-gray-300">{track.description}</p>
              </div>
            )}

            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white/5">
              <CommentsSection targetType="music" targetId={track.id} title="دیدگاه‌های کاربران" />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white/5">
              <h3 className="mb-4 text-xl font-bold">موزیک‌های مرتبط</h3>
              {relatedTracks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">موردی برای نمایش وجود ندارد.</p>
              ) : (
                <div className="space-y-3">
                  {relatedTracks.map((item) => (
                    <Link key={item.id} to={`/music/${item.id}`} className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-gray-50 dark:hover:bg-white/10">
                      <img src={item.cover || fallbackCover} alt={item.title} onError={(e) => { e.currentTarget.src = fallbackCover; }} className="h-16 w-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">{item.artist}</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 transition group-hover:text-purple-600" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
