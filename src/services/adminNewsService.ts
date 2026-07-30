// src/services/adminNewsService.ts
import { supabase } from '../lib/supabaseClient';

export interface NewsAuthor {
  name: string;
  avatar: string;
  bio: string;
  role: string;
  followers: number;
}

export interface AdminNews {
  id: string;
  title: string;
  summary: string;
  excerpt: string;
  content: string[];      // آرایهٔ پاراگراف‌ها (jsonb)
  image: string;
  category: string;
  tags: string[];
  author: NewsAuthor;     // آبجکت نویسنده (jsonb)
  date: string;
  readTime: number;
  isFeatured: boolean;
  isHot: boolean;
  relatedIds: string[];
  views: number;          // فقط نمایش — در فرم ویرایش نمی‌شود
  likes: number;          // فقط نمایش
}

const COLUMNS =
  'id,title,summary,excerpt,content,image,category,tags,author,date,read_time,views,likes,is_featured,is_hot,related_ids';

function mapRow(r: Record<string, unknown>): AdminNews {
  const author = (r.author as Partial<NewsAuthor>) || {};
  return {
    id: String(r.id),
    title: (r.title as string) || '',
    summary: (r.summary as string) || '',
    excerpt: (r.excerpt as string) || '',
    content: Array.isArray(r.content) ? (r.content as string[]) : [],
    image: (r.image as string) || '',
    category: (r.category as string) || '',
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    author: {
      name: author.name || '',
      avatar: author.avatar || '',
      bio: author.bio || '',
      role: author.role || '',
      followers: typeof author.followers === 'number' ? author.followers : 0,
    },
    date: (r.date as string) || '',
    readTime: (r.read_time as number) ?? 0,
    isFeatured: !!r.is_featured,
    isHot: !!r.is_hot,
    relatedIds: Array.isArray(r.related_ids) ? (r.related_ids as string[]) : [],
    views: (r.views as number) ?? 0,
    likes: (r.likes as number) ?? 0,
  };
}

// views/likes/comments/created_at دست‌نخورده می‌مانند (در فرم ویرایش نمی‌شوند)
function toRow(a: Omit<AdminNews, 'id'>) {
  return {
    title: a.title,
    summary: a.summary,
    excerpt: a.excerpt,
    content: a.content,
    image: a.image,
    category: a.category,
    tags: a.tags,
    author: a.author,
    date: a.date,
    read_time: a.readTime,
    is_featured: a.isFeatured,
    is_hot: a.isHot,
    related_ids: a.relatedIds,
  };
}

export async function listNews(): Promise<AdminNews[]> {
  const { data, error } = await supabase.from('news').select(COLUMNS).order('date', { ascending: false });
  if (error) {
    console.error('خطا در خواندن اخبار:', error.message);
    throw error;
  }
  return ((data ?? []) as Record<string, unknown>[]).map(mapRow);
}

export async function createNews(a: Omit<AdminNews, 'id'>): Promise<void> {
  // id جدید: اگر همهٔ idها عددی‌اند بزرگ‌ترین+۱، وگرنه یک id یکتا
  const { data: idRows, error: idErr } = await supabase.from('news').select('id');
  if (idErr) {
    console.error('خطا در خواندن idها:', idErr.message);
    throw idErr;
  }
  const ids = (idRows ?? []).map((r) => String((r as { id: unknown }).id));
  const allNumeric = ids.length > 0 && ids.every((s) => /^\d+$/.test(s));
  const newId = allNumeric ? String(Math.max(...ids.map(Number)) + 1) : Date.now().toString();

  const { error } = await supabase.from('news').insert({ id: newId, ...toRow(a) });
  if (error) {
    console.error('خطا در افزودن خبر:', error.message);
    throw error;
  }
}

export async function updateNews(id: string, a: Omit<AdminNews, 'id'>): Promise<void> {
  const { error } = await supabase.from('news').update(toRow(a)).eq('id', id);
  if (error) {
    console.error('خطا در ویرایش خبر:', error.message);
    throw error;
  }
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) {
    console.error('خطا در حذف خبر:', error.message);
    throw error;
  }
}

// آپلود عکس خبر (در همان انباری anime-images، داخل پوشهٔ news)
export async function uploadNewsImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `news/${Date.now()}-${rand}.${ext}`;

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
