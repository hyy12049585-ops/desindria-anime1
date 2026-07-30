// src/services/adminMusicService.ts
import { supabase } from '../lib/supabaseClient';

export interface MusicAuthor {
  name: string;
  avatar: string;
  bio: string;
  role: string;
  followers: number;
}

export interface AdminMusic {
  id: string;
  title: string;
  artist: string;
  anime: string;
  type: string;
  genre: string;
  summary: string;
  content: string[];      // پاراگراف‌ها (jsonb)
  coverImage: string;
  audioUrl: string;
  duration: string;
  releaseDate: string;
  tags: string[];
  lyrics: string;
  author: MusicAuthor;    // آبجکت نویسنده (jsonb)
  isFeatured: boolean;
  isHot: boolean;
  relatedIds: string[];
  views: number;          // فقط نمایش
  likes: number;          // فقط نمایش
}

const COLUMNS =
  'id,title,artist,anime,type,genre,summary,content,cover_image,audio_url,duration,release_date,views,likes,tags,is_featured,is_hot,lyrics,related_ids,author';

function mapRow(r: Record<string, unknown>): AdminMusic {
  const author = (r.author as Partial<MusicAuthor>) || {};
  return {
    id: String(r.id),
    title: (r.title as string) || '',
    artist: (r.artist as string) || '',
    anime: (r.anime as string) || '',
    type: (r.type as string) || 'OST',
    genre: (r.genre as string) || '',
    summary: (r.summary as string) || '',
    content: Array.isArray(r.content) ? (r.content as string[]) : [],
    coverImage: (r.cover_image as string) || '',
    audioUrl: (r.audio_url as string) || '',
    duration: (r.duration as string) || '',
    releaseDate: (r.release_date as string) || '',
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    lyrics: (r.lyrics as string) || '',
    author: {
      name: author.name || '',
      avatar: author.avatar || '',
      bio: author.bio || '',
      role: author.role || '',
      followers: typeof author.followers === 'number' ? author.followers : 0,
    },
    isFeatured: !!r.is_featured,
    isHot: !!r.is_hot,
    relatedIds: Array.isArray(r.related_ids) ? (r.related_ids as string[]) : [],
    views: (r.views as number) ?? 0,
    likes: (r.likes as number) ?? 0,
  };
}

// views/likes/comments و... دست‌نخورده می‌مانند
function toRow(a: Omit<AdminMusic, 'id'>) {
  return {
    title: a.title,
    artist: a.artist,
    anime: a.anime,
    type: a.type,
    genre: a.genre,
    summary: a.summary,
    content: a.content,
    cover_image: a.coverImage,
    audio_url: a.audioUrl || null,
    duration: a.duration,
    release_date: a.releaseDate,
    tags: a.tags,
    lyrics: a.lyrics || null,
    author: a.author,
    is_featured: a.isFeatured,
    is_hot: a.isHot,
    related_ids: a.relatedIds,
  };
}

export async function listMusic(): Promise<AdminMusic[]> {
  const { data, error } = await supabase.from('music').select(COLUMNS).order('release_date', { ascending: false });
  if (error) {
    console.error('خطا در خواندن موزیک:', error.message);
    throw error;
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function createMusic(a: Omit<AdminMusic, 'id'>): Promise<void> {
  const { data: idRows, error: idErr } = await supabase.from('music').select('id');
  if (idErr) {
    console.error('خطا در خواندن idها:', idErr.message);
    throw idErr;
  }
  const ids = (idRows ?? []).map((r) => String((r as { id: unknown }).id));
  const allNumeric = ids.length > 0 && ids.every((s) => /^\d+$/.test(s));
  const newId = allNumeric ? String(Math.max(...ids.map(Number)) + 1) : Date.now().toString();

  const { error } = await supabase.from('music').insert({ id: newId, ...toRow(a) });
  if (error) {
    console.error('خطا در افزودن موزیک:', error.message);
    throw error;
  }
}

export async function updateMusic(id: string, a: Omit<AdminMusic, 'id'>): Promise<void> {
  const { error } = await supabase.from('music').update(toRow(a)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش موزیک:', error.message);
    throw error;
  }
}

export async function deleteMusic(id: string): Promise<void> {
  const { error } = await supabase.from('music').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف موزیک:', error.message);
    throw error;
  }
}

// آپلود کاور موزیک (در انباری anime-images، پوشهٔ music)
export async function uploadMusicImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `music/${Date.now()}-${rand}.${ext}`;

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
