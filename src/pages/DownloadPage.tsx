// src/pages/DownloadPage.tsx
// صفحهٔ دانلود قسمت‌های یک فصل با یک کیفیت مشخص
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getDownloads, getContentTitle, type ContentType, type PublicDownload,
} from '../services/downloadsService';
import { Download, ArrowRight, Film, Loader2 } from 'lucide-react';

export default function DownloadPage() {
  const { type, id, season, quality } = useParams();
  const navigate = useNavigate();

  const contentType = (type as ContentType) || 'anime';
  const seasonNum = Number(season) || 1;
  const qualityStr = decodeURIComponent(quality || '');

  const [title, setTitle] = useState('');
  const [episodes, setEpisodes] = useState<PublicDownload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      getDownloads(contentType, String(id)),
      getContentTitle(contentType, String(id)),
    ])
      .then(([all, t]) => {
        if (!mounted) return;
        setEpisodes(all.filter((l) => l.season === seasonNum && l.quality === qualityStr).sort((a, b) => a.episode - b.episode));
        setTitle(t);
      })
      .catch(() => { if (mounted) setEpisodes([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [contentType, id, seasonNum, qualityStr]);

  return (
    <div dir="rtl" className="dl-root min-h-screen bg-base text-fg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* دکمهٔ بازگشت */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-fg-muted hover:text-accent transition-colors mb-6"
        >
          <ArrowRight className="w-5 h-5" />
          بازگشت
        </button>

        {/* هدر */}
        <div className="rounded-3xl p-6 mb-8 border border-border overflow-hidden relative"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))' }}>
          <div className="relative z-10" style={{ color: '#fff' }}>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
              <Film className="w-4 h-4" />
              صفحهٔ دانلود
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-3">{title || 'انیمه'}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                فصل {seasonNum.toLocaleString('fa-IR')}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                کیفیت {qualityStr}
              </span>
              {!loading && (
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  {episodes.length.toLocaleString('fa-IR')} قسمت
                </span>
              )}
            </div>
          </div>
        </div>

        {/* لیست قسمت‌ها */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-fg-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
            در حال بارگذاری…
          </div>
        ) : episodes.length === 0 ? (
          <div className="text-center py-16 text-fg-muted rounded-2xl border border-border bg-surface">
            برای این فصل و کیفیت هنوز لینکی ثبت نشده.
          </div>
        ) : (
          <div className="space-y-3">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 font-bold text-accent">
                  {ep.episode.toLocaleString('fa-IR')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">قسمت {ep.episode.toLocaleString('fa-IR')}</div>
                  <div className="text-xs text-fg-muted mt-0.5">
                    {title} — کیفیت {qualityStr}{ep.size ? ` • ${ep.size}` : ''}
                  </div>
                </div>
                <Link
                  to={`/dl/${ep.id}`}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity shrink-0"
                  style={{ color: '#fff' }}
                >
                  <Download className="w-4 h-4" />
                  دانلود
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* راهنما */}
        <p className="text-xs text-fg-subtle text-center mt-8 leading-6">
          برای دانلود بهتر، از نرم‌افزارهای مدیریت دانلود مثل IDM استفاده کن.
        </p>
      </div>
    </div>
  );
}
