// src/services/adminReelsService.ts
import { supabase } from '../lib/supabaseClient';

export interface AdminReel {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  likes: number;
  views: number;
}

const COLUMNS = 'id, title, thumbnail, video_url, duration, likes, views';

function mapRow(r: Record<string, unknown>): AdminReel {
  return {
    id: r.id as number,
    title: (r.title as string) || '',
    thumbnail: (r.thumbnail as string) || '',
    videoUrl: (r.video_url as string) || '',
    duration: (r.duration as string) || '',
    likes: (r.likes as number) ?? 0,
    views: (r.views as number) ?? 0,
  };
}

function toRow(a: Omit<AdminReel, 'id'>) {
  return {
    title: a.title,
    thumbnail: a.thumbnail,
    video_url: a.videoUrl,
    duration: a.duration || null,
    likes: a.likes,
    views: a.views,
  };
}

export async function listReels(): Promise<AdminReel[]> {
  const { data, error } = await supabase.from('anime_reels').select(COLUMNS).order('id', { ascending: true });
  if (error) {
    console.error('خطا در خواندن ریل‌ها:', error.message);
    throw error;
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function createReel(a: Omit<AdminReel, 'id'>): Promise<void> {
  const { data: maxRows, error: maxErr } = await supabase
    .from('anime_reels')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  if (maxErr) {
    console.error('خطا در محاسبهٔ id:', maxErr.message);
    throw maxErr;
  }
  const nextId = ((maxRows?.[0]?.id as number | undefined) ?? 0) + 1;

  const { error } = await supabase.from('anime_reels').insert({ id: nextId, ...toRow(a) });
  if (error) {
    console.error('خطا در افزودن ریل:', error.message);
    throw error;
  }
}

export async function updateReel(id: number, a: Omit<AdminReel, 'id'>): Promise<void> {
  const { error } = await supabase.from('anime_reels').update(toRow(a)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش ریل:', error.message);
    throw error;
  }
}

export async function deleteReel(id: number): Promise<void> {
  const { error } = await supabase.from('anime_reels').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف ریل:', error.message);
    throw error;
  }
}

// آپلود عکس بندانگشتی (کاور) به انباری
export async function uploadReelImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `reels/${Date.now()}-${rand}.${ext}`;

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
