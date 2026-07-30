// src/services/reelsService.ts
import { supabase } from '../lib/supabaseClient';

// ─── ساختار یک ریل (camelCase) — مطابق animeReels در mockData ───
export interface AnimeReel {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  likes: number;
  views: number;
}

// ─── شکل ردیف خام دیتابیس (snake_case) ───
interface AnimeReelRow {
  id: number;
  title: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  likes: number;
  views: number;
}

// ─── تبدیل snake_case (دیتابیس) → camelCase (interface برنامه) ───
function mapRow(row: AnimeReelRow): AnimeReel {
  return {
    id: row.id,
    title: row.title,
    thumbnail: row.thumbnail,
    videoUrl: row.video_url,
    duration: row.duration,
    likes: row.likes,
    views: row.views,
  };
}

// ─── خواندن همهٔ ریل‌ها از Supabase (مرتب بر اساس id) ───
export async function getAnimeReels(): Promise<AnimeReel[]> {
  const { data, error } = await supabase
    .from('anime_reels')
    .select('id, title, thumbnail, video_url, duration, likes, views')
    .order('id', { ascending: true });

  if (error) {
    console.error('خطا در خواندن ریل‌ها از دیتابیس:', error.message);
    return [];
  }

  return ((data ?? []) as AnimeReelRow[]).map(mapRow);
}
