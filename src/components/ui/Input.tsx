import { cn } from "@/utils/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-white/70 text-sm">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 text-sm outline-none focus:border-purple-500 transition-colors",
            error && "border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
