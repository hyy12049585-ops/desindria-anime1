// src/features/home/components/LatestNews.tsx

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLatestArticles } from '../../../services/newsService';
import type { NewsArticle } from '../../../data/newsData';
import CarouselArrows from '@/components/ui/CarouselArrows';

const LatestNews: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // آخرین ۱۰ خبر از دیتابیس
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  useEffect(() => {
    let active = true;
    getLatestArticles(10).then((list) => { if (active) setLatestNews(list); });
    return () => { active = false; };
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  return (
    <section dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 flex items-center justify-center shadow-lg shadow-slate-700/30">
            <Newspaper size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">آخرین اخبار</h2>
            <p className="text-sm text-slate-400">تازه‌ترین اخبار دنیای انیمه</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/news"
            className="text-sm text-blue-400 hover:text-blue-300 transition font-medium"
          >
            مشاهده همه
          </Link>
          <div className="flex gap-2">
            <CarouselArrows onPrev={() => scroll('right')} onNext={() => scroll('left')} />
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {latestNews.map((article) => (
          <Link to={`/news/${article.id}`} key={article.id} className="flex-shrink-0">
            <motion.div
              whileHover={{ y: -6 }}
              className="
                w-[320px] rounded-2xl overflow-hidden
                bg-white/5 backdrop-blur-sm
                border border-white/10 hover:border-white/20
                shadow-lg shadow-black/40
                transition-all duration-300 cursor-pointer group
              "
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  {article.category}
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">{article.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{article.summary}</p>

                <div className="flex items-center justify-between pt-2 mt-auto border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={11} />
                      <span>{article.views.toLocaleString('fa-IR')}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-400 hover:text-blue-300 transition">بیشتر</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
