import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';

const ContinueTab: React.FC = () => {
  const { history, removeHistoryItem, clearHistory } = useUserStore();
  const [showConfirm, setShowConfirm] = useState(false);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">📺</span>
        <h3 className="text-xl font-bold text-white mb-2">تاریخچه‌ای نیست!</h3>
        <p className="text-gray-400 text-sm">
          وقتی انیمه تماشا کنی، اینجا نشون داده میشه
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between" dir="rtl">
        <span className="text-sm text-gray-400">{history.length} مورد</span>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-xs text-red-400 hover:text-red-300 transition"
          >
            پاک کردن همه
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                clearHistory();
                setShowConfirm(false);
              }}
              className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              بله، پاک شود
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition"
            >
              انصراف
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={`${item.animeId}-${item.episode}-${index}`}
            className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            dir="rtl"
          >
            {/* Thumbnail */}
            <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg overflow-hidden flex-shrink-0">
              {item.animeCover ? (
                <img
                  src={item.animeCover}
                  alt={item.animeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-2xl">🎬</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">
                {item.animeName}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                قسمت {item.episode} {item.episodeTitle && `- ${item.episodeTitle}`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.date).toLocaleDateString('fa-IR')}
              </p>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{item.progress}%</span>
                  <span>{item.duration} دقیقه</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeHistoryItem(item.animeId, item.episode)}
              className="self-start text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueTab;
