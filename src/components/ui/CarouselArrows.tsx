// src/components/ui/CarouselArrows.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  /** غیرفعال‌سازی اختیاری برای انتها/ابتدای اسکرول */
  canPrev?: boolean;
  canNext?: boolean;
  className?: string;
}

/**
 * فلش‌های یکدستِ ردیف‌های افقی در کل سایت.
 * گرد، theme-aware و accent-aware (hover با رنگ کاربر).
 * «قبلی» = راست (در RTL)، «بعدی» = چپ.
 */
export const CarouselArrows = ({
  onPrev, onNext, canPrev = true, canNext = true, className = '',
}: CarouselArrowsProps) => {
  const base =
    'w-9 h-9 grid place-items-center rounded-full border transition-all duration-200 ' +
    'bg-[var(--bg-hover)] border-[var(--border-color)] text-fg-muted ' +
    'hover:text-fg hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)] ' +
    'hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] ' +
    'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[var(--bg-hover)] disabled:hover:text-fg-muted disabled:hover:border-[var(--border-color)]';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button onClick={onPrev} disabled={!canPrev} aria-label="قبلی" className={base}>
        <ChevronRight className="w-4 h-4" />
      </button>
      <button onClick={onNext} disabled={!canNext} aria-label="بعدی" className={base}>
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CarouselArrows;
