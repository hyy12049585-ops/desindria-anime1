import React from 'react';
import HorizontalCarousel from './HorizontalCarousel';
import { Heart } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  nameEn: string;
  anime: string;
  image: string;
  votes: string;
  rank?: number;
}

interface CharacterCarouselProps {
  title: string;
  subtitle?: string;
  characters: Character[];
  viewAllLink?: string;
}

const rankColors: Record<number, string> = {
  1: 'bg-yellow-500',
  2: 'bg-gray-400',
  3: 'bg-orange-600',
};

const CharacterCarousel: React.FC<CharacterCarouselProps> = ({
  title,
  subtitle,
  characters,
  viewAllLink,
}) => {
  return (
    <HorizontalCarousel
      title={title}
      subtitle={subtitle}
      icon={<span>👑</span>}
      viewAllLink={viewAllLink}
      accentColor="#f472b6"
      cardWidth={160}
      scrollCount={3}
      className="mb-10"
    >
      {characters.map((char, index) => (
        <div
          key={char.id}
          className="flex-shrink-0 w-[150px] flex flex-col items-center text-center group cursor-pointer"
        >
          {/* آواتار با رنک */}
          <div className="relative mb-3">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden
                            border-2 border-white/10 group-hover:border-pink-500/50
                            transition-all duration-300 group-hover:scale-105">
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* بج رتبه */}
            {char.rank && char.rank <= 3 && (
              <div
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full
                            flex items-center justify-center text-white text-xs font-bold
                            border-2 border-[#0a0a1a] ${rankColors[char.rank]}`}
              >
                {char.rank}
              </div>
            )}
          </div>

          {/* اسم */}
          <h4 className="text-white text-sm font-medium mb-0.5 
                         group-hover:text-pink-400 transition-colors">
            {char.name}
          </h4>
          <p className="text-gray-500 text-xs mb-1">{char.anime}</p>

          {/* رأی‌ها */}
          <div className="flex items-center gap-1 text-pink-500 text-xs">
            <span>{char.votes}</span>
            <Heart className="w-3 h-3 fill-pink-500" />
          </div>
        </div>
      ))}
    </HorizontalCarousel>
  );
};

export default CharacterCarousel;
