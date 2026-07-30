// src/components/anime/AnimeDownloadSection.tsx
// باکس دانلود برای صفحهٔ مشخصات انیمه/انیمیشن/موزیک (سبک آیو فیلم/AnimEX)
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDownloads, type ContentType, type PublicDownload } from '../../services/downloadsService';
import { Download, Loader2 } from 'lucide-react';

const QUALITY_ORDER = ['1080p', '720p', '480p', '360p'];
function qualityRank(q: string) {
  const i = QUALITY_ORDER.indexOf(q);
  return i === -1 ? 99 : i;
}

const headerGradient = { backgroundImage: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))', color: '#fff' };

// یک ردیف کیفیت
function QualityRow({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-2 hover:bg-surface transition-colors"
      style={{ borderRight: '3px solid var(--accent)' }}
    >
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent text-sm font-bold shrink-0" style={{ color: '#fff' }}>
        <Download className="w-4 h-4" />
        دانلود
      </span>
    </Link>
  );
}

export default function AnimeDownloadSection({
  contentId,
  type = 'anime',
}: {
  contentId: string | number;
  type?: ContentType;
}) {
  const [links, setLinks] = useState<PublicDownload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getDownloads(type, String(contentId))
      .then((d) => { if (mounted) setLinks(d); })
      .catch(() => { if (mounted) setLinks([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [contentId, type]);

  const isEpisodic = type === 'anime';
  const seasons = Array.from(new Set(links.map((l) => l.season))).sort((a, b) => a - b);
  const qualitiesOf = (season: number) =>
    Array.from(new Set(links.filter((l) => l.season === season).map((l) => l.quality)))
      .sort((a, b) => qualityRank(a) - qualityRank(b));
  const singleSorted = [...links].sort((a, b) => qualityRank(a.quality) - qualityRank(b.quality));

  const kindLabel = type === 'music' ? 'آهنگ' : type === 'animation' ? 'انیمیشن' : 'انیمه';

  return (
    <section dir="rtl" className="dl-root mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold">دانلود</h2>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-surface flex items-center justify-center gap-2 py-10 text-fg-muted text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          در حال بررسی لینک‌ها…
        </div>
      ) : links.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface text-center py-10 text-fg-muted text-sm">
          لینک‌های دانلود این {kindLabel} هنوز اضافه نشده‌اند. به‌زودی! 🎬
        </div>
      ) : isEpisodic ? (
        <div className="space-y-6">
          {seasons.map((season) => (
            <div key={season} className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="px-5 py-3 font-bold text-center" style={headerGradient}>
                دانلود فصل {season.toLocaleString('fa-IR')}
              </div>
              <div className="p-3 space-y-2">
                {qualitiesOf(season).map((quality) => (
                  <QualityRow
                    key={quality}
                    to={`/download/${type}/${contentId}/${season}/${encodeURIComponent(quality)}`}
                    label={`دانلود با کیفیت ${quality}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="px-5 py-3 font-bold text-center" style={headerGradient}>دانلود {kindLabel}</div>
          <div className="p-3 space-y-2">
            {singleSorted.map((l) => (
              <QualityRow
                key={l.id}
                to={`/dl/${l.id}`}
                label={`دانلود با کیفیت ${l.quality}${l.size ? ` (${l.size})` : ''}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
