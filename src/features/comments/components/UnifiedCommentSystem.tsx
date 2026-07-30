// src/components/comments/UnifiedCommentSystem.tsx
import React, { useState, useEffect, useCallback } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import type { CommentAuthor, CommentItemType } from '../types/comments';

interface UnifiedCommentSystemProps {
  contentId: string; // ID خبر یا موزیک
  contentType: 'news' | 'music'; // نوع محتوا
  currentUser: CommentAuthor; // کاربر فعلی از سیستم احراز هویت
  initialComments?: CommentItemType[]; // کامنت‌های اولیه
  onCommentsChange?: (comments: CommentItemType[]) => void; // کالبک برای تغییرات
}

const UnifiedCommentSystem: React.FC<UnifiedCommentSystemProps> = ({
  contentId,
  contentType,
  currentUser,
  initialComments = [],
  onCommentsChange,
}) => {
  const [comments, setComments] = useState<CommentItemType[]>(initialComments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // کلید ذخیره‌سازی در localStorage
  const storageKey = `${contentType}-${contentId}-comments`;

  // بارگذاری کامنت‌ها از localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setComments(parsed);
      } else {
        setComments(initialComments);
      }
    } catch (err) {
      console.error('خطا در بارگذاری کامنت‌ها:', err);
      setComments(initialComments);
    }
  }, [contentId, contentType, initialComments, storageKey]);

  // ذخیره کامنت‌ها در localStorage
  useEffect(() => {
    if (comments.length > 0 || initialComments.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(comments));
      onCommentsChange?.(comments);
    }
  }, [comments, storageKey, onCommentsChange, initialComments]);

  // افزودن کامنت جدید
  const handleAddComment = useCallback(async (body: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const newComment: CommentItemType = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        body: body.trim(),
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          email: currentUser.email,
        },
        createdAt: new Date().toISOString(),
        likes: [],
        dislikes: [],
        replies: [],
      };

      setComments(prev => [newComment, ...prev]);
      
      // در اینجا می‌تونی API call اضافه کنی
      // await api.addComment(contentType, contentId, newComment);
      
    } catch (err) {
      setError('خطا در ارسال دیدگاه');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [contentId, contentType, currentUser]);

  // لایک کامنت
  const handleLike = useCallback(async (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const userId = String(currentUser.id);
        const hasLiked = comment.likes.includes(userId);
        
        return {
          ...comment,
          likes: hasLiked 
            ? comment.likes.filter(id => id !== userId)
            : [...comment.likes, userId],
          dislikes: comment.dislikes.filter(id => id !== userId), // حذف دیسلایک اگر وجود داشت
        };
      }
      
      // بررسی پاسخ‌ها
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? {
                  ...reply,
                  likes: reply.likes.includes(String(currentUser.id))
                    ? reply.likes.filter(id => id !== String(currentUser.id))
                    : [...reply.likes, String(currentUser.id)],
                  dislikes: reply.dislikes.filter(id => id !== String(currentUser.id)),
                }
              : reply
          ),
        };
      }
      
      return comment;
    }));
  }, [currentUser.id]);

  // دیسلایک کامنت
  const handleDislike = useCallback(async (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const userId = String(currentUser.id);
        const hasDisliked = comment.dislikes.includes(userId);
        
        return {
          ...comment,
          dislikes: hasDisliked 
            ? comment.dislikes.filter(id => id !== userId)
            : [...comment.dislikes, userId],
          likes: comment.likes.filter(id => id !== userId), // حذف لایک اگر وجود داشت
        };
      }
      
      // بررسی پاسخ‌ها
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId 
              ? {
                  ...reply,
                  dislikes: reply.dislikes.includes(String(currentUser.id))
                    ? reply.dislikes.filter(id => id !== String(currentUser.id))
                    : [...reply.dislikes, String(currentUser.id)],
                  likes: reply.likes.filter(id => id !== String(currentUser.id)),
                }
              : reply
          ),
        };
      }
      
      return comment;
    }));
  }, [currentUser.id]);

  // پاسخ به کامنت
  const handleReply = useCallback(async (commentId: string, replyText: string) => {
    const newReply: CommentItemType = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      body: replyText.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        email: currentUser.email,
      },
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: [],
      replies: [],
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      
      // بررسی پاسخ‌های تودرتو
      const updateReplies = (replies: CommentItemType[]): CommentItemType[] => {
        return replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              replies: [...(reply.replies || []), newReply],
            };
          }
          if (reply.replies && reply.replies.length > 0) {
            return {
              ...reply,
              replies: updateReplies(reply.replies),
            };
          }
          return reply;
        });
      };

      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateReplies(comment.replies),
        };
      }
      
      return comment;
    }));
  }, [currentUser]);

  // حذف کامنت
  const handleDelete = useCallback(async (commentId: string) => {
    const confirmDelete = window.confirm('آیا از حذف این دیدگاه مطمئن هستید؟');
    if (!confirmDelete) return;

    const deleteComment = (commentsList: CommentItemType[]): CommentItemType[] => {
      return commentsList
        .filter(comment => comment.id !== commentId)
        .map(comment => ({
          ...comment,
          replies: comment.replies ? deleteComment(comment.replies) : [],
        }));
    };

    setComments(prev => deleteComment(prev));
  }, []);

  return (
    <div className="unified-comment-system">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          دیدگاه‌ها
        </h2>
        <p className="text-gray-600">
          نظرات خود را با دیگران به اشتراک بگذارید
        </p>
      </div>

      {/* فرم ارسال کامنت */}
      <div className="mb-8">
        <CommentForm
          currentAccount={currentUser}
          onSubmit={handleAddComment}
          placeholder="دیدگاه خود را بنویسید..."
          submitLabel={isLoading ? 'در حال ارسال...' : 'ارسال دیدگاه'}
        />
      </div>

      {/* نمایش خطا */}
      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* لیست کامنت‌ها */}
      <CommentList
        comments={comments}
        currentAccount={currentUser}
        onLike={handleLike}
        onDislike={handleDislike}
        onReply={handleReply}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UnifiedCommentSystem;
