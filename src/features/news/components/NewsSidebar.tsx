import React from "react";
import { TrendingUp, Clock, Flame } from "lucide-react";
import NewsCard from "./NewsCard";
import type { NewsArticle } from "../types/news.types";

interface NewsSidebarProps {
  trendingNews: NewsArticle[];
  recentNews: NewsArticle[];
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({ trendingNews, recentNews }) => {
  return (
    <aside className="space-y-6">
      {/* Trending Section */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <h3
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            داغ‌ترین اخبار
          </h3>
        </div>

        <div className="space-y-3">
          {trendingNews.slice(0, 4).map((article, index) => (
            <div key={article.id} className="flex items-start gap-3 cursor-pointer group">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                style={{
                  background:
                    index === 0
                      ? "#ef4444"
                      : index === 1
                      ? "#f97316"
                      : index === 2
                      ? "#eab308"
                      : "var(--bg-tertiary)",
                  color: index < 3 ? "#fff" : "var(--text-tertiary)",
                }}
              >
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4
                  className="text-xs font-bold line-clamp-2 group-hover:text-blue-400 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                >
                  {article.title}
                </h4>
                <span
                  className="text-[10px] mt-1 block"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {article.views.toLocaleString("fa-IR")} بازدید
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Section */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <h3
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            آخرین مطالب
          </h3>
        </div>

        <div className="space-y-3">
          {recentNews.slice(0, 5).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* Tags Cloud */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-primary)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <h3
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            تگ‌های محبوب
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "وان پیس",
            "ناروتو",
            "جوجوتسو کایسن",
            "حمله به تایتان",
            "دیمون اسلیر",
            "سولو لولینگ",
            "بلیچ",
            "هانتر",
            "مای هیرو",
            "دراگون بال",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-3 py-1.5 rounded-full cursor-pointer transition-all hover:scale-105"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default NewsSidebar;
