// src/services/adminAnimationService.ts
import { supabase } from '../lib/supabaseClient';

export interface AdminAnimation {
  id: number;
  title: string;
  titleEn: string;
  poster: string;
  banner: string;
  rating: number;
  year: number;
  duration: string;
  studio: string;
  director: string;
  country: string;
  genres: string[];
  synopsis: string;
  isTrending: boolean;
  isNew: boolean;
  viewCount: number; // فقط نمایش
}

const COLUMNS =
  'id,title,title_en,poster,banner,rating,year,duration,studio,director,country,genres,synopsis,is_trending,is_new,view_count';

function mapRow(r: Record<string, unknown>): AdminAnimation {
  return {
    id: r.id as number,
    title: (r.title as string) || '',
    titleEn: (r.title_en as string) || '',
    poster: (r.poster as string) || '',
    banner: (r.banner as string) || '',
    rating: (r.rating as number) ?? 0,
    year: (r.year as number) ?? 0,
    duration: (r.duration as string) || '',
    studio: (r.studio as string) || '',
    director: (r.director as string) || '',
    country: (r.country as string) || '',
    genres: Array.isArray(r.genres) ? (r.genres as string[]) : [],
    synopsis: (r.synopsis as string) || '',
    isTrending: !!r.is_trending,
    isNew: !!r.is_new,
    viewCount: (r.view_count as number) ?? 0,
  };
}

// characters و view_count دست‌نخورده می‌مانند
function toRow(a: Omit<AdminAnimation, 'id' | 'viewCount'>) {
  return {
    title: a.title,
    title_en: a.titleEn || null,
    poster: a.poster,
    banner: a.banner,
    rating: a.rating,
    year: a.year,
    duration: a.duration || null,
    studio: a.studio || null,
    director: a.director || null,
    country: a.country || null,
    genres: a.genres,
    synopsis: a.synopsis,
    is_trending: a.isTrending,
    is_new: a.isNew,
  };
}

export async function listAnimations(): Promise<AdminAnimation[]> {
  const { data, error } = await supabase.from('animations').select(COLUMNS).order('id', { ascending: true });
  if (error) {
    console.error('خطا در خواندن انیمیشن‌ها:', error.message);
    throw error;
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function createAnimation(a: Omit<AdminAnimation, 'id' | 'viewCount'>): Promise<void> {
  const { data: maxRows, error: maxErr } = await supabase
    .from('animations')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);
  if (maxErr) {
    console.error('خطا در محاسبهٔ id:', maxErr.message);
    throw maxErr;
  }
  const nextId = ((maxRows?.[0]?.id as number | undefined) ?? 0) + 1;

  const { error } = await supabase.from('animations').insert({ id: nextId, ...toRow(a), characters: [] });
  if (error) {
    console.error('خطا در افزودن انیمیشن:', error.message);
    throw error;
  }
}

export async function updateAnimation(id: number, a: Omit<AdminAnimation, 'id' | 'viewCount'>): Promise<void> {
  const { error } = await supabase.from('animations').update(toRow(a)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش انیمیشن:', error.message);
    throw error;
  }
}

export async function deleteAnimation(id: number): Promise<void> {
  const { error } = await supabase.from('animations').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف انیمیشن:', error.message);
    throw error;
  }
}

export async function uploadAnimationImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `animations/${Date.now()}-${rand}.${ext}`;

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
