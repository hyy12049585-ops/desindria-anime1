interface SectionTitleProps {
  title: string;
}

export function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="mb-3 text-xl font-semibold text-[--color-text-primary]">
      {title}
    </h2>
  );
}
