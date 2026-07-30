// src/components/ui/EmptyState.tsx
import React from "react";
import { PackageOpen, Plus } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      {/* آیکون */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 
          border border-white/5 flex items-center justify-center backdrop-blur-sm">
          {icon || <PackageOpen className="w-10 h-10 text-violet-400/60" />}
        </div>
        {/* گلو افکت */}
        <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-violet-500/5 blur-xl" />
      </div>

      {/* متن */}
      <h3 className="text-lg font-bold text-white/90 mb-2 text-center">{title}</h3>
      {description && (
        <p className="text-sm text-white/40 text-center max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}

      {/* دکمه اکشن */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-violet-600 to-fuchsia-600 
            hover:from-violet-500 hover:to-fuchsia-500
            text-white text-sm font-medium
            transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25
            active:scale-95"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
