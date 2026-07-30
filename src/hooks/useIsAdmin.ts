// src/hooks/useIsAdmin.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { checkIsAdmin } from '../services/adminService';

// خروجی:
//   null  = در حال بررسی (هنوز نمی‌دانیم)
//   true  = ادمین است
//   false = ادمین نیست (یا اصلاً لاگین نکرده)
export function useIsAdmin(): boolean | null {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      // اول صبر می‌کنیم وضعیت لاگین آماده شود تا بررسی اشتباه نشود
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const result = await checkIsAdmin();
      if (mounted) setIsAdmin(result);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return isAdmin;
}
