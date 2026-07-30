// hooks/useRecommendationEngine.ts

import { useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { Anime } from '../types/profile';

// دیتابیس نمونه انیمه‌ها
const ANIME_DATABASE: Anime[] = [
  {
    id: 'aot',
    title: 'Attack on Titan',
    poster: '/posters/aot.jpg',
    genres: ['Action', 'Drama', 'Fantasy'],
    totalEpisodes: 87,
    year: 2013,
    studio: 'MAPPA',
  },
  {
    id: 'ds',
    title: 'Demon Slayer',
    poster: '/posters/ds.jpg',
    genres: ['Action', 'Supernatural'],
    totalEpisodes: 44,
    year: 2019,
    studio: 'ufotable',
  },
  {
    id: 'jjk',
    title: 'Jujutsu Kaisen',
    poster: '/posters/jjk.jpg',
    genres: ['Action', 'Supernatural'],
    totalEpisodes: 47,
    year: 2020,
    studio: 'MAPPA',
  },
  {
    id: 'spy',
    title: 'Spy x Family',
    poster: '/posters/spy.jpg',
    genres: ['Comedy', 'Action', 'Slice of Life'],
    totalEpisodes: 37,
    year: 2022,
    studio: 'WIT Studio',
  },
  {
    id: 'csm',
    title: 'Chainsaw Man',
    poster: '/posters/csm.jpg',
    genres: ['Action', 'Horror', 'Supernatural'],
    totalEpisodes: 12,
    year: 2022,
    studio: 'MAPPA',
  },
  {
    id: 'mob',
    title: 'Mob Psycho 100',
    poster: '/posters/mob.jpg',
    genres: ['Action', 'Comedy', 'Supernatural'],
    totalEpisodes: 37,
    year: 2016,
    studio: 'Bones',
  },
  {
    id: 'vio',
    title: 'Violet Evergarden',
    poster: '/posters/vio.jpg',
    genres: ['Drama', 'Fantasy', 'Slice of Life'],
    totalEpisodes: 13,
    year: 2018,
    studio: 'Kyoto Animation',
  },
  {
    id: 'hxh',
    title: 'Hunter x Hunter',
    poster: '/posters/hxh.jpg',
    genres: ['Action', 'Adventure', 'Fantasy'],
    totalEpisodes: 148,
    year: 2011,
    studio: 'Madhouse',
  },
  {
    id: 'dn',
    title: 'Death Note',
    poster: '/posters/dn.jpg',
    genres: ['Thriller', 'Supernatural', 'Mystery'],
    totalEpisodes: 37,
    year: 2006,
    studio: 'Madhouse',
  },
  {
    id: 'opm',
    title: 'One Punch Man',
    poster: '/posters/opm.jpg',
    genres: ['Action', 'Comedy', 'Superhero'],
    totalEpisodes: 24,
    year: 2015,
    studio: 'Madhouse',
  },
  {
    id: 'fmab',
    title: 'Fullmetal Alchemist: Brotherhood',
    poster: '/posters/fmab.jpg',
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    totalEpisodes: 64,
    year: 2009,
    studio: 'Bones',
  },
  {
    id: 'steins',
    title: 'Steins;Gate',
    poster: '/posters/steins.jpg',
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    totalEpisodes: 24,
    year: 2011,
    studio: 'White Fox',
  },
  {
    id: 'made',
    title: 'Made in Abyss',
    poster: '/posters/made.jpg',
    genres: ['Adventure', 'Fantasy', 'Drama'],
    totalEpisodes: 25,
    year: 2017,
    studio: 'Kinema Citrus',
  },
  {
    id: 'vinland',
    title: 'Vinland Saga',
    poster: '/posters/vinland.jpg',
    genres: ['Action', 'Adventure', 'Drama'],
    totalEpisodes: 48,
    year: 2019,
    studio: 'MAPPA',
  },
  {
    id: 'bocchi',
    title: 'Bocchi the Rock!',
    poster: '/posters/bocchi.jpg',
    genres: ['Comedy', 'Music', 'Slice of Life'],
    totalEpisodes: 12,
    year: 2022,
    studio: 'CloverWorks',
  },
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey\'s End',
    poster: '/posters/frieren.jpg',
    genres: ['Adventure', 'Drama', 'Fantasy'],
    totalEpisodes: 28,
    year: 2023,
    studio: 'Madhouse',
  },
  {
    id: 'oshi',
    title: 'Oshi no Ko',
    poster: '/posters/oshi.jpg',
    genres: ['Drama', 'Supernatural', 'Mystery'],
    totalEpisodes: 23,
    year: 2023,
    studio: 'Doga Kobo',
  },
  {
    id: 'solo',
    title: 'Solo Leveling',
    poster: '/posters/solo.jpg',
    genres: ['Action', 'Fantasy', 'Adventure'],
    totalEpisodes: 12,
    year: 2024,
    studio: 'A-1 Pictures',
  },
];

export interface RecommendedAnime extends Anime {
  matchScore: number;
  matchReasons: string[];
}

export const useRecommendationEngine = (): {
  recommendations: RecommendedAnime[];
  topPicks: RecommendedAnime[];
  genreBased: Record<string, RecommendedAnime[]>;
} => {
  const { state, computed } = useProfile();

  const recommendations = useMemo(() => {
    const watchedIds = new Set(state.watchHistory.map((w) => w.animeId));
    const watchlistIds = new Set(state.watchlist.map((w) => w.animeId));
    const favoriteIds = new Set(state.favorites.map((f) => f.animeId));

    // ژانرهای مورد علاقه بر اساس وزن
    const genreWeights: Record<string, number> = {};

    // وزن از تاریخچه تماشا
    state.watchHistory.forEach((w) => {
      w.anime.genres.forEach((g) => {
        genreWeights[g] = (genreWeights[g] || 0) + w.episodesWatched * 1;
      });
    });

    // وزن بیشتر از علاقه‌مندی‌ها
    state.favorites.forEach((f) => {
      f.anime.genres.forEach((g) => {
        genreWeights[g] = (genreWeights[g] || 0) + 20;
      });
    });

    // وزن از امتیازات بالا
    state.ratings.forEach((r) => {
      if (r.score >= 7) {
        r.anime.genres.forEach((g) => {
          genreWeights[g] = (genreWeights[g] || 0) + r.score * 2;
        });
      }
    });

    // استودیوهای مورد علاقه
    const studioWeights: Record<string, number> = {};
    state.ratings
      .filter((r) => r.score >= 8)
      .forEach((r) => {
        if (r.anime.studio) {
          studioWeights[r.anime.studio] = (studioWeights[r.anime.studio] || 0) + r.score;
        }
      });

    // نرمال‌سازی وزن ژانرها
    const maxGenreWeight = Math.max(...Object.values(genreWeights), 1);

    // امتیازدهی به انیمه‌های پیشنهادی
    const scored: RecommendedAnime[] = ANIME_DATABASE
      .filter((anime) => !watchedIds.has(anime.id) && !watchlistIds.has(anime.id))
      .map((anime) => {
        let score = 0;
        const reasons: string[] = [];

        // امتیاز ژانر
        anime.genres.forEach((g) => {
          if (genreWeights[g]) {
            const normalized = (genreWeights[g] / maxGenreWeight) * 40;
            score += normalized;
          }
        });

        if (anime.genres.some((g) => g === computed.favoriteGenre)) {
          score += 15;
          reasons.push(`ژانر مورد علاقه‌ات: ${computed.favoriteGenre}`);
        }

        // امتیاز استودیو
        if (anime.studio && studioWeights[anime.studio]) {
          score += 10;
          reasons.push(`استودیو ${anime.studio}`);
        }

        // تنوع - کمی امتیاز به ژانرهای جدید
        const newGenres = anime.genres.filter((g) => !genreWeights[g]);
        if (newGenres.length > 0 && Object.keys(genreWeights).length > 0) {
          score += 5;
          reasons.push('ژانر جدید برای کشف');
        }

        // انیمه‌های جدیدتر کمی امتیاز بیشتر
        if (anime.year && anime.year >= 2022) {
          score += 5;
          reasons.push('انیمه جدید');
        }

        if (reasons.length === 0) {
          reasons.push('پیشنهاد عمومی');
        }

        return {
          ...anime,
          matchScore: Math.round(Math.min(score, 100)),
          matchReasons: reasons,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return scored;
  }, [state.watchHistory, state.favorites, state.ratings, state.watchlist, computed.favoriteGenre]);

  const topPicks = recommendations.slice(0, 6);

  const genreBased = useMemo(() => {
    const grouped: Record<string, RecommendedAnime[]> = {};
    recommendations.forEach((anime) => {
      anime.genres.forEach((g) => {
        if (!grouped[g]) grouped[g] = [];
        if (grouped[g].length < 4 && !grouped[g].some((a) => a.id === anime.id)) {
          grouped[g].push(anime);
        }
      });
    });
    return grouped;
  }, [recommendations]);

  return { recommendations, topPicks, genreBased };
};

export { ANIME_DATABASE };
