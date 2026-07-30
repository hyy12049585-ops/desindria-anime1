import { useLocation } from "react-router-dom";
import AnimeHeader from "../components/AnimeHeader";
import{AnimeMeta} from "../components/AnimeMeta";
import {AnimeSynopsis} from "../components/AnimeSynopsis";
import EpisodeList from "../components/EpisodeList";

import { normalizeAnime } from "../utils/normalizeAnime";

export default function AnimePage() {
  const { state } = useLocation();
  const anime = state?.anime ? normalizeAnime(state.anime) : null;

  if (!anime) {
    return (
      <div className="text-center text-gray-500 mt-10">
        اطلاعات انیمه پیدا نشد.
      </div>
    );
  }

  return (
    <div className="pb-10">
      <AnimeHeader anime={anime} />
      <div className="px-4 md:px-10">

        <AnimeMeta anime={anime} />

        <AnimeSynopsis synopsis={anime.synopsis} />

        <EpisodeList episodes={anime.episodes} />
      </div>
    </div>
  );
}
