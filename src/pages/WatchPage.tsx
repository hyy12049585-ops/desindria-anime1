import { useParams, Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, MessageSquare, Download, Settings, Maximize, SkipForward, SkipBack } from "lucide-react";
import { useAnimes } from "../hooks/useAnimes";


export default function WatchPageWatchPage() {
  const { episode } = useParams();
  const ep = Number(episode) || 1;
  const { animes, loading } = useAnimes();
  const anime = animes[0];

  if (loading || !anime) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-20 text-center text-white/40 text-sm">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/30">
        <Link to="/" className="hover:text-cyan-300 transition-colors">خانه</Link>
        <ChevronLeft size={12} />
        <Link to={`/anime/${anime.id}`} className="hover:text-cyan-300 transition-colors">{anime.title}</Link>
        <ChevronLeft size={12} />
        <span className="text-cyan-400">قسمت {ep}</span>
      </div>

      {/* player */}
      <div className="relative aspect-video rounded-2xl overflow-hidden neon-border bg-black">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-cyan-900/20">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center mx-auto cursor-pointer hover:bg-cyan-500/30 transition-all hover:scale-105">
              <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[22px] border-r-cyan-300 mr-[-4px] rotate-180" />
            </div>
            <p className="text-white/30 text-sm">{anime.title} — قسمت {ep}</p>
          </div>
        </div>
        {/* controls bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-l from-cyan-400 to-purple-500 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="text-white/50 hover:text-white transition-colors"><SkipForward size={18} /></button>
              <button className="text-white/50 hover:text-white transition-colors"><SkipBack size={18} /></button>
              <span className="text-white/30 text-xs">08:24 / 24:00</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-white/50 hover:text-white transition-colors"><MessageSquare size={16} /></button>
              <button className="text-white/50 hover:text-white transition-colors"><Download size={16} /></button>
              <button className="text-white/50 hover:text-white transition-colors"><Settings size={16} /></button>
              <button className="text-white/50 hover:text-white transition-colors"><Maximize size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* episode nav */}
      <div className="flex items-center justify-between">
        <Link to={`/watch/${Math.max(1, ep - 1)}`}
          className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border transition-all ${
            ep <= 1 ? "border-white/5 text-white/15 pointer-events-none" : "border-white/10 text-white/40 hover:text-cyan-300 hover:border-cyan-500/30"
          }`}>
          <ChevronRight size={14} /> قسمت قبلی
        </Link>
        <span className="text-white text-sm font-bold">قسمت {ep}</span>
        <Link to={`/watch/${ep + 1}`}
          className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-cyan-300 hover:border-cyan-500/30 transition-all">
          قسمت بعدی <ChevronLeft size={14} />
        </Link>
      </div>

      {/* episode list */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h3 className="text-white text-sm font-bold">لیست قسمت‌ها</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <Link key={i} to={`/watch/${i + 1}`}
              className={`text-center text-xs py-2 rounded-lg border transition-all ${
                i + 1 === ep
                  ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10"
                  : "border-white/10 text-white/30 hover:text-white/60 hover:border-white/20"
              }`}>
              {i + 1}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
