// src/components/profile/EmptyState.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  /** آیکون مرکزی — می‌تواند ایموجی، عنصر lucide یا هر ReactNode باشد (drop-in با نسخهٔ قبلی) */
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  /** فقط برای تنظیم شدت glow استفاده می‌شود؛ رنگ‌ها از توکن‌های تم می‌آیند */
  isDark?: boolean;
}

/**
 * Empty State پریمیوم
 * - هالهٔ aurora متحرک + حلقه‌های هم‌مرکزِ نبض‌دار
 * - دیسک شیشه‌ای گرادیانی برای آیکون با شناوری نرم
 * - کاملاً theme-aware؛ در هر دو تم خوانا و باکیفیت
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  action,
  isDark = true,
}) => {
  const glow = isDark ? 0.55 : 0.28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative flex flex-col items-center justify-center py-16 md:py-20 text-center overflow-hidden"
    >
      {/* هالهٔ aurora پشت‌زمینه */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-6 h-56 w-56 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(0,234,255,0.5) 45%, transparent 70%)',
          opacity: glow,
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [glow * 0.7, glow, glow * 0.7] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      />

      {/* قاب آیکون */}
      <div className="relative mb-6 grid place-items-center">
        {/* حلقه‌های نبض‌دار */}
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute rounded-full border"
            style={{
              width: 132,
              height: 132,
              borderColor: 'var(--accent)',
            }}
            initial={{ opacity: 0.4, scale: 0.85 }}
            animate={{ opacity: [0.35, 0, 0.35], scale: [0.85, 1.4, 0.85] }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: 'easeOut',
              delay: i * 1.4,
            }}
          />
        ))}

        {/* دیسک گرادیانی */}
        <div
          className="relative h-28 w-28 rounded-[28px] p-[2px]"
          style={{
            background:
              'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
            boxShadow: `0 12px 40px var(--accent-glow)`,
          }}
        >
          <div
            className="grid h-full w-full place-items-center rounded-[26px]"
            style={{
              background: isDark
                ? 'linear-gradient(160deg, rgba(20,14,40,0.95), rgba(8,6,22,0.98))'
                : 'linear-gradient(160deg, #ffffff, #f5f3ff)',
            }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="text-5xl leading-none [&_svg]:h-12 [&_svg]:w-12 [&_svg]:text-[var(--accent)]"
            >
              {icon}
            </motion.div>
          </div>
        </div>
      </div>

      {/* متن */}
      <h3 className="mb-1.5 text-lg font-bold text-fg">{title}</h3>
      <p className="mb-5 max-w-xs text-sm leading-relaxed text-fg-muted">
        {subtitle}
      </p>

      {action}
    </motion.div>
  );
};

export default EmptyState;
