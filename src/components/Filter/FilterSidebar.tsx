import { SlidersHorizontal, Layers, Tag, Building2, Volume2, Calendar, ArrowUpDown } from 'lucide-react';
import { FilterSection } from './FilterSection';
import { FilterPill } from './FilterPill';
import { FilterCheckbox } from './FilterCheckbox';
import { GenreList } from './GenreList';
import { StudioSearch } from './StudioSearch';
import { YearRangeSlider } from './YearRangeSlider';
import { SortOptions } from './SortOptions';
import type { FilterState, ContentType, Genre, Studio, AudioSubtitle, SortOption } from '../../types/filter.types';

interface Props {
  filters: FilterState;
  onToggleContentType: (ct: ContentType) => void;
  onToggleGenre: (g: Genre) => void;
  onToggleStudio: (s: Studio) => void;
  onToggleAudio: (a: AudioSubtitle) => void;
  onYearChange: (range: [number, number]) => void;
  onSortChange: (sort: SortOption) => void;
  onClearAll: () => void;
  activeCount: number;
}

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'series', label: 'سریال انیمه' },
  { value: 'movie', label: 'فیلم انیمه' },
  { value: 'ova', label: 'OVA' },
  { value: 'ona', label: 'ONA' },
  { value: 'special', label: 'ویژه' },
];

const AUDIO_TYPES: { value: AudioSubtitle; label: string }[] = [
  { value: 'subbed', label: 'زیرنویس' },
  { value: 'dubbed', label: 'دوبله' },
  { value: 'persian-dub', label: 'دوبله فارسی' },
  { value: 'persian-sub', label: 'زیرنویس فارسی' },
  { value: 'japanese', label: 'ژاپنی' },
  { value: 'english-dub', label: 'دوبله انگلیسی' },
];

export function FilterSidebar({
  filters,
  onToggleContentType,
  onToggleGenre,
  onToggleStudio,
  onToggleAudio,
  onYearChange,
  onSortChange,
  onClearAll,
  activeCount,
}: Props) {
  return (
    <div dir="rtl" className="w-[260px] shrink-0 rounded-2xl p-4 space-y-1 sticky top-24"
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
      }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-purple-400" />
          <span className="text-[14px] font-bold font-[Vazirmatn]"
            style={{ color: 'var(--text-primary)' }}>
            فیلتر جستجو
          </span>
        </div>
        {activeCount > 0 && (
          <button onClick={onClearAll}
            className="text-[11px] hover:text-red-400 transition-colors font-[Vazirmatn]"
            style={{ color: 'var(--text-muted)' }}>
            پاک کردن همه
          </button>
        )}
      </div>

      <FilterSection title="نوع محتوا" icon={<Layers size={14} />} defaultOpen>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map(ct => (
            <FilterPill key={ct.value} label={ct.label} active={filters.contentTypes.includes(ct.value)} onClick={() => onToggleContentType(ct.value)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="ژانرها" icon={<Tag size={14} />}>
        <GenreList selected={filters.genres} onToggle={onToggleGenre} />
      </FilterSection>

      <FilterSection title="استودیو" icon={<Building2 size={14} />} defaultOpen>
        <StudioSearch selected={filters.studios} onToggle={onToggleStudio} />
      </FilterSection>

      <FilterSection title="صدا و زیرنویس" icon={<Volume2 size={14} />}>
        <div className="space-y-2">
          {AUDIO_TYPES.map(a => (
            <FilterCheckbox key={a.value} label={a.label} checked={filters.audioSubtitle.includes(a.value)} onChange={() => onToggleAudio(a.value)} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="بازه سال" icon={<Calendar size={14} />}>
        <YearRangeSlider value={filters.yearRange} onChange={onYearChange} />
      </FilterSection>

      <FilterSection title="مرتب‌سازی" icon={<ArrowUpDown size={14} />} defaultOpen>
        <SortOptions value={filters.sortBy} onChange={onSortChange} />
      </FilterSection>
    </div>
  );
}
