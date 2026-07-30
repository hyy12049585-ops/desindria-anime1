import { useState, useEffect } from 'react';
import { Anime } from '../types/anime.types';
import { getAnimeBySlug, getSimilarAnime } from '../services/anime.api';

export const useAnimeDetail = (slug: string) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [similarAnime, setSimilarAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        const data = await getAnimeBySlug(slug);
        
        if (!data) {
          setError('انیمه پیدا نشد');
          return;
        }
        
        setAnime(data);
        
        // Fetch similar anime
        const similar = await getSimilarAnime(data.id);
        setSimilarAnime(similar);
      } catch (err) {
        setError('خطا در بارگذاری اطلاعات');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetail();
  }, [slug]);

  return { anime, similarAnime, loading, error };
};
