"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  Star,
  Play,
  Loader2,
  Sparkles,
  Filter,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SAMPLE_ANIME, GENRES } from "@/constants";

import { useDebounce } from "@/hooks/useDebounce";

// ====== تایپ‌ها ======
interface Props {
  onClose: () => void;
}

interface Anime {
  id: number;
  title: string;
  titleJapanese: string;
  slug: string;
  coverImage: string;
  bannerImage?: string;
  rating: number;
  year: number;
  status: string;
  episodes: number;
  genres: string[];
  studio: string;
  description: string;
}

// ====== داده‌های ثابت ======
const TRENDING_SEARCHES = [
  "Attack on Titan",
  "Jujutsu Kaisen",
  "Demon Slayer",
  "One Piece",
  "Chainsaw Man",
  "Solo Leveling",
];

const RECENT_SEARCHES = ["Naruto Shippuden", "Death Note", "Spy x Family"];

// ====== انیمیشن‌ها ======
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 } as any,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { type: "spring", stiffness: 300, damping: 30 } as any,
  },
};



const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ====== کامپوننت اسکلتون لودینگ ======
const ResultSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-3 animate-pulse">
    <div className="w-12 h-16 rounded-lg bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-white/10 rounded w-3/4" />
      <div className="h-3 bg-white/10 rounded w-1/2" />
      <div className="flex gap-1.5">
        <div className="h-5 w-14 bg-white/10 rounded-md" />
        <div className="h-5 w-14 bg-white/10 rounded-md" />
        <div className="h-5 w-14 bg-white/10 rounded-md" />
      </div>
    </div>
  </div>
);

// ====== کامپوننت کارت نتیجه ======
interface ResultCardProps {
  anime: Anime;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
  anime,
  index,
  isSelected,
  onClick,
}) => {
  return (
    <motion.div
      variants={itemVariants}
      data-result-item
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
        isSelected
          ? "bg-desindria-primary/10 border border-desindria-primary/30"
          : "hover:bg-white/5 border border-transparent"
      )}
    >
      {/* تصویر */}
      <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={anime.coverImage}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0.5 left-0.5 bg-black/70 rounded px-1 text-[9px] text-white font-bold">
          {index + 1}
        </div>
      </div>

      {/* اطلاعات */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate group-hover:text-desindria-primary transition-colors">
          {anime.title}
        </h4>
        <p className="text-[11px] text-desindria-text-muted truncate">
          {anime.titleJapanese}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[11px] text-yellow-500 font-medium">
              {anime.rating}
            </span>
          </div>
          <span className="text-[11px] text-desindria-text-dim">
            {anime.year}
          </span>
          <span className="text-[11px] text-desindria-text-dim">
            {anime.episodes} قسمت
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/5 border border-white/10 text-desindria-text-muted"
            >
              {genre}
            </span>
          ))}
          {anime.genres.length > 3 && (
            <span className="text-[10px] text-desindria-text-dim">
              +{anime.genres.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* دکمه پخش */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
          isSelected
            ? "bg-desindria-primary text-white"
            : "bg-white/5 text-desindria-text-muted group-hover:bg-desindria-primary/20 group-hover:text-desindria-primary"
        )}
      >
        <Play size={14} className="ml-0.5" />
      </div>
    </motion.div>
  );
};

// ====== کامپوننت اصلی SearchBar ======
const SearchBar: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // ====== فوکوس خودکار روی اینپوت ======
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ====== قفل اسکرول بدنه ======
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ====== جستجو با debounce ======
  useEffect(() => {
    if (!debouncedQuery.trim() && !selectedGenre) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSelectedIndex(-1);

    const timer = setTimeout(() => {
      let filtered = SAMPLE_ANIME as Anime[];

      if (debouncedQuery.trim()) {
        const q = debouncedQuery.toLowerCase();
        filtered = filtered.filter(
          (anime) =>
            anime.title.toLowerCase().includes(q) ||
            anime.titleJapanese.toLowerCase().includes(q) ||
            anime.genres.some((g) => g.toLowerCase().includes(q)) ||
            anime.studio.toLowerCase().includes(q)
        );
      }

      if (selectedGenre) {
        filtered = filtered.filter((anime) =>
          anime.genres.includes(selectedGenre)
        );
      }

      setResults(filtered);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [debouncedQuery, selectedGenre]);

  // ====== پیمایش کیبوردی ======
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case "Enter":
          if (selectedIndex >= 0 && results[selectedIndex]) {
            console.log("Navigate to:", results[selectedIndex].slug);
            onClose();
          }
          break;
      }
    },
    [onClose, results, selectedIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ====== اسکرول خودکار به آیتم انتخابی ======
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("[data-result-item]");
      items[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre));
  };

  const handleClear = () => {
    setQuery("");
    setSelectedGenre(null);
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const hasSearch = query.trim() || selectedGenre;
  const topGenres = GENRES.slice(0, 10);

  return (
    <AnimatePresence>
      <motion.div
  className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[12vh] px-4"
  initial="hidden"
  animate="visible"
  exit="exit"
>

        {/* ====== بکدراپ تاریک ====== */}
        <motion.div
          variants={backdropVariants}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* ====== پنل اصلی سرچ ====== */}
        <motion.div
          variants={panelVariants}
          className="relative w-full max-w-2xl bg-desindria-bg-secondary/95 backdrop-blur-2xl border border-desindria-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* ====== هدر جستجو ====== */}
          <div className="relative border-b border-white/10">
            {/* آیکون جستجو / لودینگ */}
            <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2
                      size={22}
                      className="text-desindria-primary animate-spin"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search size={22} className="text-desindria-text-muted" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* اینپوت جستجو */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی انیمه، ژانر، استودیو..."
              dir="rtl"
              className="w-full bg-transparent text-white text-base placeholder:text-desindria-text-dim py-4 pr-5 pl-14 outline-none"
            />

            {/* دکمه پاک کردن */}
            {hasSearch && (
              <button
                onClick={handleClear}
                className="absolute right-14 top-1/2 -translate-y-1/2 text-desindria-text-muted hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}

            {/* میانبر ESC */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-desindria-text-dim bg-white/5 border border-white/10 rounded-md">
                ESC
              </kbd>
            </div>
          </div>

          {/* ====== فیلتر ژانرها ====== */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 overflow-x-auto scrollbar-hide">
            <Filter size={14} className="text-desindria-text-dim flex-shrink-0" />
            {topGenres.map((genre: string) => (

              <button
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={cn(
                  "flex-shrink-0 px-3 py-1 text-[11px] font-medium rounded-full border transition-all duration-200",
                  selectedGenre === genre
                    ? "bg-desindria-primary/20 border-desindria-primary/50 text-desindria-primary"
                    : "bg-white/5 border-white/10 text-desindria-text-muted hover:bg-white/10"
                )}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* ====== محتوای نتایج ====== */}
          <div
            ref={resultsRef}
            className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {/* حالت لودینگ */}
            {isLoading && (
              <div className="p-2">
                {[...Array(3)].map((_, i) => (
                  <ResultSkeleton key={i} />
                ))}
              </div>
            )}

            {/* نتایج جستجو */}
            {!isLoading && results.length > 0 && (
              <motion.div
                className="p-2"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[11px] text-desindria-text-dim">
                    {results.length} نتیجه
                  </span>
                  <Sparkles size={12} className="text-desindria-primary" />
                </div>
                {results.map((anime, index) => (
                  <ResultCard
                    key={anime.id}
                    anime={anime}
                    index={index}
                    isSelected={index === selectedIndex}
                    onClick={() => {
                      console.log("Navigate to:", anime.slug);
                      onClose();
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* بدون نتیجه */}
            {!isLoading && hasSearch && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Search size={24} className="text-desindria-text-dim" />
                </div>
                <p className="text-sm text-desindria-text-muted">
                  نتیجه‌ای یافت نشد
                </p>
                <p className="text-[11px] text-desindria-text-dim mt-1">
                  عبارت دیگری را جستجو کنید
                </p>
              </div>
            )}

            {/* حالت پیش‌فرض — پیشنهادات */}
            {!isLoading && !hasSearch && (
              <div className="p-4 space-y-6">
                {/* جستجوهای اخیر */}
                {RECENT_SEARCHES.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-desindria-text-dim" />
                      <span className="text-[12px] font-medium text-desindria-text-muted">
                        جستجوهای اخیر
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RECENT_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSuggestionClick(term)}
                          className="px-3 py-1.5 text-[12px] rounded-lg bg-white/5 border border-white/10 text-desindria-text-muted hover:bg-white/10 hover:text-white transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ترندها */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-desindria-primary" />
                    <span className="text-[12px] font-medium text-desindria-text-muted">
                      پرطرفدار
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-1.5 text-[12px] rounded-lg bg-desindria-primary/5 border border-desindria-primary/20 text-desindria-primary/80 hover:bg-desindria-primary/10 hover:text-desindria-primary transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ====== فوتر ====== */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 text-[10px] text-desindria-text-dim">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">↑↓</kbd>
                پیمایش
              </span>
              <span className="flex items-center gap-1">
               <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">Enter</kbd>
                انتخاب
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px]">ESC</kbd>
                بستن
              </span>
            </div>
            <span className="text-[10px] text-desindria-text-dim">
              Syndria Search
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;
