// src/services/downloadsService.ts
// سرویس عمومی دانلود (برای نمایش در خود سایت — خواندن باز است)
import { supabase } from '../lib/supabaseClient';

export type ContentType = 'anime' | 'animation' | 'music';

export interface PublicDownload {
  id: number;
  season: number;
  episode: number;
  quality: string;
  title: string;
  url: string;
  size: string;
}

const TABLE_FOR: Record<ContentType, string> = { anime: 'animes', animation: 'animations', music: 'music' };

function mapRow(r: Record<string, unknown>): PublicDownload {
  return {
    id: Number(r.id),
    season: (r.season as number) ?? 1,
    episode: (r.episode as number) ?? 1,
    quality: (r.quality as string) || '1080p',
    title: (r.title as string) || '',
    url: (r.url as string) || '',
    size: (r.size as string) || '',
  };
}

// همهٔ لینک‌های یک انیمه/انیمیشن/موزیک
export async function getDownloads(type: ContentType, contentId: string): Promise<PublicDownload[]> {
  const { data, error } = await supabase
    .from('downloads')
    .select('id, season, episode, quality, title, url, size')
    .eq('content_type', type)
    .eq('content_id', String(contentId))
    .order('season', { ascending: true })
    .order('episode', { ascending: true });
  if (error) {
    console.error('خطا در خواندن دانلودها:', error.message);
    return [];
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

// گرفتن آدرس واقعی یک لینک (برای صفحهٔ واسط /dl/:id)
export async function getDownloadUrl(id: number): Promise<string | null> {
  const { data, error } = await supabase
    .from('downloads')
    .select('url')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('خطا در خواندن لینک:', error.message);
    return null;
  }
  return (data?.url as string) || null;
}

// عنوان انیمه/انیمیشن/موزیک (برای تیتر صفحهٔ دانلود)
export async function getContentTitle(type: ContentType, contentId: string): Promise<string> {
  const { data, error } = await supabase
    .from(TABLE_FOR[type])
    .select('title')
    .eq('id', contentId)
    .maybeSingle();
  if (error) {
    console.error('خطا در خواندن عنوان:', error.message);
    return '';
  }
  return (data?.title as string) || '';
}
