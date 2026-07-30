// hooks/useAnimeStats.ts

import { useMemo } from 'react';
import { useProfile } from '../contexts/ProfileContext';

export interface AnimeStats {
  totalAnimeStarted: number;
  totalAnimeCompleted: number;
  totalEpisodesWatched: number;
  totalWatchTimeHours: number;
  averageRating: number;
  favoriteGenre: string;
  genreDistribution: { genre: string; count: number; percentage: number }[];
  ratingDistribution: { score: number; count: number }[];
  watchingStreak: number;
  completionRate: number;
  monthlyActivity: { month: string; episodes: number }[];
  topStudios: { studio: string; count: number }[];
}

export const useAnimeStats = (): AnimeStats => {
  const { state } = useProfile();

  return useMemo(() => {
    const totalAnimeStarted = state.watchHistory.length;
    const totalAnimeCompleted = state.watchHistory.filter((w) => w.completed).length;
    const totalEpisodesWatched = state.watchHistory.reduce((s, w) => s + w.episodesWatched, 0);
    const totalWatchTimeHours = Math.round(
      state.watchHistory.reduce((s, w) => s + w.totalWatchTimeMinutes, 0) / 60
    );
    const averageRating =
      state.ratings.length > 0
        ? Math.round((state.ratings.reduce((s, r) => s + r.score, 0) / state.ratings.length) * 10) / 10
        : 0;

    // توزیع ژانر
    const genreCounts: Record<string, number> = {};
    state.watchHistory.forEach((w) => {
      w.anime.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const totalGenreEntries = Object.values(genreCounts).reduce((s, c) => s + c, 0) || 1;
    const genreDistribution = Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: Math.round((count / totalGenreEntries) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    const favoriteGenre = genreDistribution.length > 0 ? genreDistribution[0].genre : 'نامشخص';

    // توزیع امتیازات
    const ratingCounts: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) ratingCounts[i] = 0;
    state.ratings.forEach((r) => {
      ratingCounts[r.score] = (ratingCounts[r.score] || 0) + 1;
    });
    const ratingDistribution = Object.entries(ratingCounts)
      .map(([score, count]) => ({ score: Number(score), count }))
      .sort((a, b) => a.score - b.score);

    // نرخ تکمیل
    const completionRate =
      totalAnimeStarted > 0 ? Math.round((totalAnimeCompleted / totalAnimeStarted) * 100) : 0;

    // فعالیت ماهانه
    const monthlyMap: Record<string, number> = {};
    state.activityLog
      .filter((a) => a.type === 'watch')
      .forEach((a) => {
        const date = new Date(a.timestamp);
        const key = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + 1;
      });
    const monthlyActivity = Object.entries(monthlyMap)
      .map(([month, episodes]) => ({ month, episodes }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    // استودیوهای برتر
    const studioCounts: Record<string, number> = {};
    state.watchHistory.forEach((w) => {
      if (w.anime.studio) {
        studioCounts[w.anime.studio] = (studioCounts[w.anime.studio] || 0) + 1;
      }
    });
    const topStudios = Object.entries(studioCounts)
      .map(([studio, count]) => ({ studio, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // استریک تماشا
    let watchingStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasActivity = state.activityLog.some(
        (a) => a.type === 'watch' && a.timestamp.startsWith(dateStr)
      );
      if (hasActivity) {
        watchingStreak++;
      } else if (i > 0) {
        break;
      }
    }

   



// useAnimeStats.ts — خطوط ۱۱۱ تا ۱۲۵

return {
  totalAnimeStarted,
  totalAnimeCompleted,
  totalEpisodesWatched,
  totalWatchTimeHours,
  averageRating,
  favoriteGenre,
  genreDistribution,
  ratingDistribution,    // ← خط ۱۱۹ — این بمونه ✅
  completionRate,
  monthlyActivity,
  topStudios,
  watchingStreak,
  // ratingDistribution,  ← خط ۱۲۴ — این رو حذف کن ❌
};
  }, [state.watchHistory, state.ratings, state.activityLog]);
};
