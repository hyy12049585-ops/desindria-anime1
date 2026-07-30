export type CommentSortType = "newest" | "oldest" | "popular";
export type TargetType = "news" | "music";
export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string | null;
  email?: string;
  role?: "user" | "premium" | "admin";
  isAuthenticated: boolean;
}
/**
 * نوع داخلی کامنت‌ها (که در UI استفاده می‌شه)
 * این همون چیزیه که CommentItem و CommentSystem باهاش کار می‌کنن
 */
export interface CommentItemType {
  id: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  author: CommentAuthor;
  parentId?: string | null;
  likes: string[];        // ← آرایه‌ی userIdهایی که لایک کردن
  dislikes: string[];     // ← آرایه‌ی userIdهایی که دیسلایک کردن
  replies: CommentItemType[];
  isEdited?: boolean;
  editedAt?: string;
  pageId?: string;
  pageType?: TargetType;
}
/**
 * نوع API/Backend (اگر از سرور دیتا میگیری)
 * می‌تونی ازش برای تبدیل استفاده کنی
 */
export interface CommentEntity {
  id: string;
  content: string;
  pageId: string;
  pageType: TargetType;
  createdAt: string;
  updatedAt?: string;
  author: CommentAuthor;
  parentId: string | null;
  likes: number;
  dislikes: number;
  reactions: Record<string, "like" | "dislike">;
  repliesCount: number;
}
export interface CommentSystemProps {
  targetId: string;
  targetType: TargetType;
  currentUser: CommentAuthor | null;
  initialComments?: CommentItemType[];
  title?: string;
  placeholder?: string;
  allowReplies?: boolean;
  allowLikes?: boolean;
  allowEditing?: boolean;
  allowDeletion?: boolean;
  maxDepth?: number;
  theme?: "light" | "dark";
  onAuthRequired?: () => void;
}
