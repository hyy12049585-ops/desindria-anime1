import { Anime, Episode } from '../types/anime.types';
import { getAnimeById as fetchAnimeById, getSimilarAnimes } from '@/services/animeService';

export const getAnimeById = async (id: number): Promise<Anime | null> => {
  // حالا از دیتابیس (Supabase) خوانده می‌شود
  return (await fetchAnimeById(id)) as unknown as Anime | null;
};

export const getAnimeEpisodes = async (animeId: number): Promise<Episode[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // قسمت‌ها فعلاً ساختگی‌اند (وقتی سیستم قسمت‌ها واقعی شد، از دیتابیس می‌گیریم)
  return Array.from({ length: 12 }, (_, i) => ({
    num: i + 1,
    title: `قسمت ${i + 1}`,
    duration: "24 دقیقه",
    aired: `۱۴۰۵/۰۱/${String(i + 1).padStart(2, "۰")}`,
  }));
};

export const getSimilarAnime = async (animeId: number): Promise<Anime[]> => {
  // انیمه‌های مشابه از دیتابیس (بر اساس ژانر مشترک)
  return (await getSimilarAnimes(animeId, 6)) as unknown as Anime[];
};
