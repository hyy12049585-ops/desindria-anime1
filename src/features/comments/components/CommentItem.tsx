import { useState } from "react";
import type { CommentAuthor, CommentItemType } from "../types/comments";
import CommentForm from "./CommentForm";
import "./CommentItem.css";
interface Props {
  comment: CommentItemType;
  currentUser: CommentAuthor | null;
  depth: number;
  maxDepth: number;
  allowReplies: boolean;
  allowLikes: boolean;
  allowEditing: boolean;
  allowDeletion: boolean;
  onReply: (parentId: string, body: string) => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onEdit: (id: string, body: string) => void;
  onDelete: (id: string) => void;
  onAuthRequired?: () => void;
}
export default function CommentItem({
  comment,
  currentUser,
  depth,
  maxDepth,
  allowReplies,
  allowLikes,
  allowEditing,
  allowDeletion,
  onReply,
  onLike,
  onDislike,
  onEdit,
  onDelete,
  onAuthRequired,
}: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(comment.body);
const isLoggedIn = Boolean(currentUser?.id && currentUser.isAuthenticated);
  const isOwner = isLoggedIn && currentUser?.id === comment.author.id;
const userLiked = isLoggedIn && comment.likes.includes(currentUser!.id);
  const userDisliked =
    isLoggedIn && comment.dislikes.includes(currentUser!.id);
const canReply = allowReplies && depth < maxDepth;
// ─── فرمت زمان ────────────────────────────────
  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "همین الان";
    if (m < 60) return `${m} دقیقه پیش`;
    if (h < 24) return `${h} ساعت پیش`;
    if (d < 30) return `${d} روز پیش`;
    return new Date(iso).toLocaleDateString("fa-IR");
  };
// ─── کلیک‌ها (با چک لاگین) ────────────────────
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    onLike(comment.id);
  };
const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    onDislike(comment.id);
  };
const handleReplyClick = () => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    setShowReplyForm((s) => !s);
  };
const handleSaveEdit = () => {
    const text = editBody.trim();
    if (!text) return;
    onEdit(comment.id, text);
    setIsEditing(false);
  };
const handleConfirmDelete = () => {
    if (window.confirm("از حذف این نظر مطمئن هستید؟")) {
      onDelete(comment.id);
    }
  };
return (
    <article className="comment-item" style={{ marginRight: depth * 24 }}>
      <div className="comment-item-main">
        {/* آواتار */}
        <div className="comment-item-avatar">
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} />
          ) : (
            <div className="avatar-fallback">
              {comment.author.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
{/* محتوا */}
        <div className="comment-item-body">
          <header className="comment-item-header">
            <span className="comment-item-username">{comment.author.name}</span>
            {comment.author.role === "admin" && (
              <span className="badge badge-admin">مدیر</span>
            )}
            {comment.author.role === "premium" && (
              <span className="badge badge-premium">ویژه</span>
            )}
            <span className="comment-item-time">
              {formatTime(comment.createdAt)}
              {comment.isEdited && " (ویرایش شده)"}
            </span>
          </header>
{/* متن یا فرم ویرایش */}
          {isEditing ? (
            <div className="comment-edit-box">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="comment-edit-textarea"
                rows={3}
              />
              <div className="comment-edit-actions">
                <button
                  type="button"
                  className="comment-btn comment-btn-cancel"
                  onClick={() => {
                    setIsEditing(false);
                    setEditBody(comment.body);
                  }}
                >
                  انصراف
                </button>
                <button
                  type="button"
                  className="comment-btn comment-btn-submit"
                  onClick={handleSaveEdit}
                >
                  ذخیره
                </button>
              </div>
            </div>
          ) : (
            <p className="comment-item-text">{comment.body}</p>
          )}
{/* اکشن‌ها */}
          {!isEditing && (
            <footer className="comment-item-actions">
              {allowLikes && (
                <>
                  <button
                    type="button"
                    className={`action-btn ${userLiked ? "is-active is-like" : ""}`}
                    onClick={handleLikeClick}
                  >
                    <span>👍</span>
                    <span>پسندیدم</span>
                    {comment.likes.length > 0 && (
                      <span className="action-count">
                        {comment.likes.length}
                      </span>
                    )}
                  </button>
<button
                    type="button"
                    className={`action-btn ${userDisliked ? "is-active is-dislike" : ""}`}
                    onClick={handleDislikeClick}
                  >
                    <span>👎</span>
                    {comment.dislikes.length > 0 && (
                      <span className="action-count">
                        {comment.dislikes.length}
                      </span>
                    )}
                  </button>
                </>
              )}
{canReply && (
                <button
                  type="button"
                  className="action-btn"
                  onClick={handleReplyClick}
                >
                  <span>💬</span>
                  <span>پاسخ</span>
                </button>
              )}
{isOwner && allowEditing && (
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setIsEditing(true)}
                >
                  ویرایش
                </button>
              )}
{isOwner && allowDeletion && (
                <button
                  type="button"
                  className="action-btn action-btn-danger"
                  onClick={handleConfirmDelete}
                >
                  حذف
                </button>
              )}
            </footer>
          )}
{/* فرم پاسخ */}
          {showReplyForm && (
            <div className="comment-reply-form">
              <CommentForm
                currentUser={currentUser}
                placeholder={`پاسخ به ${comment.author.name}...`}
                isReply
                onSubmit={(body) => {
                  onReply(comment.id, body);
                  setShowReplyForm(false);
                }}
                onCancel={() => setShowReplyForm(false)}
                onAuthRequired={onAuthRequired}
              />
            </div>
          )}
        </div>
      </div>
{/* پاسخ‌ها */}
      {comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              currentUser={currentUser}
              depth={depth + 1}
              maxDepth={maxDepth}
              allowReplies={allowReplies}
              allowLikes={allowLikes}
              allowEditing={allowEditing}
              allowDeletion={allowDeletion}
              onReply={onReply}
              onLike={onLike}
              onDislike={onDislike}
              onEdit={onEdit}
              onDelete={onDelete}
              onAuthRequired={onAuthRequired}
            />
          ))}
        </div>
      )}
    </article>
  );
}
