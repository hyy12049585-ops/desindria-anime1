import { Anime } from "../types/anime.types";

export const AnimeMeta = ({ anime }: { anime: Anime }) => {
  return (
    <section className="space-y-3" style={{ color: "var(--text-primary)" }}>
      <p><strong>نوع:</strong> {anime.type}</p>
      <p><strong>وضعیت:</strong> {anime.status}</p>
      <p><strong>سال:</strong> {anime.year}</p>
      <p><strong>فصل:</strong> {anime.season}</p>
      <p><strong>ژانرها:</strong> {anime.genres.join("، ")}</p>
      <p><strong>تعداد قسمت‌ها:</strong> {anime.episodesCount}</p>
    </section>
  );
};