// src/pages/Admin/adminFields.tsx
// ورودی‌های مشترک فرم‌های پنل ادمین (انیمه، اخبار، موزیک و ...)
import { useState, type ChangeEvent } from 'react';
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react';

export const inputCls =
  'px-3 py-2 rounded-lg bg-surface-2 border border-border text-fg outline-none focus:border-accent transition-colors';

export function TextField({ label, value, onChange, full = false, placeholder = '' }:
  { label: string; value: string; onChange: (v: string) => void; full?: boolean; placeholder?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? 'md:col-span-2' : ''}`}>
      <span className="text-sm text-fg-muted">{label}</span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </label>
  );
}

export function NumberField({ label, value, onChange, step = 1 }:
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

export function SelectField({ label, value, onChange, options }:
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

export function CheckboxField({ label, checked, onChange }:
  { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[var(--accent)]" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4, hint, placeholder = '' }:
  { label: string; value: string; onChange: (v: string) => void; rows?: number; hint?: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5 md:col-span-2">
      <span className="text-sm text-fg-muted">{label}{hint ? <span className="text-fg-subtle"> — {hint}</span> : null}</span>
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y`} />
    </label>
  );
}

export function ImageUploadField({ label, value, onChange, onUpload }:
  { label: string; value: string; onChange: (v: string) => void; onUpload: (file: File) => Promise<string> }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      onChange(await onUpload(file));
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
