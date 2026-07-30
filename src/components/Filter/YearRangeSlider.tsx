interface Props {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export function YearRangeSlider({ value, onChange }: Props) {
  return (
    <div dir="rtl" className="space-y-3 px-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/50 font-[Vazirmatn]">از: {value[0]}</span>
        <span className="text-[11px] text-white/50 font-[Vazirmatn]">تا: {value[1]}</span>
      </div>
      <div className="space-y-2">
        <input
          type="range"
          min={1990}
          max={2026}
          value={value[0]}
          onChange={e => {
            const v = Number(e.target.value);
            if (v <= value[1]) onChange([v, value[1]]);
          }}
          className="w-full accent-purple-500 h-1.5 bg-[#2a2a35] rounded-full appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={1990}
          max={2026}
          value={value[1]}
          onChange={e => {
            const v = Number(e.target.value);
            if (v >= value[0]) onChange([value[0], v]);
          }}
          className="w-full accent-purple-500 h-1.5 bg-[#2a2a35] rounded-full appearance-none cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/25 font-[Vazirmatn]">
        <span>۱۹۹۰</span>
        <span>۲۰۲۶</span>
      </div>
    </div>
  );
}
