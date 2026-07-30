import type { CommentItemType } from "../types/comments";
export const updateCommentInTree = (
  comments: CommentItemType[],
  commentId: string,
  updater: (c: CommentItemType) => CommentItemType
): CommentItemType[] => {
  return comments.map((c) => {
    if (c.id === commentId) return updater(c);
    return {
      ...c,
      replies: updateCommentInTree(c.replies, commentId, updater),
    };
  });
};
export const toggleLike = (
  comment: CommentItemType,
  userId: string
): CommentItemType => {
  const liked = comment.likes.includes(userId);
  return {
    ...comment,
    likes: liked
      ? comment.likes.filter((id) => id !== userId)
      : [...comment.likes.filter((id) => id !== userId), userId],
    dislikes: comment.dislikes.filter((id) => id !== userId),
  };
};
export const toggleDislike = (
  comment: CommentItemType,
  userId: string
): CommentItemType => {
  const disliked = comment.dislikes.includes(userId);
  return {
    ...comment,
    dislikes: disliked
      ? comment.dislikes.filter((id) => id !== userId)
      : [...comment.dislikes.filter((id) => id !== userId), userId],
    likes: comment.likes.filter((id) => id !== userId),
  };
};
