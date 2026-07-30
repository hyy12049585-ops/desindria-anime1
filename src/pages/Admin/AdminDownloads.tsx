// src/pages/Admin/AdminDownloads.tsx
import { useState, useEffect } from 'react';
import {
  getContentList, listDownloads, createDownload, createDownloadsBulk, updateDownload, deleteDownload,
  type ContentType, type DownloadLink, type ContentOption, type DownloadInput,
} from '../../services/adminDownloadsService';
import { TextField, NumberField, SelectField, TextAreaField } from './adminFields';
import { Plus, Pencil, Trash2, X, Loader2, Link as LinkIcon } from 'lucide-react';

const QUALITY_OPTIONS = [
  { value: '1080p', label: '۱۰۸۰p' },
  { value: '720p', label: '۷۲۰p' },
  { value: '480p', label: '۴۸۰p' },
  { value: '360p', label: '۳۶۰p' },
];
const QUALITY_ORDER = ['1080p', '720p', '480p', '360p'];
function qualityRank(q: string) {
  const i = QUALITY_ORDER.indexOf(q);
  return i === -1 ? 99 : i;
}

// استخراج پیام واقعی خطا (خطاهای Supabase آبجکت‌اند، نه Error)
function errMsg(e: unknown): string {
  if (e && typeof e === 'object') {
    const o = e as { message?: string; details?: string; hint?: string; code?: string };
    const parts = [o.message, o.details, o.hint, o.code].filter(Boolean);
    if (parts.length) return parts.join(' | ');
  }
  return e instanceof Error ? e.message : 'نامشخص';
}


const TYPE_TABS: { value: ContentType; label: string }[] = [
  { value: 'anime', label: 'انیمه‌ها' },
  { value: 'animation', label: 'انیمیشن‌ها' },
  { value: 'music', label: 'موزیک' },
];

export default function AdminDownloads() {
  const [contentType, setContentType] = useState<ContentType>('anime');
  const [options, setOptions] = useState<ContentOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState('');
  const [links, setLinks] = useState<DownloadLink[]>([]);
  const [linksLoading, setLinksLoading] = useState(false);

  // انیمه = فصل/قسمت‌دار، بقیه = تکی
  const isEpisodic = contentType === 'anime';

  // مودال افزودن
  const [addOpen, setAddOpen] = useState(false);
  const [bulkSeason, setBulkSeason] = useState(1);
  const [bulkQuality, setBulkQuality] = useState('1080p');
  const [bulkStart, setBulkStart] = useState(1);
  const [bulkSize, setBulkSize] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [singleQuality, setSingleQuality] = useState('1080p');
  const [singleUrl, setSingleUrl] = useState('');
  const [singleSize, setSingleSize] = useState('');
  const [addSaving, setAddSaving] = useState(false);

  // ویرایش / حذف
  const [editTarget, setEditTarget] = useState<DownloadLink | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DownloadLink | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setOptionsLoading(true);
    setSelectedId('');
    setLinks([]);
    getContentList(contentType)
      .then((d) => { if (mounted) setOptions(d); })
      .catch(() => { if (mounted) setOptions([]); })
      .finally(() => { if (mounted) setOptionsLoading(false); });
    return () => { mounted = false; };
  }, [contentType]);

  async function loadLinks() {
    if (!selectedId) { setLinks([]); return; }
    setLinksLoading(true);
    try {
      setLinks(await listDownloads(contentType, selectedId));
    } catch {
      setLinks([]);
    } finally {
      setLinksLoading(false);
    }
  }

  useEffect(() => { loadLinks(); /* eslint-disable-next-line */ }, [selectedId, contentType]);

  // گروه‌بندی برای حالت فصل/قسمت‌دار
  const seasons = Array.from(new Set(links.map((l) => l.season))).sort((a, b) => a - b);
  function qualitiesOf(season: number) {
    return Array.from(new Set(links.filter((l) => l.season === season).map((l) => l.quality)))
      .sort((a, b) => qualityRank(a) - qualityRank(b));
  }
  function episodesOf(season: number, quality: string) {
    return links.filter((l) => l.season === season && l.quality === quality).sort((a, b) => a.episode - b.episode);
  }
  // برای حالت تکی: مرتب بر اساس کیفیت
  const singleSorted = [...links].sort((a, b) => qualityRank(a.quality) - qualityRank(b.quality) || a.quality.localeCompare(b.quality));

  function openAdd() {
    setBulkSeason(1);
    setBulkQuality('1080p');
    setBulkStart(1);
    setBulkSize('');
    setBulkUrls('');
    setSingleQuality(contentType === 'music' ? '320kbps' : '1080p');
    setSingleUrl('');
    setSingleSize('');
    setAddOpen(true);
  }

  async function handleAddSave() {
    setAddSaving(true);
    try {
      if (isEpisodic) {
        const urls = bulkUrls.split('\n').map((u) => u.trim()).filter(Boolean);
        if (urls.length === 0) { alert('حداقل یک لینک وارد کن'); setAddSaving(false); return; }
        await createDownloadsBulk(
          { contentType, contentId: selectedId, season: bulkSeason, quality: bulkQuality, size: bulkSize },
          urls,
          bulkStart,
        );
      } else {
        if (!singleUrl.trim()) { alert('آدرس لینک الزامی است'); setAddSaving(false); return; }
        const input: DownloadInput = {
          contentType, contentId: selectedId, season: 1, episode: 1,
          quality: singleQuality.trim() || 'دانلود', title: '', url: singleUrl.trim(), size: singleSize,
        };
        await createDownload(input);
      }
      setAddOpen(false);
      await loadLinks();
    } catch (e) {
      alert('خطا در افزودن: ' + errMsg(e));
    } finally {
      setAddSaving(false);
    }
  }

  async function handleEditSave() {
    if (!editTarget) return;
    if (!editTarget.url.trim()) { alert('آدرس لینک الزامی است'); return; }
    setEditSaving(true);
    try {
      const input: DownloadInput = {
        contentType, contentId: selectedId,
        season: editTarget.season, episode: editTarget.episode,
        quality: editTarget.quality, title: editTarget.title, url: editTarget.url, size: editTarget.size,
      };
      await updateDownload(editTarget.id, input);
      setEditTarget(null);
      await loadLinks();
    } catch (e) {
      alert('خطا در ویرایش: ' + errMsg(e));
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDownload(deleteTarget.id);
      setDeleteTarget(null);
      await loadLinks();
    } catch (e) {
      alert('خطا در حذف: ' + errMsg(e));
    } finally {
      setDeleting(false);
    }
  }

  const selectedLabel = TYPE_TABS.find((t) => t.value === contentType)?.label ?? '';

  return (
    <div dir="rtl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">مدیریت دانلودها</h2>
        <p className="text-fg-muted text-sm mt-1">لینک دانلود انیمه (فصل/قسمت)، انیمیشن و موزیک (تکی) را اینجا مدیریت کن</p>
      </div>

      {/* انتخاب نوع */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {TYPE_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setContentType(t.value)}
            style={contentType === t.value ? { color: '#fff' } : undefined}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              contentType === t.value ? 'bg-accent' : 'bg-surface border border-border text-fg-muted hover:bg-surface-2'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* انتخاب مورد */}
      <div className="mb-6 max-w-md">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm text-fg-muted">انتخاب از {selectedLabel}</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={optionsLoading}
            className="px-3 py-2 rounded-lg bg-surface-2 border border-border text-fg outline-none focus:border-accent transition-colors"
          >
            <option value="">{optionsLoading ? 'در حال بارگذاری…' : '— انتخاب کن —'}</option>
            {options.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
          </select>
        </label>
      </div>

      {selectedId && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">
              لینک‌های دانلود
              {!linksLoading && <span className="text-fg-muted font-normal text-sm mr-2">({links.length.toLocaleString('fa-IR')} لینک)</span>}
            </h3>
            <button onClick={openAdd} style={{ color: '#fff' }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              {isEpisodic ? 'افزودن گروهی لینک' : 'افزودن لینک'}
            </button>
          </div>

          {linksLoading ? (
            <div className="p-10 text-center text-fg-muted rounded-2xl border border-border bg-surface">در حال بارگذاری…</div>
          ) : links.length === 0 ? (
            <div className="p-10 text-center text-fg-muted rounded-2xl border border-border bg-surface">
              هنوز لینکی ثبت نشده. روی «{isEpisodic ? 'افزودن گروهی لینک' : 'افزودن لینک'}» بزن.
            </div>
          ) : isEpisodic ? (
            /* ===== حالت فصل/قسمت‌دار (انیمه) ===== */
            <div className="space-y-5">
              {seasons.map((season) => (
                <div key={season} className="rounded-2xl border border-border bg-surface overflow-hidden">
                  <div className="px-4 py-3 border-b border-border bg-surface-2 font-bold">فصل {season.toLocaleString('fa-IR')}</div>
                  <div className="p-4 space-y-4">
                    {qualitiesOf(season).map((quality) => (
                      <div key={quality}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-accent" style={{ color: '#fff' }}>{quality}</span>
                          <span className="text-xs text-fg-muted">{episodesOf(season, quality).length.toLocaleString('fa-IR')} قسمت</span>
                        </div>
                        <div className="space-y-1.5">
                          {episodesOf(season, quality).map((l) => (
                            <div key={l.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-2">
                              <span className="text-sm font-medium shrink-0 w-16">قسمت {l.episode.toLocaleString('fa-IR')}</span>
                              <span className="flex items-center gap-1 text-xs text-fg-muted flex-1 min-w-0">
                                <LinkIcon className="w-3 h-3 shrink-0" />
                                <span className="truncate" dir="ltr">{l.url}</span>
                              </span>
                              {l.size && <span className="text-xs text-fg-subtle shrink-0">{l.size}</span>}
                              <button onClick={() => setEditTarget({ ...l })} aria-label="ویرایش"
                                className="p-1.5 rounded-md text-fg-muted hover:bg-surface hover:text-accent transition-colors shrink-0">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setDeleteTarget(l)} aria-label="حذف"
                                className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ===== حالت تکی (انیمیشن / موزیک) ===== */
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="divide-y divide-border">
                {singleSorted.map((l) => (
                  <div key={l.id} className="flex items-center gap-3 p-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-accent shrink-0" style={{ color: '#fff' }}>{l.quality}</span>
                    <span className="flex items-center gap-1 text-xs text-fg-muted flex-1 min-w-0">
                      <LinkIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate" dir="ltr">{l.url}</span>
                    </span>
                    {l.size && <span className="text-xs text-fg-subtle shrink-0">{l.size}</span>}
                    <button onClick={() => setEditTarget({ ...l })} aria-label="ویرایش"
                      className="p-1.5 rounded-md text-fg-muted hover:bg-surface-2 hover:text-accent transition-colors shrink-0">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteTarget(l)} aria-label="حذف"
                      className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* مودال افزودن */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { if (!addSaving) setAddOpen(false); }}>
          <div dir="rtl"
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{isEpisodic ? 'افزودن گروهی لینک' : 'افزودن لینک'}</h3>
              <button onClick={() => { if (!addSaving) setAddOpen(false); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isEpisodic ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberField label="فصل" value={bulkSeason} onChange={setBulkSeason} />
                  <SelectField label="کیفیت" value={bulkQuality} onChange={setBulkQuality} options={QUALITY_OPTIONS} />
                  <NumberField label="شمارهٔ قسمت شروع" value={bulkStart} onChange={setBulkStart} />
                  <TextField label="حجم هر فایل (اختیاری)" value={bulkSize} onChange={setBulkSize} placeholder="مثلاً ۳۰۰MB" />
                  <TextAreaField
                    label="لینک‌ها"
                    hint="هر خط = یک قسمت (هر تعداد: ۱۲، ۲۰، ۲۴...)"
                    value={bulkUrls}
                    onChange={setBulkUrls}
                    rows={8}
                    placeholder={'https://...قسمت۱\nhttps://...قسمت۲\nhttps://...قسمت۳'}
                  />
                </div>
                <div className="text-xs text-fg-muted mt-2">
                  {bulkUrls.split('\n').map((u) => u.trim()).filter(Boolean).length.toLocaleString('fa-IR')} لینک واردشده
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="کیفیت / نوع" value={singleQuality} onChange={setSingleQuality}
                  placeholder={contentType === 'music' ? 'مثلاً ۳۲۰kbps' : 'مثلاً ۱۰۸۰p'} />
                <TextField label="حجم (اختیاری)" value={singleSize} onChange={setSingleSize} placeholder="مثلاً ۸MB" />
                <TextField label="آدرس لینک" value={singleUrl} onChange={setSingleUrl} full placeholder="https://..." />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setAddOpen(false)} disabled={addSaving}
                className="px-4 py-2 rounded-xl border border-border text-fg-muted hover:bg-surface-2 transition-colors disabled:opacity-60">
                انصراف
              </button>
              <button onClick={handleAddSave} disabled={addSaving} style={{ color: '#fff' }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                {addSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                افزودن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال ویرایش */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { if (!editSaving) setEditTarget(null); }}>
          <div dir="rtl"
            className="w-full max-w-xl rounded-2xl bg-surface border border-border shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">ویرایش لینک</h3>
              <button onClick={() => { if (!editSaving) setEditTarget(null); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEpisodic && (
                <>
                  <NumberField label="فصل" value={editTarget.season} onChange={(v) => setEditTarget({ ...editTarget, season: v })} />
                  <NumberField label="قسمت" value={editTarget.episode} onChange={(v) => setEditTarget({ ...editTarget, episode: v })} />
                  <SelectField label="کیفیت" value={editTarget.quality} onChange={(v) => setEditTarget({ ...editTarget, quality: v })} options={QUALITY_OPTIONS} />
                </>
              )}
              {!isEpisodic && (
                <TextField label="کیفیت / نوع" value={editTarget.quality} onChange={(v) => setEditTarget({ ...editTarget, quality: v })} />
              )}
              <TextField label="حجم (اختیاری)" value={editTarget.size} onChange={(v) => setEditTarget({ ...editTarget, size: v })} />
              <TextField label="آدرس لینک" value={editTarget.url} onChange={(v) => setEditTarget({ ...editTarget, url: v })} full />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setEditTarget(null)} disabled={editSaving}
                className="px-4 py-2 rounded-xl border border-border text-fg-muted hover:bg-surface-2 transition-colors disabled:opacity-60">
                انصراف
              </button>
              <button onClick={handleEditSave} disabled={editSaving} style={{ color: '#fff' }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                {editSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* تأیید حذف */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { if (!deleting) setDeleteTarget(null); }}>
          <div className="w-full max-w-sm rounded-2xl bg-surface border border-border shadow-2xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}>
            <span className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-7 h-7 text-red-500" />
            </span>
            <h3 className="text-lg font-bold mb-2">حذف لینک؟</h3>
            <p className="text-fg-muted text-sm mb-5 leading-7">
              {isEpisodic
                ? `لینک «فصل ${deleteTarget.season.toLocaleString('fa-IR')} قسمت ${deleteTarget.episode.toLocaleString('fa-IR')} (${deleteTarget.quality})» حذف می‌شود.`
                : `لینک «${deleteTarget.quality}» حذف می‌شود.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                className="flex-1 px-4 py-2 rounded-xl border border-border hover:bg-surface-2 transition-colors disabled:opacity-60">
                انصراف
              </button>
              <button onClick={handleDelete} disabled={deleting} style={{ color: '#fff' }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:opacity-90 transition-opacity disabled:opacity-60">
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
