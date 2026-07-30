// ===== NEWS =====
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: "اخبار" | "مقاله" | "انیمه" | "مانگا";
  author: string;
  authorAvatar?: string;
  date: string;
  views: number;
  likes: number;
  commentsCount: number;
}

// ===== CHARACTER =====
export interface Character {
  id: string;
  name: string;
  nameEn?: string;
  image: string;
  animeName: string;
  animeNameEn?: string;
  animeId?: string;
  rank?: number;
  likes: number;
  role?: "اصلی" | "فرعی" | "مهمان";
  description?: string;
  voiceActor?: string;
  voiceActorImage?: string;
  gender?: string;
  age?: string;
  birthday?: string;
  height?: string;
  abilities?: string[];
}

// ===== REVIEW =====
export interface Review {
  id: string;
  animeId: string;
  animeName: string;
  animeImage: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel?: string;
  title: string;
  content: string;
  overallScore: number;
  scores: {
    graphics: number;
    characters: number;
    story: number;
    music?: number;
  };
  likes: number;
  dislikes: number;
  commentsCount: number;
  date: string;
}

// ===== COMMENT =====
export interface UserComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel?: string;
  animeId?: string;
  animeName?: string;
  animeImage?: string;
  content: string;
  score?: number;
  likes: number;
  dislikes: number;
  replies: number;
  date: string;
  parentId?: string;
}
