import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';

const ReviewsTab: React.FC = () => {
  const { reviews, removeReview, updateReview } = useUserStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(5);

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">✍️</span>
        <h3 className="text-xl font-bold text-white mb-2">نقدی ننوشتی!</h3>
        <p className="text-gray-400 text-sm">
          نظرت رو درباره انیمه‌ها بنویس تا اینجا نشون داده بشه
        </p>
      </div>
    );
  }

  const startEdit = (review: { animeId: string; text: string; rating: number }) => {
    setEditingId(review.animeId);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const saveEdit = (animeId: string) => {
   updateReview(animeId, { text: editText.trim(), rating: editRating });

    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const renderStars = (rating: number, interactive = false, onChange?: (r: number) => void) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            className={`text-lg transition-all ${
              interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'
            } ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400" dir="rtl">
        {reviews.length} نقد
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.animeId}
            className="rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
            dir="rtl"
          >
            {/* Review Header */}
            <div className="flex gap-4 p-4">
              {/* Cover */}
              <div className="w-16 h-22 sm:w-20 sm:h-28 rounded-lg overflow-hidden flex-shrink-0">
                {review.animeCover ? (
                  <img
                    src={review.animeCover}
                    alt={review.animeName}
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
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-white truncate">
                    {review.animeName}
                  </h4>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(review)}
                      className="text-gray-500 hover:text-blue-400 transition text-sm"
                      title="ویرایش"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => removeReview(review.animeId)}
                      className="text-gray-500 hover:text-red-400 transition text-sm"
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Stars */}
                <div className="mt-1">
                  {editingId === review.animeId
                    ? renderStars(editRating, true, setEditRating)
                    : renderStars(review.rating)}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.date).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>

            {/* Review Body */}
            <div className="px-4 pb-4">
              {editingId === review.animeId ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none text-sm"
                    dir="rtl"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {editText.length}/500
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(review.animeId)}
                        disabled={!editText.trim()}
                        className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs transition disabled:opacity-50"

                      >
                        ذخیره
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-xs transition"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {review.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
