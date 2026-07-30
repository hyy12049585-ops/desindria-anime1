export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: "اخبار" | "مقاله" | "انیمه" | "مانگا" | "بازی";
  author: string;
  authorAvatar?: string;
  date: string;
  views: number;
  likes: number;
  commentsCount: number;
  isFeatured?: boolean;
  tags?: string[];
}

export type NewsFilter = "همه" | "اخبار" | "مقاله" | "انیمه" | "مانگا" | "بازی";
export type NewsSortBy = "جدیدترین" | "پربازدیدترین" | "محبوب‌ترین";
