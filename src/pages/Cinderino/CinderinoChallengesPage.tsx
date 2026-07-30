// src/pages/Cinderino/CinderinoChallengesPage.tsx

import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import CinderinoChallengeCard from "../../components/Cinderino/CinderinoChallengeCard";
import type { CinderinoChallenge } from "../../types/cinderino";
import { ArrowRight } from "lucide-react";

const SAMPLE_CHALLENGES: CinderinoChallenge[] = [
  {
    id: "ch-1", title: "چالش طلوع آفتاب", description: "یه عکس از طلوع آفتاب امروز بگیر و به اشتراک بذار!", emoji: "🌅", category: "photography", coverGradient: ["#f97316", "#ef4444"], reward: { type: "badge", emoji: "🏅", title: "نشان طلوع", description: "بهترین عکس طلوع رو ثبت کردی!" }, participantsCount: 234, tags: ["عکاسی", "طلوع", "طبیعت"], startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 8 * 3600000).toISOString(),
  },
  {
    id: "ch-2", title: "چالش قهوه هنری", description: "لاته‌آرت یا هر نوشیدنی خلاقانه‌ای درست کن!", emoji: "☕", category: "art", coverGradient: ["#8b5cf6", "#6366f1"], reward: { type: "feature", emoji: "💎", title: "باریستای خلاق", description: "نوشیدنی خلاقانه‌ات توی صفحه اصلی نمایش داده میشه!" }, participantsCount: 189, tags: ["قهوه", "لاته‌آرت", "خلاقیت"], startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 5 * 3600000).toISOString(),
  },
  {
    id: "ch-3", title: "چالش پیاده‌روی", description: "۱۰ هزار قدم بزن و مسیرت رو به اشتراک بذار 🚶", emoji: "🚶", category: "photography", coverGradient: ["#10b981", "#06b6d4"], reward: { type: "badge", emoji: "⚡", title: "قدم‌زن حرفه‌ای", description: "۱۰ هزار قدم رو تکمیل کردی!" }, participantsCount: 412, tags: ["پیاده‌روی", "سلامت", "ورزش"], startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 12 * 3600000).toISOString(),
  },
  {
    id: "ch-4", title: "چالش آشپزی سریع", description: "یه غذا زیر ۱۵ دقیقه درست کن و عکسش رو بذار!", emoji: "🍳", category: "photography", coverGradient: ["#ec4899", "#f43f5e"], reward: { type: "badge", emoji: "🎨", title: "سرآشپز سریع", description: "غذای ۱۵ دقیقه‌ای رو ساختی!" }, participantsCount: 156, tags: ["آشپزی", "غذا", "سریع"], startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 6 * 3600000).toISOString(),
  },
  {
    id: "ch-5", title: "چالش کتاب‌خوانی", description: "عکس کتابی که الان داری میخونی رو بذار 📖", emoji: "📚", category: "writing", coverGradient: ["#3b82f6", "#8b5cf6"], reward: { type: "boost", emoji: "🌙", title: "کتاب‌خوان", description: "عکس کتابت رو به اشتراک گذاشتی!" }, participantsCount: 98, tags: ["کتاب", "مطالعه", "کتابخوانی"], startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 10 * 3600000).toISOString(),
  },
  {
    id: "ch-6", title: "چالش موسیقی", description: "آهنگی که الان گوش میدی رو معرفی کن 🎵", emoji: "🎵", category: "music", coverGradient: ["#f59e0b", "#ef4444"], reward: { type: "feature", emoji: "🔥", title: "ملودی‌ساز", description: "آهنگ پیشنهادیت به بقیه نمایش داده میشه!" }, participantsCount: 321, tags: ["موسیقی", "آهنگ", "پیشنهاد"], startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 4 * 3600000).toISOString(),
  },
];

export default function CinderinoChallengesPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen pt-20 transition-colors ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <button
            onClick={() => navigate("/cinderino")}
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              border: "none",
              borderRadius: 12,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowRight size={20} color={isDark ? "#fff" : "#1f2937"} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: isDark ? "#fff" : "#1f2937" }}>
              🏆 همه چالش‌ها
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: isDark ? "#8e8e8e" : "#6b7280" }}>
              {SAMPLE_CHALLENGES.length} چالش فعال
            </p>
          </div>
        </div>

        {/* Challenge cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SAMPLE_CHALLENGES.map((ch) => (
            <CinderinoChallengeCard key={ch.id} challenge={ch} />
          ))}
        </div>
      </div>
    </div>
  );
}
