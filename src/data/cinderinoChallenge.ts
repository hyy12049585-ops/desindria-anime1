import { CinderinoChallenge } from "../types/cinderino";

// ساخت تاریخ‌های داینامیک (چالش امروز + فردا)
const now = new Date();
const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).toISOString();

export const sampleChallenges: CinderinoChallenge[] = [
  {
    id: "ch-1",
    title: "Golden Hour",
    description: "یه عکس از نور طلایی غروب بگیر و به اشتراک بذار",
    emoji: "🌅",
    category: "photography",
    startsAt: todayStart,
    endsAt: todayEnd,
    reward: {
      type: "badge",
      title: "Golden Eye",
      emoji: "👁️‍🗨️",
      description: "بج عکاس طلایی",
    },
    participantsCount: 234,
    coverGradient: ["#f59e0b", "#ef4444"],
    tags: ["golden_hour", "sunset", "photography"],
  },
  {
    id: "ch-2",
    title: "Minimal Art",
    description: "یه اثر هنری مینیمال بساز، کمتر بیشتره!",
    emoji: "🎨",
    category: "art",
    startsAt: todayStart,
    endsAt: todayEnd,
    reward: {
      type: "feature",
      title: "Featured Artist",
      emoji: "⭐",
      description: "نمایش در صفحه اکسپلور",
    },
    participantsCount: 189,
    coverGradient: ["#8b5cf6", "#ec4899"],
    tags: ["minimal", "art", "creative"],
  },
  {
    id: "ch-3",
    title: "Neon Dreams",
    description: "دنیای نئونی خودت رو طراحی کن",
    emoji: "💜",
    category: "design",
    startsAt: todayStart,
    endsAt: tomorrowEnd,
    reward: {
      type: "boost",
      title: "Neon Boost",
      emoji: "🚀",
      description: "بوست ۲۴ ساعته پست",
    },
    participantsCount: 312,
    coverGradient: ["#06b6d4", "#8b5cf6"],
    tags: ["neon", "design", "cyberpunk"],
  },
  {
    id: "ch-4",
    title: "Micro Poetry",
    description: "یه شعر کوتاه ۳ خطی بنویس و تصویرش کن",
    emoji: "✍️",
    category: "writing",
    startsAt: todayStart,
    endsAt: tomorrowEnd,
    reward: {
      type: "badge",
      title: "Word Wizard",
      emoji: "📝",
      description: "بج شاعر سیندرینو",
    },
    participantsCount: 156,
    coverGradient: ["#10b981", "#06b6d4"],
    tags: ["poetry", "writing", "micro"],
  },
];
