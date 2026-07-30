import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20">
      <div className="h-[1px] bg-gradient-to-l from-transparent via-purple-500 to-transparent opacity-40" />
      <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border-t border-[var(--border-color)]">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* لوگو */}
            <div className="space-y-4">
              <span className="text-xl font-extrabold text-transparent bg-gradient-to-l from-cyan-300 via-purple-400 to-pink-400 bg-clip-text">
                دسیندریا انیمه
              </span>
              <p className="text-[var(--text-secondary)] text-sm leading-7">
                بهترین پلتفرم تماشای آنلاین انیمه با زیرنویس فارسی. دنیای انیمه رو با ما تجربه کن.
              </p>
            </div>
            {/* لینک‌ها */}
            <div className="space-y-3">
              <h4 className="text-cyan-400 text-sm font-bold">دسترسی سریع</h4>
              {[
                { to: "/", l: "خانه" },
                { to: "/anime", l: "انیمه‌ها" },
                { to: "/search", l: "جستجو" },
                { to: "/news", l: "اخبار" },
              ].map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  className="block text-[var(--text-secondary)] hover:text-cyan-400 text-sm transition-colors"
                >
                  {i.l}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-cyan-400 text-sm font-bold">حساب کاربری</h4>
              {[
                { to: "/profile", l: "پروفایل" },
                { to: "/auth/login", l: "ورود" },
                { to: "/auth/register", l: "ثبت‌نام" },
              ].map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  className="block text-[var(--text-secondary)] hover:text-cyan-400 text-sm transition-colors"
                >
                  {i.l}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-cyan-400 text-sm font-bold">ارتباط با ما</h4>
              <p className="text-[var(--text-secondary)] text-sm">ایمیل: [email]</p>
              <p className="text-[var(--text-secondary)] text-sm">تلگرام: @desindria</p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-[var(--border-color)] flex items-center justify-center gap-1.5 text-[var(--text-muted)] text-xs">
            <span>ساخته شده با</span>
            <Heart size={12} className="text-pink-500 fill-pink-500" />
            <span>توسط تیم دسیندریا — ۱۴۰۵</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
