import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useCinderinoProfile } from "../../contexts/CinderinoProfileContext";
import { CinderinoPost } from "../../types/cinderino";

type TabKey = "posts" | "liked" | "bookmarked";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "posts", label: "پست‌ها", icon: "📷" },
  { key: "liked", label: "لایک‌شده", icon: "❤️" },
  { key: "bookmarked", label: "ذخیره‌شده", icon: "🔖" },
];

const CinderinoProfileTabs: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { state, deletePost } = useCinderinoProfile();
  const [activeTab, setActiveTab] = useState<TabKey>("posts");
  const [selectedPost, setSelectedPost] = useState<CinderinoPost | null>(null);

  const getTabData = (): CinderinoPost[] => {
    switch (activeTab) {
      case "posts": return state.myPosts;
      case "liked": return state.likedPosts;
      case "bookmarked": return state.bookmarkedPosts;
    }
  };

  const posts = getTabData();

  return (
    <div className="mt-6 px-4">
      {/* Tab Bar */}
      <div
        className="flex rounded-xl overflow-hidden mb-4"
        style={{
          background: isDark ? "rgba(30,27,75,0.6)" : "rgba(237,233,254,0.8)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1"
            style={{
              background:
                activeTab === tab.key
                  ? isDark
                    ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                    : "linear-gradient(135deg, #8b5cf6, #a78bfa)"
                  : "transparent",
              color:
                activeTab === tab.key
                  ? "#fff"
                  : isDark
                  ? "#94a3b8"
                  : "#64748b",
              borderRadius: activeTab === tab.key ? "0.75rem" : "0",
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">
            {activeTab === "posts" ? "📷" : activeTab === "liked" ? "❤️" : "🔖"}
          </p>
          <p
            className="text-sm"
            style={{ color: isDark ? "#94a3b8" : "#64748b" }}
          >
            {activeTab === "posts"
              ? "هنوز پستی نذاشتی"
              : activeTab === "liked"
              ? "هنوز پستی لایک نکردی"
              : "هنوز پستی ذخیره نکردی"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
          {posts.map((post) => (
            <div
              key={post.id}
              className="aspect-square relative cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              {post.images[0] ? (
                <img
                  src={post.images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xs p-2 text-center leading-relaxed"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, #1e1b4b, #312e81)"
                      : "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                    color: isDark ? "#cbd5e1" : "#475569",
                  }}
                >
                  {post.caption.slice(0, 60)}...
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
              {/* Multi-image badge */}
              {post.images.length > 1 && (
                <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  📷 {post.images.length}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
            style={{
              background: isDark
                ? "linear-gradient(135deg, #1e1b4b, #0f0c29)"
                : "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Images */}
            {selectedPost.images.length > 0 && (
              <div className="w-full aspect-square">
                <img
                  src={selectedPost.images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: isDark
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                    color: "#fff",
                  }}
                >
                  {selectedPost.author.displayName.charAt(0)}
                </div>
                <span
                  className="text-sm font-medium"
                  style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
                >
                  {selectedPost.author.displayName}
                </span>
              </div>

              {/* Caption */}
              <p
                className="text-sm whitespace-pre-line leading-relaxed mb-3"
                style={{ color: isDark ? "#cbd5e1" : "#475569" }}
              >
                {selectedPost.caption}
              </p>

              {/* Tags */}
              {selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: isDark ? "rgba(124,58,237,0.2)" : "rgba(139,92,246,0.1)",
                        color: "#a855f7",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats + Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-xs" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                  <span>❤️ {selectedPost.likes}</span>
                  <span>💬 {selectedPost.comments}</span>
                </div>

                {activeTab === "posts" && (
                  <button
                    onClick={() => {
                      deletePost(selectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      background: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                    }}
                  >
                    🗑️ حذف
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinderinoProfileTabs;
