// src/services/adminDownloadsService.ts
import { supabase } from '../lib/supabaseClient';

export type ContentType = 'anime' | 'animation' | 'music';

export interface DownloadLink {
  id: number;
  contentType: ContentType;
  contentId: string;
  season: number;
  episode: number;
  quality: string;
  title: string;
  url: string;
  size: string;
}

export interface ContentOption {
  id: string;
  title: string;
}

export interface DownloadInput {
  contentType: ContentType;
  contentId: string;
  season: number;
  episode: number;
  quality: string;
  title: string;
  url: string;
  size: string;
}

const TABLE_FOR: Record<ContentType, string> = { anime: 'animes', animation: 'animations', music: 'music' };
const COLUMNS = 'id, content_type, content_id, season, episode, quality, title, url, size';

// لیست انیمه‌ها یا انیمیشن‌ها برای انتخاب (id + عنوان)
export async function getContentList(type: ContentType): Promise<ContentOption[]> {
  const { data, error } = await supabase.from(TABLE_FOR[type]).select('id, title').order('title', { ascending: true });
  if (error) {
    console.error('خطا در خواندن لیست محتوا:', error.message);
    throw error;
  }
  return ((data ?? []) as { id: unknown; title: unknown }[]).map((r) => ({
    id: String(r.id),
    title: String(r.title ?? ''),
  }));
}

function mapRow(r: Record<string, unknown>): DownloadLink {
  return {
    id: Number(r.id),
    contentType: (r.content_type as ContentType) || 'anime',
    contentId: String(r.content_id),
    season: (r.season as number) ?? 1,
    episode: (r.episode as number) ?? 1,
    quality: (r.quality as string) || '1080p',
    title: (r.title as string) || '',
    url: (r.url as string) || '',
    size: (r.size as string) || '',
  };
}

function toRow(d: DownloadInput) {
  return {
    content_type: d.contentType,
    content_id: String(d.contentId),
    season: d.season,
    episode: d.episode,
    quality: d.quality,
    title: d.title || null,
    url: d.url,
    size: d.size || null,
  };
}

export async function listDownloads(type: ContentType, contentId: string): Promise<DownloadLink[]> {
  const { data, error } = await supabase
    .from('downloads')
    .select(COLUMNS)
    .eq('content_type', type)
    .eq('content_id', String(contentId))
    .order('season', { ascending: true })
    .order('episode', { ascending: true });
  if (error) {
    console.error('خطا در خواندن دانلودها:', error.message);
    throw error;
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function createDownload(d: DownloadInput): Promise<void> {
  const { error } = await supabase.from('downloads').insert(toRow(d));
  if (error) {
    console.error('خطا در افزودن لینک:', error.message);
    throw error;
  }
}

// افزودن گروهی: چند لینک یک‌جا؛ هر لینک یک قسمت (شماره از startEpisode به بعد)
export async function createDownloadsBulk(
  common: { contentType: ContentType; contentId: string; season: number; quality: string; size: string },
  urls: string[],
  startEpisode: number,
): Promise<void> {
  const rows = urls.map((url, i) =>
    toRow({
      contentType: common.contentType,
      contentId: common.contentId,
      season: common.season,
      quality: common.quality,
      size: common.size,
      episode: startEpisode + i,
      title: '',
      url,
    }),
  );
  if (rows.length === 0) return;
  const { error } = await supabase.from('downloads').insert(rows);
  if (error) {
    console.error('خطا در افزودن گروهی:', error.message);
    throw error;
  }
}

export async function updateDownload(id: number, d: DownloadInput): Promise<void> {
  const { error } = await supabase.from('downloads').update(toRow(d)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش لینک:', error.message);
    throw error;
  }
}

export async function deleteDownload(id: number): Promise<void> {
  const { error } = await supabase.from('downloads').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف لینک:', error.message);
    throw error;
  }
}
