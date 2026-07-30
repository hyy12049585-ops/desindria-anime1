import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getPostComments,
  addPostComment,
  toggleCommentLike,
  isCommentLiked,
  getCommentCount,
} from "../../utils/cinderinoStorage";
import type { CinderinoUser } from "../../types/cinderino";

interface CommentAuthor {
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
}

interface CinderinoComment {
  id: string;
  postId: string;
  author: CommentAuthor;
  text: string;
  likes: number;
  createdAt: string;
  parentId?: string;
  replies?: CinderinoComment[];
}

interface Props {
  postId: string;
  onCountChange?: (count: number) => void;
}

const currentUser: CinderinoUser = {
  id: "user-mazyar",
  username: "mazyar",
  displayName: "مازیار",
  avatar: "",
  isVerified: false,
  banner: "",
  bio: "",
  link: "",
  isPrivate: false,
  joinedAt: new Date().toISOString(),
};



export default function CinderinoCommentSection({ postId, onCountChange }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [comments, setComments] = useState<CinderinoComment[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const reload = useCallback(() => {
    const c = getPostComments(postId) as CinderinoComment[];
    setComments(c);
    onCountChange?.(getCommentCount(postId));
  }, [postId, onCountChange]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    addPostComment(postId, trimmed, currentUser, replyTo?.id);
    setText("");
    setReplyTo(null);

    if (replyTo) {
      setExpandedReplies((prev) => new Set(prev).add(replyTo.id));
    }

    reload();
  };

  const handleLike = (commentId: string) => {
    toggleCommentLike(commentId);
    reload();
  };

  const handleReply = (commentId: string, displayName: string) => {
    setReplyTo({ id: commentId, name: displayName });
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "الان";
    if (mins < 60) return `${mins} دقیقه پیش`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    return `${Math.floor(hours / 24)} روز پیش`;
  };

  const renderComment = (comment: CinderinoComment, isReply = false) => {
    const liked = isCommentLiked(comment.id);
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);

    return (
      <div
        key={comment.id}
        className={`${isReply ? "mr-10 pr-3 border-r-2" : ""} ${
          isReply ? (isDark ? "border-purple-500/30" : "border-purple-300") : ""
        }`}
      >
        <div className="flex gap-3 py-3">
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
              isDark ? "bg-purple-600 text-white" : "bg-purple-200 text-purple-700"
            }`}
          >
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                className="w-8 h-8 rounded-full object-cover"
                alt=""
              />
            ) : (
              comment.author.displayName.charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {comment.author.displayName}
              </span>
              {comment.author.isVerified && (
                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
              <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {timeAgo(comment.createdAt)}
              </span>
            </div>

            <p className={`text-sm mt-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {comment.text}
            </p>

            <div className="flex items-center gap-4 mt-2">
              <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 group">
                <svg
                  className={`w-4 h-4 transition-colors ${
                    liked
                      ? "text-red-500 fill-red-500"
                      : isDark
                      ? "text-gray-500 group-hover:text-red-400"
                      : "text-gray-400 group-hover:text-red-500"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill={liked ? "currentColor" : "none"}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {comment.likes > 0 && (
                  <span className={`text-xs ${liked ? "text-red-500" : isDark ? "text-gray-500" : "text-gray-400"}`}>
                    {comment.likes}
                  </span>
                )}
              </button>

              {!isReply && (
                <button
                  onClick={() => handleReply(comment.id, comment.author.displayName)}
                  className={`text-xs font-medium transition-colors ${
                    isDark ? "text-gray-500 hover:text-purple-400" : "text-gray-400 hover:text-purple-600"
                  }`}
                >
                  پاسخ
                </button>
              )}
            </div>

            {hasReplies && !isReply && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className={`text-xs mt-2 font-medium ${isDark ? "text-purple-400" : "text-purple-600"}`}
              >
                {isExpanded ? "بستن پاسخ‌ها" : `مشاهده ${comment.replies!.length} پاسخ`}
              </button>
            )}
          </div>
        </div>

        {hasReplies && isExpanded && (
          <div className="mt-1">
            {comment.replies!.map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
      {comments.length > 0 && (
        <div className="px-4 max-h-80 overflow-y-auto">
          {comments.map((c) => renderComment(c))}
        </div>
      )}

      {comments.length === 0 && (
        <p className={`text-center text-sm py-6 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          هنوز کامنتی نیست... اولین نفر باش! 💬
        </p>
      )}

      {replyTo && (
        <div
          className={`flex items-center justify-between px-4 py-2 text-xs ${
            isDark ? "bg-purple-500/10 text-purple-300" : "bg-purple-50 text-purple-600"
          }`}
        >
          <span>پاسخ به {replyTo.name}</span>
          <button onClick={() => setReplyTo(null)} className="hover:opacity-70">
            ✕
          </button>
        </div>
      )}

      <div className={`flex items-center gap-2 p-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={replyTo ? `پاسخ به ${replyTo.name}...` : "کامنت بذار..."}
          className={`flex-1 text-sm px-3 py-2 rounded-full outline-none transition-colors ${
            isDark
              ? "bg-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
              : "bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-400"
          }`}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`p-2 rounded-full transition-all ${
            text.trim()
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : isDark
              ? "bg-gray-700 text-gray-500"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
