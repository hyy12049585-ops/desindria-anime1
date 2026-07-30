// src/components/comments/CommentStats.tsx
import React from 'react';
import { CommentItemType } from './types';
import { toPersianNumber } from './utils';
import { MessageCircle, ThumbsUp, Users } from 'lucide-react';

interface CommentStatsProps {
  comments: CommentItemType[];
  totalLikes: number;
  totalComments: number;
  theme?: 'light' | 'dark';
}

const CommentStats: React.FC<CommentStatsProps> = ({
  comments,
  totalLikes,
  totalComments,
  theme = 'light',
}) => {
  // محاسبه تعداد پاسخ‌ها
  const countReplies = (commentsList: CommentItemType[]): number => {
    return commentsList.reduce((total, comment) => {
      return total + comment.replies.length + countReplies(comment.replies);
    }, 0);
  };

  const totalReplies = countReplies(comments);
  const totalInteractions = totalComments + totalReplies;

  const isDark = theme === 'dark';

  const stats = [
    {
      icon: MessageCircle,
      label: 'دیدگاه‌ها',
      value: totalComments,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      darkColor: 'text-purple-400',
      darkBgColor: 'bg-purple-500/10',
    },
    {
      icon: Users,
      label: 'پاسخ‌ها',
      value: totalReplies,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      darkColor: 'text-blue-400',
      darkBgColor: 'bg-blue-500/10',
    },
    {
      icon: ThumbsUp,
      label: 'لایک‌ها',
      value: totalLikes,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      darkColor: 'text-green-400',
      darkBgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="comment-stats mb-8">
      <div className={`rounded-3xl border p-6 ${
        isDark 
          ? 'border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent' 
          : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
      }`}>
        <h3 className={`mb-6 text-xl font-black ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          📊 آمار تعاملات
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] ${
                isDark ? stat.darkBgColor : stat.bgColor
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  isDark ? 'bg-white/10' : 'bg-white/80'
                }`}>
                  <stat.icon className={`h-6 w-6 ${isDark ? stat.darkColor : stat.color}`} />
                </div>
                
                <div>
                  <p className={`text-2xl font-black ${
                    isDark ? stat.darkColor : stat.color
                  }`}>
                    {toPersianNumber(stat.value)}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                </div>
              </div>
              
              <div className="h-2 overflow-hidden rounded-full bg-white/50">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isDark ? stat.darkColor.replace('text-', 'bg-') : stat.color.replace('text-', 'bg-')
                  }`}
                  style={{ width: `${Math.min((stat.value / Math.max(totalInteractions, 1)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className={`mt-6 rounded-xl border p-4 ${
          isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white'
        }`}>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            در مجموع{' '}
            <span className="font-black text-purple-600 dark:text-purple-400">
              {toPersianNumber(totalInteractions)}
            </span>{' '}
            تعامل در این پست ثبت شده است.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentStats;
