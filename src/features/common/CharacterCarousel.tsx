import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Character } from '../../types/anime';

interface CharacterCarouselProps {
  title: string;
  subtitle?: string;
  characters: Character[];
  viewAllLink?: string;
}

const CharacterCarousel: React.FC<CharacterCarouselProps> = ({
  title,
  subtitle,
  characters,
  viewAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <a href={viewAllLink} className="text-purple-400 text-sm hover:underline">
            مشاهده همه
          </a>
        )}
      </div>

      <div className="relative group">
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex-shrink-0 w-[140px] text-center group/card cursor-pointer"
            >
              <div className="w-[120px] h-[120px] mx-auto rounded-full overflow-hidden border-2 border-purple-500/50 group-hover/card:border-purple-400 transition">
                <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-white text-sm font-medium mt-2 truncate">{char.name}</p>
              <p className="text-gray-400 text-xs truncate">{char.anime}</p>
              <p className="text-purple-400 text-xs mt-1">❤️ {char.votes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterCarousel;
