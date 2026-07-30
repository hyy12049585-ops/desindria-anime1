import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getArticleById, getRelatedArticles } from "../../../services/newsService";
import type { NewsArticle } from "../../../data/newsData";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import CommentsSection, {
  type CommentNode,
} from "../../comments/components/CommentsSection";
import { addRecent } from "../../../services/recentService";

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
    /* ignore */
  }
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

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { isAuthenticated } = useAuth();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loadingArticle, setLoadingArticle] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingArticle(true);
    (async () => {
      const a = await getArticleById(id || "");
      if (!active) return;
      setArticle(a);
      setRelatedArticles(a ? await getRelatedArticles(a) : []);
      setLoadingArticle(false);
    })();
    return () => { active = false; };
  }, [id]);

  // ──── Article like (StrictMode-safe: شمارش از روی state مشتق می‌شود) ────
  const [isArticleLiked, setIsArticleLiked] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    initRef.current = false;
    setIsArticleLiked(loadJSON<boolean>(`news-${id}-articleLiked`, false));
    const t = setTimeout(() => {
      initRef.current = true;
    }, 0);
    return () => clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (!initRef.current || !id) return;
    saveJSON(`news-${id}-articleLiked`, isArticleLiked);
  }, [id, isArticleLiked]);

  const handleArticleLike = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    setIsArticleLiked((prev) => !prev);
  }, [isAuthenticated, navigate]);

  const likeCount = (article?.likes || 0) + (isArticleLiked ? 1 : 0);

  // ثبت در «اخیراً خوانده‌شده» (برای تب پروفایل)
  useEffect(() => {
    if (!article) return;
    addRecent('news', {
      id: article.id,
      title: article.title,
      poster: article.image,
      subtitle: article.category || '',
      linkTo: `/news/${article.id}`,
    });
  }, [article?.id]);

  // ──── Loading ────
  if (loadingArticle) {
    return (
      <main className={`min-h-screen px-4 py-16 ${isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"}`} dir="rtl">
        <div className="mx-auto max-w-3xl text-center text-sm opacity-60">در حال بارگذاری...</div>
      </main>
    );
  }

  // ──── Not found ────
  if (!article) {
    return (
      <main
        className={`min-h-screen px-4 py-16 ${
          isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"
        }`}
        dir="rtl"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-2xl font-bold">خبر پیدا نشد</h1>
          <p className={`mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            خبری با این شناسه وجود ندارد.
          </p>
          <button
            type="button"
            onClick={() => navigate("/news")}
            className="mt-6 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
          >
            بازگشت به اخبار
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen ${
        isDark ? "bg-[#050505] text-white" : "bg-gray-50 text-gray-900"
      }`}
      dir="rtl"
    >
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`mb-6 rounded-full px-4 py-2 text-sm transition ${
            isDark
              ? "bg-white/5 text-gray-300 hover:bg-white/10"
              : "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
          }`}
        >
          بازگشت
        </button>

        <article
          className={`overflow-hidden rounded-3xl border ${
            isDark
              ? "border-white/10 bg-white/[0.03]"
              : "border-gray-200 bg-white shadow-sm"
          }`}
        >
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="h-64 w-full object-cover sm:h-80 md:h-96"
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder.jpg";
              }}
            />
          )}

          <div className="p-5 sm:p-8">
            {article.category && (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs ${
                  isDark
                    ? "bg-blue-500/10 text-blue-300"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {article.category}
              </span>
            )}

            <h1 className="mt-4 text-2xl font-black leading-10 sm:text-4xl sm:leading-[3.5rem]">
              {article.title}
            </h1>

            <div
              className={`mt-4 flex flex-wrap items-center gap-3 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {article.author && <span>نویسنده: {article.author.name}</span>}
              {article.date && <span>تاریخ: {formatDate(article.date)}</span>}
              {article.readTime && <span>{article.readTime} دقیقه مطالعه</span>}
            </div>

            {article.excerpt && (
              <p
                className={`mt-6 text-lg leading-9 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {article.excerpt}
              </p>
            )}

            <div
              className={`prose prose-lg mt-8 max-w-none leading-9 ${
                isDark ? "prose-invert text-gray-300" : "text-gray-800"
              }`}
            >
              {Array.isArray(article.content) ? (
                article.content.map((paragraph: string, index: number) => (
                  <p key={`paragraph-${index}`} className="mb-5 leading-9">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="leading-9">{article.content}</p>
              )}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag: string, index: number) => (
                  <span
                    key={`${tag}-${index}`}
                    className={`rounded-full px-3 py-1 text-xs ${
                      isDark
                        ? "bg-white/5 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={handleArticleLike}
                className={`rounded-full px-5 py-2 text-sm transition ${
                  isArticleLiked
                    ? "bg-red-500 text-white"
                    : isDark
                    ? "bg-white/5 text-gray-300 hover:bg-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isArticleLiked ? "❤️ پسندیده شده" : "🤍 پسندیدن"} {likeCount}
              </button>
            </div>
          </div>
        </article>

        {/* بخش کامنت مشترک */}
        <section className="mt-10">
          <div
            className={`rounded-3xl border p-5 shadow-sm sm:p-6 ${
              isDark
                ? "border-white/10 bg-white/[0.03]"
                : "border-gray-200 bg-white"
            }`}
          >
            <CommentsSection
              targetType="news"
              targetId={id || ""}
              title="دیدگاه‌های کاربران"
              initialComments={
                (article.comments as unknown as CommentNode[]) || []
              }
            />
          </div>
        </section>

        {/* مقالات مرتبط */}
        {relatedArticles.length > 0 && (
          <section className="mt-10">
            <h2
              className={`mb-5 text-xl font-black ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              اخبار مرتبط
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/news/${related.id}`}
                  className={`group overflow-hidden rounded-2xl border transition hover:scale-[1.02] ${
                    isDark
                      ? "border-white/10 bg-white/[0.03] hover:border-purple-500/30"
                      : "border-gray-200 bg-white shadow-sm hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  {related.image && (
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-40 w-full object-cover transition group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.jpg";
                      }}
                    />
                  )}

                  <div className="p-4">
                    {related.category && (
                      <span
                        className={`text-xs ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}
                      >
                        {related.category}
                      </span>
                    )}
                    <h3
                      className={`mt-1 line-clamp-2 text-sm font-bold leading-6 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {related.title}
                    </h3>
                    {related.date && (
                      <p
                        className={`mt-2 text-xs ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatDate(related.date)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}