export interface Anime {
  id: string;
  title: string;
  poster: string;
  banner?: string;
  description?: string;
  rating?: number;
  year?: number;
  type?: string;
  genres?: string[];

  // فیلدهای جدید:
  titleEn?: string;
  japaneseTitle?: string;
  season?: string;
  ageRating?: string;
  source?: string;
  duration?: string;
  status?: string;
  episodes?: number | string;
  studio?: string;

  characters?: {
    id?: string;
    name: string;
    image: string;
    role?: string;
  }[];

  synopsis?: string;
  rank?: number;
}



export interface Episode {
  num: number;
  title: string;
  duration: string;
  aired: string;
  thumbnail?: string;
}

export interface Season {
  id: number;
  number: number;
  title: string;
  episodes: Episode[];
}
