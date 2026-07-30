import React from 'react';
import type { CommentAuthor, CommentItemType } from '../types/comments';
import { getAvatarText, isSameAuthor } from '../utils/author';

interface ReplyItemProps {
  reply: CommentItemType;
  currentAccount: CommentAuthor;
  onLike: () => void;
  onDislike: () => void;
  onDelete: () => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  currentAccount,
  onLike,
  onDislike,
  onDelete,
}) => {
  const safeLikes = Array.isArray(reply.likes) ? reply.likes.map(String) : [];
  const safeDislikes = Array.isArray(reply.dislikes)
    ? reply.dislikes.map(String)
    : [];

  const userId = String(currentAccount.id);
  const hasLiked = safeLikes.includes(userId);
  const hasDisliked = safeDislikes.includes(userId);
  const ownReply = isSameAuthor(reply.author, currentAccount);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white shadow-lg shadow-purple-200">
            {reply.author?.avatar ? (
              <img
                src={reply.author.avatar}
                alt={reply.author.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{getAvatarText(reply.author?.name)}</span>
            )}
          </div>

          <div>
            <h5 className="font-bold text-gray-900">
              {reply.author?.name || 'کاربر'}
            </h5>

            <p className="mt-1 text-xs text-gray-400">
              {formatDate(reply.createdAt)}
            </p>
          </div>
        </div>

        {ownReply && (
          <button
            type="button"
            onClick={() => {
              const ok = window.confirm('آیا از حذف این پاسخ مطمئن هستید؟');
              if (ok) onDelete();
            }}
            className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs text-red-500 transition hover:bg-red-100"
          >
            🗑️ حذف
          </button>
        )}
      </div>

      <p className="mt-4 leading-8 text-gray-700">{reply.body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onLike}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
            hasLiked
              ? 'bg-purple-500 text-white shadow-md shadow-purple-200'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-600'
          }`}
        >
          <span>👍</span>
          <span>{toPersianNumber(safeLikes.length)}</span>
        </button>

        <button
          type="button"
          onClick={onDislike}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${
            hasDisliked
              ? 'bg-red-500 text-white shadow-md shadow-red-200'
              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <span>👎</span>
          <span>{toPersianNumber(safeDislikes.length)}</span>
        </button>
      </div>
    </article>
  );
};

function formatDate(date: string) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function toPersianNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

export default ReplyItem;
