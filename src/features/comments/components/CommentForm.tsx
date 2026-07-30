import { useState } from "react";
import type { CommentAuthor } from "../types/comments";
import "./CommentForm.css";
interface CommentFormProps {
  currentUser: CommentAuthor | null;
  placeholder?: string;
  onSubmit: (body: string) => void;
  onAuthRequired?: () => void;
  onCancel?: () => void;
  isReply?: boolean;
}
export default function CommentForm({
  currentUser,
  placeholder = "نظر خود را بنویسید...",
  onSubmit,
  onAuthRequired,
  onCancel,
  isReply = false,
}: CommentFormProps) {
  const [body, setBody] = useState("");
const isLoggedIn = Boolean(currentUser?.id && currentUser.isAuthenticated);
// 🔒 اگر کاربر لاگین نیست، فقط دکمه ورود نشون بده
  if (!isLoggedIn) {
    return (
      <div className="comment-auth-required">
        <div className="comment-auth-icon">🔒</div>
        <p className="comment-auth-text">
          برای ثبت نظر ابتدا وارد حساب کاربری شوید
        </p>
        <button
          type="button"
          className="comment-auth-button"
          onClick={onAuthRequired}
        >
          ورود / ثبت‌نام
        </button>
      </div>
    );
  }
const handleSubmit = () => {
    const text = body.trim();
    if (!text) return;
    onSubmit(text);
    setBody("");
  };
return (
    <div className={`comment-form ${isReply ? "is-reply" : ""}`}>
      <div className="comment-form-header">
        <div className="comment-form-avatar">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} />
          ) : (
            <div className="avatar-fallback">
              {currentUser?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
        <span className="comment-form-username">{currentUser?.name}</span>
      </div>
<textarea
        className="comment-form-textarea"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
<div className="comment-form-actions">
        {onCancel && (
          <button
            type="button"
            className="comment-btn comment-btn-cancel"
            onClick={onCancel}
          >
            انصراف
          </button>
        )}
        <button
          type="button"
          className="comment-btn comment-btn-submit"
          onClick={handleSubmit}
          disabled={!body.trim()}
        >
          ارسال نظر
        </button>
      </div>
    </div>
  );
}
