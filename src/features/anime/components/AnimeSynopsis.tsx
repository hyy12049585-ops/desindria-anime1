import { Anime } from "../types/anime.types";

export const AnimeSynopsis = ({ anime }: { anime: Anime }) => {
  return (
    <section className="leading-8" style={{ color: "var(--text-secondary)" }}>
      {anime.synopsis}
    </section>
  );
};