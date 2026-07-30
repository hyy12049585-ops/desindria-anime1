// src/types/search.types.ts
export interface SearchResult {
  id: string;
  title: string;
  titleEnglish: string;
  image: string;
  type: 'anime' | 'character' | 'genre';
  year?: number;
  episodes?: number;
  rating?: number;
}

export interface SearchSuggestion {
  query: string;
  timestamp: number;
}
