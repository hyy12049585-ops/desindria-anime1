import React, { useState, useEffect } from 'react';

import { Flame, Star, Sparkles, Heart } from 'lucide-react';
import HeroBanner from '@/features/home/components/HeroBanner';
import AnimeRow from '@/features/home/components/AnimeRow';
import PollsSection from '@/features/polls/components/PollsSection';

import UserComments from '@/features/home/components/UserComments';
import TopReviews from '@/features/home/components/TopReviews';
import CharactersSection from '@/features/home/components/CharactersSection';
import OfficialChannels from '@/features/home/components/OfficialChannels';
import ExclusiveDubs from '@/features/home/components/ExclusiveDubs';
import LatestNews from '@/features/home/components/LatestNews';
import LatestMusic from '@/features/home/components/LatestMusic';
import AnimeReels from '@/features/home/components/AnimeReels';

import { useAnimes } from '../hooks/useAnimes';
import { getPopularCharacters, type PopularCharacter } from '../services/charactersService';
import { getAnimeReels, type AnimeReel } from '../services/reelsService';
import { getUserComments, type UserComment } from '../services/commentsService';
import { getTopReviews } from '../services/reviewsService';
import type { Review } from '../features/anime/types/anime';
import {
  weeklyPollAnimes,
  latestNews,
} from '../data/mockData';


const HomePage: React.FC = () => {
  // انیمه‌ها از دیتابیس (Supabase) — بقیه فعلاً از mockData
  const { trendingAnimes, popularAnimes, smartPicks, seasonalAnimes } = useAnimes();

  // کاراکترهای محبوب از دیتابیس (Supabase) — async با useState + useEffect
  const [popularCharacters, setPopularCharacters] = useState<PopularCharacter[]>([]);

  useEffect(() => {
    let mounted = true;
    getPopularCharacters()
      .then((data) => {
        if (mounted) setPopularCharacters(data);
      })
      .catch((err) => {
        console.error('خطا در دریافت کاراکترهای محبوب:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // ریلز انیمه از دیتابیس (Supabase) — async با useState + useEffect
  const [animeReels, setAnimeReels] = useState<AnimeReel[]>([]);

  useEffect(() => {
    let mounted = true;
    getAnimeReels()
      .then((data) => {
        if (mounted) setAnimeReels(data);
      })
      .catch((err) => {
        console.error('خطا در دریافت ریلز انیمه:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // کامنت‌های کاربران از دیتابیس (Supabase) — async با useState + useEffect
  const [userComments, setUserComments] = useState<UserComment[]>([]);

  useEffect(() => {
    let mounted = true;
    getUserComments()
      .then((data) => {
        if (mounted) setUserComments(data);
      })
      .catch((err) => {
        console.error('خطا در دریافت کامنت‌های کاربران:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // نقدهای برتر از دیتابیس (Supabase) — async با useState + useEffect
  const [topReviews, setTopReviews] = useState<Review[]>([]);

  useEffect(() => {
    let mounted = true;
    getTopReviews()
      .then((data) => {
        if (mounted) setTopReviews(data);
      })
      .catch((err) => {
        console.error('خطا در دریافت نقدهای برتر:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <HeroBanner animeList={trendingAnimes} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-12">

        <AnimeRow
          title="ترند روز"
          subtitle="محبوب‌ترین‌ها الان"
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          animes={trendingAnimes}
          viewAllLink="/category/trending"
          accentColor="#ff6b35"
          cardWidth={180}
        />

        <AnimeRow
          title="محبوب‌ترین‌ها"
          subtitle="بالاترین امتیاز"
          icon={<Star className="w-6 h-6 text-yellow-400" />}
          animes={popularAnimes}
          viewAllLink="/category/popular"
          accentColor="#ffd700"
          cardWidth={180}
        />

        <AnimeRow
          title="پیشنهاد هوشمند"
          subtitle="بر اساس سلیقه و تاریخچه تماشای شما"
          icon={<Sparkles className="w-6 h-6 text-purple-400" />}
          animes={smartPicks}
          viewAllLink="/category/recommendations"
          accentColor="#a855f7"
          cardWidth={200}
        />

        <AnimeRow
          title="انیمه‌های فصلی"
          subtitle="پاییز ۲۰۲۴"
          icon={<Heart className="w-6 h-6 text-pink-500" />}
          animes={seasonalAnimes}
          viewAllLink="/category/seasonal"
          accentColor="#ec4899"
          cardWidth={180}
        />

        {/* نظرسنجی هفته */}
        <PollsSection />

        <ExclusiveDubs animes={trendingAnimes} />

        <AnimeReels reels={animeReels} />

        <UserComments comments={userComments} />

        <TopReviews reviews={topReviews} />

        {/* ✅ کامپوننت جدید جایگزین PopularCharacters */}
        <CharactersSection 
  popularCharacters={popularCharacters} 
  topCharacters={popularCharacters} 
/>


        <OfficialChannels />

        <LatestNews />

        <LatestMusic />

      </div>
    </div>
  );
};

export default HomePage;
