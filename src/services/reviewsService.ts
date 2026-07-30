// src/services/reviewsService.ts
import { supabase } from '../lib/supabaseClient';
import type { Review } from '../features/anime/types/anime';

// ─── شکل ردیف خام دیتابیس (snake_case) ───
interface TopReviewRow {
  id: number;
  user_name: string;
  avatar_url: string;
  anime: string;
  anime_title: string;
  anime_image: string;
  title: string;
  rating: number | string;
  comment: string;
  excerpt: string;
  overall_score: number | string;
  story_score: number | string;
  character_score: number | string;
  art_score: number | string;
  likes: number;
  review_date: string;
}

// ─── تبدیل ردیف دیتابیس → Review (camelCase) ───
// فیلدهای تکراری (authorName=user، authorAvatar=avatar، animeName=animeTitle)
// از همان ستون‌ها دوباره پر می‌شوند تا با ساختار mockData یکی باشد.
function mapRow(row: TopReviewRow): Review {
  return {
    id: row.id,
    user: row.user_name,
    avatar: row.avatar_url,
    anime: row.anime,
    animeTitle: row.anime_title,
    animeName: row.anime_title,
    animeImage: row.anime_image,
    title: row.title,
    rating: Number(row.rating),
    comment: row.comment,
    excerpt: row.excerpt,
    authorName: row.user_name,
    authorAvatar: row.avatar_url,
    overallScore: Number(row.overall_score),
    storyScore: Number(row.story_score),
    characterScore: Number(row.character_score),
    artScore: Number(row.art_score),
    likes: row.likes,
    date: row.review_date,
  };
}

// ─── خواندن نقدهای برتر از Supabase (مرتب بر اساس id) ───
export async function getTopReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('top_reviews')
    .select('id, user_name, avatar_url, anime, anime_title, anime_image, title, rating, comment, excerpt, overall_score, story_score, character_score, art_score, likes, review_date')
    .order('id', { ascending: true });

  if (error) {
    console.error('خطا در خواندن نقدها از دیتابیس:', error.message);
    return [];
  }

  return ((data ?? []) as TopReviewRow[]).map(mapRow);
}
