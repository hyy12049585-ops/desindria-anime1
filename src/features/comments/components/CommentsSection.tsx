import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  Reply as ReplyIcon,
  Trash2,
  Lock,
  LogIn,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export interface CommentNode {
  id: string;
  author: string;
  authorId?: string;
  text: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: CommentNode[];
}

interface CommentsSectionProps {
  /** نوع محتوا: "news" | "music" | ... (در کلید ذخیره‌سازی استفاده می‌شود) */
  targetType: string;
  /** شناسه‌ی محتوا */
  targetId: string;
  title?: string;
  initialComments?: CommentNode[];
}

type SortType = "newest" | "popular";

// ──────────────────────────────────────────────
// Storage helpers
// ──────────────────────────────────────────────
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

// ──────────────────────────────────────────────
// Tree helpers (همگی pure هستند تا با StrictMode سازگار باشند)
// ──────────────────────────────────────────────
function ensureShape(list: CommentNode[]): CommentNode[] {
  return list.map((c) => ({
    ...c,
    createdAt:
      c.createdAt ||
      (c as { date?: string }).date ||
      new Date().toISOString(),
    likes: c.likes ?? 0,
    dislikes: c.dislikes ?? 0,
    replies: c.replies ? ensureShape(c.replies) : [],
  }));
}
function updateById(
  list: CommentNode[],
  id: string,
  updater: (c: CommentNode) => CommentNode
): CommentNode[] {
  return list.map((c) =>
    c.id === id
      ? updater(c)
      : { ...c, replies: c.replies ? updateById(c.replies, id, updater) : [] }
  );
}

function deleteById(list: CommentNode[], id: string): CommentNode[] {
  return list
    .filter((c) => c.id !== id)
    .map((c) => ({
      ...c,
      replies: c.replies ? deleteById(c.replies, id) : [],
    }));
}

function countReplies(list: CommentNode[]): number {
  return list.reduce(
    (total, c) =>
      total + (c.replies?.length || 0) + countReplies(c.replies || []),
    0
  );
}

function formatDate(date?: string): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────
export default function CommentsSection({
  targetType,
  targetId,
  title = "دیدگاه‌های کاربران",
  initialComments = [],
}: CommentsSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { profile, isAuthenticated } = useAuth();
  const userId = profile.id || "";
  const currentName =
    profile.displayName || profile.username || "کاربر";

  const baseKey = `${targetType}-${targetId}`;

  const [comments, setComments] = useState<CommentNode[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sort, setSort] = useState<SortType>("newest");
  const [liked, setLiked] = useState<Set<string>>(() => new Set());
  const [disliked, setDisliked] = useState<Set<string>>(() => new Set());

  const isInitialized = useRef(false);

  // ──── Load (هر بار که محتوا یا کاربر عوض شد) ────
  useEffect(() => {
    if (!targetId) return;
    isInitialized.current = false;

    const storedComments = loadJSON<CommentNode[]>(
      `${baseKey}-comments`,
      initialComments
    );
    setComments(ensureShape(storedComments));

    if (userId) {
      setLiked(new Set(loadJSON<string[]>(`${baseKey}-${userId}-liked`, [])));
      setDisliked(
        new Set(loadJSON<string[]>(`${baseKey}-${userId}-disliked`, []))
      );
    } else {
      setLiked(new Set());
      setDisliked(new Set());
    }

    const t = setTimeout(() => {
      isInitialized.current = true;
    }, 0);
    return () => clearTimeout(t);
    // initialComments عمداً در deps نیست تا حلقه‌ی ذخیره/بارگذاری ایجاد نشود
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseKey, targetId, userId]);

  // ──── Persist comments ────
  useEffect(() => {
    if (!isInitialized.current || !targetId) return;
    saveJSON(`${baseKey}-comments`, comments);
  }, [comments, baseKey, targetId]);

  // ──── Persist per-user reactions ────
  useEffect(() => {
    if (!isInitialized.current || !targetId || !userId) return;
    saveJSON(`${baseKey}-${userId}-liked`, [...liked]);
    saveJSON(`${baseKey}-${userId}-disliked`, [...disliked]);
  }, [liked, disliked, baseKey, targetId, userId]);

  const totalReplies = useMemo(() => countReplies(comments), [comments]);

  const sortedComments = useMemo(() => {
    const cloned = [...comments];
    if (sort === "popular") {
      return cloned.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return cloned.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }, [comments, sort]);

  const navigate = useNavigate();
  const ensureAuth = useCallback((): boolean => {
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  // ──── Handlers ────
  const handleAddComment = useCallback(() => {
    if (!ensureAuth()) return;
    const text = newComment.trim();
    if (!text) return;

    const comment: CommentNode = {
      id: makeId(),
      author: currentName,
      authorId: userId,
      text,
      createdAt: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  }, [ensureAuth, newComment, currentName, userId]);

  const handleAddReply = useCallback(
    (parentId: string) => {
      if (!ensureAuth()) return;
      const text = replyText.trim();
      if (!text) return;

      const reply: CommentNode = {
        id: makeId(),
        author: currentName,
        authorId: userId,
        text,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
      };
      setComments((prev) =>
        updateById(prev, parentId, (c) => ({
          ...c,
          replies: [...(c.replies || []), reply],
        }))
      );
      setReplyText("");
      setReplyingTo(null);
    },
    [ensureAuth, replyText, currentName, userId]
  );

  const handleDelete = useCallback((commentId: string) => {
    setComments((prev) => deleteById(prev, commentId));
    setLiked((prev) => {
      const n = new Set(prev);
      n.delete(commentId);
      return n;
    });
    setDisliked((prev) => {
      const n = new Set(prev);
      n.delete(commentId);
      return n;
    });
  }, []);

  const handleLike = useCallback(
    (commentId: string) => {
      if (!ensureAuth()) return;
      const wasLiked = liked.has(commentId);
      const wasDisliked = disliked.has(commentId);

      setComments((prev) =>
        updateById(prev, commentId, (c) => ({
          ...c,
          likes: Math.max(0, (c.likes || 0) + (wasLiked ? -1 : 1)),
          dislikes: Math.max(0, (c.dislikes || 0) + (wasDisliked ? -1 : 0)),
        }))
      );
      setLiked((prev) => {
        const n = new Set(prev);
        wasLiked ? n.delete(commentId) : n.add(commentId);
        return n;
      });
      if (wasDisliked) {
        setDisliked((prev) => {
          const n = new Set(prev);
          n.delete(commentId);
          return n;
        });
      }
    },
    [ensureAuth, liked, disliked]
  );

  const handleDislike = useCallback(
    (commentId: string) => {
      if (!ensureAuth()) return;
      const wasLiked = liked.has(commentId);
      const wasDisliked = disliked.has(commentId);

      setComments((prev) =>
        updateById(prev, commentId, (c) => ({
          ...c,
          likes: Math.max(0, (c.likes || 0) + (wasLiked ? -1 : 0)),
          dislikes: Math.max(0, (c.dislikes || 0) + (wasDisliked ? -1 : 1)),
        }))
      );
      setDisliked((prev) => {
        const n = new Set(prev);
        wasDisliked ? n.delete(commentId) : n.add(commentId);
        return n;
      });
      if (wasLiked) {
        setLiked((prev) => {
          const n = new Set(prev);
          n.delete(commentId);
          return n;
        });
      }
    },
    [ensureAuth, liked, disliked]
  );

  const canDelete = useCallback(
    (c: CommentNode): boolean => {
      if (!isAuthenticated) return false;
      if (c.authorId) return c.authorId === userId;
      return c.author === currentName; // سازگاری با کامنت‌های قدیمی بدون id
    },
    [isAuthenticated, userId, currentName]
  );

  // ──── Render a single comment (با پاسخ‌های تودرتو) ────
  const renderComment = (comment: CommentNode, level = 0) => {
    const isLiked = liked.has(comment.id);
    const isDisliked = disliked.has(comment.id);

    return (
      <div
        key={comment.id}
        className={`rounded-2xl border p-4 transition ${
          level > 0 ? "mr-4 mt-3 border-r-4 border-r-purple-400" : "mt-4"
        } ${
          isDark ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-purple-500/20">
              {(comment.author || "ک").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h4
                className={`font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {comment.author || "کاربر"}
              </h4>
              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>

          {canDelete(comment) && (
            <button
              type="button"
              onClick={() => handleDelete(comment.id)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition ${
                isDark
                  ? "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف
            </button>
          )}
        </div>

        <p
          className={`mt-4 leading-8 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {comment.text}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleLike(comment.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
              isLiked
                ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                : isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
            {comment.likes || 0}
          </button>

          <button
            type="button"
            onClick={() => handleDislike(comment.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
              isDisliked
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-red-300"
                : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
            {comment.dislikes || 0}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!ensureAuth()) return;
              setReplyingTo((cur) => (cur === comment.id ? null : comment.id));
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
              isDark
                ? "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-purple-300"
                : "bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            <ReplyIcon className="h-4 w-4" />
            پاسخ
          </button>
        </div>

        {replyingTo === comment.id && (
          <div
            className={`mt-4 rounded-2xl border p-4 ${
              isDark
                ? "border-white/10 bg-black/20"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="پاسخ خود را بنویسید..."
              rows={3}
              className={`w-full resize-none rounded-xl border p-3 text-sm outline-none transition ${
                isDark
                  ? "border-white/10 bg-black/20 text-white placeholder:text-gray-500 focus:border-purple-400"
                  : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-400"
              }`}
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleAddReply(comment.id)}
                disabled={!replyText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ارسال پاسخ
                <Send className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className={`rounded-xl px-4 py-2 text-sm transition ${
                  isDark
                    ? "bg-white/5 text-gray-300 hover:bg-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // ──── Main render ────
  return (
    <section dir="rtl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h2
              className={`text-2xl font-black ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mt-1 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {comments.length} دیدگاه و {totalReplies} پاسخ
            </p>
          </div>
        </div>

        <div
          className={`flex w-fit items-center rounded-xl p-1 ${
            isDark ? "bg-white/5" : "bg-gray-100"
          }`}
        >
          <button
            type="button"
            onClick={() => setSort("newest")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              sort === "newest"
                ? isDark
                  ? "bg-white/10 text-purple-300 shadow-sm"
                  : "bg-white text-purple-600 shadow-sm"
                : isDark
                ? "text-gray-400 hover:text-purple-300"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            جدیدترین
          </button>
          <button
            type="button"
            onClick={() => setSort("popular")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              sort === "popular"
                ? isDark
                  ? "bg-white/10 text-purple-300 shadow-sm"
                  : "bg-white text-purple-600 shadow-sm"
                : isDark
                ? "text-gray-400 hover:text-purple-300"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            محبوب‌ترین
          </button>
        </div>
      </div>

      {/* فرم ارسال / دعوت به ورود */}
      <div
        className={`mb-6 rounded-2xl border p-4 ${
          isDark ? "border-white/10 bg-black/20" : "border-gray-200 bg-gray-50"
        }`}
      >
        {isAuthenticated ? (
          <>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-purple-500/20">
                {currentName.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentName}
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  دیدگاه شما با این حساب ثبت می‌شود
                </p>
              </div>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="دیدگاه خود را بنویسید..."
              rows={4}
              className={`w-full resize-none rounded-xl border p-3 text-sm outline-none transition ${
                isDark
                  ? "border-white/10 bg-black/20 text-white placeholder:text-gray-500 focus:border-purple-400"
                  : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-purple-400"
              }`}
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ارسال دیدگاه
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-500">
              <Lock className="h-6 w-6" />
            </div>
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              برای ثبت دیدگاه ابتدا وارد حساب کاربری شوید
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              ورود / ثبت‌نام
            </Link>
          </div>
        )}
      </div>

      {/* لیست کامنت‌ها */}
      {sortedComments.length === 0 ? (
        <div
          className={`py-16 text-center ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          <MessageCircle className="mx-auto mb-4 h-12 w-12 opacity-30" />
          <p className="text-lg font-medium">هنوز دیدگاهی ثبت نشده</p>
          <p className="mt-1 text-sm">اولین نفری باشید که دیدگاه می‌گذارد!</p>
        </div>
      ) : (
        <div>{sortedComments.map((comment) => renderComment(comment))}</div>
      )}
    </section>
  );
}