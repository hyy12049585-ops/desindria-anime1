// src/pages/Admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { getAdminStats, STAT_DEFS, type AdminStat } from '../../services/adminStatsService';
import {
  Film, Newspaper, Music, Clapperboard,
  Users, Video, MessageSquare, Star,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  animes: Film,
  news: Newspaper,
  music: Music,
  animations: Clapperboard,
  characters: Users,
  reels: Video,
  comments: MessageSquare,
  reviews: Star,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStat[]>(
    STAT_DEFS.map((d) => ({ ...d, count: null }))
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminStats()
      .then((data) => { if (mounted) setStats(data); })
      .catch((err) => { console.error('خطا در دریافت آمار داشبورد:', err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <div dir="rtl">
      <h2 className="text-2xl font-bold mb-1">خوش اومدی، ادمین 👋</h2>
      <p className="text-fg-muted mb-6">یه نگاه کلی به محتوای سایت سیندریا</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = ICONS[s.key] ?? Film;
          return (
            <div
              key={s.key}
              className="rounded-2xl p-4 bg-surface border border-border hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-fg-muted">{s.label}</span>
                <span className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
                </span>
              </div>
              <div className="text-3xl font-bold">
                {loading ? '…' : s.count === null ? '—' : s.count.toLocaleString('fa-IR')}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl p-5 bg-surface border border-border">
        <h3 className="font-bold mb-2">قدم بعدی</h3>
        <p className="text-fg-muted text-sm leading-7">
          بخش «انیمه‌ها» الان فعاله — می‌تونی انیمه اضافه، ویرایش و حذف کنی و عکس‌ها رو آپلود کنی.
          بقیهٔ بخش‌ها (اخبار، موزیک و...) رو هم به‌زودی یکی‌یکی فعال می‌کنیم.
        </p>
      </div>
    </div>
  );
}
