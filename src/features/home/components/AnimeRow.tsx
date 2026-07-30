import React from 'react';
import HorizontalCarousel from '@/features/common/HorizontalCarousel';
import AnimeCard from "@/features/anime/components/AnimeCard/AnimeCard";


import type { Anime } from 'src/types/anime';

interface AnimeRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  animes?: Anime[];
  animeList?: Anime[];
  viewAllLink?: string;
  accentColor?: string;
  cardWidth?: number;
}

const AnimeRow: React.FC<AnimeRowProps> = ({
  title,
  subtitle,
  icon,
  animes,
  animeList,
  viewAllLink,
  accentColor = '#e94560',
  cardWidth = 180,
}) => {
  const data = animes ?? animeList ?? [];
  if (data.length === 0) return null;

  return (
    <HorizontalCarousel
      title={title}
      subtitle={subtitle}
      icon={icon}
      viewAllLink={viewAllLink}
      accentColor={accentColor}
      cardWidth={cardWidth}
      scrollCount={4}
      className="mb-10"
    >
      {data.map((anime) => (
        <div
          key={anime.id}
          className="flex-shrink-0"
          style={{ width: `${cardWidth}px` }}
        >
          <AnimeCard anime={anime} />
        </div>
      ))}
    </HorizontalCarousel>
  );
};

export default AnimeRow;
