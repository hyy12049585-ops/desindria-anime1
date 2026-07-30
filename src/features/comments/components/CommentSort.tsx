// src/components/comments/CommentSort.tsx
import React from 'react';
import { Flame, Newest, TrendingUp } from 'lucide-react';
import { toPersianNumber } from './utils';

export type SortOption = 'newest' | 'popular' | 'controversial';

interface CommentSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalComments: number;
  theme?: 'light' | 'dark';
}

const CommentSort: React.FC<CommentSortProps> = ({
  sortBy,
  onSortChange,
  totalComments,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  const sortOptions = [
    {
      id: 'newest',
      label: 'جدیدترین',
      icon: Newest,
      description: 'مرتب‌سازی بر اساس جدیدترین نظرات',
    },
    {
      id: 'popular',
      label: 'محبوب‌ترین',
      icon: Flame,
      description: 'مرتب‌سازی بر اساس بیشترین لایک',
    },
    {
      id: 'controversial',
      label: 'جنجالی‌ترین',
      icon: TrendingUp,
      description: 'مرتب‌سازی بر اساس بیشترین بحث',
    },
  ];

  return (
    <div className="comment-sort mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isDark ? 'bg-purple-500/10' : 'bg-purple-100'
          }`}>
            <span className={`text-lg ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              💬
            </span>
          </div>
          
          <div>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              نظرات کاربران
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {toPersianNumber(totalComments)} دیدگاه ثبت شده
            </p>
          </div>
        </div>
        
        <div className={`flex w-fit items-center gap-1 rounded-2xl p-1 ${
          isDark ? 'bg-white/5' : 'bg-gray-100'
        }`}>
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = sortBy === option.id;
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSortChange(option.id as SortOption)}
                className={`group relative flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? isDark
                      ? 'bg-white/10 text-purple-300 shadow-sm'
                      : 'bg-white text-purple-600 shadow-lg shadow-purple-100'
                    : isDark
                    ? 'text-gray-400 hover:text-purple-300'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
                title={option.description}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
                
                {/* افکت فعال */}
                {isActive && (
                  <div className={`absolute inset-0 rounded-xl border ${
                    isDark ? 'border-purple-400/30' : 'border-purple-200'
                  }`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentSort;
