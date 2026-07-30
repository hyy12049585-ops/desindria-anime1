// src/components/Cinderino/CinderinoPostCard.tsx

import React, { useState, useRef } from "react";
import type { CinderinoPost, VibeReaction, VibeType, PostVibes } from "../../types/cinderino";

// ============================================
// Vibe Reactions Data
// ============================================
const VIBE_REACTIONS: VibeReaction[] = [
  { type: "fire", emoji: "🔥", label: "آتیش", color: "#ff4500" },
  { type: "diamond", emoji: "💎", label: "الماس", color: "#00d4ff" },
  { type: "moon", emoji: "🌙", label: "ماه", color: "#ffd700" },
  { type: "lightning", emoji: "⚡", label: "برق", color: "#ffeb3b" },
  { type: "palette", emoji: "🎨", label: "هنری", color: "#e040fb" },
];

interface CinderinoPostCardProps {
  post: CinderinoPost;
  isDark: boolean;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onComment: (text: string) => void;
  onUsernameClick?: (userId: string) => void;
  onVibeReact?: (type: VibeType) => void;
  onVibe?: (postId: string, vibeType: VibeType) => void;
  onShare?: (postId: string) => void;
  onVibeClick?: (postId: string, vibeType: VibeType) => void;

}

// ============================================
// Time Ago Helper
// ============================================
const timeAgo = (dateStr: string): string => {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الان";
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} روز پیش`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} هفته پیش`;
  return new Date(dateStr).toLocaleDateString("fa-IR");
};

// ============================================
// Image Carousel Component
// ============================================
const ImageCarousel: React.FC<{
  images: string[];
  onDoubleTap: () => void;
}> = ({ images, onDoubleTap }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      onDoubleTap();
    }
    lastTap.current = now;
  };

  if (images.length === 0) return null;

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div
        onClick={handleTap}
        style={{
          display: "flex",
          transition: "transform 0.3s ease",
          transform: `translateX(${currentIndex * 100}%)`,
        }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            style={{
              width: "100%",
              flexShrink: 0,
              aspectRatio: "1",
              objectFit: "cover",
            }}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 4,
          }}
        >
          {images.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? 8 : 6,
                height: i === currentIndex ? 8 : 6,
                borderRadius: "50%",
                background: i === currentIndex ? "#0095f6" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
      )}

      {images.length > 1 && currentIndex > 0 && (
        <button
          onClick={() => setCurrentIndex((p) => p - 1)}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </button>
      )}
      {images.length > 1 && currentIndex < images.length - 1 && (
        <button
          onClick={() => setCurrentIndex((p) => p + 1)}
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </button>
      )}
    </div>
  );
};

// ============================================
// Main PostCard Component
// ============================================
const CinderinoPostCard: React.FC<CinderinoPostCardProps> = ({
  post,
  isDark,
  onLike,
  onBookmark,
  onComment,
  onUsernameClick,
  onVibeReact,
}) => {
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showVibes, setShowVibes] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);

  const bg = isDark ? "#000" : "#fff";
  const textColor = isDark ? "#f5f5f5" : "#262626";
  const secondaryText = isDark ? "#a8a8a8" : "#8e8e8e";
  const borderColor = isDark ? "#262626" : "#efefef";

  const handleDoubleTapLike = () => {
    if (!post.isLiked) onLike(post.id);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 1000);
  };

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(commentText.trim());
      setCommentText("");
    }
  };

  const allImages = post.images.length > 0 ? post.images : post.media || [];

  return (
    <article
      style={{
        background: bg,
        borderBottom: `1px solid ${borderColor}`,
        marginBottom: 4,
        animation: "fadeInUp 0.4s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => onUsernameClick?.(post.authorId)}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={post.author.avatar}
              alt={post.author.username}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: `2px solid ${bg}`,
                objectFit: "cover",
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: textColor }}>
                {post.author.username}
              </span>
              {post.author.isVerified && (
                <span style={{ fontSize: 12, color: "#0095f6" }}>✓</span>
              )}
            </div>
            {post.author.displayName && (
              <span style={{ fontSize: 11, color: secondaryText }}>
                {post.author.displayName}
              </span>
            )}
          </div>
        </div>

        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: textColor,
            padding: 4,
          }}
        >
          ⋯
        </button>
      </div>

      {/* Image(s) */}
      <div style={{ position: "relative" }}>
        <ImageCarousel images={allImages} onDoubleTap={handleDoubleTapLike} />

        {likeAnim && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: 80,
                animation: "heartPop 1s ease forwards",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
              }}
            >
              ❤️
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Like */}
          <button
            onClick={() => onLike(post.id)}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              transition: "transform 0.2s",
              transform: post.isLiked ? "scale(1.1)" : "scale(1)",
              padding: 0,
            }}
          >
            {post.isLiked ? "❤️" : isDark ? "🤍" : "🖤"}
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
            }}
          >
            💬
          </button>

          {/* Share */}
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
            }}
          >
            📤
          </button>

          {/* Vibe React */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowVibes(!showVibes)}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                padding: 0,
              }}
            >
              ✨
            </button>

            {showVibes && (
              <div
                style={{
                  position: "absolute",
                  bottom: 36,
                  right: -20,
                  display: "flex",
                  gap: 4,
                  background: isDark ? "#262626" : "#fff",
                  borderRadius: 24,
                  padding: "6px 10px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  animation: "fadeInUp 0.2s ease",
                  zIndex: 10,
                }}
              >
                {VIBE_REACTIONS.map((vibe) => (
                  <button
                    key={vibe.type}
                    onClick={() => {
                      onVibeReact?.(vibe.type);
                      setShowVibes(false);
                    }}
                    title={vibe.label}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 22,
                      cursor: "pointer",
                      transition: "transform 0.15s",
                      padding: 2,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.3)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {vibe.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(post.id)}
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {post.isBookmarked ? "🔖" : "🏷️"}
        </button>
      </div>

      {/* Likes Count */}
      <div style={{ padding: "0 16px 4px" }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: textColor }}>
          {post.likes.toLocaleString("fa-IR")} پسند
        </span>
      </div>

      {/* Caption */}
      <div style={{ padding: "0 16px 6px" }}>
        <span
          style={{ fontWeight: 600, fontSize: 14, color: textColor, cursor: "pointer" }}
          onClick={() => onUsernameClick?.(post.authorId)}
        >
          {post.author.username}
        </span>{" "}
        <span style={{ fontSize: 14, color: textColor, lineHeight: 1.5 }}>
          {captionExpanded || post.caption.length <= 100
            ? post.caption
            : post.caption.slice(0, 100) + "..."}
        </span>
        {post.caption.length > 100 && !captionExpanded && (
          <button
            onClick={() => setCaptionExpanded(true)}
            style={{
              background: "none",
              border: "none",
              color: secondaryText,
              fontSize: 14,
              cursor: "pointer",
              padding: 0,
              marginRight: 4,
            }}
          >
            بیشتر
          </button>
        )}
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div style={{ padding: "0 16px 6px", display: "flex", flexWrap: "wrap", gap: 4 }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 13,
                color: "#00376b",
                cursor: "pointer",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Comments Count */}
      {post.comments > 0 && (
        <button
          style={{
            background: "none",
            border: "none",
            color: secondaryText,
            fontSize: 14,
            cursor: "pointer",
            padding: "0 16px 4px",
            display: "block",
          }}
        >
          مشاهده {post.comments.toLocaleString("fa-IR")} نظر
        </button>
      )}

      {/* Comment Input */}
      {showCommentInput && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
            gap: 8,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            placeholder="نظر بنویسید..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: textColor,
              direction: "rtl",
            }}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            style={{
              background: "none",
              border: "none",
              color: commentText.trim() ? "#0095f6" : secondaryText,
              fontWeight: 600,
              fontSize: 14,
              cursor: commentText.trim() ? "pointer" : "default",
            }}
          >
            ارسال
          </button>
        </div>
      )}

      {/* Time */}
      <div style={{ padding: "2px 16px 12px" }}>
        <span style={{ fontSize: 11, color: secondaryText }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes heartPop {
          0% { transform: scale(0); opacity: 1; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </article>
  );
};

export default CinderinoPostCard;
