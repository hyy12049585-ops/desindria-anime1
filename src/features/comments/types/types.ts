// src/components/comments/types.ts
export interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  isAuthenticated: boolean;
}

export interface CommentItemType {
  id: string;
  body: string;
  author: CommentAuthor;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  replies: CommentItemType[];
  isEdited?: boolean;
  editedAt?: string;
}

export interface CommentSystemProps {
  targetId: string;           // ID خبر یا موزیک
  targetType: 'news' | 'music';
  currentUser: CommentAuthor;
  initialComments?: CommentItemType[];
  title?: string;
  placeholder?: string;
  allowReplies?: boolean;
  allowLikes?: boolean;
  allowEditing?: boolean;
  allowDeletion?: boolean;
  maxDepth?: number;
  theme?: 'light' | 'dark';
}
