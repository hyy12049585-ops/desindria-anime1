import { useState } from 'react';
import { FilterCheckbox } from './FilterCheckbox';
import type { Genre } from '../../types/filter.types';

interface Props {
  selected: Genre[];
  onToggle: (genre: Genre) => void;
}

const ALL_GENRES: { value: Genre; label: string }[] = [
  { value: 'Action', label: 'اکشن' },
  { value: 'Adventure', label: 'ماجراجویی' },
  { value: 'Comedy', label: 'کمدی' },
  { value: 'Drama', label: 'درام' },
  { value: 'Fantasy', label: 'فانتزی' },
  { value: 'Supernatural', label: 'ماوراءطبیعی' },
  { value: 'Mystery', label: 'رمز و راز' },
  { value: 'Psychological', label: 'روانشناختی' },
  { value: 'Thriller', label: 'هیجان‌انگیز' },
  { value: 'Romance', label: 'عاشقانه' },
  { value: 'Sci-Fi', label: 'علمی‌تخیلی' },
  { value: 'Slice of Life', label: 'برش زندگی' },
  { value: 'Horror', label: 'ترسناک' },
  { value: 'Sports', label: 'ورزشی' },
  { value: 'School', label: 'مدرسه‌ای' },
  { value: 'Magic', label: 'جادویی' },
  { value: 'Isekai', label: 'ایسکای' },
  { value: 'Mecha', label: 'مکا' },
  { value: 'Military', label: 'نظامی' },
  { value: 'Music', label: 'موسیقی' },
  { value: 'Historical', label: 'تاریخی' },
  { value: 'Samurai', label: 'سامورایی' },
  { value: 'Martial Arts', label: 'هنرهای رزمی' },
  { value: 'Parody', label: 'پارودی' },
  { value: 'Ecchi', label: 'اچی' },
  { value: 'Seinen', label: 'سینن' },
  { value: 'Shounen', label: 'شونن' },
  { value: 'Shoujo', label: 'شوجو' },
  { value: 'Josei', label: 'جوسی' },
  { value: 'Vampire', label: 'خون‌آشام' },
  { value: 'Demons', label: 'شیاطین' },
  { value: 'Game', label: 'بازی' },
  { value: 'Police', label: 'پلیسی' },
  { value: 'Space', label: 'فضایی' },
  { value: 'Survival', label: 'بقا' },
];

export function GenreList({ selected, onToggle }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? ALL_GENRES : ALL_GENRES.slice(0, 8);

  return (
    <div className="space-y-2">
      {visible.map(g => (
        <FilterCheckbox
          key={g.value}
          label={g.label}
          checked={selected.includes(g.value)}
          onChange={() => onToggle(g.value)}
        />
      ))}
      {ALL_GENRES.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors mt-1 font-[Vazirmatn]"
        >
          {showAll ? 'نمایش کمتر' : `نمایش همه (${ALL_GENRES.length})`}
        </button>
      )}
    </div>
  );
}
