import React from "react";
import { Eye, Heart, MessageCircle, Clock } from "lucide-react";
import type { NewsArticle } from "../types/news.types";
import { useTheme } from "../../../contexts/ThemeContext";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "compact" | "horizontal";
}

const categoryColors: Record<string, string> = {
  اخبار: "#3b82f6",
  مقاله: "#8b5cf6",
  انیمه: "#ef4444",
  مانگا: "#10b981",
  بازی: "#f59e0b",
};

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = "default" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const catColor = categoryColors[article.category] || "#6b7280";

  // توکن‌های واقعیِ موجود در index.css (باگ: قبلاً به متغیرهای تعریف‌نشده تکیه داشت)
  const cardBg = isDark ? "#0a0a1e" : "#ffffff";
  const cardBorder = isDark ? "rgba(0,234,255,0.18)" : "rgba(0,0,0,0.1)";
  const textPrimary = "var(--text-primary)";
  const textSecondary = "var(--text-secondary)";
  const textTertiary = "var(--text-muted)";
  const tagBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  if (variant === "horizontal") {
    return (
      <article
        className="group flex gap-4 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = catColor;
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = `0 8px 25px ${catColor}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = cardBorder;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div className="relative w-[140px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden">
          <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: catColor }}>
            {article.category}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-sm font-bold line-clamp-2 mb-1 transition-colors" style={{ color: textPrimary }}>{article.title}</h3>
            <p className="text-xs line-clamp-2" style={{ color: textSecondary }}>{article.summary}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: textTertiary }}><Clock className="w-3 h-3" />{article.date}</span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: textTertiary }}><Eye className="w-3 h-3" />{article.views.toLocaleString("fa-IR")}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article
        className="group flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = catColor; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = cardBorder; }}
      >
        <div className="w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden">
          <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold line-clamp-2" style={{ color: textPrimary }}>{article.title}</h4>
          <span className="text-[10px] mt-1 block" style={{ color: textTertiary }}>{article.date}</span>
        </div>
      </article>
    );
  }

  // default variant
  return (
    <article
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = catColor;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 12px 30px ${catColor}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = cardBorder;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <img src={article.image} alt={article.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full text-white backdrop-blur-sm" style={{ background: `${catColor}cc` }}>
          {article.category}
        </span>
        {article.isFeatured && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full bg-yellow-500/90 text-black backdrop-blur-sm">
            ⭐ ویژه
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold line-clamp-2 mb-2 leading-7 transition-colors" style={{ color: textPrimary }}>{article.title}</h3>
        <p className="text-sm line-clamp-2 mb-4 leading-6" style={{ color: textSecondary }}>{article.summary}</p>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: tagBg, color: textSecondary }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-2">
            {article.authorAvatar ? (
              <img src={article.authorAvatar} alt={article.author} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: catColor }}>
                {article.author[0]}
              </div>
            )}
            <span className="text-xs font-medium" style={{ color: textSecondary }}>{article.author}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: textTertiary }}>
              <Eye className="w-3.5 h-3.5" />
              {article.views >= 1000 ? `${(article.views / 1000).toFixed(1)}k` : article.views}
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: textTertiary }}>
              <Heart className="w-3.5 h-3.5" />
              {article.likes >= 1000 ? `${(article.likes / 1000).toFixed(1)}k` : article.likes}
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: textTertiary }}>
              <MessageCircle className="w-3.5 h-3.5" />
              {article.commentsCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
