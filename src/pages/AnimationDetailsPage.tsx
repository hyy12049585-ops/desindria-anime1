import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Play, Plus, Check, Star, Calendar, Clock, Users, Heart, Share2, Globe,
  Clapperboard, ChevronDown, ChevronUp, Download,
} from "lucide-react";
import { getAnimationById, getSimilarAnimations } from "@/services/animationService";
import type { Animation } from "@/data/animationData";
import AnimationCard from "@/features/animation/components/AnimationCard";
import CommentsSection from "@/features/comments/components/CommentsSection";
import AnimeDownloadSection from "@/components/anime/AnimeDownloadSection";
import { useTheme } from "@/contexts/ThemeContext";
import { useAnimationUserData } from "@/hooks/useAnimationUserData";
import { useUserData } from "@/contexts/UserDataContext";
import { addRecent } from "@/services/recentService";

export default function AnimationDetailsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    toggleAnimationLike, isAnimationLiked,
    toggleAnimationWatchlist, isAnimationInWatchlist,
    setAnimationRating, getAnimationRating,
    addAnimationDownload,
    toggleAnimationCharacter, isAnimationCharacterFollowed,
  } = useAnimationUserData();

  const { addNotification } = useUserData();

  const phBanner = isDark
    ? "https://placehold.co/1600x600/0a0a1e/a855f7?text=Animation"
    : "https://placehold.co/1600x600/f3f0ff/7c3aed?text=Animation";
  const phPoster = isDark
    ? "https://placehold.co/600x900/0a0a1e/a855f7?text=Animation"
    : "https://placehold.co/600x900/f3f0ff/7c3aed?text=Animation";

  const { id } = useParams();
  const numericId = Number(id);

  const [animation, setAnimation] = useState<Animation | null>(null);
  const [similar, setSimilar] = useState<Animation[]>([]);
  const [loadingAnimation, setLoadingAnimation] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingAnimation(true);
    (async () => {
      const a = await getAnimationById(numericId);
      if (!active) return;
      setAnimation(a);
      setSimilar(a ? await getSimilarAnimations(numericId) : []);
      setLoadingAnimation(false);
    })();
    return () => { active = false; };
  }, [numericId]);

  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // وضعیت زنده از هوک (localStorage) — با پروفایل سینک
  const isLiked = Number.isFinite(numericId) ? isAnimationLiked(numericId) : false;
  const inList = Number.isFinite(numericId) ? isAnimationInWatchlist(numericId) : false;
  const userRating = Number.isFinite(numericId) ? getAnimationRating(numericId) : 0;

  // ثبت در «اخیراً تماشا‌شده» (برای تب پروفایل)
  useEffect(() => {
    if (!animation) return;
    addRecent('animation', {
      id: animation.id,
      title: animation.title,
      poster: animation.poster,
      subtitle: animation.year ? String(animation.year) : '',
      linkTo: `/animation/${animation.id}`,
    });
  }, [animation?.id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: animation?.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("لینک کپی شد!");
      }
    } catch { /* ignore */ }
  };

  const handleWatch = () => {
    alert("این فیلم به‌زودی برای تماشا اضافه می‌شود.");
  };

  if (loadingAnimation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-sm" style={{ color: "var(--text-muted)" }}>در حال بارگذاری...</div>
      </div>
    );
  }

  if (!animation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <div className="text-2xl text-red-400 font-bold">انیمیشن پیدا نشد</div>
          <Link to="/animation" className="inline-block px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition">بازگشت به آرشیو</Link>
        </div>
      </div>
    );
  }

  const payload = {
    id: animation.id,
    title: animation.title,
    poster: animation.poster,
    year: animation.year,
    duration: animation.duration,
  };

  const synopsis = animation.synopsis || "";
  const shortSynopsis = synopsis.length > 200 ? synopsis.slice(0, 200) + "..." : synopsis;

  const infoItems = [
    { icon: Calendar, label: "سال انتشار", value: String(animation.year) },
    { icon: Clock, label: "مدت زمان", value: animation.duration },
    { icon: Clapperboard, label: "کارگردان", value: animation.director },
    { icon: Users, label: "استودیو", value: animation.studio },
    { icon: Globe, label: "کشور", value: animation.country },
  ].filter((i) => i.value);

  return (
    <div className="themed-page space-y-0 pb-20">
      {/* ═══════════ HERO BANNER ═══════════ */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img src={animation.banner || animation.poster} alt={animation.title}
          className="w-full h-full object-cover scale-105 blur-[2px]"
          onError={(e) => { e.currentTarget.src = phBanner; }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-primary) 5%, color-mix(in srgb, var(--bg-primary) 80%, transparent) 40%, color-mix(in srgb, var(--bg-primary) 30%, transparent) 70%, transparent)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--bg-primary) 60%, transparent), transparent 60%)" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"
              style={{ top: `${20 + i * 12}%`, right: `${10 + i * 15}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${2 + i * 0.3}s` }} />
          ))}
        </div>
      </div>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-72 relative z-10 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── POSTER ── */}
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 via-cyan-500 to-pink-500 rounded-2xl opacity-60 group-hover:opacity-100 blur-md transition-opacity duration-500" />
              <div className="relative w-[220px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/40">
                <img src={animation.poster} alt={animation.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.currentTarget.src = phPoster; }} />
              </div>
            </div>

            {/* rating badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md"
              style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))", border: "1px solid rgba(234,179,8,0.3)" }}>
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span className="text-amber-300 font-black text-lg">{animation.rating}</span>
              <span className="text-xs mr-1" style={{ color: "var(--text-muted)" }}>/ ۱۰</span>
            </div>

            {/* user rating — حالا در پروفایل ذخیره می‌شود */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>امتیاز شما</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = n <= (hoveredStar || userRating);
                  return (
                    <Star key={n} size={20} className="cursor-pointer transition-all duration-200"
                      style={{ color: active ? "#fbbf24" : "var(--text-muted)", fill: active ? "#fbbf24" : "none", transform: active ? "scale(1.1)" : "none" }}
                      onMouseEnter={() => setHoveredStar(n)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setAnimationRating(payload, userRating === n ? 0 : n)} />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── DETAILS ── */}
          <div className="flex-1 space-y-5 pt-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black leading-tight" style={{ color: "var(--text-primary)" }}>{animation.title}</h1>
              {animation.titleEn && <p className="text-sm mt-1 font-medium" style={{ color: "var(--text-muted)" }}>{animation.titleEn}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}><Calendar size={12} /> {animation.year}</span>
              <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}><Clock size={12} /> {animation.duration}</span>
              <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}><Clapperboard size={12} /> فیلم سینمایی</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {animation.genres.map((g) => (
                <span key={g} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(0,234,255,0.1))", border: "1px solid rgba(168,85,247,0.3)", color: "var(--text-secondary)" }}>{g}</span>
              ))}
            </div>

            <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: "var(--text-primary)" }}><Clapperboard size={16} className="text-purple-400" />خلاصه داستان</h3>
              <p className="text-sm leading-7" style={{ color: "var(--text-secondary)" }}>{showFullSynopsis ? synopsis : shortSynopsis}</p>
              {synopsis.length > 200 && (
                <button onClick={() => setShowFullSynopsis((v) => !v)} className="mt-2 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                  {showFullSynopsis ? (<>بستن <ChevronUp size={14} /></>) : (<>بیشتر <ChevronDown size={14} /></>)}
                </button>
              )}
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleWatch}
                className="group relative overflow-hidden flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-white shadow-lg shadow-purple-900/40 transition-transform duration-300 hover:scale-[1.03] active:scale-95"
                style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 45%, #00eaff 100%)" }}>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"><Play size={18} className="fill-white text-white ml-0.5" /></span>
                <span className="relative text-base">تماشای فیلم</span>
              </button>

              {/* لیست من */}
              <button onClick={() => {
                  const wasIn = inList;
                  toggleAnimationWatchlist(payload);
                  if (!wasIn) addNotification({ title: "به لیست تماشا اضافه شد", message: `«${animation.title}» به لیست تماشای تو اضافه شد`, type: "success" });
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: inList ? "rgba(34,197,94,0.15)" : "var(--bg-card)", border: `1px solid ${inList ? "rgba(34,197,94,0.4)" : "var(--border-color)"}`, color: inList ? "#4ade80" : "var(--text-secondary)" }}>
                {inList ? <Check size={18} /> : <Plus size={18} />}{inList ? "در لیست من" : "لیست من"}
              </button>

              {/* لایک */}
              <button onClick={() => toggleAnimationLike(payload)} aria-label="پسندیدن"
                className="flex items-center justify-center h-[52px] w-[52px] rounded-2xl transition-all hover:scale-105 active:scale-95"
                style={{ background: isLiked ? "rgba(236,72,153,0.15)" : "var(--bg-card)", border: `1px solid ${isLiked ? "rgba(236,72,153,0.45)" : "var(--border-color)"}`, color: isLiked ? "#ec4899" : "var(--text-secondary)" }}>
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>

              {/* دانلود — حالا در پروفایل ذخیره می‌شود */}
              <button onClick={() => {
                  addAnimationDownload({ ...payload, quality: "1080p" });
                  addNotification({ title: "دانلود شروع شد", message: `دانلود «${animation.title}» به لیست دانلودها اضافه شد`, type: "info" });
                }} aria-label="دانلود"
                className="flex items-center justify-center h-[52px] w-[52px] rounded-2xl transition-all hover:scale-105 active:scale-95"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <Download size={20} />
              </button>

              {/* اشتراک */}
              <button onClick={handleShare} aria-label="اشتراک‌گذاری"
                className="flex items-center justify-center h-[52px] w-[52px] rounded-2xl transition-all hover:scale-105 active:scale-95"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ── INFO GRID ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {infoItems.map((item) => (
            <div key={item.label} className="rounded-2xl p-4 flex flex-col items-center text-center gap-1.5" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <item.icon size={20} className="text-purple-400" />
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.value}</span>
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── CHARACTERS ── */}
        {animation.characters && animation.characters.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-black" style={{ color: "var(--text-primary)" }}>کاراکترها</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animation.characters.map((c) => {
                const followed = isAnimationCharacterFollowed(c.id);
                return (
                  <div key={c.id} className="rounded-2xl overflow-hidden border transition-all duration-300 group"
                    style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={c.image} alt={c.name} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = phPoster; }} />
                      <button
                        onClick={() => toggleAnimationCharacter({ id: c.id, name: c.name, image: c.image, animationTitle: animation.title, animationId: animation.id, role: c.role })}
                        aria-label="فالو"
                        className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm text-white transition-all hover:scale-110 ${followed ? "bg-pink-500 shadow-lg shadow-pink-500/30" : "bg-black/50 hover:bg-pink-500/80"}`}>
                        <Heart size={16} className={followed ? "fill-white" : ""} />
                      </button>
                    </div>
                    <div className="p-2.5 text-center">
                      <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{c.name}</p>
                      {c.role && <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>{c.role}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimeDownloadSection contentId={animation.id} type="animation" />

        {/* ── SIMILAR ── */}
        {similar.length > 0 && (
          <div className="space-y-4 pt-2">
            <h2 className="text-xl font-black neon-text-pink">انیمیشن‌های مشابه</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map((item) => (<AnimationCard key={item.id} item={item} />))}
            </div>
          </div>
        )}

        {/* ── COMMENTS ── */}
        <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
          <CommentsSection targetType="animation" targetId={String(numericId)} title="دیدگاه‌های کاربران" />
        </div>
      </div>
    </div>
  );
}
