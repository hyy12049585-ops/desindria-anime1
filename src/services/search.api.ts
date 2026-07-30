// src/services/search.api.ts
import { SearchResult } from '@/types/search.types';

// Mock data - بعداً با API واقعی جایگزین می‌شود
const mockAnimeData: SearchResult[] = [
  {
    id: '1',
    title: 'جوجوتسو کایسن',
    titleEnglish: 'Jujutsu Kaisen',
    image: '/images/jujutsu.jpg',
    type: 'anime',
    year: 2020,
    episodes: 24,
    rating: 8.7
  },
  {
    id: '2',
    title: 'جوجوتسو کایسن 0',
    titleEnglish: 'Jujutsu Kaisen 0',
    image: '/images/jujutsu0.jpg',
    type: 'anime',
    year: 2021,
    rating: 8.5
  },
  {
    id: '3',
    title: 'جوجوتسو کایسن فصل 2',
    titleEnglish: 'Jujutsu Kaisen Season 2',
    image: '/images/jujutsu2.jpg',
    type: 'anime',
    year: 2023,
    episodes: 23,
    rating: 8.9
  },
  {
    id: '4',
    title: 'دیمون اسلیر',
    titleEnglish: 'Demon Slayer',
    image: '/images/demon-slayer.jpg',
    type: 'anime',
    year: 2019,
    episodes: 26,
    rating: 8.6
  },
  {
    id: '5',
    title: 'وان پیس',
    titleEnglish: 'One Piece',
    image: '/images/one-piece.jpg',
    type: 'anime',
    year: 1999,
    episodes: 1100,
    rating: 8.9
  },
  {
    id: '6',
    title: 'سولو لولینگ',
    titleEnglish: 'Solo Leveling',
    image: '/images/solo-leveling.jpg',
    type: 'anime',
    year: 2024,
    episodes: 12,
    rating: 8.4
  },
  {
    id: '7',
    title: 'اتک آن تایتان',
    titleEnglish: 'Attack on Titan',
    image: '/images/aot.jpg',
    type: 'anime',
    year: 2013,
    episodes: 87,
    rating: 9.0
  },
  {
    id: '8',
    title: 'ناروتو',
    titleEnglish: 'Naruto',
    image: '/images/naruto.jpg',
    type: 'anime',
    year: 2002,
    episodes: 220,
    rating: 8.3
  }
];

export const searchAnime = async (query: string): Promise<SearchResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return mockAnimeData.filter(anime => 
    anime.title.toLowerCase().includes(lowerQuery) ||
    anime.titleEnglish.toLowerCase().includes(lowerQuery)
  ).slice(0, 6); // محدود به 6 نتیجه
};
