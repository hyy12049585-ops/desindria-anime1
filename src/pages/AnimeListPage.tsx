import { useState } from "react";
import { Search, Filter, Grid3X3, LayoutList, ChevronDown } from "lucide-react";
import AnimeCard from "@/features/anime/components/AnimeCard/AnimeCard";
import { useAnimes } from "@/hooks/useAnimes";

const sortOptions = ["جدیدترین", "محبوب‌ترین", "بالاترین امتیاز", "الفبایی"];
const genreFilters = ["همه", "اکشن", "ماجراجویی", "فانتزی", "درام", "کمدی", "رمانتیک", "ترسناک", "علمی‌تخیلی"];

export default function AnimeListPage() {
  const { animes: allAnime, loading } = useAnimes();
  const [query, setQuery] = useState("");
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState(sortOptions[0]);
  const [genre, setGenre] = useState("همه");
  const [showSort, setShowSort] = useState(false);

  const filtered = allAnime.filter((a) =>
    a.title.includes(query) || a.titleEn?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-8">
      {/* header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
          آرشیو انیمه‌ها
          <div className="h-[2px] w-16 mt-3 bg-gradient-to-l from-cyan-400 to-purple-500 rounded-full" />
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          بیش از {allAnime.length} انیمه برای تماشا
        </p>
      </div>

      {/* filters bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* search */}
        <div className="flex-1 min-w-[200px] max-w-md relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو..."
            className="w-full rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none transition-colors focus:border-cyan-500/40"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* genre pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {genreFilters.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`shrink-0 text-xs px-4 py-2 rounded-full border transition-all ${
                genre === g
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                  : ""
              }`}
              style={genre !== g ? {
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              } : undefined}
            >
              {g}
            </button>
          ))}
        </div>

        {/* sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-2 text-xs rounded-xl px-4 py-2.5 transition-colors"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Filter size={14} /> {sort} <ChevronDown size={12} />
          </button>
          {showSort && (
            <div className="absolute top-full mt-2 left-0 rounded-xl overflow-hidden z-20 min-w-[150px] shadow-xl"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
              }}>
              {sortOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSort(s); setShowSort(false); }}
                  className={`block w-full text-right text-xs px-4 py-2.5 transition-colors ${
                    sort === s ? "text-cyan-300 bg-cyan-500/10" : ""
                  }`}
                  style={sort !== s ? {
                    color: 'var(--text-secondary)',
                  } : undefined}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* view toggle */}
        <div className="flex items-center rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setGrid(true)}
            className={`p-2.5 transition-colors ${grid ? "bg-cyan-500/10 text-cyan-300" : ""}`}
            style={!grid ? { color: 'var(--text-muted)' } : undefined}
          >
            <Grid3X3 size={14} />
          </button>
          <button
            onClick={() => setGrid(false)}
            className={`p-2.5 transition-colors ${!grid ? "bg-cyan-500/10 text-cyan-300" : ""}`}
            style={grid ? { color: 'var(--text-muted)' } : undefined}
          >
            <LayoutList size={14} />
          </button>
        </div>
      </div>

      {/* results */}
      {loading ? (
        <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>
          در حال بارگذاری...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-sm" style={{ color: 'var(--text-muted)' }}>
          نتیجه‌ای یافت نشد
        </div>
      ) : (
        <div className={grid
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        }>
          {filtered.map((a) => (
            <AnimeCard key={a.id} anime={a} />
          ))}
        </div>
      )}
    </div>
  );
}
