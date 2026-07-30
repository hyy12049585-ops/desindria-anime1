// src/services/adminService.ts
import { supabase } from '../lib/supabaseClient';

// ── بررسی اینکه کاربرِ لاگین‌شدهٔ فعلی ادمین است یا نه ──
// از تابع is_admin() در دیتابیس استفاده می‌کند (امن و سمت سرور).
// خروجی: true اگر ادمین باشد، در غیر این صورت false.
export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_admin');

  if (error) {
    console.error('خطا در بررسی دسترسی ادمین:', error.message);
    return false;
  }

  return data === true;
}
