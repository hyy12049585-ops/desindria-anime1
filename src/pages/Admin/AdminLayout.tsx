// src/pages/Admin/AdminLayout.tsx
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Film, Newspaper, Music, Clapperboard,
  Users, Video, MessageSquare, Star, ArrowRight, Download,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  ready: boolean;
  end?: boolean;
};

const navItems: NavItem[] = [
  { to: '/admin',            label: 'داشبورد',    icon: LayoutDashboard, ready: true, end: true },
  { to: '/admin/animes',     label: 'انیمه‌ها',   icon: Film,            ready: true },
  { to: '/admin/news',       label: 'اخبار',      icon: Newspaper,       ready: true },
  { to: '/admin/music',      label: 'موزیک',      icon: Music,           ready: true },
  { to: '/admin/downloads',  label: 'دانلودها',   icon: Download,        ready: true },
  { to: '/admin/animations', label: 'انیمیشن‌ها', icon: Clapperboard,    ready: true },
  { to: '/admin/characters', label: 'کاراکترها',  icon: Users,           ready: true },
  { to: '/admin/reels',      label: 'ریلز',       icon: Video,           ready: true },
  { to: '/admin/comments',   label: 'کامنت‌ها',   icon: MessageSquare,   ready: false },
  { to: '/admin/reviews',    label: 'نقدها',      icon: Star,            ready: false },
];

export default function AdminLayout() {
  return (
    <div dir="rtl" className="admin-root min-h-screen flex bg-base text-fg">

      {/* ===== سایدبار ===== */}
      <aside className="w-64 shrink-0 flex flex-col border-l border-border bg-surface">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <span className="text-lg font-bold bg-[linear-gradient(to_left,var(--accent),var(--accent-secondary))] bg-clip-text text-transparent">
            پنل مدیریت سیندریا
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (!item.ready) {
              return (
                <div
                  key={item.to}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-fg-subtle opacity-60 cursor-not-allowed select-none"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-surface-2 border border-border">
                    به‌زودی
                  </span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-accent shadow-lg'
                      : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
                  }`
                }
                style={({ isActive }) => (isActive ? { color: '#fff' } : undefined)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-fg-muted hover:bg-surface-2 hover:text-fg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {/* ===== بخش اصلی ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 shrink-0 flex items-center px-6 border-b border-border bg-surface">
          <h1 className="text-base font-semibold">مدیریت محتوا</h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
