// src/components/admin/AdminRoute.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAdmin } from '../../hooks/useIsAdmin';

// نگهبان مسیر پنل ادمین:
//   • در حال بررسی → پیام لودینگ
//   • ادمین نیست  → هدایت به صفحهٔ اصلی
//   • ادمین است   → نمایش محتوای پنل
export default function AdminRoute({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-lg text-[var(--text-secondary)]">در حال بررسی دسترسی...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
