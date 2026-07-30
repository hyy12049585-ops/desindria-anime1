// src/pages/Admin/AdminNews.tsx
import { useState, useEffect } from 'react';
import {
  listNews, createNews, updateNews, deleteNews, uploadNewsImage,
  type AdminNews, type NewsAuthor,
} from '../../services/adminNewsService';
import {
  TextField, NumberField, CheckboxField, TextAreaField, ImageUploadField,
} from './adminFields';
import { Plus, Pencil, Trash2, X, Loader2, Newspaper } from 'lucide-react';

type FormState = Omit<AdminNews, 'id'>;

const EMPTY_AUTHOR: NewsAuthor = { name: '', avatar: '', bio: '', role: '', followers: 0 };

const EMPTY_FORM: FormState = {
  title: '', summary: '', excerpt: '', content: [], image: '', category: '',
  tags: [], author: { ...EMPTY_AUTHOR }, date: '', readTime: 0,
  isFeatured: false, isHot: false, relatedIds: [], views: 0, likes: 0,
};

export default function AdminNews() {
  const [items, setItems] = useState<AdminNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [contentText, setContentText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [relatedText, setRelatedText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminNews | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listNews());
    } catch {
      // خطا در کنسول لاگ شده
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, author: { ...EMPTY_AUTHOR } });
    setContentText('');
    setTagsText('');
    setRelatedText('');
    setModalOpen(true);
  }

  function openEdit(a: AdminNews) {
    setEditingId(a.id);
    const { id: _id, ...rest } = a;
    void _id;
    setForm(rest);
    setContentText(a.content.join('\n\n'));
    setTagsText(a.tags.join('، '));
    setRelatedText(a.relatedIds.join('، '));
    setModalOpen(true);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setAuthorField<K extends keyof NewsAuthor>(key: K, value: NewsAuthor[K]) {
    setForm((f) => ({ ...f, author: { ...f.author, [key]: value } }));
  }

  async function handleSave() {
    if (!form.title.trim()) { alert('عنوان الزامی است'); return; }
    const content = contentText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const tags = tagsText.split(/[،,]/).map((t) => t.trim()).filter(Boolean);
    const relatedIds = relatedText.split(/[،,]/).map((t) => t.trim()).filter(Boolean);
    const payload: FormState = { ...form, content, tags, relatedIds };
    setSaving(true);
    try {
      if (editingId === null) await createNews(payload);
      else await updateNews(editingId, payload);
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
      await deleteNews(deleteTarget.id);
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
          <h2 className="text-2xl font-bold">مدیریت اخبار</h2>
          <p className="text-fg-muted text-sm mt-1">
            {loading ? 'در حال بارگذاری…' : `${items.length.toLocaleString('fa-IR')} خبر`}
          </p>
        </div>
        <button onClick={openAdd} style={{ color: '#fff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          افزودن خبر
        </button>
      </div>

      {/* لیست */}
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        {loading ? (
          <div className="p-10 text-center text-fg-muted">در حال بارگذاری…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-fg-muted">هنوز خبری ثبت نشده.</div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 hover:bg-surface-2 transition-colors">
                <div className="w-20 h-14 rounded-md overflow-hidden bg-surface-2 shrink-0 flex items-center justify-center">
                  {a.image
                    ? <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                    : <Newspaper className="w-5 h-5 text-fg-subtle" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{a.title}</div>
                  <div className="flex items-center gap-1 text-xs text-fg-muted mt-1">
                    {a.category && <span className="px-1.5 py-0.5 rounded bg-surface-2">{a.category}</span>}
                    {a.date && <><span className="mx-1">·</span>{a.date}</>}
                    <span className="mx-1">·</span>
                    {a.views.toLocaleString('fa-IR')} بازدید
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
              <h3 className="text-lg font-bold">{editingId === null ? 'افزودن خبر جدید' : 'ویرایش خبر'}</h3>
              <button onClick={() => { if (!saving) setModalOpen(false); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="عنوان" value={form.title} onChange={(v) => setField('title', v)} full />
              <TextField label="دسته‌بندی" value={form.category} onChange={(v) => setField('category', v)} />
              <TextField label="تاریخ" value={form.date} onChange={(v) => setField('date', v)} placeholder="مثلاً ۱۴۰۵/۰۱/۱۵" />
              <NumberField label="زمان مطالعه (دقیقه)" value={form.readTime} onChange={(v) => setField('readTime', v)} />
              <TextField label="تگ‌ها (با کاما جدا کن)" value={tagsText} onChange={setTagsText} full placeholder="انیمه، اخبار، فصل جدید" />
              <TextAreaField label="خلاصهٔ کوتاه (summary)" value={form.summary} onChange={(v) => setField('summary', v)} rows={2} />
              <TextAreaField label="چکیده (excerpt)" value={form.excerpt} onChange={(v) => setField('excerpt', v)} rows={2} />

              <ImageUploadField label="عکس خبر" value={form.image} onChange={(v) => setField('image', v)} onUpload={uploadNewsImage} />

              <TextAreaField
                label="متن خبر"
                hint="هر پاراگراف رو با یک خط خالی از بعدی جدا کن"
                value={contentText}
                onChange={setContentText}
                rows={8}
              />

              {/* نویسنده */}
              <div className="md:col-span-2 rounded-xl border border-border p-4">
                <div className="text-sm font-semibold mb-3">نویسنده</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField label="نام نویسنده" value={form.author.name} onChange={(v) => setAuthorField('name', v)} />
                  <TextField label="نقش" value={form.author.role} onChange={(v) => setAuthorField('role', v)} placeholder="مثلاً نویسنده ارشد" />
                  <NumberField label="دنبال‌کننده" value={form.author.followers} onChange={(v) => setAuthorField('followers', v)} />
                  <TextField label="بیو کوتاه" value={form.author.bio} onChange={(v) => setAuthorField('bio', v)} />
                  <ImageUploadField label="آواتار نویسنده" value={form.author.avatar} onChange={(v) => setAuthorField('avatar', v)} onUpload={uploadNewsImage} />
                </div>
              </div>

              <TextField label="idهای مرتبط (با کاما، اختیاری)" value={relatedText} onChange={setRelatedText} full placeholder="2، 5، 8" />

              <div className="flex items-center gap-6 md:col-span-2">
                <CheckboxField label="ویژه (Featured)" checked={form.isFeatured} onChange={(v) => setField('isFeatured', v)} />
                <CheckboxField label="داغ (Hot)" checked={form.isHot} onChange={(v) => setField('isHot', v)} />
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
            <h3 className="text-lg font-bold mb-2">حذف خبر؟</h3>
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
