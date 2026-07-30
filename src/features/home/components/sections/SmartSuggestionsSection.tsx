import { AnimeRow } from "@/components/anime/AnimeRow/AnimeRow";
import { smartSuggestions } from "@/data/mockData";

export function SmartSuggestionsSection() {
  return (
    <div className="max-w-[1400px] mx-auto px-6">
      <AnimeRow title="پیشنهادات هوشمند" animes={smartSuggestions} />
    </div>
  );
}
