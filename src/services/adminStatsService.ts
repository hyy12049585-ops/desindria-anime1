// src/services/adminStatsService.ts
import { supabase } from '../lib/supabaseClient';

export interface AdminStat {
  key: string;
  label: string;
  count: number | null; // null = نشد بخوانیم
}

// جدول‌های محتوا برای آمار داشبورد
const STAT_TABLES: { key: string; label: string; table: string }[] = [
  { key: 'animes',     label: 'انیمه‌ها',    table: 'animes' },
  { key: 'news',       label: 'اخبار',       table: 'news' },
  { key: 'music',      label: 'موزیک',       table: 'music' },
  { key: 'animations', label: 'انیمیشن‌ها',  table: 'animations' },
  { key: 'characters', label: 'کاراکترها',   table: 'characters' },
  { key: 'reels',      label: 'ریلز',        table: 'anime_reels' },
  { key: 'comments',   label: 'کامنت‌ها',    table: 'user_comments' },
  { key: 'reviews',    label: 'نقدها',       table: 'top_reviews' },
];

// فقط برچسب‌ها (برای نمایش فوری کارت‌ها قبل از رسیدن اعداد)
export const STAT_DEFS = STAT_TABLES.map(({ key, label }) => ({ key, label }));

// شمارش ردیف‌های یک جدول؛ اگر خطا بدهد null برمی‌گرداند (پنل نمی‌شکند)
async function countTable(table: string): Promise<number | null> {
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

// خواندن آمار همهٔ جدول‌ها به‌صورت موازی
export async function getAdminStats(): Promise<AdminStat[]> {
  return Promise.all(
    STAT_TABLES.map(async (t) => ({
      key: t.key,
      label: t.label,
      count: await countTable(t.table),
    }))
  );
}
