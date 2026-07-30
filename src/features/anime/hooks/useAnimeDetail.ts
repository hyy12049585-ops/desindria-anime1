import { useState, useEffect } from 'react';
import { Anime, Episode } from '../types/anime.types';
import { getAnimeById, getAnimeEpisodes, getSimilarAnime } from '../services/anime.api';

export const useAnimeDetail = (id: number) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [similarAnime, setSimilarAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [animeData, episodesData, similarData] = await Promise.all([
          getAnimeById(id),
          getAnimeEpisodes(id),
          getSimilarAnime(id),
        ]);
        
        if (!animeData) {
          setError('انیمه پیدا نشد');
          return;
        }
        
        setAnime(animeData);
        setEpisodes(episodesData);
        setSimilarAnime(similarData);
      } catch (err) {
        setError('خطا در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { anime, episodes, similarAnime, loading, error };
};
