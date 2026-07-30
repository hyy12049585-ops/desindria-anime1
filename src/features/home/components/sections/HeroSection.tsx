import { Play, Plus, Star, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { featuredAnime } from "@/data/mockData";

export function HeroSection() {
  const a = featuredAnime;
  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
      {/* bg */}
      <div className="absolute inset-0">
        <img src={a.banner || a.cover} alt={a.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050510]/30 to-[#050510]/80" />
      </div>
      {/* neon lines */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-l from-transparent via-cyan-500 to-transparent opacity-40" />
      {/* content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-end pb-16">
        <div className="max-w-xl space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
              <Star size={14} className="fill-amber-400" /> {a.rating}
            </span>
            <span className="text-white/30 text-xs">{a.year}</span>
            <span className="text-white/30 text-xs">{a.duration}</span>
            {a.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-300 bg-purple-500/10">{g}</span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            {a.title}
          </h1>
          <p className="text-white/50 text-sm leading-7 line-clamp-3">{a.synopsis}</p>
          <div className="flex items-center gap-3 pt-2">
            <Link to={`/watch/1`}
              className="flex items-center gap-2 bg-gradient-to-l from-purple-600 to-cyan-500 text-white font-bold px-7 py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition-all">
              <Play size={18} className="fill-white" /> پخش کن
            </Link>
            <button className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-5 py-3 rounded-xl transition-all hover:bg-white/5">
              <Plus size={18} /> افزودن به لیست
            </button>
            <Link to={`/anime/${a.id}`}
              className="p-3 rounded-xl border border-white/10 text-white/40 hover:text-cyan-300 hover:border-cyan-500/30 transition-all">
              <Info size={18} />
            </Link>
          </div>
        </div>
      </div>
      {/* dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === 0 ? "bg-cyan-400 w-6 shadow-lg shadow-cyan-400/50" : "bg-white/20"}`} />
        ))}
      </div>
    </section>
  );
}
