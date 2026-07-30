// src/utils/xpSystem.ts

export interface RankInfo {
  name: string;
  nameEn: string;
  color: string;
  gradient: string;
  minLevel: number;
  icon: string;
}

const RANKS: RankInfo[] = [
  { name: "تازه‌کار", nameEn: "Newbie", color: "#9CA3AF", gradient: "from-gray-400 to-gray-500", minLevel: 0, icon: "🌱" },
  { name: "تماشاگر", nameEn: "Viewer", color: "#60A5FA", gradient: "from-blue-400 to-blue-500", minLevel: 5, icon: "👁️" },
  { name: "طرفدار", nameEn: "Fan", color: "#34D399", gradient: "from-emerald-400 to-emerald-500", minLevel: 10, icon: "⭐" },
  { name: "حرفه‌ای", nameEn: "Pro", color: "#A78BFA", gradient: "from-violet-400 to-violet-500", minLevel: 20, icon: "🔮" },
  { name: "استاد", nameEn: "Master", color: "#F472B6", gradient: "from-pink-400 to-pink-500", minLevel: 35, icon: "👑" },
  { name: "افسانه‌ای", nameEn: "Legend", color: "#FBBF24", gradient: "from-amber-400 to-amber-500", minLevel: 50, icon: "🏆" },
  { name: "اوتاکو", nameEn: "Otaku", color: "#F43F5E", gradient: "from-rose-400 to-red-500", minLevel: 75, icon: "🎌" },
];

// XP مورد نیاز برای هر لول: فرمول نمایی
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level));
}

// محاسبه لول از روی کل XP
export function calculateLevel(totalXp: number): { level: number; currentXp: number; requiredXp: number; progress: number } {
  let level = 0;
  let remaining = totalXp;

  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }

  const required = xpForLevel(level);
  return {
    level,
    currentXp: remaining,
    requiredXp: required,
    progress: (remaining / required) * 100,
  };
}

// گرفتن رنک بر اساس لول
export function getRank(level: number): RankInfo {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
    else break;
  }
  return current;
}

// XP اکشن‌های مختلف
export const XP_ACTIONS = {
  WATCH_EPISODE: 10,
  COMPLETE_ANIME: 50,
  RATE_ANIME: 5,
  ADD_FAVORITE: 3,
  FIRST_ANIME: 100,
  STREAK_7_DAYS: 70,
  WATCH_100_EPISODES: 200,
} as const;
