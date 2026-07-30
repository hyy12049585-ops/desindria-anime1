import { useState, useEffect, useCallback, useRef } from "react";
import {
  getStoredComments,
  saveStoredComments,
  generateCommentId,
  validateCommentContent,
  sanitizeCommentContent,
  canUserPostComment,
  markUserPostedComment,
  getRemainingRateLimitTime,
  sortComments,
  buildCommentTree,
  canReplyToComment,
  recountReplies,
  getCurrentCommentUser,
} from "../utils/commentStorage";
import { CommentEntity, CommentSortType, CommentUser } from "../types/comments";
interface UseCommentsOptions {
  pageType: "news" | "music";
  pageId: string;
  currentUser?: CommentUser | null;
}
interface UseCommentsReturn {
  comments: CommentEntity[];
  commentTree: ReturnType<typeof buildCommentTree>;
  sortType: CommentSortType;
  setSortType: (sort: CommentSortType) => void;
  totalCount: number;
  isSubmitting: boolean;
  submitError: string;
  rateLimitRemaining: number;
  addComment: (content: string, parentId?: string | null) => boolean;
  deleteComment: (commentId: string) => void;
  reactToComment: (commentId: string, reaction: "like" | "dislike") => void;
  canReply: (parentId: string) => boolean;
}
export function useComments({
  pageType,
  pageId,
  currentUser,
}: UseCommentsOptions): UseCommentsReturn {
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [sortType, setSortType] = useState<CommentSortType>("newest");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [rateLimitRemaining, setRateLimitRemaining] = useState(0);
  const isInitialized = useRef(false);
  const rateLimitTimer = useRef<ReturnType<typeof setInterval> | null>(null);
// ✅ بارگذاری کامنت‌ها از localStorage
  useEffect(() => {
    if (!pageId) return;
    const stored = getStoredComments(pageType, pageId);
    const recounted = recountReplies(stored);
    setComments(recounted);
    isInitialized.current = true;
  }, [pageType, pageId]);
// ✅ ذخیره کامنت‌ها در localStorage (فقط بعد از init)
  useEffect(() => {
    if (!isInitialized.current || !pageId) return;
    saveStoredComments(pageType, pageId, comments);
  }, [comments, pageType, pageId]);
// ✅ تایمر rate limit
  useEffect(() => {
    const userId = currentUser?.id ?? "guest";
const remaining = getRemainingRateLimitTime(pageType, pageId, userId);
    setRateLimitRemaining(remaining);
if (remaining > 0) {
      rateLimitTimer.current = setInterval(() => {
        const r = getRemainingRateLimitTime(pageType, pageId, userId);
        setRateLimitRemaining(r);
        if (r <= 0 && rateLimitTimer.current) {
          clearInterval(rateLimitTimer.current);
        }
      }, 1000);
    }
return () => {
      if (rateLimitTimer.current) clearInterval(rateLimitTimer.current);
    };
  }, [pageType, pageId, currentUser?.id]);
// ✅ افزودن کامنت یا پاسخ
  const addComment = useCallback(
    (content: string, parentId: string | null = null): boolean => {
      setSubmitError("");
const validation = validateCommentContent(content);
      if (!validation.valid) {
        setSubmitError(validation.error);
        return false;
      }
const userId = currentUser?.id ?? "guest";
if (!canUserPostComment(pageType, pageId, userId)) {
        const remaining = Math.ceil(
          getRemainingRateLimitTime(pageType, pageId, userId) / 1000
        );
        setSubmitError(`لطفاً ${remaining} ثانیه صبر کنید.`);
        return false;
      }
if (parentId && !canReplyToComment(comments, parentId)) {
        setSubmitError("حداکثر عمق پاسخ‌دهی رعایت نشده.");
        return false;
      }
setIsSubmitting(true);
const author: CommentUser = currentUser ?? {
        id: "guest",
        name: "کاربر مهمان",
        avatar: undefined,
      };
const newComment: CommentEntity = {
        id: generateCommentId(),
        content: sanitizeCommentContent(content),
        pageId,
        pageType,
        createdAt: new Date().toISOString(),
        author,
        parentId,
        likes: 0,
        dislikes: 0,
        reactions: {},
        repliesCount: 0,
      };
setComments((prev) => {
        const updated = [...prev, newComment];
        return recountReplies(updated);
      });
markUserPostedComment(pageType, pageId, userId);
// ✅ شروع تایمر rate limit
      setRateLimitRemaining(10000);
      rateLimitTimer.current = setInterval(() => {
        const r = getRemainingRateLimitTime(pageType, pageId, userId);
        setRateLimitRemaining(r);
        if (r <= 0 && rateLimitTimer.current) {
          clearInterval(rateLimitTimer.current);
        }
      }, 1000);
setIsSubmitting(false);
      return true;
    },
    [comments, currentUser, pageType, pageId]
  );
// ✅ حذف کامنت (فقط توسط صاحب کامنت)
  const deleteComment = useCallback(
    (commentId: string) => {
      const userId = currentUser?.id ?? "guest";
setComments((prev) => {
        const target = prev.find((c) => c.id === commentId);
        if (!target) return prev;
        if (target.author.id !== userId) return prev;
// حذف کامنت و تمام فرزندانش
        const idsToDelete = new Set<string>();
        const collectIds = (id: string) => {
          idsToDelete.add(id);
          prev
            .filter((c) => c.parentId === id)
            .forEach((child) => collectIds(child.id));
        };
        collectIds(commentId);
const updated = prev.filter((c) => !idsToDelete.has(c.id));
        return recountReplies(updated);
      });
    },
    [currentUser?.id]
  );
// ✅ لایک / دیسلایک
  const reactToComment = useCallback(
    (commentId: string, reaction: "like" | "dislike") => {
      const userId = currentUser?.id ?? "guest";
setComments((prev) =>
        prev.map((comment) => {
          if (comment.id !== commentId) return comment;
const currentReaction = comment.reactions[userId];
          const updatedReactions = { ...comment.reactions };
let likes = comment.likes;
          let dislikes = comment.dislikes;
if (currentReaction === reaction) {
            // ✅ toggle off
            delete updatedReactions[userId];
            if (reaction === "like") likes = Math.max(0, likes - 1);
            else dislikes = Math.max(0, dislikes - 1);
          } else {
            // ✅ تغییر یا افزودن reaction
            if (currentReaction === "like") likes = Math.max(0, likes - 1);
            if (currentReaction === "dislike")
              dislikes = Math.max(0, dislikes - 1);
updatedReactions[userId] = reaction;
            if (reaction === "like") likes += 1;
            else dislikes += 1;
          }
return {
            ...comment,
            likes,
            dislikes,
            reactions: updatedReactions,
          };
        })
      );
    },
    [currentUser?.id]
  );
const canReply = useCallback(
    (parentId: string) => canReplyToComment(comments, parentId),
    [comments]
  );
const sorted = sortComments(comments, sortType);
  const commentTree = buildCommentTree(sorted);
return {
    comments,
    commentTree,
    sortType,
    setSortType,
    totalCount: comments.length,
    isSubmitting,
    submitError,
    rateLimitRemaining,
    addComment,
    deleteComment,
    reactToComment,
    canReply,
  };
}
