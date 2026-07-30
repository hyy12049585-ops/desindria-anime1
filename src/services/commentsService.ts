// src/services/commentsService.ts
import { supabase } from '../lib/supabaseClient';

// ─── ساختار یک کامنت (camelCase) — مطابق userComments در mockData ───
export interface UserComment {
  id: string;
  avatar: string;
  username: string;
  isPro: boolean;
  level: number;
  animeName: string;
  comment: string;
  rating: number;
  likes: number;
  dislikes: number;
  replies: number;
  date: string;
}

// ─── شکل ردیف خام دیتابیس (snake_case) ───
interface UserCommentRow {
  id: string;
  avatar: string;
  username: string;
  is_pro: boolean;
  level: number;
  anime_name: string;
  comment: string;
  rating: number | string;
  likes: number;
  dislikes: number;
  replies: number;
  comment_date: string;
}

// ─── تبدیل snake_case (دیتابیس) → camelCase (interface برنامه) ───
function mapRow(row: UserCommentRow): UserComment {
  return {
    id: row.id,
    avatar: row.avatar,
    username: row.username,
    isPro: row.is_pro,
    level: row.level,
    animeName: row.anime_name,
    comment: row.comment,
    rating: Number(row.rating),
    likes: row.likes,
    dislikes: row.dislikes,
    replies: row.replies,
    date: row.comment_date,
  };
}

// ─── خواندن همهٔ کامنت‌ها از Supabase (مرتب بر اساس id) ───
export async function getUserComments(): Promise<UserComment[]> {
  const { data, error } = await supabase
    .from('user_comments')
    .select('id, avatar, username, is_pro, level, anime_name, comment, rating, likes, dislikes, replies, comment_date')
    .order('id', { ascending: true });

  if (error) {
    console.error('خطا در خواندن کامنت‌های کاربران از دیتابیس:', error.message);
    return [];
  }

  return ((data ?? []) as UserCommentRow[]).map(mapRow);
}
