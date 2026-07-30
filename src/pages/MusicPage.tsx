import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music2,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import {
  getTrackById,
  getRelatedTracks,
  type MusicItem,
} from "../data/musicData";
import { useTheme } from "../contexts/ThemeContext";

// ─── تایپ کامنت (اگر در musicData نیست، اینجا تعریف می‌کنیم) ───
interface MusicComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  date: string;
  likes: number;
  dislikes: number;
  replies: MusicComment[];
}

// ─── کامپوننت پلیر ───
function MusicPlayer({ track }: { track: MusicItem }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // تبدیل duration متنی به ثانیه
  const totalSeconds = useMemo(() => {
    const parts = track.duration.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }, [track.duration]);

  // شبیه‌سازی پخش
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, totalSeconds]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = totalSeconds > 0 ? (currentTime / totalSeconds) * 100 : 0;

  return (
    <div
      className={`rounded-2xl p-6 mb-6 ${
        isDark
          ? "bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-800/30"
          : "bg-white shadow-lg"
      }`}
    >
      <div className="flex items-center gap-6">
        {/* کاور */}
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex gap-1">
                <span className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" />
                <span className="w-1 h-6 bg-purple-400 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse delay-150" />
                <span className="w-1 h-5 bg-purple-400 rounded-full animate-pulse delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* کنترل‌ها */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "hover:bg-purple-900/50 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} fill="white" />
              )}
            </button>

            <button
              onClick={() =>
                setCurrentTime(Math.min(totalSeconds, currentTime + 10))
              }
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "hover:bg-purple-900/50 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <SkipForward size={18} />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "hover:bg-purple-900/50 text-gray-300"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* نوار پیشرفت */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {formatTime(currentTime)}
            </span>
            <div
              className={`flex-1 h-1.5 rounded-full cursor-pointer ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const pct = x / rect.width;
                setCurrentTime(Math.floor(pct * totalSeconds));
              }}
            >
              <div
                className="h-full bg-purple-500 rounded-full transition-all relative"
                style={{ width: `${progress}%` }}
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow" />
              </div>
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {track.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── کامپوننت لیریک ───
function LyricsSection({ lyrics }: { lyrics?: string[] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [expanded, setExpanded] = useState(false);

  if (!lyrics || lyrics.length === 0) return null;

  const displayLyrics = expanded ? lyrics : lyrics.slice(0, 6);

  return (
    <div
      className={`rounded-2xl p-6 mb-6 ${
        isDark
          ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30"
          : "bg-white shadow-lg"
      }`}
    >
      <h3
        className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <Music2 size={20} className="text-purple-500" />
        متن آهنگ
      </h3>
      <div className="space-y-2">
        {displayLyrics.map((line, idx) => (
          <p
            key={idx}
            className={`text-sm leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
      {lyrics.length > 6 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-purple-500 text-sm mt-4 hover:text-purple-400 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} /> بستن
            </>
          ) : (
            <>
              <ChevronDown size={16} /> مشاهده کامل متن
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ─── کامپوننت اصلی ───
export default function MusicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [track, setTrack] = useState<MusicItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<MusicComment[]>([]);
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [dislikedComments, setDislikedComments] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<"latest" | "top">("latest");
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [userRating, setUserRating] = useState(0);

  // بارگذاری ترک
  useEffect(() => {
    if (!id) return;
    const found = getTrackById(id);
    if (found) {
      setTrack(found);
      setLikeCount(found.likes);
    }
  }, [id]);

  // خواندن از localStorage
  useEffect(() => {
    if (!id) return;
    const storedLiked = localStorage.getItem(`music_${id}_liked`);
    const storedLikeCount = localStorage.getItem(`music_${id}_likeCount`);
    const storedBookmarked = localStorage.getItem(`music_${id}_bookmarked`);
    const storedComments = localStorage.getItem(`music_${id}_comments`);
    const storedLikedComments = localStorage.getItem(
      `music_${id}_likedComments`
    );
    const storedDislikedComments = localStorage.getItem(
      `music_${id}_dislikedComments`
    );
    const storedRating = localStorage.getItem(`music_${id}_rating`);

    if (storedLiked) setLiked(JSON.parse(storedLiked));
    if (storedLikeCount) setLikeCount(JSON.parse(storedLikeCount));
    if (storedBookmarked) setBookmarked(JSON.parse(storedBookmarked));
    if (storedComments) setComments(JSON.parse(storedComments));
    if (storedLikedComments)
      setLikedComments(JSON.parse(storedLikedComments));
    if (storedDislikedComments)
      setDislikedComments(JSON.parse(storedDislikedComments));
    if (storedRating) setUserRating(JSON.parse(storedRating));
  }, [id]);

  // ذخیره در localStorage
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`music_${id}_liked`, JSON.stringify(liked));
    localStorage.setItem(`music_${id}_likeCount`, JSON.stringify(likeCount));
    localStorage.setItem(
      `music_${id}_bookmarked`,
      JSON.stringify(bookmarked)
    );
    localStorage.setItem(`music_${id}_comments`, JSON.stringify(comments));
    localStorage.setItem(
      `music_${id}_likedComments`,
      JSON.stringify(likedComments)
    );
    localStorage.setItem(
      `music_${id}_dislikedComments`,
      JSON.stringify(dislikedComments)
    );
    localStorage.setItem(`music_${id}_rating`, JSON.stringify(userRating));
  }, [
    id,
    liked,
    likeCount,
    bookmarked,
    comments,
    likedComments,
    dislikedComments,
    userRating,
  ]);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: MusicComment = {
      id: Date.now().toString(),
      username: "کاربر مهمان",
      avatar:
        "https://i.pravatar.cc/40?img=" + Math.floor(Math.random() * 70),
      text: newComment,
      date: "همین الان",
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim()) return;
    const reply: MusicComment = {
      id: Date.now().toString(),
      username: "کاربر مهمان",
      avatar:
        "https://i.pravatar.cc/40?img=" + Math.floor(Math.random() * 70),
      text: replyText,
      date: "همین الان",
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === parentId ? { ...c, replies: [...c.replies, reply] } : c
      )
    );
    setReplyText("");
    setReplyingTo(null);
  };

  const toggleCommentLike = (commentId: string) => {
    if (likedComments.includes(commentId)) {
      setLikedComments((prev) => prev.filter((cid) => cid !== commentId));
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: c.likes - 1 } : c
        )
      );
    } else {
      setLikedComments((prev) => [...prev, commentId]);
      setDislikedComments((prev) => prev.filter((cid) => cid !== commentId));
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                likes: c.likes + 1,
                dislikes: dislikedComments.includes(commentId)
                  ? c.dislikes - 1
                  : c.dislikes,
              }
            : c
        )
      );
    }
  };

  const toggleCommentDislike = (commentId: string) => {
    if (dislikedComments.includes(commentId)) {
      setDislikedComments((prev) => prev.filter((cid) => cid !== commentId));
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, dislikes: c.dislikes - 1 } : c
        )
      );
    } else {
      setDislikedComments((prev) => [...prev, commentId]);
      setLikedComments((prev) => prev.filter((cid) => cid !== commentId));
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                dislikes: c.dislikes + 1,
                likes: likedComments.includes(commentId)
                  ? c.likes - 1
                  : c.likes,
              }
            : c
        )
      );
    }
  };

  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    if (sortOption === "top") {
      sorted.sort((a, b) => b.likes - a.likes);
    }
    return sorted;
  }, [comments, sortOption]);

  const related = useMemo(
    () => (track ? getRelatedTracks(track.id) : []),
    [track]
  );

  // ─── حالت لودینگ / نات فاند ───
  if (!track) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#050116]" : "bg-slate-50"
        }`}
      >
        <div className="text-center">
          <Music2
            size={48}
            className={`mx-auto mb-4 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            موزیک مورد نظر پیدا نشد
          </p>
          <button
            onClick={() => navigate("/music")}
            className="mt-4 text-purple-500 hover:text-purple-400 text-sm"
          >
            بازگشت به صفحه موزیک
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={isDark ? "bg-[#050116] min-h-screen" : "bg-slate-50 min-h-screen"}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* دکمه بازگشت */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-sm mb-6 transition-colors ${
            isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ArrowLeft size={16} />
          بازگشت
        </button>

        {/* هدر */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
              {track.type}
            </span>
            {track.isHot && (
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                داغ
              </span>
            )}
            {track.isFeatured && (
              <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={12} /> ویژه
              </span>
            )}
          </div>

          <h1
            className={`text-2xl md:text-3xl font-black mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {track.title}
          </h1>

          <p
            className={`text-base mb-3 ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
          >
            {track.artist} • {track.anime}
          </p>

          <div
            className={`flex flex-wrap items-center gap-4 text-xs ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <span className="flex items-center gap-1">
              <Clock size={14} /> {track.releaseDate}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {track.views.toLocaleString("fa-IR")} بازدید
            </span>
            <span className="flex items-center gap-1">
              <Heart size={14} /> {likeCount.toLocaleString("fa-IR")}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} /> {comments.length} نظر
            </span>
          </div>
        </header>

        {/* تصویر کاور */}
        <div className="rounded-2xl overflow-hidden mb-6">
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-full h-[320px] md:h-[420px] object-cover"
          />
        </div>

        {/* پلیر */}
        <MusicPlayer track={track} />

        {/* امتیازدهی کاربر */}
        <div
          className={`rounded-2xl p-6 mb-6 ${
            isDark
              ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30"
              : "bg-white shadow-lg"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            امتیاز شما
          </h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setUserRating(star)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  size={28}
                  className={
                    star <= userRating
                      ? "text-yellow-400 fill-yellow-400"
                      : isDark
                      ? "text-gray-600"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
            {userRating > 0 && (
              <span
                className={`mr-3 text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {userRating}/۵
              </span>
            )}
          </div>
        </div>

        {/* توضیحات */}
        <div
          className={`rounded-2xl p-6 mb-6 ${
            isDark
              ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30"
              : "bg-white shadow-lg"
          }`}
        >
          <p
            className={`leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {track.summary}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {track.genre.map((g) => (
              <span
                key={g}
                className={`text-xs px-3 py-1 rounded-full ${
                  isDark
                    ? "bg-purple-900/40 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* لیریک */}
        <LyricsSection lyrics={track.lyrics} />

        {/* نوار اکشن‌ها */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              liked
                ? "bg-red-500 text-white"
                : isDark
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Heart className={liked ? "fill-current" : ""} size={16} />
            {liked ? "پسندیده شده" : "پسندیدن"} •{" "}
            {likeCount.toLocaleString("fa-IR")}
          </button>

          <button
            onClick={() => setBookmarked((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              bookmarked
                ? "bg-yellow-500 border-yellow-500 text-black"
                : isDark
                ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Bookmark className={bookmarked ? "fill-current" : ""} size={16} />
            {bookmarked ? "ذخیره شده" : "ذخیره"}
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isDark
                ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <Share2 size={16} />
            اشتراک‌گذاری
          </button>
        </div>

        {/* بخش کامنت‌ها */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              نظرات ({comments.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSortOption("latest")}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  sortOption === "latest"
                    ? "bg-purple-600 text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                جدیدترین
              </button>
              <button
                onClick={() => setSortOption("top")}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  sortOption === "top"
                    ? "bg-purple-600 text-white"
                    : isDark
                    ? "bg-gray-800 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                محبوب‌ترین
              </button>
            </div>
          </div>

          {/* فرم ارسال نظر */}
          <div
            className={`rounded-2xl p-4 mb-6 ${
              isDark
                ? "bg-gray-900/50 border border-gray-800"
                : "bg-white shadow"
            }`}
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="نظر خود را بنویسید..."
              rows={3}
              className={`w-full rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? "bg-gray-800 text-white placeholder-gray-500"
                  : "bg-gray-50 text-gray-900 placeholder-gray-400"
              }`}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-6 py-2 rounded-full transition-colors"
              >
                ارسال نظر
              </button>
            </div>
          </div>

                  {/* لیست کامنت‌ها */}
          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <div key={comment.id}>
                <div
                  className={`rounded-2xl p-4 ${
                    isDark
                      ? "bg-gray-900/50 border border-gray-800"
                      : "bg-white shadow"
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-bold text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {comment.username}
                        </span>
                        <span
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {comment.date}
                        </span>
                      </div>
                      <p
                        className={`text-sm mb-3 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleCommentLike(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            likedComments.includes(comment.id)
                              ? "text-purple-500"
                              : isDark
                              ? "text-gray-400 hover:text-purple-400"
                              : "text-gray-600 hover:text-purple-600"
                          }`}
                        >
                          <ThumbsUp
                            size={14}
                            className={
                              likedComments.includes(comment.id)
                                ? "fill-current"
                                : ""
                            }
                          />
                          {comment.likes}
                        </button>
                        <button
                          onClick={() => toggleCommentDislike(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            dislikedComments.includes(comment.id)
                              ? "text-red-500"
                              : isDark
                              ? "text-gray-400 hover:text-red-400"
                              : "text-gray-600 hover:text-red-600"
                          }`}
                        >
                          <ThumbsDown
                            size={14}
                            className={
                              dislikedComments.includes(comment.id)
                                ? "fill-current"
                                : ""
                            }
                          />
                          {comment.dislikes}
                        </button>
                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${
                            isDark
                              ? "text-gray-400 hover:text-gray-200"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          <Reply size={14} />
                          پاسخ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* فرم ریپلای */}
                {replyingTo === comment.id && (
                  <div
                    className={`mr-12 mt-3 rounded-xl p-3 ${
                      isDark ? "bg-gray-800/50" : "bg-gray-50"
                    }`}
                  >
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="پاسخ خود را بنویسید..."
                      rows={2}
                      className={`w-full rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        isDark
                          ? "bg-gray-900 text-white placeholder-gray-500"
                          : "bg-white text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-gray-200"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        انصراف
                      </button>
                      <button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs px-4 py-1 rounded-full transition-colors"
                      >
                        ارسال
                      </button>
                    </div>
                  </div>
                )}

                {/* ریپلای‌ها */}
                {comment.replies.length > 0 && (
                  <div className="mr-12 mt-3 space-y-3">
                    {comment.replies.map((reply: MusicComment) => (
                      <div
                        key={reply.id}
                        className={`rounded-xl p-3 ${
                          isDark
                            ? "bg-gray-800/30 border border-gray-700/50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex gap-2">
                          <img
                            src={reply.avatar}
                            alt={reply.username}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`font-bold text-xs ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {reply.username}
                              </span>
                              <span
                                className={`text-xs ${
                                  isDark ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                {reply.date}
                              </span>
                            </div>
                            <p
                              className={`text-xs ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* موزیک‌های مرتبط */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              موزیک‌های مرتبط
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/music/${item.id}`}
                  className={`group rounded-xl overflow-hidden transition-all hover:scale-[1.02] ${
                    isDark
                      ? "bg-gray-900/60 border border-gray-800 hover:border-purple-500"
                      : "bg-white shadow hover:shadow-xl"
                  }`}
                >
                  <div className="relative">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-white" fill="white" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p
                      className={`text-xs mb-1 ${
                        isDark ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      {item.type}
                    </p>
                    <h3
                      className={`text-sm font-bold mb-1 line-clamp-1 group-hover:text-purple-500 transition-colors ${
                        isDark ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.artist}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
