// src/components/comments/utils.ts
import { CommentAuthor, CommentItemType } from '../types/types';

// تبدیل اعداد به فارسی
export const toPersianNumber = (value: number | string): string => {
  const str = String(value);
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

// گرفتن متن اول برای آواتار
export const getAvatarText = (name?: string): string => {
  if (!name || name.trim() === '') return 'ک';
  
  const cleaned = name.trim();
  const words = cleaned.split(' ');
  
  if (words.length === 1) {
    return words[0].charAt(0);
  }
  
  return words[0].charAt(0) + words[1].charAt(0);
};

// فرمت تاریخ
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return new Intl.DateTimeFormat('fa-IR', options || defaultOptions).format(dateObj);
  } catch {
    return 'تاریخ نامعتبر';
  }
};

// بررسی مالکیت کامنت
export const isCommentOwner = (commentAuthor: CommentAuthor, currentUser: CommentAuthor): boolean => {
  if (!commentAuthor || !currentUser || !currentUser.id) return false;
  return String(commentAuthor.id) === String(currentUser.id);
};

// تولید ID منحصر به فرد
export const generateId = (): string => {
  return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ذخیره در localStorage
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('خطا در ذخیره‌سازی:', error);
  }
};

// بارگذاری از localStorage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('خطا در بارگذاری:', error);
    return defaultValue;
  }
};

// محاسبه زمان نسبی (مثلاً "۲ ساعت پیش")
export const getRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'همین الان';
  if (diffMins < 60) return `${toPersianNumber(diffMins)} دقیقه پیش`;
  if (diffHours < 24) return `${toPersianNumber(diffHours)} ساعت پیش`;
  if (diffDays < 7) return `${toPersianNumber(diffDays)} روز پیش`;
  
  return formatDate(date);
};
