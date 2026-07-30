import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';

const statusLabels: Record<string, string> = {
  completed: 'تکمیل',
  downloading: 'در حال دانلود',
  paused: 'متوقف',
  failed: 'خطا',
};

const statusColors: Record<string, string> = {
  completed: 'text-green-400',
  downloading: 'text-blue-400',
  paused: 'text-yellow-400',
  failed: 'text-red-400',
};

const statusIcons: Record<string, string> = {
  completed: '✅',
  downloading: '⏳',
  paused: '⏸️',
  failed: '❌',
};

const DownloadsTab: React.FC = () => {
  const { downloads, removeDownload, clearDownloads } = useUserStore();
  const [showConfirm, setShowConfirm] = useState(false);

  if (downloads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">💾</span>
        <h3 className="text-xl font-bold text-white mb-2">دانلودی نداری!</h3>
        <p className="text-gray-400 text-sm">
          فایل‌های دانلود شده اینجا نمایش داده میشن
        </p>
      </div>
    );
  }

  const totalSize = downloads.reduce((sum, d) => {
    const num = parseFloat(d.size) || 0;
    return sum + num;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2" dir="rtl">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{downloads.length} فایل</span>
          <span className="text-sm text-gray-500">
            حجم کل: {totalSize.toFixed(1)} MB
          </span>
        </div>
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
                clearDownloads();
                setShowConfirm(false);
              }}
              className="text-xs px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              بله
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 transition"
            >
              نه
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {downloads.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            dir="rtl"
          >
            {/* Thumbnail */}
            <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-lg overflow-hidden flex-shrink-0">
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
                قسمت {item.episode}
              </p>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {/* Quality */}
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs">
                  {item.quality}
                </span>
                {/* Size */}
                <span className="text-xs text-gray-500">
                  {item.size}
                </span>
                {/* Status */}
                <span className={`text-xs flex items-center gap-1 ${statusColors[item.status]}`}>
                  {statusIcons[item.status]} {statusLabels[item.status]}
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                {new Date(item.date).toLocaleDateString('fa-IR')}
              </p>
            </div>

            {/* Remove */}
            <button
              onClick={() => removeDownload(item.id)}
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

export default DownloadsTab;
