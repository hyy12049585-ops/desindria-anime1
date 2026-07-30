// src/components/Cinderino/CinderinoFeed.tsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CinderinoPost, VibeType, PostVibes } from "../../types/cinderino";
import CinderinoPostCard from "./CinderinoPostCard";
import CinderinoCanvasLauncher from "./CinderinoCanvasLauncher";

// ─── Types ───────────────────────────────────────────────────────
interface StoryItem {
  id: string;
  type: "image" | "video";
  url: string;
  duration?: number;
}

interface StoryGroup {
  id: string;
  username: string;
  avatar: string;
  hasUnseenStory: boolean;
  stories: StoryItem[];
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
}

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  user: { username: string; avatar: string };
  message: string;
  time: string;
  isRead: boolean;
}

const DEFAULT_VIBES: PostVibes = {
  fire: 0,
  diamond: 0,
  moon: 0,
  lightning: 0,
  palette: 0,
};

const CURRENT_USER: UserProfile & { banner: string; link: string; isPrivate: boolean; joinedAt: string } = {
  id: "cinderino_user",
  username: "cinderino_dev",
  displayName: "Cinderino Dev",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cinderino",
  bio: "Building the future of social ✨",
  postsCount: 42,
  followersCount: 1337,
  followingCount: 420,
  isVerified: true,
  banner: "https://picsum.photos/800/200?random=banner",
  link: "https://cinderino.dev",
  isPrivate: false,
  joinedAt: new Date().toISOString(),
};

const MOCK_STORY_GROUPS: StoryGroup[] = [
  {
    id: "s1",
    username: "your_story",
    avatar: CURRENT_USER.avatar,
    hasUnseenStory: false,
    stories: [],
  },
  {
    id: "s2",
    username: "alice_wonder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    hasUnseenStory: true,
    stories: [
      { id: "st1", type: "image", url: "https://picsum.photos/400/700?random=101", duration: 5000 },
      { id: "st2", type: "image", url: "https://picsum.photos/400/700?random=102", duration: 5000 },
    ],
  },
  {
    id: "s3",
    username: "bob_builder",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    hasUnseenStory: true,
    stories: [
      { id: "st3", type: "image", url: "https://picsum.photos/400/700?random=103", duration: 5000 },
    ],
  },
  {
    id: "s4",
    username: "charlie_x",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie",
    hasUnseenStory: true,
    stories: [
      { id: "st4", type: "image", url: "https://picsum.photos/400/700?random=104", duration: 5000 },
    ],
  },
  {
    id: "s5",
    username: "diana_moon",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
    hasUnseenStory: false,
    stories: [
      { id: "st5", type: "image", url: "https://picsum.photos/400/700?random=105", duration: 5000 },
    ],
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "like", user: { username: "alice_wonder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" }, message: "liked your post", time: "2m ago", isRead: false },
  { id: "n2", type: "comment", user: { username: "bob_builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" }, message: 'commented: "Amazing shot! 🔥"', time: "15m ago", isRead: false },
  { id: "n3", type: "follow", user: { username: "charlie_x", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie" }, message: "started following you", time: "1h ago", isRead: true },
  { id: "n4", type: "mention", user: { username: "diana_moon", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana" }, message: "mentioned you in a comment", time: "3h ago", isRead: true },
];

const generateMockPost = (id: number): CinderinoPost => ({
  id: `post_${id}`,
  authorId: `user_${id % 5}`,
  author: {
    id: `user_${id % 5}`,
    username: ["alice_wonder", "bob_builder", "charlie_x", "diana_moon", "cinderino_dev"][id % 5],
    displayName: ["Alice Wonder", "Bob Builder", "Charlie X", "Diana Moon", "Cinderino Dev"][id % 5],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${["alice", "bob", "charlie", "diana", "cinderino"][id % 5]}`,
    banner: `https://picsum.photos/800/200?random=${id}`,
    bio: "Living my best life ✨",
    link: "",
    isVerified: id % 3 === 0,
    isPrivate: false,
    joinedAt: new Date().toISOString(),
  },
  images: [`https://picsum.photos/600/600?random=${id}`],
  caption: [
    "Living my best life ✨ #cinderino",
    "Golden hour vibes 🌅",
    "Coffee and code ☕💻",
    "Adventure awaits 🏔️",
    "Just another beautiful day 🌸",
  ][id % 5],
  tags: [],
  likes: Math.floor(Math.random() * 10000),
  comments: Math.floor(Math.random() * 500),
  isLiked: Math.random() > 0.5,
  isBookmarked: Math.random() > 0.7,
  createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
  vibes: {
    fire: Math.floor(Math.random() * 50),
    diamond: Math.floor(Math.random() * 30),
    moon: Math.floor(Math.random() * 20),
    lightning: Math.floor(Math.random() * 15),
    palette: Math.floor(Math.random() * 25),
  },
});

const INITIAL_POSTS: CinderinoPost[] = Array.from({ length: 10 }, (_, i) => generateMockPost(i));

// ─── StoriesBar ──────────────────────────────────────────
interface StoriesBarProps {
  isDark: boolean;
  storyGroups: StoryGroup[];
  onStoryClick: (index: number) => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ isDark, storyGroups, onStoryClick }) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      padding: "12px 16px",
      overflowX: "auto",
      borderBottom: `1px solid ${isDark ? "#262626" : "#efefef"}`,
      background: isDark ? "#000" : "#fff",
    }}
  >
    {storyGroups.map((group, index) => (
      <div
        key={group.id}
        onClick={() => group.stories.length > 0 && onStoryClick(index)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          cursor: group.stories.length > 0 ? "pointer" : "default",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            padding: 2,
            background: group.hasUnseenStory
              ? "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
              : isDark
              ? "#333"
              : "#ddd",
          }}
        >
          <img
            src={group.avatar}
            alt={group.username}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: `3px solid ${isDark ? "#000" : "#fff"}`,
              objectFit: "cover",
            }}
            draggable={false}
          />
        </div>
        <span
          style={{
            fontSize: 11,
            color: isDark ? "#ccc" : "#666",
            maxWidth: 64,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {group.username === "your_story" ? "Your story" : group.username}
        </span>
      </div>
    ))}
  </div>
);

// ─── StoryViewer ─────────────────────────────────────────
interface StoryViewerProps {
  isDark: boolean;
  storyGroups: StoryGroup[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ storyGroups, initialIndex, onClose }) => {
  const [groupIndex, setGroupIndex] = useState(initialIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentGroup = storyGroups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];

  const handleNext = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (currentGroup && storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
    } else if (groupIndex < storyGroups.length - 1) {
      setGroupIndex((prev) => prev + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  }, [currentGroup, storyIndex, groupIndex, storyGroups.length, onClose]);

  useEffect(() => {
    if (!currentStory) return;
    setProgress(0);
    const duration = currentStory.duration || 5000;
    const interval = 50;
    let elapsed = 0;

    timerRef.current = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        handleNext();
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [groupIndex, storyIndex, currentStory, handleNext]);

  const handlePrev = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (storyIndex > 0) {
      setStoryIndex((prev) => prev - 1);
    } else if (groupIndex > 0) {
      setGroupIndex((prev) => prev - 1);
      setStoryIndex(0);
    }
  };

  if (!currentGroup || !currentStory) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", gap: 4, padding: "8px 8px 0" }}>
        {currentGroup.stories.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 2,
              background: "rgba(255,255,255,0.3)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#fff",
                width: i < storyIndex ? "100%" : i === storyIndex ? `${progress}%` : "0%",
                transition: i === storyIndex ? "none" : "width 0.3s",
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          gap: 10,
        }}
      >
        <img
          src={currentGroup.avatar}
          alt={currentGroup.username}
          style={{ width: 32, height: 32, borderRadius: "50%" }}
          draggable={false}
        />
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
          {currentGroup.username}
        </span>
        <button
          onClick={onClose}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src={currentStory.url}
          alt="story"
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          draggable={false}
        />
      </div>

      <div
        onClick={handlePrev}
        style={{ position: "absolute", left: 0, top: 80, bottom: 0, width: "30%", cursor: "pointer" }}
      />
      <div
        onClick={handleNext}
        style={{ position: "absolute", right: 0, top: 80, bottom: 0, width: "70%", cursor: "pointer" }}
      />
    </div>
  );
};

// ─── CreatePostModal ─────────────────────────────────────
interface CreatePostModalProps {
  isDark: boolean;
  onClose: () => void;
  onPost: (data: { caption: string; image: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isDark, onClose, onPost }) => {
  const [caption, setCaption] = useState("");
  const [imageUrl] = useState(`https://picsum.photos/600/600?random=${Date.now()}`);

  const handleSubmit = () => {
    if (caption.trim()) {
      onPost({ caption, image: imageUrl });
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: isDark ? "#1a1a1a" : "#fff",
          borderRadius: 16,
          width: "100%",
          maxWidth: 500,
          overflow: "hidden",
          animation: "slideUp 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            borderBottom: `1px solid ${isDark ? "#333" : "#eee"}`,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: isDark ? "#fff" : "#000",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <span style={{ fontWeight: 700, color: isDark ? "#fff" : "#000" }}>New Post</span>
          <button
            onClick={handleSubmit}
            style={{
              background: "none",
              border: "none",
              color: "#0095f6",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              opacity: caption.trim() ? 1 : 0.4,
            }}
            disabled={!caption.trim()}
          >
            Share
          </button>
        </div>

        <div style={{ aspectRatio: "1", background: isDark ? "#111" : "#fafafa" }}>
          <img
            src={imageUrl}
            alt="preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            draggable={false}
          />
        </div>

        <div style={{ padding: 16 }}>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            style={{
              width: "100%",
              minHeight: 80,
              background: "transparent",
              border: "none",
              outline: "none",
              color: isDark ? "#fff" : "#000",
              fontSize: 14,
              resize: "none",
              fontFamily: "inherit",
            }}
            maxLength={2200}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              color: isDark ? "#555" : "#999",
              marginTop: 4,
            }}
          >
            {caption.length}/2200
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── NotificationsPanel ──────────────────────────────────
interface NotificationsPanelProps {
  isDark: boolean;
  notifications: Notification[];
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isDark, notifications, onClose }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9997,
      background: "rgba(0,0,0,0.5)",
    }}
    onClick={onClose}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "85%",
        maxWidth: 400,
        background: isDark ? "#1a1a1a" : "#fff",
        animation: "slideUp 0.3s ease",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${isDark ? "#333" : "#eee"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 18, color: isDark ? "#fff" : "#000" }}>
          Notifications
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            color: isDark ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {notifications.map((notif) => (
        <div
          key={notif.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: !notif.isRead ? (isDark ? "rgba(0,149,246,0.1)" : "rgba(0,149,246,0.05)") : "transparent",
          }}
        >
          <img
            src={notif.user.avatar}
            alt={notif.user.username}
            style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0 }}
            draggable={false}
          />
          <div style={{ flex: 1 }}>
            <span style={{ color: isDark ? "#fff" : "#000", fontSize: 14 }}>
              <strong>{notif.user.username}</strong> {notif.message}
            </span>
            <div style={{ fontSize: 12, color: isDark ? "#555" : "#999", marginTop: 2 }}>
              {notif.time}
            </div>
          </div>
          {!notif.isRead && (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#0095f6",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

// ─── ExplorePage ─────────────────────────────────────────
interface ExplorePageProps {
  isDark: boolean;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ isDark }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const exploreImages = Array.from({ length: 24 }, (_, i) => ({
    id: `explore_${i}`,
    url: `https://picsum.photos/300/300?random=${i + 200}`,
    isLarge: i % 5 === 0,
  }));

  return (
    <div style={{ background: isDark ? "#000" : "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "12px 16px", position: "sticky", top: 0, zIndex: 10, background: isDark ? "#000" : "#fff" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: isDark ? "#262626" : "#efefef",
            borderRadius: 10,
            padding: "8px 12px",
          }}
        >
          <span style={{ fontSize: 16, color: isDark ? "#888" : "#999" }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: isDark ? "#fff" : "#000",
              fontSize: 14,
            }}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {exploreImages.map((img) => (
          <div
            key={img.id}
            style={{
              aspectRatio: img.isLarge ? "1/2" : "1",
              gridRow: img.isLarge ? "span 2" : "span 1",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <img
              src={img.url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ProfilePage ─────────────────────────────────────────
interface ProfilePageProps {
  isDark: boolean;
  user: UserProfile;
  onBack: () => void;
  onOpenCanvas: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isDark, user, onBack, onOpenCanvas }) => {
  const [activeProfileTab, setActiveProfileTab] = useState<"posts" | "saved" | "tagged">("posts");

  const profilePosts = Array.from({ length: 18 }, (_, i) => ({
    id: `profile_${i}`,
    url: `https://picsum.photos/300/300?random=${i + 300}`,
  }));

  const highlights = [
    { id: "h1", name: "Travel", emoji: "✈️" },
    { id: "h2", name: "Food", emoji: "🍕" },
    { id: "h3", name: "Code", emoji: "💻" },
    { id: "h4", name: "Music", emoji: "🎵" },
    { id: "h5", name: "Art", emoji: "🎨" },
  ];

  return (
    <div style={{ background: isDark ? "#000" : "#fff", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${isDark ? "#262626" : "#efefef"}`,
        }}
      >
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", fontSize: 20, color: isDark ? "#fff" : "#000", cursor: "pointer" }}
        >
          ←
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, color: isDark ? "#fff" : "#000" }}>
          {user.username} {user.isVerified && "✓"}
        </span>
        <button
          onClick={onOpenCanvas}
          style={{ background: "none", border: "none", fontSize: 20, color: isDark ? "#fff" : "#000", cursor: "pointer" }}
        >
          ☰
        </button>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img
            src={user.avatar}
            alt={user.username}
            style={{ width: 80, height: 80, borderRadius: "50%" }}
            draggable={false}
          />
          <div style={{ display: "flex", gap: 24, flex: 1, justifyContent: "center" }}>
            {[
              { label: "Posts", value: user.postsCount },
              { label: "Followers", value: user.followersCount },
              { label: "Following", value: user.followingCount },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: isDark ? "#fff" : "#000" }}>
                  {stat.value.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: isDark ? "#999" : "#666" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: isDark ? "#fff" : "#000" }}>
            {user.displayName}
          </div>
          <div style={{ fontSize: 14, color: isDark ? "#ccc" : "#333", marginTop: 4 }}>
            {user.bio}
          </div>
        </div>

        <button
          style={{
            width: "100%",
            marginTop: 16,
            padding: "8px 0",
            borderRadius: 8,
            border: `1px solid ${isDark ? "#333" : "#ddd"}`,
            background: "transparent",
            color: isDark ? "#fff" : "#000",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Edit Profile
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          padding: "0 16px 16px",
          overflowX: "auto",
        }}
      >
        {highlights.map((h) => (
          <div key={h.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `1px solid ${isDark ? "#333" : "#ddd"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              {h.emoji}
            </div>
            <span style={{ fontSize: 11, color: isDark ? "#ccc" : "#666" }}>{h.name}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          borderTop: `1px solid ${isDark ? "#262626" : "#efefef"}`,
          borderBottom: `1px solid ${isDark ? "#262626" : "#efefef"}`,
        }}
      >
        {(["posts", "saved", "tagged"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveProfileTab(tab)}
            style={{
              flex: 1,
              padding: "12px 0",
              background: "none",
              border: "none",
              borderBottom: activeProfileTab === tab ? `2px solid ${isDark ? "#fff" : "#000"}` : "2px solid transparent",
              color: activeProfileTab === tab ? (isDark ? "#fff" : "#000") : (isDark ? "#666" : "#999"),
              fontSize: 13,
              fontWeight: activeProfileTab === tab ? 700 : 400,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {tab === "posts" ? "📷" : tab === "saved" ? "🔖" : "👤"} {tab}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,        }}
      >
        {activeProfileTab === "posts" &&
          profilePosts.map((post) => (
            <div key={post.id} style={{ aspectRatio: "1", overflow: "hidden", cursor: "pointer" }}>
              <img
                src={post.url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                draggable={false}
              />
            </div>
          ))}
        {activeProfileTab === "saved" && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: 40,
              color: isDark ? "#555" : "#999",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔖</div>
            <div>No saved posts yet</div>
          </div>
        )}
        {activeProfileTab === "tagged" && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: 40,
              color: isDark ? "#555" : "#999",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
            <div>No tagged posts</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────
interface CinderinoFeedProps {
  isDark?: boolean;
  extraPosts?: CinderinoPost[];
}

const CinderinoFeed: React.FC<CinderinoFeedProps> = ({ isDark = false, extraPosts = [] }) => {
  const [posts, setPosts] = useState<CinderinoPost[]>([...extraPosts, ...INITIAL_POSTS]);
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "create" | "notifications" | "profile">("home");
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [storyStartIndex, setStoryStartIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const handleVibeClick = useCallback((postId: string, vibeType: VibeType) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              vibes: {
                ...post.vibes,
                [vibeType]: (post.vibes?.[vibeType] || 0) + 1,
              },
            }
          : post
      )
    );
  }, []);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const handleBookmark = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
    );
  }, []);

  const handleCreatePost = useCallback((data: { caption: string; image: string }) => {
    const newPost: CinderinoPost = {
      id: `post_new_${Date.now()}`,
      authorId: CURRENT_USER.id,
      author: {
        id: CURRENT_USER.id,
        username: CURRENT_USER.username,
        displayName: CURRENT_USER.displayName,
        avatar: CURRENT_USER.avatar,
        banner: CURRENT_USER.banner,
        bio: CURRENT_USER.bio,
        link: CURRENT_USER.link,
        isVerified: CURRENT_USER.isVerified,
        isPrivate: CURRENT_USER.isPrivate,
        joinedAt: CURRENT_USER.joinedAt,
      },
      images: [data.image],
      caption: data.caption,
      tags: [],
      likes: 0,
      comments: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      vibes: { ...DEFAULT_VIBES },
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const handleStoryClick = useCallback((index: number) => {
    setStoryStartIndex(index);
    setShowStoryViewer(true);
  }, []);

  const loadMorePosts = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      const newPosts = Array.from({ length: 5 }, (_, i) =>
        generateMockPost(posts.length + i)
      );
      setPosts((prev) => [...prev, ...newPosts]);
      setIsLoading(false);
    }, 1000);
  }, [isLoading, posts.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (!feedRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = feedRef.current;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        loadMorePosts();
      }
    };

    const ref = feedRef.current;
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [loadMorePosts]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: isDark ? "#000" : "#fff",
        color: isDark ? "#fff" : "#000",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      {activeTab === "home" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: `1px solid ${isDark ? "#262626" : "#efefef"}`,
            background: isDark ? "#000" : "#fff",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "cursive",
            }}
          >
            Cinderino
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                color: isDark ? "#fff" : "#000",
                position: "relative",
              }}
            >
              ♡
              {MOCK_NOTIFICATIONS.some((n) => !n.isRead) && (
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ff3040",
                  }}
                />
              )}
            </button>
            <button
              onClick={() => setShowCanvas(true)}
              style={{
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                color: isDark ? "#fff" : "#000",
              }}
            >
              ✉
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div
        ref={feedRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {activeTab === "home" && (
          <>
            <StoriesBar
              isDark={isDark}
              storyGroups={MOCK_STORY_GROUPS}
              onStoryClick={handleStoryClick}
            />
            {posts.map((post) => (
         <CinderinoPostCard
  key={post.id}
  post={post}
  isDark={isDark}
  onLike={handleLike}
  onBookmark={handleBookmark}
  onVibe={handleVibeClick}
  onComment={(postId) => {
    // اینجا هندلر کامنت رو بذار
    console.log("comment on", postId);
  }}
/>

              
            ))}
            {isLoading && (
              <div
                style={{
                  textAlign: "center",
                  padding: 20,
                  color: isDark ? "#555" : "#999",
                }}
              >
                Loading more posts...
              </div>
            )}
          </>
        )}

        {activeTab === "explore" && <ExplorePage isDark={isDark} />}

        {activeTab === "profile" && (
          <ProfilePage
            isDark={isDark}
            user={CURRENT_USER}
            onBack={() => setActiveTab("home")}
            onOpenCanvas={() => setShowCanvas(true)}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0",
          borderTop: `1px solid ${isDark ? "#262626" : "#efefef"}`,
          background: isDark ? "#000" : "#fff",
          position: "sticky",
          bottom: 0,
          zIndex: 100,
        }}
      >
        {[
          { tab: "home" as const, icon: "🏠", label: "Home" },
          { tab: "explore" as const, icon: "🔍", label: "Explore" },
          { tab: "create" as const, icon: "➕", label: "Create" },
          { tab: "notifications" as const, icon: "♡", label: "Activity" },
          { tab: "profile" as const, icon: "👤", label: "Profile" },
        ].map(({ tab, icon, label }) => (
          <button
            key={tab}
            onClick={() => {
              if (tab === "create") {
                setShowCreateModal(true);
              } else if (tab === "notifications") {
                setShowNotifications(true);
              } else {
                setActiveTab(tab);
              }
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: activeTab === tab ? (isDark ? "#fff" : "#000") : isDark ? "#666" : "#999",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: "4px 12px",
            }}
            title={label}
          >
            {icon}
            <span style={{ fontSize: 10 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Modals & Overlays */}
      {showStoryViewer && (
        <StoryViewer
          isDark={isDark}
          storyGroups={MOCK_STORY_GROUPS}
          initialIndex={storyStartIndex}
          onClose={() => setShowStoryViewer(false)}
        />
      )}

      {showCreateModal && (
        <CreatePostModal
          isDark={isDark}
          onClose={() => setShowCreateModal(false)}
          onPost={handleCreatePost}
        />
      )}

      {showNotifications && (
        <NotificationsPanel
          isDark={isDark}
          notifications={MOCK_NOTIFICATIONS}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {showCanvas && (
        <CinderinoCanvasLauncher
          isDark={isDark}
          onClose={() => setShowCanvas(false)}
        />
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        div::-webkit-scrollbar { display: none; }
        div { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CinderinoFeed;
