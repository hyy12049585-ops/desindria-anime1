// src/features/comments/services/commentStorage.ts
import { Comment, Reply } from "../types/comment.types";

const STORAGE_KEY = "desindria_comments";

function loadAll(): Comment[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAll(comments: Comment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export const commentStorage = {
  // گرفتن کامنت‌های یک content
  getComments(entityType: "music" | "news", entityId: string): Comment[] {
    const comments = loadAll();
    return comments.filter(
      (c) => c.entityType === entityType && c.entityId === entityId
    );
  },

  // اضافه کردن کامنت جدید
  addComment(comment: Comment) {
    const comments = loadAll();
    comments.push(comment);
    saveAll(comments);
    return comment;
  },

  // لایک / آنلایک کامنت
  toggleLike(commentId: string, userId: string) {
    const comments = loadAll();

    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
    } else {
      comment.likes.push(userId);
    }

    saveAll(comments);
    return comment;
  },

  // اضافه کردن reply
  addReply(parentCommentId: string, reply: Reply) {
    const comments = loadAll();

    const comment = comments.find((c) => c.id === parentCommentId);
    if (!comment) return;

    comment.replies.push(reply);
    saveAll(comments);
    return reply;
  },

  // nested reply (reply در reply)
  addNestedReply(
    parentCommentId: string,
    targetReplyId: string,
    newReply: Reply
  ) {
    const comments = loadAll();

    const comment = comments.find((c) => c.id === parentCommentId);
    if (!comment) return;

    function findAndInsert(target: Reply[]): boolean {
      for (let r of target) {
        if (r.id === targetReplyId) {
          r.replies = r.replies || [];
          r.replies.push(newReply);
          return true;
        }
        if (r.replies && findAndInsert(r.replies)) {
          return true;
        }
      }
      return false;
    }

    findAndInsert(comment.replies);
    saveAll(comments);
    return newReply;
  },

  // لایک در سطوح تو در تو
  toggleReplyLike(commentId: string, replyId: string, userId: string) {
    const comments = loadAll();
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    function findAndToggle(replies: Reply[]): boolean {
      for (let r of replies) {
        if (r.id === replyId) {
          if (r.likes.includes(userId)) {
            r.likes = r.likes.filter((id) => id !== userId);
          } else {
            r.likes.push(userId);
          }
          return true;
        }
        if (r.replies && findAndToggle(r.replies)) return true;
      }
      return false;
    }

    findAndToggle(comment.replies);
    saveAll(comments);
  },

  // ابزار توسعه - پاکسا
  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
