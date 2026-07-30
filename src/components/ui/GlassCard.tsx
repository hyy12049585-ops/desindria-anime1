import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  neon?: "cyan" | "pink" | "purple";
  hover?: boolean;
}

export function GlassCard({ children, className, neon = "cyan", hover = true }: Props) {
  const neonMap = {
    cyan: "neon-border hover:neon-glow-cyan",
    pink: "neon-border-pink hover:shadow-pink-500/10",
    purple: "border-purple-500/20 hover:neon-glow-purple",
  };

  return (
    <div className={cn(
      "glass rounded-2xl transition-all duration-300",
      hover && neonMap[neon],
      className
    )}>
      {children}
    </div>
  );
}
