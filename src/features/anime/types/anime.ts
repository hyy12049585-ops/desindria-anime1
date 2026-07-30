export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
}

export interface Anime {
  id: number;
  title: string;
  titleEn?: string;
  japaneseTitle?: string;
  image: string;
  poster?: string;
  banner: string;
  rating?: number;
  episodes: number | Episode[];
  currentEpisode?: number;
  type?: string;
  episodesCount?: number;
  status: string;
  season: string;
  year: number;
  genres: string[];
  studio?: string;
  synopsis: string;
  duration?: string;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface Character {
  id: number | string;
  name: string;
  anime: string;
  image: string;
  votes?: number;
  role?: string;
}

export interface Review {
  id: number | string;
  user: string;
  avatar: string;
  anime: string;
  animeTitle: string;
  animeName: string;        // ← اضافه شد
  animeImage: string;
  title: string;            // ← اضافه شد
  rating: number;
  excerpt: string;
  authorName: string;
  authorAvatar: string;
  overallScore: number;
  storyScore: number;
  characterScore: number;
  artScore: number;
  likes: number;
  date: string;
  comment: string;
}

export interface UserPreferences {
  favoriteGenres: string[];
  watchHistory: number[];
  ratings: Record<number, number>;
}
