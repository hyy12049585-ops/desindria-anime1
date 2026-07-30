import React from "react";
import { Eye, Heart, MessageCircle, ArrowLeft } from "lucide-react";
import type { NewsArticle } from "../types/news.types";

interface NewsHeroProps {
  article: NewsArticle;
}

const NewsHero: React.FC<NewsHeroProps> = ({ article }) => {
  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden cursor-pointer group">
      {/* Background Image */}
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 right-0 left-0 p-6 md:p-10">
        {/* Category */}
        <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full bg-blue-500/90 text-white backdrop-blur-sm mb-4">
          {article.category}
        </span>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight mb-3 max-w-3xl">
          {article.title}
        </h1>

        <p className="text-sm md:text-base text-gray-300 line-clamp-2 max-w-2xl mb-5 leading-7">
          {article.summary}
        </p>

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-4">
          {/* Author */}
          <div className="flex items-center gap-2">
            {article.authorAvatar ? (
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
                {article.author[0]}
              </div>
            )}
            <span className="text-sm text-white font-medium">
              {article.author}
            </span>
          </div>

          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-400">{article.date}</span>

          <div className="flex items-center gap-3 mr-auto">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Eye className="w-4 h-4" />
              {article.views.toLocaleString("fa-IR")}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Heart className="w-4 h-4" />
              {article.likes.toLocaleString("fa-IR")}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MessageCircle className="w-4 h-4" />
              {article.commentsCount}
            </span>
          </div>

          {/* CTA */}
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-colors">
            مطالعه بیشتر
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsHero;
