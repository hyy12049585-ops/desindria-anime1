// src/pages/DownloadRedirect.tsx
// لینک واسط: کاربر روی سایتت کلیک می‌کند (سایتت/dl/۱۲۳)، اینجا
// به‌صورت خودکار به فایل واقعی منتقل می‌شود. لینکِ کلیک‌شده مال دامنهٔ خودته.
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDownloadUrl } from '../services/downloadsService';
import { Download, Loader2, AlertCircle } from 'lucide-react';

export default function DownloadRedirect() {
  const { id } = useParams();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const url = await getDownloadUrl(Number(id));
        if (!active) return;
        if (url) {
          // انتقال به فایل واقعی
          window.location.href = url;
        } else {
          setStatus('error');
        }
      } catch {
        if (active) setStatus('error');
      }
    })();
    return () => { active = false; };
  }, [id]);

  return (
    <div dir="rtl" className="dl-root min-h-screen bg-base text-fg flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {status === 'loading' ? (
          <>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }}>
              <Download className="w-8 h-8" style={{ color: '#fff' }} />
            </div>
            <h1 className="text-xl font-bold mb-2">در حال آماده‌سازی دانلود…</h1>
            <p className="text-fg-muted text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              لطفاً چند لحظه صبر کن
            </p>
            <p className="text-fg-subtle text-xs mt-4 leading-6">
              اگر دانلود خودکار شروع نشد، چند ثانیه صبر کن یا صفحه را دوباره باز کن.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">لینک پیدا نشد</h1>
            <p className="text-fg-muted text-sm mb-5">این لینک دانلود معتبر نیست یا حذف شده.</p>
            <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity" style={{ color: '#fff' }}>
              بازگشت به خانه
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
