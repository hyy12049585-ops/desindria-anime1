import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  Play,
  Plus,
  Check,
  Star,
  Calendar,
  Clock,
  Film,
  Users,
  Heart,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Tv,
  Globe,
  Award,
  TrendingUp,
  Eye,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useAnimeDetail } from "@/features/anime/hooks/useAnimeDetail";
import { useUserData } from "@/contexts/UserDataContext";
import { addRecent } from "@/services/recentService";
import { incrementAnimeView } from "@/services/animeService";
import AnimeRow from "@/features/home/components/AnimeRow";
import CommentsSection from "@/features/comments/components/CommentsSection";
import AnimeDownloadSection from "@/components/anime/AnimeDownloadSection";

export default function AnimeDetailsPage() {
  const { id } = useParams();
  const numericId = Number(id);
  const { anime, similarAnime, loading, error } =
    useAnimeDetail(numericId);

  const {
    toggleFavorite, isInFavorites, toggleWatchlist, isInWatchlist, setRating, getRating,
    addDownload, addNotification, toggleFollowCharacter, isCharacterFollowed,
  } = useUserData();

  const isFav = anime ? isInFavorites(numericId) : false;
  const isWatch = anime ? isInWatchlist(numericId) : false;

  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [activeTab, setActiveTab] = useState<"characters" | "info">("characters");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userRating, setUserRating] = useState(0);

  // مقداردهی اولیهٔ امتیاز کاربر از روی دادهٔ ذخیره‌شده
  useEffect(() => {
    if (!anime) return;
    setUserRating(getRating(numericId));
  }, [anime, numericId, getRating]);

  // ثبت بازدید در «اخیراً تماشا‌شده»
  useEffect(() => {
    if (!anime) return;
    addRecent('anime', {
      id: numericId,
      title: anime.title,
      poster: anime.poster,
      subtitle: anime.titleEn || '',
      linkTo: `/anime/${numericId}`,
    });
  }, [anime, numericId]);

  // شمارش بازدید واقعی (یک‌بار برای هر بازکردن صفحه)
  const viewedRef = useRef<string | number | null>(null);
  useEffect(() => {
    if (!anime) return;
    if (viewedRef.current === numericId) return; // جلوی شمارش دوباره (StrictMode)
    viewedRef.current = numericId;
    incrementAnimeView(numericId);
  }, [anime, numericId]);

  const handleToggleWatchlist = () => {
    if (!anime) return;
    const wasIn = isWatch;
    toggleWatchlist({
      id: numericId,
      title: anime.title,
      poster: anime.poster,
      type: "anime",
    });
    // اعلان خودکار هنگام افزودن (نه حذف)
    if (!wasIn) {
      addNotification({
        title: "به لیست تماشا اضافه شد",
        message: `«${anime.title}» به لیست تماشای تو اضافه شد`,
        type: "success",
      });
    }
  };

  const handleDownload = () => {
    if (!anime) return;
    addDownload({
      id: numericId,
      title: anime.title,
      poster: anime.poster,
      quality: "1080p",
    });
    addNotification({
      title: "دانلود شروع شد",
      message: `دانلود «${anime.title}» به لیست دانلودها اضافه شد`,
      type: "info",
    });
  };

  const handleToggleFavorite = () => {
    if (!anime) return;
    toggleFavorite({
      id: numericId,
      title: anime.title,
      poster: anime.poster,
      type: "anime",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: anime?.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("لینک کپی شد!");
      }
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
          <p style={{ color: "var(--text-muted)" }} className="animate-pulse">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <div className="text-2xl text-red-400 font-bold">
            {error || "انیمه پیدا نشد"}
          </div>
          <Link
            to="/"
            className="inline-block px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    );
  }

  const synopsis = anime.synopsis || "";
  const shortSynopsis =
    synopsis.length > 200 ? synopsis.slice(0, 200) + "..." : synopsis;

  const infoItems = [
    { icon: Calendar, label: "سال انتشار", value: anime.year },
    { icon: Film, label: "تعداد قسمت", value: `${anime.episodes} قسمت` },
    { icon: Clock, label: "مدت هر قسمت", value: anime.duration },
    { icon: Users, label: "استودیو", value: anime.studio },
    { icon: Tv, label: "نوع", value: anime.type || "TV" },
    { icon: Globe, label: "منبع", value: anime.source || "مانگا" },
    {
      icon: TrendingUp,
      label: "رتبه",
      value: anime.rank ? `#${anime.rank}` : "—",
    },
    {
      icon: Eye,
      label: "وضعیت",
      value: anime.status || "در حال پخش",
    },
  ];

  return (
    <div className="themed-page space-y-0 pb-20">
      {/* ═══════════ HERO BANNER ═══════════ */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <img
          src={anime.banner || anime.poster}
          alt={anime.title}
          className="w-full h-full object-cover scale-105 blur-[2px]"
        />
        {/* overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--bg-primary) 5%, color-mix(in srgb, var(--bg-primary) 80%, transparent) 40%, color-mix(in srgb, var(--bg-primary) 30%, transparent) 70%, transparent)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--bg-primary) 60%, transparent), transparent 60%)",
          }}
        />
        {/* floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"
              style={{
                top: `${20 + i * 12}%`,
                right: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.3}s`,
              }}
            />
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
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* play overlay */}
                <Link
                  to={`/watch/${id}/1`}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                    <Play size={24} className="text-white fill-white ml-1" />
                  </div>
                </Link>
              </div>
            </div>

            {/* rating badge */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))",
                border: "1px solid rgba(234,179,8,0.3)",
              }}
            >
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span className="text-amber-300 font-black text-lg">
                {anime.rating}
              </span>
              <span
                className="text-xs mr-1"
                style={{ color: "var(--text-muted)" }}
              >
                / ۱۰
              </span>
            </div>

            {/* user rating */}
            <div className="flex flex-col items-center gap-1">
              <span
                className="text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                امتیاز شما
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={20}
                    className={`cursor-pointer transition-all duration-200 ${
                      n <= (hoveredStar || userRating)
                        ? "text-amber-400 fill-amber-400 scale-110"
                        : "text-gray-600 hover:text-amber-400/50"
                    }`}
                    onMouseEnter={() => setHoveredStar(n)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => {
                      setUserRating(n);
                      if (anime) {
                        setRating({
                          id: numericId,
                          title: anime.title,
                          poster: anime.poster,
                          rating: n,
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── DETAILS ── */}
          <div className="flex-1 space-y-5 pt-4">
            {/* title */}
            <div>
              <h1
                className="text-3xl md:text-5xl font-black leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {anime.title}
              </h1>
              {anime.titleEn && (
                <p
                  className="text-sm mt-1 font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {anime.titleEn}
                </p>
              )}
              {anime.japaneseTitle && (
                <p className="text-xs mt-0.5 text-purple-400/70 font-light">
                  {anime.japaneseTitle}
                </p>
              )}
            </div>

            {/* meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              {anime.year && (
                <span
                  className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Calendar size={12} /> {anime.year}
                </span>
              )}
              {anime.duration && (
                <span
                  className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Clock size={12} /> {anime.duration}
                </span>
              )}
              <span
                className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <Film size={12} /> {anime.episodes} قسمت
              </span>
              {anime.studio && (
                <span
                  className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-sm"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Users size={12} /> {anime.studio}
                </span>
              )}
              {anime.status && (
                <span className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Sparkles size={12} /> {anime.status}
                </span>
              )}
            </div>

            {/* genres */}
            <div className="flex flex-wrap gap-2">
              {anime.genres?.map((g: string) => (
                <span
                  key={g}
                  className="text-[11px] px-3 py-1.5 rounded-full font-medium transition-all duration-300 hover:scale-105 cursor-default"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(147,51,234,0.15), rgba(6,182,212,0.1))",
                    border: "1px solid rgba(147,51,234,0.3)",
                    color: "rgb(196,148,255)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            {/* synopsis */}
            <div
              className="rounded-2xl p-5 backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--bg-card) 80%, transparent), var(--bg-card))",
                border: "1px solid var(--border-color)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle
                  size={14}
                  className="text-purple-400"
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  خلاصه داستان
                </span>
              </div>
              <p
                className="text-sm leading-8"
                style={{ color: "var(--text-secondary)" }}
              >
                {showFullSynopsis ? synopsis : shortSynopsis}
              </p>
              {synopsis.length > 200 && (
                <button
                  onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                  className="flex items-center gap-1 mt-3 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showFullSynopsis ? (
                    <>
                      بستن <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      ادامه مطلب <ChevronDown size={14} />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={`/watch/${id}/1`}
                className="group relative flex items-center gap-2 font-bold px-8 py-3.5 rounded-xl text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #9333ea, #06b6d4)",
                }}
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />
                <Play
                  size={18}
                  className="fill-white relative z-10"
                />
                <span className="relative z-10">شروع تماشا</span>
              </Link>

              <button
                onClick={handleToggleWatchlist}
                className={`group flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] ${
                  isWatch
                    ? "bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10"
                    : "hover:bg-purple-500/10"
                }`}
                style={{
                  border: isWatch
                    ? "1px solid rgb(168 85 247 / 0.5)"
                    : "1px solid var(--border-color)",
                  color: isWatch ? undefined : "var(--text-secondary)",
                }}
              >
                {isWatch ? (
                  <Check size={16} className="animate-[scale_0.3s_ease]" />
                ) : (
                  <Plus
                    size={16}
                    className="group-hover:rotate-90 transition-transform duration-300"
                  />
                )}
                {isWatch ? "در لیست من" : "لیست من"}
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`group p-3.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isFav
                    ? "text-pink-400 bg-pink-500/15 shadow-lg shadow-pink-500/10"
                    : "hover:text-pink-400 hover:bg-pink-500/5"
                }`}
                style={{
                  border: isFav
                    ? "1px solid rgb(236 72 153 / 0.4)"
                    : "1px solid var(--border-color)",
                  color: isFav ? undefined : "var(--text-muted)",
                }}
              >
                <Heart
                  size={18}
                  className={`transition-all duration-300 ${isFav ? "fill-pink-400 scale-110" : "group-hover:scale-110"}`}
                />
              </button>

              <button
                onClick={handleShare}
                className="group p-3.5 rounded-xl transition-all duration-300 hover:scale-110 hover:text-cyan-300 hover:bg-cyan-500/5"
                style={{
                  border: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                }}
              >
                <Share2
                  size={18}
                  className="group-hover:rotate-12 transition-transform duration-300"
                />
              </button>

              <button
                onClick={handleDownload}
                className="group p-3.5 rounded-xl transition-all duration-300 hover:scale-110 hover:text-emerald-300 hover:bg-emerald-500/5"
                style={{
                  border: "1px solid var(--border-color)",
                  color: "var(--text-muted)",
                }}
                title="دانلود"
              >
                <Download
                  size={18}
                  className="group-hover:translate-y-0.5 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════ INFO GRID ═══════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl p-4 text-center backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-500/5 cursor-default"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
              }}
            >
              <item.icon
                size={20}
                className="mx-auto mb-2 text-purple-400 group-hover:text-cyan-400 transition-colors duration-300"
              />
              <div
                className="text-sm font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.value || "—"}
              </div>
              <div
                className="text-[10px] mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <AnimeDownloadSection contentId={anime.id} type="anime" />

        {/* ═══════════ TABS ═══════════ */}
        <div>
          <div
            className="flex gap-1 p-1 rounded-2xl w-fit mx-auto backdrop-blur-md"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            {[
              { key: "characters" as const, label: "شخصیت‌ها", icon: Users },
              { key: "info" as const, label: "اطلاعات بیشتر", icon: Award },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "text-white shadow-lg"
                    : "hover:bg-white/5"
                }`}
                style={{
                  background:
                    activeTab === tab.key
                      ? "linear-gradient(135deg, #9333ea, #06b6d4)"
                      : "transparent",
                  color:
                    activeTab === tab.key
                      ? "white"
                      : "var(--text-muted)",
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="mt-6">
            {/* ── CHARACTERS TAB ── */}
            {activeTab === "characters" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {((anime as any).characters || []).length > 0 ? (
                  (anime as any).characters.map((char: any, idx: number) => {
                    const charId = char.id ?? `${numericId}-${idx}`;
                    const followed = isCharacterFollowed(charId);
                    return (
                    <div
                      key={idx}
                      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10"
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div className="aspect-[3/4] overflow-hidden relative">
                        <img
                          src={char.image}
                          alt={char.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                          onClick={() =>
                            toggleFollowCharacter({
                              id: charId,
                              name: char.name,
                              image: char.image,
                              animeName: anime.title,
                              animeId: numericId,
                            })
                          }
                          className="absolute bottom-2 left-2 right-2 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-300 backdrop-blur-md"
                          style={{
                            background: followed
                              ? "color-mix(in srgb, var(--accent) 85%, transparent)"
                              : "rgba(0,0,0,0.55)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.18)",
                          }}
                        >
                          {followed ? "دنبال می‌کنی ✓" : "دنبال کردن"}
                        </button>
                      </div>
                      <div className="p-3 text-center">
                        <p
                          className="text-xs font-bold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {char.name}
                        </p>
                        {char.role && (
                          <p
                            className="text-[10px] mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {char.role}
                          </p>
                        )}
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div
                    className="col-span-full text-center py-16"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Users size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">اطلاعات شخصیت‌ها موجود نیست</p>
                  </div>
                )}
              </div>
            )}

            {/* ── INFO TAB ── */}
            {activeTab === "info" && (
              <div
                className="rounded-2xl p-6 max-w-2xl mx-auto space-y-4"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {[
                  { label: "عنوان اصلی", value: anime.title },
                  { label: "عنوان انگلیسی", value: anime.titleEn },
                  { label: "عنوان ژاپنی", value: anime.japaneseTitle },
                  { label: "نوع", value: anime.type || "TV" },
                  { label: "تعداد قسمت‌ها", value: anime.episodes },
                  { label: "وضعیت", value: anime.status },
                  { label: "سال", value: anime.year },
                  { label: "فصل", value: anime.season },
                  { label: "استودیو", value: anime.studio },
                  { label: "منبع", value: anime.source },
                  { label: "مدت زمان", value: anime.duration },
                  { label: "رده سنی", value: anime.ageRating },
                  {
                    label: "ژانرها",
                    value: anime.genres?.join("، "),
                  },
                ].map(
                  (row) =>
                    row.value && (
                      <div
                        key={row.label}
                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                        style={{ borderColor: "var(--border-color)" }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {row.label}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {row.value}
                        </span>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>

  {/* ═══════════ SIMILAR ANIME ═══════════ */}
        {similarAnime && similarAnime.length > 0 && (
          <div className="pt-4">
            <AnimeRow title="انیمه‌های مشابه" animes={similarAnime} />
          </div>
        )}

        {/* ═══════════ COMMENTS ═══════════ */}
        <div
          className="rounded-2xl p-5 sm:p-6 mt-4"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <CommentsSection
            targetType="anime"
            targetId={String(numericId)}
            title="دیدگاه‌های کاربران"
          />
        </div>
      </div>
    </div>
  );
}
