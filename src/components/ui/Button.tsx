import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "neon";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", children, icon, className, ...props }: Props) {
  const base = "inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-300 cursor-pointer";

  const variants = {
    primary: "bg-gradient-to-l from-purple-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02]",
    secondary: "border border-cyan-500/30 text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:shadow-lg hover:shadow-cyan-500/10",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
    neon: "relative overflow-hidden border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3",
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
