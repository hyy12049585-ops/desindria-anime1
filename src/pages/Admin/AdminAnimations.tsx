// src/pages/Admin/AdminAnimations.tsx
import { useState, useEffect } from 'react';
import {
  listAnimations, createAnimation, updateAnimation, deleteAnimation, uploadAnimationImage,
  type AdminAnimation,
} from '../../services/adminAnimationService';
import {
  TextField, NumberField, CheckboxField, TextAreaField, ImageUploadField,
} from './adminFields';
import { Plus, Pencil, Trash2, X, Loader2, Star, Clapperboard } from 'lucide-react';

type FormState = Omit<AdminAnimation, 'id' | 'viewCount'>;

const EMPTY_FORM: FormState = {
  title: '', titleEn: '', poster: '', banner: '', rating: 0, year: new Date().getFullYear(),
  duration: '', studio: '', director: '', country: '', genres: [], synopsis: '',
  isTrending: false, isNew: false,
};

export default function AdminAnimations() {
  const [items, setItems] = useState<AdminAnimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [genresText, setGenresText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminAnimation | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listAnimations());
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

  function openEdit(a: AdminAnimation) {
    setEditingId(a.id);
    const { id: _id, viewCount: _v, ...rest } = a;
    void _id; void _v;
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
      if (editingId === null) await createAnimation(payload);
      else await updateAnimation(editingId, payload);
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
      await deleteAnimation(deleteTarget.id);
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
          <h2 className="text-2xl font-bold">مدیریت انیمیشن‌ها</h2>
          <p className="text-fg-muted text-sm mt-1">
            {loading ? 'در حال بارگذاری…' : `${items.length.toLocaleString('fa-IR')} انیمیشن`}
          </p>
        </div>
        <button onClick={openAdd} style={{ color: '#fff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          افزودن انیمیشن
        </button>
      </div>

      {/* لیست */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        {loading ? (
          <div className="p-10 text-center text-fg-muted">در حال بارگذاری…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-fg-muted">هنوز انیمیشنی ثبت نشده.</div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 hover:bg-surface-2 transition-colors">
                <div className="w-12 h-16 rounded-md overflow-hidden bg-surface-2 shrink-0 flex items-center justify-center">
                  {a.poster
                    ? <img src={a.poster} alt={a.title} className="w-full h-full object-cover" />
                    : <Clapperboard className="w-5 h-5 text-fg-subtle" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{a.title}</div>
                  <div className="text-xs text-fg-muted truncate">{a.titleEn}</div>
                  <div className="flex items-center gap-1 text-xs text-fg-muted mt-1">
                    <Star className="w-3 h-3 text-accent" />
                    {a.rating.toLocaleString('fa-IR')}
                    {a.year ? <><span className="mx-1">·</span>{a.year.toLocaleString('fa-IR')}</> : null}
                    {a.studio ? <><span className="mx-1">·</span>{a.studio}</> : null}
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

      {/* فرم */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { if (!saving) setModalOpen(false); }}>
          <div dir="rtl"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editingId === null ? 'افزودن انیمیشن جدید' : 'ویرایش انیمیشن'}</h3>
              <button onClick={() => { if (!saving) setModalOpen(false); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="عنوان فارسی" value={form.title} onChange={(v) => setField('title', v)} full />
              <TextField label="عنوان انگلیسی" value={form.titleEn} onChange={(v) => setField('titleEn', v)} />
              <TextField label="استودیو" value={form.studio} onChange={(v) => setField('studio', v)} />
              <TextField label="کارگردان" value={form.director} onChange={(v) => setField('director', v)} />
              <TextField label="کشور" value={form.country} onChange={(v) => setField('country', v)} />
              <NumberField label="امتیاز" value={form.rating} onChange={(v) => setField('rating', v)} step={0.1} />
              <NumberField label="سال" value={form.year} onChange={(v) => setField('year', v)} />
              <TextField label="مدت‌زمان" value={form.duration} onChange={(v) => setField('duration', v)} placeholder="مثلاً ۱۰۵ دقیقه" />
              <TextField label="ژانرها (با کاما جدا کن)" value={genresText} onChange={setGenresText} full placeholder="ماجراجویی، کمدی، خانوادگی" />

              <ImageUploadField label="پوستر" value={form.poster} onChange={(v) => setField('poster', v)} onUpload={uploadAnimationImage} />
              <ImageUploadField label="بنر" value={form.banner} onChange={(v) => setField('banner', v)} onUpload={uploadAnimationImage} />

              <TextAreaField label="خلاصه داستان" value={form.synopsis} onChange={(v) => setField('synopsis', v)} rows={4} />

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
            <h3 className="text-lg font-bold mb-2">حذف انیمیشن؟</h3>
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
