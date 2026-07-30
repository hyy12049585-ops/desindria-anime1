import { AnimeRow } from "@/components/anime/AnimeRow/AnimeRow";
import { trendingAnime } from "@/data/mockData";

export function TrendingSection() {
  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <AnimeRow title="ترندینگ" animes={trendingAnime} />
    </div>
  );
}
