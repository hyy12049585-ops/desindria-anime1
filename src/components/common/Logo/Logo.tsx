import React from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 44, showText = true }) => {
  return (
    <div className="flex items-center gap-3 select-none cursor-pointer group">
      {/* آیکون لوگو */}
      <div
        className="logo-icon relative flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-105"
        style={{
          width: size,
          height: size,
        }}
      >
        {/* مثلث Play با گلو */}
        <svg
          width={size * 0.45}
          height={size * 0.45}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10 drop-shadow-lg"
        >
          <defs>
            <filter id="logoPlayGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="logoPlayGrad" x1="0" y1="0" x2="24" y2="24">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e9d5ff" />
            </linearGradient>
          </defs>
          <path
            d="M7 4.5v15l12-7.5L7 4.5z"
            fill="url(#logoPlayGrad)"
            filter="url(#logoPlayGlow)"
          />
        </svg>

        {/* شاین بالا */}
        <div
          className="absolute top-0 left-0 w-full h-1/2 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
            borderRadius: "inherit",
          }}
        />

        {/* حلقه نئون دور لوگو */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "1px solid rgba(168, 85, 247, 0.3)",
          }}
        />
      </div>

      {/* متن سیندریا */}
      {showText && (
        <span
          className="logo-text transition-all duration-300 group-hover:scale-[1.02]"
          style={{
            fontSize: size * 0.7,
            lineHeight: 1.2,
            fontWeight: 700,
          }}
        >
          سیندریا
        </span>
      )}
    </div>
  );
};

export default Logo;
