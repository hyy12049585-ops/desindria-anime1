// src/pages/Admin/AdminAnimes.tsx
import { useState, useEffect, type ChangeEvent } from 'react';
import {
  listAnimes, createAnime, updateAnime, deleteAnime, uploadAnimeImage, type AdminAnime,
} from '../../services/adminAnimeService';
import { Plus, Pencil, Trash2, X, Loader2, Star, Upload, Image as ImageIcon } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ongoing', label: 'در حال پخش' },
  { value: 'completed', label: 'تمام‌شده' },
  { value: 'upcoming', label: 'به‌زودی' },
];
const SEASON_OPTIONS = [
  { value: 'spring', label: 'بهار' },
  { value: 'summer', label: 'تابستان' },
  { value: 'fall', label: 'پاییز' },
  { value: 'winter', label: 'زمستان' },
];

type FormState = Omit<AdminAnime, 'id'>;

const EMPTY_FORM: FormState = {
  title: '', titleEn: '', image: '', poster: '', banner: '', slider: '', logo: '',
  rating: 0, episodes: 0, currentEpisode: 0, genres: [],
  status: 'ongoing', season: 'spring', year: new Date().getFullYear(),
  studio: '', synopsis: '', duration: '', isTrending: false, isNew: false,
};

const inputCls =
  'px-3 py-2 rounded-lg bg-surface-2 border border-border text-fg outline-none focus:border-accent transition-colors';

// ---------- ورودی‌های کوچک ----------
function TextField({ label, value, onChange, full = false, placeholder = '' }:
  { label: string; value: string; onChange: (v: string) => void; full?: boolean; placeholder?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? 'md:col-span-2' : ''}`}>
      <span className="text-sm text-fg-muted">{label}</span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}

function NumberField({ label, value, onChange, step = 1 }:
  { label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-fg-muted">{label}</span>
      <input
        type="number" step={step} value={value}
        onChange={(e) => { const n = e.target.value === '' ? 0 : Number(e.target.value); if (!Number.isNaN(n)) onChange(n); }}
        className={inputCls}
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }:
  { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-fg-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function CheckboxField({ label, checked, onChange }:
  { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[var(--accent)]" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

// ---------- کادر عکس با آپلود + پیش‌نمایش ----------
function ImageUploadField({ label, value, onChange }:
  { label: string; value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAnimeImage(file);
      onChange(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'نامشخص';
      alert('خطا در آپلود عکس: ' + msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-1.5 md:col-span-2">
      <span className="text-sm text-fg-muted">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg bg-surface-2 border border-border overflow-hidden shrink-0 flex items-center justify-center">
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <ImageIcon className="w-5 h-5 text-fg-subtle" />}
        </div>
        <input value={value} placeholder="آدرس عکس، یا دکمهٔ آپلود رو بزن" onChange={(e) => onChange(e.target.value)} className={`flex-1 min-w-0 ${inputCls}`} />
        <label className="cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-sm font-medium" style={{ color: '#fff' }}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          آپلود
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

// ---------- صفحهٔ اصلی ----------
export default function AdminAnimes() {
  const [animes, setAnimes] = useState<AdminAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [genresText, setGenresText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAnime | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setAnimes(await listAnimes());
    } catch {
      // خطا در کنسول لاگ شده
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setGenresText('');
    setModalOpen(true);
  }

  function openEdit(a: AdminAnime) {
    setEditingId(a.id);
    const { id: _id, ...rest } = a;
    void _id;
    setForm(rest);
    setGenresText(a.genres.join('، '));
    setModalOpen(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { alert('عنوان الزامی است'); return; }
    const genres = genresText.split(/[،,]/).map((g) => g.trim()).filter(Boolean);
    const payload: FormState = { ...form, genres };
    setSaving(true);
    try {
      if (editingId === null) await createAnime(payload);
      else await updateAnime(editingId, payload);
      setModalOpen(false);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'نامشخص';
      alert('خطا در ذخیره: ' + msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAnime(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'نامشخص';
      alert('خطا در حذف: ' + msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div dir="rtl">
      {/* سربرگ */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">مدیریت انیمه‌ها</h2>
          <p className="text-fg-muted text-sm mt-1">
            {loading ? 'در حال بارگذاری…' : `${animes.length.toLocaleString('fa-IR')} انیمه`}
          </p>
        </div>
        <button onClick={openAdd} style={{ color: '#fff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          افزودن انیمه
        </button>
      </div>

      {/* لیست */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        {loading ? (
          <div className="p-10 text-center text-fg-muted">در حال بارگذاری…</div>
        ) : animes.length === 0 ? (
          <div className="p-10 text-center text-fg-muted">هنوز انیمه‌ای ثبت نشده.</div>
        ) : (
          <div className="divide-y divide-border">
            {animes.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 hover:bg-surface-2 transition-colors">
                <img src={a.poster || a.image} alt={a.title} className="w-12 h-16 object-cover rounded-md bg-surface-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{a.title}</div>
                  <div className="text-xs text-fg-muted truncate">{a.titleEn}</div>
                  <div className="flex items-center gap-1 text-xs text-fg-muted mt-1">
                    <Star className="w-3 h-3 text-accent" />
                    {a.rating.toLocaleString('fa-IR')}
                    <span className="mx-1">·</span>
                    {a.episodes.toLocaleString('fa-IR')} قسمت
                    <span className="mx-1">·</span>
                    {a.year.toLocaleString('fa-IR')}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(a)} aria-label="ویرایش"
                    className="p-2 rounded-lg text-fg-muted hover:bg-surface hover:text-accent transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(a)} aria-label="حذف"
                    className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* فرم افزودن/ویرایش */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { if (!saving) setModalOpen(false); }}>
          <div dir="rtl"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editingId === null ? 'افزودن انیمهٔ جدید' : 'ویرایش انیمه'}</h3>
              <button onClick={() => { if (!saving) setModalOpen(false); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="عنوان فارسی" value={form.title} onChange={(v) => setField('title', v)} full />
              <TextField label="عنوان انگلیسی" value={form.titleEn} onChange={(v) => setField('titleEn', v)} />
              <TextField label="استودیو" value={form.studio} onChange={(v) => setField('studio', v)} />
              <NumberField label="امتیاز" value={form.rating} onChange={(v) => setField('rating', v)} step={0.1} />
              <NumberField label="سال" value={form.year} onChange={(v) => setField('year', v)} />
              <NumberField label="تعداد قسمت‌ها" value={form.episodes} onChange={(v) => setField('episodes', v)} />
              <NumberField label="قسمت فعلی" value={form.currentEpisode} onChange={(v) => setField('currentEpisode', v)} />
              <SelectField label="وضعیت" value={form.status} onChange={(v) => setField('status', v)} options={STATUS_OPTIONS} />
              <SelectField label="فصل" value={form.season} onChange={(v) => setField('season', v)} options={SEASON_OPTIONS} />
              <TextField label="مدت هر قسمت" value={form.duration} onChange={(v) => setField('duration', v)} placeholder="مثلاً ۲۳ دقیقه" />
              <TextField label="ژانرها (با کاما جدا کن)" value={genresText} onChange={setGenresText} full placeholder="Action، Fantasy، Drama" />

              <ImageUploadField label="تصویر (image)" value={form.image} onChange={(v) => setField('image', v)} />
              <ImageUploadField label="پوستر (poster)" value={form.poster} onChange={(v) => setField('poster', v)} />
              <ImageUploadField label="بنر (banner)" value={form.banner} onChange={(v) => setField('banner', v)} />
              <ImageUploadField label="اسلایدر (slider)" value={form.slider} onChange={(v) => setField('slider', v)} />
              <ImageUploadField label="لوگو / تایتل (logo)" value={form.logo} onChange={(v) => setField('logo', v)} />

              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-sm text-fg-muted">خلاصه داستان</span>
                <textarea value={form.synopsis} onChange={(e) => setField('synopsis', e.target.value)} rows={4}
                  className={`${inputCls} resize-y`} />
              </label>

              <div className="flex items-center gap-6 md:col-span-2">
                <CheckboxField label="ترند روز" checked={form.isTrending} onChange={(v) => setField('isTrending', v)} />
                <CheckboxField label="جدید" checked={form.isNew} onChange={(v) => setField('isNew', v)} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} disabled={saving}
                className="px-4 py-2 rounded-xl border border-border text-fg-muted hover:bg-surface-2 transition-colors disabled:opacity-60">
                انصراف
              </button>
              <button onClick={handleSave} disabled={saving} style={{ color: '#fff' }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity disabled:opacity-60">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId === null ? 'افزودن' : 'ذخیره'}
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
            <h3 className="text-lg font-bold mb-2">حذف انیمه؟</h3>
            <p className="text-fg-muted text-sm mb-5 leading-7">
              «{deleteTarget.title}» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.
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
