// src/services/musicService.ts
import { supabase } from '../lib/supabaseClient';
import type { MusicItem } from '../features/music/user/data/musicData';

const SELECT =
  'id,title,artist,anime,type,genre,summary,content,cover_image,audio_url,duration,release_date,views,likes,comments_count,bookmarks,tags,is_featured,is_hot,lyrics,comments,related_ids,author';

function mapRow(r: Record<string, unknown>): MusicItem {
  return {
    id: String(r.id),
    title: (r.title as string) || '',
    artist: (r.artist as string) || '',
    anime: (r.anime as string) || '',
    type: (r.type as MusicItem['type']) || 'OST',
    genre: (r.genre as string) || '',
    summary: (r.summary as string) || '',
    content: (r.content as string[]) || [],
    coverImage: (r.cover_image as string) || '',
    audioUrl: (r.audio_url as string) || undefined,
    duration: (r.duration as string) || '',
    releaseDate: (r.release_date as string) || '',
    views: (r.views as number) ?? 0,
    likes: (r.likes as number) ?? 0,
    commentsCount: (r.comments_count as number) ?? 0,
    bookmarks: (r.bookmarks as number) ?? 0,
    tags: (r.tags as string[]) || [],
    isFeatured: !!r.is_featured,
    isHot: !!r.is_hot,
    lyrics: (r.lyrics as string) || undefined,
    comments: (r.comments as MusicItem['comments']) || [],
    relatedIds: (r.related_ids as string[]) || [],
    author: (r.author as MusicItem['author']) || { name: '', avatar: '', bio: '', role: '', followers: 0 },
  } as MusicItem;
}

export async function getAllMusic(): Promise<MusicItem[]> {
  const { data, error } = await supabase.from('music').select(SELECT).order('release_date', { ascending: false });
  if (error) { console.error('خواندن موزیک:', error.message); return []; }
  return (data || []).map(mapRow);
}

export async function getMusicById(id: string): Promise<MusicItem | null> {
  const { data, error } = await supabase.from('music').select(SELECT).eq('id', String(id)).maybeSingle();
  if (error) { console.error('خواندن آهنگ:', error.message); return null; }
  return data ? mapRow(data) : null;
}

// نام مستعار برای سازگاری
export const getTrackById = getMusicById;

export async function getRelatedTracks(trackId: string, limit = 6): Promise<MusicItem[]> {
  const all = await getAllMusic();
  const track = all.find((t) => t.id === trackId);
  if (!track) return [];
  const byIds = all.filter((t) => (track.relatedIds || []).includes(t.id) && t.id !== trackId);
  if (byIds.length >= limit) return byIds.slice(0, limit);
  const sameGenre = all.filter(
    (t) => t.genre === track.genre && t.id !== trackId && !byIds.some((b) => b.id === t.id)
  );
  return [...byIds, ...sameGenre].slice(0, limit);
}

export async function getHotTracks(): Promise<MusicItem[]> {
  const all = await getAllMusic();
  return all.filter((t) => t.isHot).sort((a, b) => b.views - a.views);
}

export async function getFeaturedTracks(): Promise<MusicItem[]> {
  const all = await getAllMusic();
  return all.filter((t) => t.isFeatured);
}

export async function searchTracks(query: string): Promise<MusicItem[]> {
  const q = query.trim().toLowerCase();
  const all = await getAllMusic();
  if (!q) return all;
  return all.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.anime.toLowerCase().includes(q) ||
      (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
  );
}

export async function getAllGenres(): Promise<string[]> {
  const all = await getAllMusic();
  return Array.from(new Set(all.map((t) => t.genre)));
}

export async function getAllMusicTags(): Promise<string[]> {
  const all = await getAllMusic();
  return Array.from(new Set(all.flatMap((t) => t.tags || [])));
}

export async function getAllTypes(): Promise<string[]> {
  const all = await getAllMusic();
  return Array.from(new Set(all.map((t) => t.type)));
}

export async function getTracksByType(type: string): Promise<MusicItem[]> {
  const all = await getAllMusic();
  return all.filter((t) => t.type === type);
}

/** ثبت بازدید پخش (نیازمند تابع RPC؛ بی‌صدا اگر نبود) */
export async function incrementMusicViews(trackId: string): Promise<void> {
  try {
    await supabase.rpc('increment_music_view', { track_id: String(trackId) });
  } catch {
    /* ignore */
  }
}
