import type { SortOption } from '../../types/filter.types';

interface Props {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'seasonal', label: 'فصلی' },
  { value: 'top-rated', label: 'بالاترین امتیاز' },
  { value: 'most-popular', label: 'محبوب‌ترین' },
  { value: 'imdb', label: 'امتیاز IMDB' },
  { value: 'recently-updated', label: 'آخرین به‌روزرسانی' },
];

export function SortOptions({ value, onChange }: Props) {
  return (
    <div className="space-y-1.5">
      {SORT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full text-right px-3 py-2 rounded-lg text-[12px] transition-all font-[Vazirmatn] ${
            value === opt.value
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
