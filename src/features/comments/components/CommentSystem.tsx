import { useState, useCallback } from "react";
import type {
  CommentItemType,
  CommentSystemProps,
} from "../types/comments";
import {
  updateCommentInTree,
  toggleLike,
  toggleDislike,
} from "../utils/commentTree";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import "./CommentSystem.css";
export default function CommentSystem({
  targetId,
  targetType,
  currentUser,
  initialComments = [],
  title = "دیدگاه کاربران",
  placeholder = "نظر خود را بنویسید...",
  allowReplies = true,
  allowLikes = true,
  allowEditing = true,
  allowDeletion = true,
  maxDepth = 3,
  theme = "dark",
  onAuthRequired,
}: CommentSystemProps) {
  const [comments, setComments] = useState<CommentItemType[]>(initialComments);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
const isLoggedIn = Boolean(currentUser?.id && currentUser.isAuthenticated);
// 🔒 helper چک کردن لاگین
  const requireAuth = useCallback((): boolean => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return false;
    }
    return true;
  }, [isLoggedIn, onAuthRequired]);
// ─── ارسال کامنت جدید ────────────────────────────
  const handleNewComment = useCallback(
    (body: string) => {
      if (!requireAuth() || !currentUser) return;
const newComment: CommentItemType = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        body,
        createdAt: new Date().toISOString(),
        author: currentUser,
        parentId: null,
        likes: [],
        dislikes: [],
        replies: [],
        pageId: targetId,
        pageType: targetType,
      };
setComments((prev) => [newComment, ...prev]);
    },
    [requireAuth, currentUser, targetId, targetType]
  );
// ─── ارسال پاسخ ──────────────────────────────────
  const handleReply = useCallback(
    (parentId: string, body: string) => {
      if (!requireAuth() || !currentUser) return;
const reply: CommentItemType = {
        id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        body,
        createdAt: new Date().toISOString(),
        author: currentUser,
        parentId,
        likes: [],
        dislikes: [],
        replies: [],
        pageId: targetId,
        pageType: targetType,
      };
setComments((prev) =>
        updateCommentInTree(prev, parentId, (c) => ({
          ...c,
          replies: [reply, ...c.replies],
        }))
      );
    },
    [requireAuth, currentUser, targetId, targetType]
  );
// ─── لایک (با محافظت از دو بار صدا زدن) ─────────
  const handleLike = useCallback(
    (commentId: string) => {
      if (!requireAuth() || !currentUser) return;
// 🛡️ جلوگیری از دو بار اجرا شدن
      if (pendingIds.has(commentId)) return;
setPendingIds((prev) => new Set(prev).add(commentId));
setComments((prev) =>
        updateCommentInTree(prev, commentId, (c) =>
          toggleLike(c, currentUser.id)
        )
      );
// آزاد کردن قفل بعد از یک تیک
      setTimeout(() => {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }, 300);
    },
    [requireAuth, currentUser, pendingIds]
  );
const handleDislike = useCallback(
    (commentId: string) => {
      if (!requireAuth() || !currentUser) return;
      if (pendingIds.has(commentId)) return;
setPendingIds((prev) => new Set(prev).add(commentId));
setComments((prev) =>
        updateCommentInTree(prev, commentId, (c) =>
          toggleDislike(c, currentUser.id)
        )
      );
setTimeout(() => {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
      }, 300);
    },
    [requireAuth, currentUser, pendingIds]
  );
// ─── ویرایش ──────────────────────────────────────
  const handleEdit = useCallback(
    (commentId: string, newBody: string) => {
      if (!requireAuth()) return;
setComments((prev) =>
        updateCommentInTree(prev, commentId, (c) => ({
          ...c,
          body: newBody,
          isEdited: true,
          editedAt: new Date().toISOString(),
        }))
      );
    },
    [requireAuth]
  );
// ─── حذف ─────────────────────────────────────────
  const deleteFromTree = (
    list: CommentItemType[],
    id: string
  ): CommentItemType[] =>
    list
      .filter((c) => c.id !== id)
      .map((c) => ({ ...c, replies: deleteFromTree(c.replies, id) }));
const handleDelete = useCallback(
    (commentId: string) => {
      if (!requireAuth()) return;
      setComments((prev) => deleteFromTree(prev, commentId));
    },
    [requireAuth]
  );
// ─── مرتب‌سازی ───────────────────────────────────
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return b.likes.length - a.likes.length;
  });
return (
    <section className={`comment-system theme-${theme}`} dir="rtl">
      <header className="comment-system-header">
        <h3 className="comment-system-title">
          {title}
          <span className="comment-count">({comments.length})</span>
        </h3>
<div className="comment-sort">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="comment-sort-select"
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="popular">محبوب‌ترین</option>
          </select>
        </div>
      </header>
{/* فرم اصلی */}
      <CommentForm
        currentUser={currentUser}
        placeholder={placeholder}
        onSubmit={handleNewComment}
        onAuthRequired={onAuthRequired}
      />
{/* لیست کامنت‌ها */}
      <div className="comment-list">
        {sortedComments.length === 0 ? (
          <div className="comment-empty">
            <p>هنوز نظری ثبت نشده. اولین نفر باشید!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              depth={0}
              maxDepth={maxDepth}
              allowReplies={allowReplies}
              allowLikes={allowLikes}
              allowEditing={allowEditing}
              allowDeletion={allowDeletion}
              onReply={handleReply}
              onLike={handleLike}
              onDislike={handleDislike}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAuthRequired={onAuthRequired}
            />
          ))
        )}
      </div>
    </section>
  );
}
