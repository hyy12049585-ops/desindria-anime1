// src/features/comments/utils/commentStorage.ts
import { CommentEntity } from "../types/comments";
const MAX_DEPTH = 3;
const RATE_LIMIT_MS = 30_000;
// ✅ این تابع export شده
export function createCommentStorageKey(
  pageType: string,
  pageId: string
): string {
  return `comments_${pageType}_${pageId}`;
}
export function getStoredComments(
  pageType: string,
  pageId: string
): CommentEntity[] {
  try {
    const key = createCommentStorageKey(pageType, pageId);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
export function saveStoredComments(
  pageType: string,
  pageId: string,
  comments: CommentEntity[]
): void {
  try {
    const key = createCommentStorageKey(pageType, pageId);
    localStorage.setItem(key, JSON.stringify(comments));
  } catch {}
}
export function generateCommentId(): string {
  return `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
export function sanitizeCommentContent(content: string): string {
  return content
    .trim()
    .replace(/<[^>]*>/g, "")
    .slice(0, 1000);
}
export function canUserPostComment(
  pageType: string,
  pageId: string,
  userId: string
): boolean {
  try {
    const key = `ratelimit_${pageType}_${pageId}_${userId}`;
    const lastPost = localStorage.getItem(key);
    if (!lastPost) return true;
    return Date.now() - parseInt(lastPost, 10) > RATE_LIMIT_MS;
  } catch {
    return true;
  }
}
export function getRemainingRateLimitTime(
  pageType: string,
  pageId: string,
  userId: string
): number {
  try {
    const key = `ratelimit_${pageType}_${pageId}_${userId}`;
    const lastPost = localStorage.getItem(key);
    if (!lastPost) return 0;
    const elapsed = Date.now() - parseInt(lastPost, 10);
    return Math.max(0, RATE_LIMIT_MS - elapsed);
  } catch {
    return 0;
  }
}
export function markUserPostedComment(
  pageType: string,
  pageId: string,
  userId: string
): void {
  try {
    const key = `ratelimit_${pageType}_${pageId}_${userId}`;
    localStorage.setItem(key, String(Date.now()));
  } catch {}
}
export function canReplyToComment(
  comments: CommentEntity[],
  parentId: string
): boolean {
  let depth = 0;
  let currentId: string | null = parentId;
  while (currentId) {
    const parent = comments.find((c) => c.id === currentId);
    if (!parent) break;
    depth += 1;
    currentId = parent.parentId;
    if (depth >= MAX_DEPTH) return false;
  }
  return true;
}
export function recountReplies(comments: CommentEntity[]): CommentEntity[] {
  return comments.map((comment) => ({
    ...comment,
    repliesCount: comments.filter((c) => c.parentId === comment.id).length,
  }));
}
export function buildCommentTree(
  comments: CommentEntity[]
): (CommentEntity & { children: CommentEntity[] })[] {
  const map = new Map<string, CommentEntity & { children: CommentEntity[] }>();
  const roots: (CommentEntity & { children: CommentEntity[] })[] = [];
comments.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });
map.forEach((comment) => {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.children.push(comment);
      } else {
        roots.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });
return roots;
}

export type CommentSortType = "newest" | "oldest" | "popular";
export function sortComments<T extends CommentEntity>(
  comments: T[],
  sortType: CommentSortType
): T[] {
  const copy = [...comments];
  switch (sortType) {
    case "newest":
      return copy.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return copy.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "popular":
      return copy.sort((a, b) => b.likes - a.likes);
    default:
      return copy;
  }
}
