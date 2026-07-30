import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function FilterSection({ title, icon, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="pt-3 pb-2" style={{ borderTop: '1px solid var(--border-color)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <span className="text-purple-400/70">{icon}</span>
          <span
            className="text-[13px] font-semibold transition-colors font-[Vazirmatn]"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
