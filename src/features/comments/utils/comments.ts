// src/features/comments/types/comments.ts
export type CommentSortType = "newest" | "oldest" | "popular";
// ─── Author (یکی برای همه) ────────────────────────────────
export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string | null;
  email?: string;
  role?: "user" | "premium" | "admin";
  isAuthenticated?: boolean;
}
// ─── API Response ─────────────────────────────────────────
export interface CommentEntity {
  id: string;
  content: string;
  pageId: string;
  pageType: "news" | "music";
  createdAt: string;
  updatedAt?: string;
  author: CommentAuthor;
  parentId: string | null;
  likes: number;
  dislikes: number;
  reactions: Record<string, "like" | "dislike">;
  repliesCount: number;
}
// ─── UI Type ──────────────────────────────────────────────
export interface CommentItemType {
  id: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  author: CommentAuthor;
  parentId?: string | null;
  likes: string[];
  dislikes: string[];
  replies: CommentItemType[];
  isEdited?: boolean;
  editedAt?: string;
  pageId?: string;
  pageType?: "news" | "music";
}
// ─── Component Props ──────────────────────────────────────
export interface CommentSystemProps {
  targetId: string;
  targetType: "news" | "music";
  currentUser: CommentAuthor;
  initialComments?: CommentItemType[];
  title?: string;
  placeholder?: string;
  allowReplies?: boolean;
  allowLikes?: boolean;
  allowEditing?: boolean;
  allowDeletion?: boolean;
  maxDepth?: number;
  theme?: "light" | "dark";
}
