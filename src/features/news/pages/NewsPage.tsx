// src/pages/NewsPage.tsx

import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search, Filter, Clock, Eye, Heart, MessageCircle,
  TrendingUp, ChevronLeft, ChevronRight, Bookmark, Tag, Flame, Star
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useNews } from "../../../hooks/useNews";
import { type NewsArticle } from "../../../data/newsData";

// ─── News Card ───
function NewsCard({ article, isDark }: { article: NewsArticle; isDark: boolean }) {
  return (
    <Link to={`/news/${article.id}`} className="group block">
      <div className={`border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? "bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-500/10"
          : "bg-white border-gray-200 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10"
      }`}>
        <div className="relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-purple-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {article.category}
            </span>
            {article.isHot && (
              <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Flame size={12} /> داغ
              </span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {article.title}
          </h3>
          <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            {article.summary}
          </p>
          <div className={`flex items-center justify-between text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            <span className="flex items-center gap-1"><Clock size={12} /> {article.date}</span>
          </div>
          <div className={`flex items-center gap-4 mt-3 pt-3 text-xs ${
            isDark ? "border-t border-white/5 text-gray-500" : "border-t border-gray-100 text-gray-400"
          }`}>
            <span className="flex items-center gap-1"><Eye size={12} /> {article.views.toLocaleString("fa-IR")}</span>
            <span className="flex items-center gap-1"><Heart size={12} /> {article.likes.toLocaleString("fa-IR")}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {article.commentsCount.toLocaleString("fa-IR")}</span>
            <span className="flex items-center gap-1"><Bookmark size={12} /> {article.bookmarks.toLocaleString("fa-IR")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Hero Slider ───
function HeroSlider({ articles, isDark }: { articles: NewsArticle[]; isDark: boolean }) {
  const slides = useMemo(() => articles.slice(0, 5), [articles]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, total]);

  if (total === 0) return null;

  const article = slides[current];

  return (
    <div
      className="relative mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Link to={`/news/${article.id}`} className="group block">
        <div className="relative rounded-3xl overflow-hidden h-[420px]">
          <img
            src={article.image}
            alt={article.title}
            key={article.id}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <div className="absolute bottom-0 right-0 left-0 p-8">
            <div className="flex items-center gap-3 mb-4 pr-12">
              <span className="bg-purple-600 text-white text-sm px-4 py-1.5 rounded-full font-medium">
                {article.category}
              </span>
              {article.isHot && (
                <span className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Flame size={14} /> داغ
                </span>
              )}
              {article.isFeatured && (
                <span className="bg-amber-500 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star size={14} /> ویژه
                </span>
              )}
            </div>
            <h2 className="text-white text-3xl md:text-4xl font-black mb-3 group-hover:text-purple-300 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-300 text-base mb-4 max-w-2xl leading-relaxed">
              {article.summary}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Clock size={14} /> {article.date}</span>
              <span className="flex items-center gap-1"><Eye size={14} /> {article.views.toLocaleString("fa-IR")}</span>
              <span className="flex items-center gap-1"><Heart size={14} /> {article.likes.toLocaleString("fa-IR")}</span>
            </div>
          </div>
        </div>
      </Link>

      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition"
            aria-label="خبر قبلی"
          >
            <ChevronRight size={22} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition"
            aria-label="خبر بعدی"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-purple-500"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`اسلاید ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sidebar ───
function NewsSidebar({ isDark }: { isDark: boolean }) {
  const { hot, articles, tags } = useNews();
  const hotArticles = hot.slice(0, 5);
  const recentArticles = [...articles].slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* Trending */}
      <div className={`border rounded-2xl p-5 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"
      }`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          <TrendingUp size={20} className="text-red-400" /> اخبار داغ
        </h3>
        <div className="space-y-4">
          {hotArticles.map((a, i) => (
            <Link key={a.id} to={`/news/${a.id}`} className="flex gap-3 group">
              <span className="text-2xl font-black text-purple-500/50 min-w-[32px]">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <h4 className={`text-sm font-medium group-hover:text-purple-400 transition-colors line-clamp-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {a.title}
                </h4>
                <span className={`text-xs flex items-center gap-1 mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  <Eye size={10} /> {a.views.toLocaleString("fa-IR")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className={`border rounded-2xl p-5 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"
      }`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          <Clock size={20} className="text-blue-400" /> آخرین مطالب
        </h3>
        <div className="space-y-3">
          {recentArticles.map(a => (
            <Link key={a.id} to={`/news/${a.id}`} className="flex gap-3 group items-center">
              <img src={a.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
              <div>
                <h4 className={`text-xs font-medium group-hover:text-purple-400 transition-colors line-clamp-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {a.title}
                </h4>
                <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{a.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className={`border rounded-2xl p-5 ${
        isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"
      }`}>
        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}>
          <Tag size={20} className="text-green-400" /> تگ‌های محبوب
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className={`text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer border ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30"
                  : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-300"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Main Page ───
type SortType = "newest" | "popular" | "views";

export default function NewsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [sort, setSort] = useState<SortType>("newest");

  const { articles, featured, categories: newsCategories } = useNews();
  const categories = ["همه", ...newsCategories];
  const featuredList = featured;

  const filtered = useMemo(() => {
    let result = [...articles];

    if (category !== "همه") {
      result = result.filter(a => a.category === category);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        a =>
          a.title.includes(q) ||
          a.summary.includes(q) ||
          a.tags.some(t => t.includes(q))
      );
    }

    switch (sort) {
      case "popular":
        result.sort((a, b) => b.likes - a.likes);
        break;
      case "views":
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [search, category, sort, articles]);

  return (
    <div className={`min-h-screen pt-8 pb-16 ${isDark ? "bg-[#0a0a14]" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className={`flex items-center gap-2 text-sm mb-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          <Link to="/" className="hover:text-purple-400 transition-colors">خانه</Link>
          <ChevronLeft size={14} />
          <span className="text-purple-400">اخبار</span>
        </div>

        {/* Hero Slider */}
        {featuredList.length > 0 && <HeroSlider articles={featuredList} isDark={isDark} />}

        {/* Filters */}
        <div className={`border rounded-2xl p-5 mb-8 ${
          isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"
        }`}>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="جستجو در اخبار..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full border rounded-xl pr-11 pl-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    category === cat
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : isDark
                        ? "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortType)}
              className={`border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/10 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="newest">جدیدترین</option>
              <option value="popular">محبوب‌ترین</option>
              <option value="views">پربازدیدترین</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(article => (
                  <NewsCard key={article.id} article={article} isDark={isDark} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search size={48} className={`mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-500"}`}>خبری یافت نشد</p>
                <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</p>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <NewsSidebar isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
}
