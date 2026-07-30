// src/components/ui/SectionHeader.tsx
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  /** 'accent' از رنگ کاربر استفاده می‌کند؛ بقیه رنگ ثابت دارند */
  accentColor?: 'accent' | 'cyan' | 'purple' | 'pink' | 'orange';
}

export const SectionHeader = ({
  title, subtitle, onScrollLeft, onScrollRight, accentColor = 'accent',
}: SectionHeaderProps) => {
  const gradientMap: Record<string, string> = {
    cyan: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
    purple: 'linear-gradient(90deg, #c084fc, #ec4899)',
    pink: 'linear-gradient(90deg, #f472b6, #fb7185)',
    orange: 'linear-gradient(90deg, #fb923c, #facc15)',
    accent: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
  };

  const titleGradient = gradientMap[accentColor] || gradientMap.accent;

  return (
    <div className="flex items-center justify-between mb-4 px-4 md:px-6">
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-bold bg-clip-text text-transparent"
          style={{ backgroundImage: titleGradient }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <p className="text-fg-muted text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onScrollLeft}
          aria-label="قبلی"
          className="p-2 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
        >
          <ChevronRight className="w-4 h-4 text-fg-muted" />
        </button>
        <button
          onClick={onScrollRight}
          aria-label="بعدی"
          className="p-2 rounded-full bg-[var(--bg-hover)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] transition-all hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)]"
        >
          <ChevronLeft className="w-4 h-4 text-fg-muted" />
        </button>
      </div>
    </div>
  );
};
