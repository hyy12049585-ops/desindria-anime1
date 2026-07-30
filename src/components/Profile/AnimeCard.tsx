import React from 'react';

interface AnimeCardProps {
  animeId: string;
  animeName: string;
  animeCover: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  onRemove?: () => void;
  onClick?: () => void;
  actions?: React.ReactNode;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  animeName,
  animeCover,
  subtitle,
  badge,
  badgeColor = 'bg-purple-600',
  onRemove,
  onClick,
  actions,
}) => {
  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {animeCover ? (
          <img
            src={animeCover}
            alt={animeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs rounded-md text-white ${badgeColor}`}>
            {badge}
          </span>
        )}

        {/* Remove button */}
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            ✕
          </button>
        )}

        {/* Actions overlay */}
        {actions && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {actions}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-white truncate" dir="rtl">
          {animeName}
        </h4>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-1 truncate" dir="rtl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnimeCard;
