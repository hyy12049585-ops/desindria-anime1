// src/components/ui/SkeletonLoader.tsx
import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  lines = 1,
}) => {
  const baseClass = "bg-white/5 animate-pulse";

  const variants = {
    text: "h-4 rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
    card: "rounded-2xl",
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} ${variants.text}`}
            style={{
              ...style,
              width: i === lines - 1 ? "70%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

// لودر اسکلتی کارت انیمه
export const AnimeCardSkeleton: React.FC = () => (
  <div className="rounded-2xl bg-white/5 overflow-hidden">
    <Skeleton variant="rectangular" className="w-full aspect-[3/4]" />
    <div className="p-3 space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

// لودر صفحه پروفایل
export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 p-6">
    {/* هدر */}
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={80} height={80} />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" className="w-40" />
        <Skeleton variant="text" className="w-24" />
      </div>
    </div>
    {/* کارت‌ها */}
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} variant="card" className="h-24" />
      ))}
    </div>
    {/* محتوا */}
    <Skeleton variant="rectangular" className="w-full h-64" />
  </div>
);

export default Skeleton;
