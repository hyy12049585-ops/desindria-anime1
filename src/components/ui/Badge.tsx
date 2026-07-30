import { cn } from "@/utils/cn";

interface Props {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neon";
  className?: string;
}

export function Badge({ children, variant = "default", className }: Props) {
  const variants = {
    default: "bg-white/10 text-white/70",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    danger: "bg-red-500/20 text-red-400 border border-red-500/30",
    info: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    neon: "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full", variants[variant], className)}>
      {children}
    </span>
  );
}
