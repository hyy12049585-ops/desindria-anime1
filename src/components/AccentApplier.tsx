// src/components/AccentApplier.tsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

/** hex → rgba (برای glow). از #rgb و #rrggbb پشتیبانی می‌کند. */
function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return hex;
  const int = parseInt(h, 16);
  if (Number.isNaN(int)) return hex;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * رنگ accent انتخابیِ کاربر را روی متغیرهای CSS سراسری می‌نشاند.
 * UI ندارد؛ فقط افکت اعمال می‌کند. باید داخل AuthProvider رندر شود.
 *
 * توجه: عمداً فقط --accent و --accent-glow را override می‌کنیم و
 * --accent-secondary (فیروزه‌ایِ مکمل) را دست‌نخورده می‌گذاریم تا
 * گرادیان‌های دورنگ (accent → cyan) همان طراحی اصلی بمانند.
 */
export default function AccentApplier() {
  const { profile } = useAuth();
  const accent = profile?.theme?.accentColor;

  useEffect(() => {
    const root = document.documentElement;
    if (!accent) {
      // به مقادیر پیش‌فرضِ index.css برگرد
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-glow');
      return;
    }
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-glow', hexToRgba(accent, 0.25));
  }, [accent]);

  return null;
}
