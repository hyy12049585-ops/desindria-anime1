import { Star, Quote } from "lucide-react";
import { userReviews } from "@/data/mockData";

export function UserReviewsSection() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 space-y-5">
      <h2 className="text-xl font-extrabold text-white">
        نظرات کاربران
        <div className="h-[2px] w-12 mt-2 bg-gradient-to-l from-cyan-400 to-blue-500 rounded-full" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {userReviews.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-5 space-y-3 neon-border hover:neon-glow-cyan transition-all duration-300">
            <div className="flex items-center gap-3">
              <img src={r.avatar} alt={r.username} className="w-10 h-10 rounded-full border-2 border-cyan-500/30 object-cover" />
              <div className="flex-1">
                <span className="text-white text-sm font-bold">{r.username}</span>
                <p className="text-white/30 text-[10px]">{r.date}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-amber-300 text-xs font-bold">{r.rating}</span>
              </div>
            </div>
            <div className="relative">
              <Quote size={14} className="absolute -top-1 -right-1 text-cyan-500/20" />
              <p className="text-white/50 text-xs leading-6 pr-4">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
