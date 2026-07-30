import { Check } from 'lucide-react';

interface Props {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function FilterCheckbox({ label, checked, onChange }: Props) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center gap-2.5 group py-0.5"
    >
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
          checked
            ? 'bg-purple-500 border-purple-500'
            : ''
        }`}
        style={
          !checked
            ? { borderColor: 'var(--border-color)' }
            : undefined
        }
      >
        {checked && <Check size={10} className="text-white" />}
      </div>
      <span
        className="text-[12px] transition-colors font-[Vazirmatn]"
        style={{ color: checked ? 'var(--text-primary)' : 'var(--text-secondary)' }}
      >
        {label}
      </span>
    </button>
  );
}
