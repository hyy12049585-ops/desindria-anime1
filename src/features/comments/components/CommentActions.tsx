// src/features/comments/components/CommentActions.tsx
"use client";
import { MessageCircle } from "lucide-react";
interface CommentActionsProps {
  likes: number;
  dislikes: number;
  isLiked: boolean;
  isDisliked: boolean;
  replyCount: number;
  onLike: () => void;
  onDislike: () => void;
  onReply: () => void;
  showReplyButton?: boolean;
}
export default function CommentActions({
  likes,
  dislikes,
  isLiked,
  isDisliked,
  replyCount,
  onLike,
  onDislike,
  onReply,
  showReplyButton = true,
}: CommentActionsProps) {
  return (
    <div className="flex items-center gap-3" dir="rtl">
{/* لایک */}
      <button
        type="button"
        onClick={onLike}
        className={`group relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
          isLiked
            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-zinc-100 text-zinc-500 hover:bg-blue-50 hover:text-blue-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
        }`}
      >
        {/* آیکون لایک */}
        <svg
          className={`h-4 w-4 transition-transform group-active:scale-90 ${
            isLiked ? "scale-110" : ""
          }`}
          viewBox="0 0 24 24"
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          style={
            isLiked
              ? { filter: "drop-shadow(0 0 6px rgba(59,130,246,0.5))" }
              : {}
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
          />
        </svg>
{likes > 0 && (
          <span>{likes.toLocaleString("fa-IR")}</span>
        )}
{/* پالس هنگام لایک */}
        {isLiked && (
          <span className="absolute inset-0 animate-ping rounded-xl bg-blue-400/20" />
        )}
      </button>
{/* دیسلایک */}
      <button
        type="button"
        onClick={onDislike}
        className={`group relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
          isDisliked
            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            : "bg-zinc-100 text-zinc-500 hover:bg-red-50 hover:text-red-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        }`}
      >
        {/* آیکون دیسلایک */}
        <svg
          className={`h-4 w-4 transition-transform group-active:scale-90 ${
            isDisliked ? "scale-110" : ""
          }`}
          viewBox="0 0 24 24"
          fill={isDisliked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          style={
            isDisliked
              ? { filter: "drop-shadow(0 0 6px rgba(239,68,68,0.5))" }
              : {}
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"
          />
        </svg>
{dislikes > 0 && (
          <span>{dislikes.toLocaleString("fa-IR")}</span>
        )}
{isDisliked && (
          <span className="absolute inset-0 animate-ping rounded-xl bg-red-400/20" />
        )}
      </button>
{/* پاسخ */}
      {showReplyButton && (
        <button
          type="button"
          onClick={onReply}
          className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-violet-900/20 dark:hover:text-violet-400"
        >
          <MessageCircle size={15} />
          <span>
            {replyCount > 0
              ? `${replyCount.toLocaleString("fa-IR")} پاسخ`
              : "پاسخ"}
          </span>
        </button>
      )}
    </div>
  );
}
