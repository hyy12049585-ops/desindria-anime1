// comment.types.ts

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  entityType: 'music' | 'news';
  entityId: string;
  content: string;
  createdAt: string;
  replies: Reply[]; // پاسخ‌های تودرتو
  likes: string[]; // آرایه ای از userIdهای لایک شده
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  replies?: Reply[]; // در صورت نیاز به nested replies عمیق‌تر
  likes: string[];
}
