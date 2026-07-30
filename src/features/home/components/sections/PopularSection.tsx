import { AnimeRow } from "@/components/anime/AnimeRow/AnimeRow";
import { popularAnime } from "@/data/mockData";

export function PopularSection() {
  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <AnimeRow title="محبوب‌ترین‌ها" animes={popularAnime} />
    </div>
  );
}
