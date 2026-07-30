// src/services/animeService.ts
import { supabase } from '../lib/supabaseClient';
import type { Anime } from '../features/anime/types/anime';

// تبدیل ردیف دیتابیس (snake_case) به شکل Anime (camelCase)
function mapRow(r: Record<string, unknown>): Anime {
  return {
    id: r.id as number,
    title: (r.title as string) || '',
    titleEn: (r.title_en as string) || '',
    image: (r.image as string) || '',
    poster: (r.poster as string) || '',
    banner: (r.banner as string) || '',
    rating: (r.rating as number) ?? 0,
    episodes: (r.episodes as number) ?? 0,
    currentEpisode: (r.current_episode as number) ?? 0,
    genres: (r.genres as string[]) || [],
    status: (r.status as string) || '',
    season: (r.season as string) || '',
    year: (r.year as number) ?? 0,
    studio: (r.studio as string) || '',
    synopsis: (r.synopsis as string) || '',
    duration: (r.duration as string) || '',
    isTrending: !!r.is_trending,
    isNew: !!r.is_new,
    viewCount: (r.view_count as number) ?? 0,
  } as Anime;
}

const SELECT =
  'id,title,title_en,image,poster,banner,rating,episodes,current_episode,genres,status,season,year,studio,synopsis,duration,is_trending,is_new,view_count';

export async function getAllAnimes(): Promise<Anime[]> {
  const { data, error } = await supabase
    .from('animes')
    .select(SELECT)
    .order('id', { ascending: true });
  if (error) {
    console.error('خواندن انیمه‌ها:', error.message);
    return [];
  }
  return (data || []).map(mapRow);
}

export async function getAnimeById(id: number | string): Promise<Anime | null> {
  const { data, error } = await supabase
    .from('animes')
    .select(SELECT)
    .eq('id', Number(id))
    .maybeSingle();
  if (error) {
    console.error('خواندن انیمه:', error.message);
    return null;
  }
  return data ? mapRow(data) : null;
}

export async function getSimilarAnimes(id: number | string, limit = 6): Promise<Anime[]> {
  const all = await getAllAnimes();
  const current = all.find((a) => String(a.id) === String(id));
  if (!current) return [];
  return all
    .filter((a) => String(a.id) !== String(id) && a.genres.some((g) => current.genres.includes(g)))
    .slice(0, limit);
}

export async function searchAnimes(query: string): Promise<Anime[]> {
  const q = query.trim();
  const all = await getAllAnimes();
  if (!q) return all;
  const lower = q.toLowerCase();
  return all.filter((a) => a.title.includes(q) || (a.titleEn || '').toLowerCase().includes(lower));
}

/** ثبت یک بازدید برای انیمه (شمارش محبوبیت واقعی) */
export async function incrementAnimeView(id: number | string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_anime_view', { anime_id: Number(id) });
    if (error) console.error('ثبت بازدید:', error.message);
  } catch {
    /* ignore */
  }
}

/** پربازدیدترین انیمه‌ها (محبوب‌ترین‌ها بر اساس بازدید واقعی) */
export async function getPopularAnimes(limit = 12): Promise<Anime[]> {
  const { data, error } = await supabase
    .from('animes')
    .select(SELECT)
    .order('view_count', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('خواندن محبوب‌ترین‌ها:', error.message);
    return [];
  }
  return (data || []).map(mapRow);
}
