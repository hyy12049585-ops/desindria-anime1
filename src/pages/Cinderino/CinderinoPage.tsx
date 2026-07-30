// src/pages/Cinderino/CinderinoPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { cinderinoUsers } from "../../data/cinderinoData";
import CinderinoStoryBar from "../../components/Cinderino/CinderinoStoryBar";
import CinderinoFeed from "../../components/Cinderino/CinderinoFeed";
import CinderinoChallengesCarousel from "../../components/Cinderino/CinderinoChallengesCarousel";
import CreatePostModal from "../../components/Cinderino/CreatePostModal";
import { Plus } from "lucide-react";
import type {
  CinderinoPost,
  CinderinoUser,
  CinderinoChallenge,
  PostVibes,
} from "../../types/cinderino";

const MY_USER: CinderinoUser = {
  id: "me",
  username: "maziar",
  displayName: "مازیار",
  avatar: "",
  banner: "",
  bio: "",
  link: "",
  isVerified: false,
  isPrivate: false,
  joinedAt: new Date().toISOString(),
};

const DEFAULT_VIBES: PostVibes = {
  fire: 0,
  diamond: 0,
  moon: 0,
  lightning: 0,
  palette: 0,
};

const SAMPLE_CHALLENGES: CinderinoChallenge[] = [
  {
    id: "ch-1",
    title: "چالش طلوع آفتاب",
    description: "یه عکس از طلوع آفتاب امروز بگیر و به اشتراک بذار!",
    emoji: "🌅",
    category: "photography",
    coverGradient: ["#f97316", "#ef4444"],
    reward: {
      type: "badge",
      emoji: "🏅",
      title: "نشان طلوع",
      description: "بهترین عکس طلوع رو ثبت کردی!",
    },
    participantsCount: 234,
    tags: ["عکاسی", "طلوع", "طبیعت"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 8 * 3600000).toISOString(),
  },
  {
    id: "ch-2",
    title: "چالش قهوه هنری",
    description: "لاته‌آرت یا هر نوشیدنی خلاقانه‌ای درست کن!",
    emoji: "☕",
    category: "art",
    coverGradient: ["#8b5cf6", "#6366f1"],
    reward: {
      type: "feature",
      emoji: "💎",
      title: "باریستای خلاق",
      description: "نوشیدنی خلاقانه‌ات توی صفحه اصلی نمایش داده میشه!",
    },
    participantsCount: 189,
    tags: ["قهوه", "لاته‌آرت", "خلاقیت"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 5 * 3600000).toISOString(),
  },
  {
    id: "ch-3",
    title: "چالش پیاده‌روی",
    description: "۱۰ هزار قدم بزن و مسیرت رو به اشتراک بذار 🚶",
    emoji: "🚶",
    category: "photography",
    coverGradient: ["#10b981", "#06b6d4"],
    reward: {
      type: "badge",
      emoji: "⚡",
      title: "قدم‌زن حرفه‌ای",
      description: "۱۰ هزار قدم رو تکمیل کردی!",
    },
    participantsCount: 412,
    tags: ["پیاده‌روی", "سلامت", "ورزش"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 12 * 3600000).toISOString(),
  },
  {
    id: "ch-4",
    title: "چالش آشپزی سریع",
    description: "یه غذا زیر ۱۵ دقیقه درست کن و عکسش رو بذار!",
    emoji: "🍳",
    category: "photography",
    coverGradient: ["#ec4899", "#f43f5e"],
    reward: {
      type: "badge",
      emoji: "🎨",
      title: "سرآشپز سریع",
      description: "غذای ۱۵ دقیقه‌ای رو ساختی!",
    },
    participantsCount: 156,
    tags: ["آشپزی", "غذا", "سریع"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 6 * 3600000).toISOString(),
  },
  {
    id: "ch-5",
    title: "چالش کتاب‌خوانی",
    description: "عکس کتابی که الان داری میخونی رو بذار 📖",
    emoji: "📚",
    category: "writing",
    coverGradient: ["#3b82f6", "#8b5cf6"],
    reward: {
      type: "boost",
      emoji: "🌙",
      title: "کتاب‌خوان",
      description: "عکس کتابت رو به اشتراک گذاشتی!",
    },
    participantsCount: 98,
    tags: ["کتاب", "مطالعه", "کتابخوانی"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 10 * 3600000).toISOString(),
  },
  {
    id: "ch-6",
    title: "چالش موسیقی",
    description: "آهنگی که الان گوش میدی رو معرفی کن 🎵",
    emoji: "🎵",
    category: "music",
    coverGradient: ["#f59e0b", "#ef4444"],
    reward: {
      type: "feature",
      emoji: "🔥",
      title: "ملودی‌ساز",
      description: "آهنگ پیشنهادیت به بقیه نمایش داده میشه!",
    },
    participantsCount: 321,
    tags: ["موسیقی", "آهنگ", "پیشنهاد"],
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 4 * 3600000).toISOString(),
  },
];

const STORAGE_KEY = "cinderino_my_posts";

function loadMyPosts(): CinderinoPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveMyPosts(posts: CinderinoPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export default function CinderinoPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [myPosts, setMyPosts] = useState<CinderinoPost[]>(loadMyPosts);

  useEffect(() => {
    saveMyPosts(myPosts);
  }, [myPosts]);

  const handleCreatePost = (data: {
    images: File[];
    caption: string;
    tags: string[];
    downloadable: boolean;
  }) => {
    const readers = data.images.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((base64Images) => {
      const newPost: CinderinoPost = {
        id: `post-${Date.now()}`,
        authorId: MY_USER.id,
        author: MY_USER,
        images: base64Images,
        caption: data.caption,
        tags: data.tags,
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        isLiked: false,
        isBookmarked: false,
        vibes: { ...DEFAULT_VIBES },
      };

      setMyPosts((prev) => [newPost, ...prev]);
      setShowCreatePost(false);
    });
  };

  const handleShowAllChallenges = () => {
    navigate("/cinderino/challenges");
  };

  return (
    <div
      className={`min-h-screen pt-20 transition-colors ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
            style={{ fontFamily: "inherit" }}
          >
            🌟 سیندرینو
          </h1>
          <span
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {cinderinoUsers.length} کاربر فعال
          </span>
        </div>

        {/* ─── Story Bar ─── */}
        <div className="mb-6">
          <CinderinoStoryBar />
        </div>

        {/* ─── 🏆 Challenges Carousel ─── */}
        <CinderinoChallengesCarousel
          challenges={SAMPLE_CHALLENGES}
          onShowAll={handleShowAllChallenges}
        />

        {/* ─── Feed ─── */}
        <CinderinoFeed extraPosts={myPosts} />
      </div>

      {/* ─── FAB ─── */}
      <button
        onClick={() => setShowCreatePost(true)}
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#ff6b6b",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(255,107,107,0.4)",
          zIndex: 100,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform =
            "translateX(-50%) scale(1.1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform =
            "translateX(-50%) scale(1)")
        }
      >
        <Plus size={28} color="#fff" />
      </button>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
