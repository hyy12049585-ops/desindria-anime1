// src/services/adminAnimeService.ts
import { supabase } from '../lib/supabaseClient';

// ساختار انیمه برای پنل ادمین (camelCase، مطابق ستون‌های جدول animes)
export interface AdminAnime {
  id: number;
  title: string;
  titleEn: string;
  image: string;
  poster: string;
  banner: string;
  slider: string;
  logo: string;
  rating: number;
  episodes: number;
  currentEpisode: number;
  genres: string[];
  status: string;
  season: string;
  year: number;
  studio: string;
  synopsis: string;
  duration: string;
  isTrending: boolean;
  isNew: boolean;
}

interface AnimeRow {
  id: number;
  title: string;
  title_en: string | null;
  image: string;
  poster: string | null;
  banner: string;
  slider: string | null;
  logo: string | null;
  rating: number | string | null;
  episodes: number | null;
  current_episode: number | null;
  genres: string[] | null;
  status: string;
  season: string;
  year: number;
  studio: string | null;
  synopsis: string;
  duration: string | null;
  is_trending: boolean | null;
  is_new: boolean | null;
}

const COLUMNS =
  'id, title, title_en, image, poster, banner, slider, logo, rating, episodes, current_episode, genres, status, season, year, studio, synopsis, duration, is_trending, is_new';

function mapRow(r: AnimeRow): AdminAnime {
  return {
    id: r.id,
    title: r.title,
    titleEn: r.title_en ?? '',
    image: r.image,
    poster: r.poster ?? '',
    banner: r.banner,
    slider: r.slider ?? '',
    logo: r.logo ?? '',
    rating: r.rating == null ? 0 : Number(r.rating),
    episodes: r.episodes ?? 0,
    currentEpisode: r.current_episode ?? 0,
    genres: r.genres ?? [],
    status: r.status,
    season: r.season,
    year: r.year,
    studio: r.studio ?? '',
    synopsis: r.synopsis,
    duration: r.duration ?? '',
    isTrending: r.is_trending ?? false,
    isNew: r.is_new ?? false,
  };
}

// برنامه → دیتابیس (views و created_at دست‌نخورده می‌مانند)
function toRow(a: Omit<AdminAnime, 'id'>) {
  return {
    title: a.title,
    title_en: a.titleEn || null,
    image: a.image,
    poster: a.poster || null,
    banner: a.banner,
    slider: a.slider || null,
    logo: a.logo || null,
    rating: a.rating,
    episodes: a.episodes,
    current_episode: a.currentEpisode,
    genres: a.genres,
    status: a.status,
    season: a.season,
    year: a.year,
    studio: a.studio || null,
    synopsis: a.synopsis,
    duration: a.duration || null,
    is_trending: a.isTrending,
    is_new: a.isNew,
  };
}

export async function listAnimes(): Promise<AdminAnime[]> {
  const { data, error } = await supabase
    .from('animes')
    .select(COLUMNS)
    .order('id', { ascending: true });
  if (error) {
    console.error('خطا در خواندن انیمه‌ها:', error.message);
    throw error;
  }
  return ((data ?? []) as AnimeRow[]).map(mapRow);
}

export async function createAnime(a: Omit<AdminAnime, 'id'>): Promise<void> {
  const { data: maxRows, error: maxErr } = await supabase
    .from('animes')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  if (maxErr) {
    console.error('خطا در محاسبهٔ id:', maxErr.message);
    throw maxErr;
  }
  const nextId = ((maxRows?.[0]?.id as number | undefined) ?? 0) + 1;

  const { error } = await supabase.from('animes').insert({ id: nextId, ...toRow(a) });
  if (error) {
    console.error('خطا در افزودن انیمه:', error.message);
    throw error;
  }
}

export async function updateAnime(id: number, a: Omit<AdminAnime, 'id'>): Promise<void> {
  const { error } = await supabase.from('animes').update(toRow(a)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش انیمه:', error.message);
    throw error;
  }
}

export async function deleteAnime(id: number): Promise<void> {
  const { error } = await supabase.from('animes').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف انیمه:', error.message);
    throw error;
  }
}

// آپلود یک عکس به انباری anime-images و گرفتن آدرس عمومی‌اش
export async function uploadAnimeImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${Date.now()}-${rand}.${ext}`;

  const { error } = await supabase.storage
    .from('anime-images')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) {
    console.error('خطا در آپلود عکس:', error.message);
    throw error;
  }

  const { data } = supabase.storage.from('anime-images').getPublicUrl(path);
  return data.publicUrl;
}
