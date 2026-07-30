// src/pages/Admin/AdminReels.tsx
import { useState, useEffect } from 'react';
import {
  listReels, createReel, updateReel, deleteReel, uploadReelImage,
  type AdminReel,
} from '../../services/adminReelsService';
import { TextField, NumberField, ImageUploadField } from './adminFields';
import { Plus, Pencil, Trash2, X, Loader2, Play, Heart, Eye, Video } from 'lucide-react';

type FormState = Omit<AdminReel, 'id'>;

const EMPTY_FORM: FormState = { title: '', thumbnail: '', videoUrl: '', duration: '', likes: 0, views: 0 };

export default function AdminReels() {
  const [items, setItems] = useState<AdminReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminReel | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listReels());
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
    setModalOpen(true);
  }

  function openEdit(a: AdminReel) {
    setEditingId(a.id);
    const { id: _id, ...rest } = a;
    void _id;
    setForm(rest);
    setModalOpen(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { alert('عنوان الزامی است'); return; }
    if (!form.videoUrl.trim()) { alert('لینک ویدیو الزامی است'); return; }
    setSaving(true);
    try {
      if (editingId === null) await createReel(form);
      else await updateReel(editingId, form);
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
      await deleteReel(deleteTarget.id);
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
          <h2 className="text-2xl font-bold">مدیریت ریلز</h2>
          <p className="text-fg-muted text-sm mt-1">
            {loading ? 'در حال بارگذاری…' : `${items.length.toLocaleString('fa-IR')} ریل`}
          </p>
        </div>
        <button onClick={openAdd} style={{ color: '#fff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          افزودن ریل
        </button>
      </div>

      {/* گرید */}
      {loading ? (
        <div className="p-10 text-center text-fg-muted rounded-2xl border border-border bg-surface">در حال بارگذاری…</div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-fg-muted rounded-2xl border border-border bg-surface">هنوز ریلی ثبت نشده.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-surface overflow-hidden group">
              <div className="aspect-[9/16] bg-surface-2 overflow-hidden relative flex items-center justify-center">
                {r.thumbnail
                  ? <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" />
                  : <Video className="w-8 h-8 text-fg-subtle" />}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                    <Play className="w-5 h-5" />
                  </span>
                </span>
                {r.duration && (
                  <span className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                    {r.duration}
                  </span>
                )}
              </div>
              <div className="p-3">
                <div className="font-bold truncate text-sm">{r.title}</div>
                <div className="flex items-center gap-3 text-xs text-fg-muted mt-1.5">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-accent" />{r.likes.toLocaleString('fa-IR')}</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-accent" />{r.views.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <button onClick={() => openEdit(r)} aria-label="ویرایش"
                    className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-2 hover:text-accent transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(r)} aria-label="حذف"
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* فرم */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { if (!saving) setModalOpen(false); }}>
          <div dir="rtl"
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editingId === null ? 'افزودن ریل جدید' : 'ویرایش ریل'}</h3>
              <button onClick={() => { if (!saving) setModalOpen(false); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="عنوان" value={form.title} onChange={(v) => setField('title', v)} full />
              <TextField label="لینک ویدیو (URL)" value={form.videoUrl} onChange={(v) => setField('videoUrl', v)} full placeholder="https://..." />
              <TextField label="مدت‌زمان" value={form.duration} onChange={(v) => setField('duration', v)} placeholder="مثلاً ۰:۴۵" />
              <div className="hidden md:block" />
              <NumberField label="لایک‌ها" value={form.likes} onChange={(v) => setField('likes', v)} />
              <NumberField label="بازدیدها" value={form.views} onChange={(v) => setField('views', v)} />
              <ImageUploadField label="کاور (بندانگشتی)" value={form.thumbnail} onChange={(v) => setField('thumbnail', v)} onUpload={uploadReelImage} />
            </div>

            <p className="text-xs text-fg-muted mt-3 leading-6">
              ویدیو روی سرور آپلود نمی‌شود؛ فقط لینکش را وارد کن (مثلاً لینک مستقیم mp4 یا آدرس ویدیو).
            </p>

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
            <h3 className="text-lg font-bold mb-2">حذف ریل؟</h3>
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
