// src/utils/commentHelpers.ts
import { CommentAuthor, CommentItem } from '../types/comment.types';

export const toPersianNumber = (num: number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'همین الان';
  if (diffMins < 60) return `${toPersianNumber(diffMins)} دقیقه پیش`;
  if (diffHours < 24) return `${toPersianNumber(diffHours)} ساعت پیش`;
  if (diffDays < 30) return `${toPersianNumber(diffDays)} روز پیش`;
  
  return new Date(dateString).toLocaleDateString('fa-IR');
};

export const normalizeAuthor = (data: any): CommentAuthor | null => {
  if (!data) return null;
  
  return {
    id: data.id || data.userId || data._id || 'guest',
    name: data.name || data.fullName || data.displayName || data.username || 'کاربر مهمان',
    avatar: data.avatar || data.profilePicture || data.image || undefined,
    username: data.username || data.userName || undefined,
    email: data.email || undefined,
  };
};

export const getCurrentAccount = (): CommentAuthor | null => {
  const storageKeys = [
    'currentAccount',
    'account',
    'user',
    'authUser',
    'profile',
    'loggedInUser',
    'userData',
    'currentUser'
  ];

  for (const key of storageKeys) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        const normalized = normalizeAuthor(parsed);
        if (normalized) return normalized;
      }
    } catch (e) {
      continue;
    }
  }

  return null;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const countAllComments = (comments: CommentItem[]): number => {
  return comments.reduce((total, comment) => {
    return total + 1 + countAllComments(comment.replies);
  }, 0);
};

export const updateReaction = (
  comments: CommentItem[],
  commentId: string,
  userId: string,
  type: 'like' | 'dislike'
): CommentItem[] => {
  return comments.map(comment => {
    if (comment.id === commentId) {
      const likes = [...comment.likes];
      const dislikes = [...comment.dislikes];

      if (type === 'like') {
        const likeIndex = likes.indexOf(userId);
        const dislikeIndex = dislikes.indexOf(userId);
        
        if (likeIndex > -1) {
          likes.splice(likeIndex, 1);
        } else {
          likes.push(userId);
          if (dislikeIndex > -1) {
            dislikes.splice(dislikeIndex, 1);
          }
        }
      } else {
        const dislikeIndex = dislikes.indexOf(userId);
        const likeIndex = likes.indexOf(userId);
        
        if (dislikeIndex > -1) {
          dislikes.splice(dislikeIndex, 1);
        } else {
          dislikes.push(userId);
          if (likeIndex > -1) {
            likes.splice(likeIndex, 1);
          }
        }
      }

      return { ...comment, likes, dislikes };
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateReaction(comment.replies, commentId, userId, type)
      };
    }

    return comment;
  });
};

export const addReplyToComments = (
  comments: CommentItem[],
  parentId: string,
  reply: CommentItem
): CommentItem[] => {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, reply]
      };
    }

    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComments(comment.replies, parentId, reply)
      };
    }

    return comment;
  });
};

export const deleteCommentById = (
  comments: CommentItem[],
  commentId: string
): CommentItem[] => {
  return comments
    .filter(comment => comment.id !== commentId)
    .map(comment => ({
      ...comment,
      replies: deleteCommentById(comment.replies, commentId)
    }));
};
