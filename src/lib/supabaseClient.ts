// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // اگر این خطا را دیدی یعنی فایل .env درست خوانده نشده — سرور dev را ری‌استارت کن
  console.error('⚠️ Supabase env vars پیدا نشدند. فایل .env را چک کن و سرور را ری‌استارت کن.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // نشست کاربر را در مرورگر نگه می‌دارد
    autoRefreshToken: true,    // توکن را خودکار تازه می‌کند
    detectSessionInUrl: true,  // برای ورود با گوگل/لینک ایمیل لازم است
  },
});
