// src/services/recentService.ts
import { supabase } from '../lib/supabaseClient';

export type RecentCategory = 'anime' | 'animation' | 'music' | 'news';

export interface RecentItem {
  id: string | number;
  title: string;
  poster: string;
  subtitle?: string;
  linkTo?: string;
  viewedAt?: string;
}

const LS_KEY = (cat: RecentCategory) => `recent-${cat === 'anime' ? 'anime' : cat}`;
const MAX = 12;

// ---------- localStorage (مهمان) ----------
function lsGet(cat: RecentCategory): RecentItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY(cat));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function lsAdd(cat: RecentCategory, item: RecentItem) {
  try {
    const list = lsGet(cat).filter((x) => String(x.id) !== String(item.id));
    const next = [{ ...item, viewedAt: new Date().toISOString() }, ...list].slice(0, MAX);
    localStorage.setItem(LS_KEY(cat), JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

// ---------- وضعیت لاگین فعلی ----------
async function getUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}

// ---------- API عمومی ----------

/** افزودن/به‌روزرسانی یک آیتم در «اخیراً دیده‌شده» */
export async function addRecent(cat: RecentCategory, item: RecentItem): Promise<void> {
  const userId = await getUserId();

  // همیشه در localStorage هم نگه می‌داریم (برای نمایش سریع و حالت مهمان)
  lsAdd(cat, item);

  if (!userId) return;

  // کاربر لاگین: در Supabase ذخیره/به‌روزرسانی کن
  const { error } = await supabase.from('recent_items').upsert(
    {
      user_id: userId,
      category: cat,
      item_id: String(item.id),
      title: item.title,
      poster: item.poster,
      subtitle: item.subtitle ?? null,
      link_to: item.linkTo ?? null,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,category,item_id' }
  );
  if (error) console.error('ثبت اخیراً دیده‌شده:', error.message);
}

/** خواندن آیتم‌های «اخیراً دیده‌شده» یک دسته */
export async function getRecent(cat: RecentCategory): Promise<RecentItem[]> {
  const userId = await getUserId();

  // مهمان: از localStorage
  if (!userId) return lsGet(cat);

  // لاگین: از Supabase
  const { data, error } = await supabase
    .from('recent_items')
    .select('item_id, title, poster, subtitle, link_to, viewed_at')
    .eq('user_id', userId)
    .eq('category', cat)
    .order('viewed_at', { ascending: false })
    .limit(MAX);

  if (error) {
    console.error('خواندن اخیراً دیده‌شده:', error.message);
    return lsGet(cat); // در صورت خطا، نسخهٔ محلی
  }

  const list = (data || []).map((r) => ({
    id: r.item_id as string,
    title: (r.title as string) || '',
    poster: (r.poster as string) || '',
    subtitle: (r.subtitle as string) || '',
    linkTo: (r.link_to as string) || '',
    viewedAt: (r.viewed_at as string) || '',
  }));

  // اگر هنوز چیزی در دیتابیس نیست، نسخهٔ محلی را نشان بده (انتقال تدریجی)
  return list.length > 0 ? list : lsGet(cat);
}
