// src/types/filter.types.ts

export type ContentType = 'series' | 'movie' | 'ova' | 'ona' | 'special';

export type Genre =
  | 'Action' | 'Adventure' | 'Comedy' | 'Drama' | 'Fantasy'
  | 'Supernatural' | 'Mystery' | 'Psychological' | 'Thriller' | 'Romance'
  | 'Sci-Fi' | 'Slice of Life' | 'Horror' | 'Sports' | 'School'
  | 'Magic' | 'Isekai' | 'Mecha' | 'Military' | 'Music'
  | 'Historical' | 'Samurai' | 'Martial Arts' | 'Parody' | 'Ecchi'
  | 'Seinen' | 'Shounen' | 'Shoujo' | 'Josei' | 'Vampire'
  | 'Demons' | 'Game' | 'Police' | 'Space' | 'Survival';

export type Studio =
  | 'MAPPA' | 'Madhouse' | 'Ufotable' | 'Studio Ghibli' | 'Bones'
  | 'Toei Animation' | 'A-1 Pictures' | 'CloverWorks' | 'Wit Studio'
  | 'Production I.G' | 'Kyoto Animation' | 'Trigger' | 'White Fox'
  | 'Pierrot' | 'Sunrise' | 'David Production' | 'Lerche'
  | 'Silver Link' | 'JC Staff';

export type AudioSubtitle = 'subbed' | 'dubbed' | 'persian-dub' | 'persian-sub' | 'japanese' | 'english-dub';

export type SortOption = 'newest' | 'seasonal' | 'top-rated' | 'most-popular' | 'imdb' | 'recently-updated';

export interface FilterState {
  contentTypes: ContentType[];
  genres: Genre[];
  studios: Studio[];
  audioSubtitle: AudioSubtitle[];
  yearRange: [number, number];
  sortBy: SortOption;
  searchQuery: string;
}

export const DEFAULT_FILTERS: FilterState = {
  contentTypes: [],
  genres: [],
  studios: [],
  audioSubtitle: [],
  yearRange: [1990, 2025],
  sortBy: 'newest',
  searchQuery: '',
};
