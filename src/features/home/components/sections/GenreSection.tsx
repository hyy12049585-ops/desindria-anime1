import { Link } from "react-router-dom";
import { genres } from "@/data/mockData";

export function GenreSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 space-y-5">
      <h2 className="text-xl font-extrabold text-white">
        ژانرها
        <div className="h-[2px] w-12 mt-2 bg-gradient-to-l from-pink-500 to-purple-500 rounded-full" />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {genres.map((g) => (
          <Link key={g.id} to={`/anime?genre=${g.id}`}
            className="group glass rounded-xl p-4 flex items-center gap-3 hover:neon-glow-purple transition-all duration-300 border border-purple-500/10 hover:border-purple-500/30">
            <span className="text-2xl">{g.icon}</span>
            <div className="flex-1">
              <span className="text-white text-sm font-bold group-hover:text-purple-300 transition-colors">{g.name}</span>
              <p className="text-white/20 text-[10px]">{g.count} انیمه</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
