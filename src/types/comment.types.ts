// src/types/comment.types.ts
export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  username?: string;
  email?: string;
}

export interface CommentItem {
  id: string;
  author: CommentAuthor;
  body: string;
  createdAt: string;
  likes: string[]; // آرایه آیدی کاربرانی که لایک کردند
  dislikes: string[]; // آرایه آیدی کاربرانی که دیس‌لایک کردند
  replies: CommentItem[];
}

export interface CommentSystemProps {
  targetType: 'music' | 'news';
  targetId: string;
  title?: string;
  currentAccount?: CommentAuthor;
}
