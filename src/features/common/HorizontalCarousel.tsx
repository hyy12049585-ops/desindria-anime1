// HorizontalCarousel.tsx - نسخه ساده و کاربردی
import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarouselArrows from '@/components/ui/CarouselArrows';

interface HorizontalCarouselProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  viewAllLink?: string;
  viewAllText?: string;
  children: ReactNode;
  cardWidth?: number;
  scrollCount?: number;
  className?: string;
  titleClassName?: string;
  accentColor?: string;
}

const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  title,
  subtitle,
  icon,
  viewAllLink,
  viewAllText = 'نمایش همه',
  children,
  cardWidth = 200,
  scrollCount = 3,
  className = '',
  titleClassName = '',
  accentColor = '#e94560',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // RTL: scrollLeft معمولاً منفی است
    const scrolledFromRight = Math.abs(scrollLeft);
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollRight(scrolledFromRight < maxScroll - 10);
    setCanScrollLeft(scrolledFromRight > 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    const timer = setTimeout(checkScroll, 200);

    container.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = cardWidth * scrollCount;
    
    container.scrollBy({
      left: direction === 'right' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`relative w-full ${className}`}>
      {/* هدر ساده */}
      <div className="flex items-center justify-between mb-5 px-4">
        <div className="flex items-center gap-3">
          {/* آیکون با انیمیشن */}
          {icon && (
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg transition-transform hover:scale-110"
              style={{ 
                backgroundColor: `${accentColor}20`,
                color: accentColor 
              }}
            >
              {icon}
            </div>
          )}
          
          <div>
            <h2 
              className={`text-2xl font-bold ${titleClassName}`}
              style={{ color: accentColor }}
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-sm hover:underline transition-all flex items-center gap-1"
              style={{ color: accentColor }}
            >
              {viewAllText}
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          {(canScrollLeft || canScrollRight) && (
            <CarouselArrows
              onPrev={() => scroll('left')}
              onNext={() => scroll('right')}
            />
          )}
        </div>
      </div>

      {/* اسلایدر */}
      <div className="relative group">
        {/* کانتینر اسکرول */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2
                   scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default HorizontalCarousel;
