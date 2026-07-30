import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { FilterCheckbox } from './FilterCheckbox';
import type { Studio } from '../../types/filter.types';

interface Props {
  selected: Studio[];
  onToggle: (studio: Studio) => void;
}

const ALL_STUDIOS: Studio[] = [
  'MAPPA', 'Madhouse', 'Ufotable', 'Studio Ghibli', 'Bones',
  'Toei Animation', 'A-1 Pictures', 'CloverWorks', 'Wit Studio',
  'Production I.G', 'Kyoto Animation', 'Trigger', 'White Fox',
  'Pierrot', 'Sunrise', 'David Production', 'Lerche',
  'Silver Link', 'JC Staff',
];

export function StudioSearch({ selected, onToggle }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_STUDIOS;
    return ALL_STUDIOS.filter(s => s.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="جستجوی استودیو..."
          dir="rtl"
         className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-lg pr-9 pl-3 py-2 text-[12px] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-purple-500/40 transition-colors font-[Vazirmatn]"
        />
      </div>
      <div className="max-h-[180px] overflow-y-auto space-y-1.5 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map(s => (
            <FilterCheckbox key={s} label={s} checked={selected.includes(s)} onChange={() => onToggle(s)} />
          ))
        ) : (
          <p className="text-[11px] text-white/25 text-center py-2 font-[Vazirmatn]">استودیویی پیدا نشد</p>
        )}
      </div>
    </div>
  );
}
