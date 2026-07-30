// src/features/home/components/LatestMusic.tsx

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Music2,
  Clock,
  Eye,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllMusic } from "@/services/musicService";
import type { MusicItem } from "@/features/music/user/data/musicData";
import CarouselArrows from "@/components/ui/CarouselArrows";

const LatestMusic: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // جدیدترین ۱۰ موزیک از دیتابیس
  const [latestMusic, setLatestMusic] = useState<MusicItem[]>([]);
  useEffect(() => {
    let active = true;
    getAllMusic().then((list) => { if (active) setLatestMusic(list.slice(0, 10)); });
    return () => { active = false; };
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-700/30">
            <Music2 size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">جدیدترین موزیک‌ها</h2>
            <p className="text-sm text-slate-400">
              برترین آهنگ‌های دنیای انیمه
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/music"
            className="text-sm text-purple-400 hover:text-purple-300 transition font-medium"
          >
            مشاهده همه
          </Link>
          <div className="flex gap-2">
            <CarouselArrows onPrev={() => scroll("right")} onNext={() => scroll("left")} />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
      >
        {latestMusic.map((track) => (
          <Link
            to={`/music/${track.id}`}
            key={track.id}
            className="flex-shrink-0"
          >
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
                  src={track.coverImage}
                  alt={track.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/320x176/0a0a1e/a855f7?text=Music";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* نوع آهنگ */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                  {track.type}
                </div>

                {/* دکمه‌ی پخش روی هاور */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Play size={20} className="text-white fill-white ml-0.5" />
                  </div>
                </div>

                {/* مدت زمان */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                  <Clock size={10} />
                  {track.duration}
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {track.artist} • {track.anime}
                </p>

                <div className="flex items-center justify-between pt-2 mt-auto border-t border-white/5">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{track.releaseDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={11} />
                      <span>{track.views.toLocaleString("fa-IR")}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-400 hover:text-purple-300 transition">
                    پخش
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LatestMusic;