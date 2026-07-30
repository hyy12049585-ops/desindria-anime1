interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterPill({ label, active, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border font-[Vazirmatn] ${
        active
          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/10'
          : ''
      }`}
      style={
        !active
          ? {
              background: 'var(--bg-hover)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }
          : undefined
      }
    >
      {label}
    </button>
  );
}
