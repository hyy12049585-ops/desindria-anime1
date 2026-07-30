// src/pages/Admin/AdminCharacters.tsx
import { useState, useEffect } from 'react';
import {
  listCharacters, createCharacter, updateCharacter, deleteCharacter, uploadCharacterImage,
  type AdminCharacter,
} from '../../services/adminCharactersService';
import { TextField, NumberField, SelectField, TextAreaField, ImageUploadField } from './adminFields';
import { Plus, Pencil, Trash2, X, Loader2, Heart, User } from 'lucide-react';

type FormState = Omit<AdminCharacter, 'id'>;

const ROLE_OPTIONS = [
  { value: '', label: '— انتخاب نقش —' },
  { value: 'اصلی', label: 'اصلی (Main)' },
  { value: 'فرعی', label: 'فرعی (Supporting)' },
];

const EMPTY_FORM: FormState = {
  name: '', nameJapanese: '', anime: '', image: '', banner: '', role: '',
  bio: '', voiceActor: '', birthday: '', age: '', height: '', votes: 0, favorites: 0,
};

export default function AdminCharacters() {
  const [items, setItems] = useState<AdminCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCharacter | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listCharacters());
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

  function openEdit(a: AdminCharacter) {
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
    if (!form.name.trim()) { alert('نام الزامی است'); return; }
    setSaving(true);
    try {
      if (editingId === null) await createCharacter(form);
      else await updateCharacter(editingId, form);
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
      await deleteCharacter(deleteTarget.id);
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
          <h2 className="text-2xl font-bold">مدیریت کاراکترها</h2>
          <p className="text-fg-muted text-sm mt-1">
            {loading ? 'در حال بارگذاری…' : `${items.length.toLocaleString('fa-IR')} کاراکتر`}
          </p>
        </div>
        <button onClick={openAdd} style={{ color: '#fff' }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" />
          افزودن کاراکتر
        </button>
      </div>

      {/* گرید */}
      {loading ? (
        <div className="p-10 text-center text-fg-muted rounded-2xl border border-border bg-surface">در حال بارگذاری…</div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-fg-muted rounded-2xl border border-border bg-surface">هنوز کاراکتری ثبت نشده.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border bg-surface overflow-hidden group">
              <div className="aspect-[3/4] bg-surface-2 overflow-hidden flex items-center justify-center">
                {c.image
                  ? <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  : <User className="w-8 h-8 text-fg-subtle" />}
              </div>
              <div className="p-3">
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-xs text-fg-muted truncate">{c.anime}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs text-fg-muted">
                    <Heart className="w-3.5 h-3.5 text-accent" />
                    {c.votes.toLocaleString('fa-IR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <button onClick={() => openEdit(c)} aria-label="ویرایش"
                      className="p-1.5 rounded-lg text-fg-muted hover:bg-surface-2 hover:text-accent transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} aria-label="حذف"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </span>
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-surface border border-border shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editingId === null ? 'افزودن کاراکتر جدید' : 'ویرایش کاراکتر'}</h3>
              <button onClick={() => { if (!saving) setModalOpen(false); }} aria-label="بستن"
                className="p-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField label="نام کاراکتر" value={form.name} onChange={(v) => setField('name', v)} />
              <TextField label="نام ژاپنی" value={form.nameJapanese} onChange={(v) => setField('nameJapanese', v)} placeholder="日本語" />
              <TextField label="انیمه" value={form.anime} onChange={(v) => setField('anime', v)} />
              <SelectField label="نقش" value={form.role} onChange={(v) => setField('role', v)} options={ROLE_OPTIONS} />
              <TextField label="صداپیشه" value={form.voiceActor} onChange={(v) => setField('voiceActor', v)} />
              <TextField label="تاریخ تولد" value={form.birthday} onChange={(v) => setField('birthday', v)} placeholder="مثلاً ۳ مارس" />
              <TextField label="سن" value={form.age} onChange={(v) => setField('age', v)} />
              <TextField label="قد" value={form.height} onChange={(v) => setField('height', v)} placeholder="مثلاً ۱۷۰cm" />
              <NumberField label="تعداد رأی" value={form.votes} onChange={(v) => setField('votes', v)} />
              <NumberField label="علاقه‌مندی‌ها" value={form.favorites} onChange={(v) => setField('favorites', v)} />

              <ImageUploadField label="عکس کاراکتر" value={form.image} onChange={(v) => setField('image', v)} onUpload={uploadCharacterImage} />
              <ImageUploadField label="بنر پروفایل (اختیاری)" value={form.banner} onChange={(v) => setField('banner', v)} onUpload={uploadCharacterImage} />

              <TextAreaField label="بیوگرافی" value={form.bio} onChange={(v) => setField('bio', v)} rows={5} />
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
            <h3 className="text-lg font-bold mb-2">حذف کاراکتر؟</h3>
            <p className="text-fg-muted text-sm mb-5 leading-7">
              «{deleteTarget.name}» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.
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
