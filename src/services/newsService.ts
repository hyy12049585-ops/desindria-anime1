// src/services/newsService.ts
import { supabase } from '../lib/supabaseClient';
import type { NewsArticle } from '../data/newsData';

const SELECT =
  'id,title,summary,excerpt,content,image,category,tags,author,date,read_time,views,likes,comments_count,bookmarks,is_featured,is_hot,comments,related_ids';

function mapRow(r: Record<string, unknown>): NewsArticle {
  return {
    id: String(r.id),
    title: (r.title as string) || '',
    summary: (r.summary as string) || '',
    excerpt: (r.excerpt as string) || '',
    content: (r.content as string[]) || [],
    image: (r.image as string) || '',
    category: (r.category as string) || '',
    tags: (r.tags as string[]) || [],
    author: (r.author as NewsArticle['author']) || { name: '', avatar: '', bio: '', role: '', followers: 0 },
    date: (r.date as string) || '',
    readTime: (r.read_time as number) ?? 0,
    views: (r.views as number) ?? 0,
    likes: (r.likes as number) ?? 0,
    commentsCount: (r.comments_count as number) ?? 0,
    bookmarks: (r.bookmarks as number) ?? 0,
    isFeatured: !!r.is_featured,
    isHot: !!r.is_hot,
    comments: (r.comments as NewsArticle['comments']) || [],
    relatedIds: (r.related_ids as string[]) || [],
  } as NewsArticle;
}

export async function getAllNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase.from('news').select(SELECT).order('date', { ascending: false });
  if (error) { console.error('خواندن اخبار:', error.message); return []; }
  return (data || []).map(mapRow);
}

export async function getArticleById(id: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase.from('news').select(SELECT).eq('id', String(id)).maybeSingle();
  if (error) { console.error('خواندن خبر:', error.message); return null; }
  return data ? mapRow(data) : null;
}

export async function getRelatedArticles(article: NewsArticle, limit = 3): Promise<NewsArticle[]> {
  const all = await getAllNews();
  // اول بر اساس relatedIds، بعد هم‌دسته‌ای‌ها
  const byIds = all.filter((a) => (article.relatedIds || []).includes(a.id) && a.id !== article.id);
  if (byIds.length >= limit) return byIds.slice(0, limit);
  const sameCat = all.filter(
    (a) => a.category === article.category && a.id !== article.id && !byIds.some((b) => b.id === a.id)
  );
  return [...byIds, ...sameCat].slice(0, limit);
}

export async function searchArticles(query: string): Promise<NewsArticle[]> {
  const q = query.trim();
  const all = await getAllNews();
  if (!q) return all;
  const lower = q.toLowerCase();
  return all.filter(
    (a) =>
      a.title.includes(q) ||
      a.summary.includes(q) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(lower))
  );
}

export async function getFeaturedArticles(): Promise<NewsArticle[]> {
  const all = await getAllNews();
  return all.filter((a) => a.isFeatured);
}

export async function getHotArticles(): Promise<NewsArticle[]> {
  const all = await getAllNews();
  return all.filter((a) => a.isHot);
}

export async function getArticlesByCategory(category: string): Promise<NewsArticle[]> {
  const all = await getAllNews();
  if (!category || category === 'همه') return all;
  return all.filter((a) => a.category === category);
}

export async function getLatestArticles(limit?: number): Promise<NewsArticle[]> {
  const all = await getAllNews();
  return limit ? all.slice(0, limit) : all;
}

export async function getMostViewedArticles(limit = 5): Promise<NewsArticle[]> {
  const all = await getAllNews();
  return [...all].sort((a, b) => b.views - a.views).slice(0, limit);
}

export async function getMostLikedArticles(limit = 5): Promise<NewsArticle[]> {
  const all = await getAllNews();
  return [...all].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

export async function getAllNewsCategories(): Promise<string[]> {
  const all = await getAllNews();
  return Array.from(new Set(all.map((a) => a.category)));
}
