import { useUserData } from "../../../contexts/UserDataContext";
import { Heart, Bookmark, Star, Download } from "lucide-react";
import { Anime } from "../types/anime.types";

export const AnimeHeader = ({ anime }: { anime: Anime }) => {
  const {
    toggleFavorite,
    isInFavorites,
    toggleWatchlist,
    isInWatchlist,
    getRating,
    setRating,
    addDownload,
  } = useUserData();

  const id = anime.id;
  const isFav = isInFavorites(id);
  const isWatch = isInWatchlist(id);
  const rating = getRating(id);

  const animeItem = {
    id,
    title: anime.title,
    poster: anime.image || anime.poster || "",
    type: "anime",
  };

  const handleRating = (value: number) => {
    setRating({
      id,
      title: anime.title,
      poster: anime.image || anime.poster || "",
      rating: value,
    });
  };

  return (
    <header className="relative w-full h-[450px]">
      <img
        src={anime.banner}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="absolute bottom-10 left-10 flex items-end gap-8">
        <img
          src={anime.image}
          className="w-52 h-72 rounded-xl object-cover shadow-xl"
        />

        <div>
          <h1 className="text-4xl font-bold text-white">{anime.title}</h1>
          <p className="text-gray-300 mt-2">{anime.japaneseTitle}</p>

          <div className="flex gap-3 mt-5">
            <button
              onClick={() => toggleFavorite(animeItem)}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center gap-2 transition"
            >
              <Heart
                className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : ""}`}
              />
              {isFav ? "حذف از علاقه‌مندی" : "علاقه‌مندی"}
            </button>

            <button
              onClick={() => toggleWatchlist(animeItem)}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center gap-2"
            >
              <Bookmark
                className={`w-5 h-5 ${isWatch ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
              {isWatch ? "در لیست من" : "لیست من"}
            </button>

            <button
              onClick={() =>
                addDownload({
                  id,
                  title: anime.title,
                  poster: anime.image || anime.poster || "",
                })
              }
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              دانلود
            </button>
          </div>

          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                onClick={() => handleRating(n)}
                className={`w-6 h-6 cursor-pointer ${
                  n <= rating ? "text-yellow-400 fill-yellow-400" : "text-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AnimeHeader;
