// src/components/Profile/tabs/ActivityTimeline.tsx
import React, { useState } from "react";
import {
  FiPlay, FiCheckCircle, FiStar, FiMessageSquare, FiHeart,
  FiClock, FiFilter, FiChevronDown, FiEye, FiEdit3,
  FiBookmark, FiTrash2, FiRefreshCw, FiCalendar,
} from "react-icons/fi";

// ─── تایپ‌ها ───
type ActivityType =
  | "watched_episode"
  | "completed"
  | "scored"
  | "reviewed"
  | "favorited"
  | "planned"
  | "dropped"
  | "rewatched"
  | "status_update";

interface Activity {
  id: string;
  type: ActivityType;
  animeName: string;
  animeImage: string;
  detail: string;
  timestamp: string;
  relativeTime: string;
  extra?: string; // مثل امتیاز یا شماره اپیزود
}

// ─── تنظیمات نوع فعالیت ───
const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; label: string; bgColor: string }
> = {
  watched_episode: {
    icon: <FiPlay size={14} />,
    color: "#4fc3f7",
    label: "تماشای اپیزود",
    bgColor: "rgba(79,195,247,.12)",
  },
  completed: {
    icon: <FiCheckCircle size={14} />,
    color: "#66bb6a",
    label: "تکمیل",
    bgColor: "rgba(102,187,106,.12)",
  },
  scored: {
    icon: <FiStar size={14} />,
    color: "#ffa726",
    label: "امتیازدهی",
    bgColor: "rgba(255,167,38,.12)",
  },
  reviewed: {
    icon: <FiEdit3 size={14} />,
    color: "#ab47bc",
    label: "نقد",
    bgColor: "rgba(171,71,188,.12)",
  },
  favorited: {
    icon: <FiHeart size={14} />,
    color: "#ef5350",
    label: "علاقه‌مندی",
    bgColor: "rgba(239,83,80,.12)",
  },
  planned: {
    icon: <FiBookmark size={14} />,
    color: "#78909c",
    label: "برنامه تماشا",
    bgColor: "rgba(120,144,156,.12)",
  },
  dropped: {
    icon: <FiTrash2 size={14} />,
    color: "#e53935",
    label: "رها شده",
    bgColor: "rgba(229,57,53,.12)",
  },
  rewatched: {
    icon: <FiRefreshCw size={14} />,
    color: "#29b6f6",
    label: "تماشای مجدد",
    bgColor: "rgba(41,182,246,.12)",
  },
  status_update: {
    icon: <FiEye size={14} />,
    color: "#8bc34a",
    label: "تغییر وضعیت",
    bgColor: "rgba(139,195,74,.12)",
  },
};

// ─── داده‌های نمونه ───
const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "watched_episode",
    animeName: "Solo Leveling Season 2",
    animeImage: "https://cdn.myanimelist.net/images/anime/1-solo.jpg",
    detail: "اپیزود ۸ رو تماشا کرد",
    timestamp: "1405/01/21 - 14:30",
    relativeTime: "۲ ساعت پیش",
    extra: "EP 8",
  },
  {
    id: "2",
    type: "scored",
    animeName: "Frieren: Beyond Journey's End",
    animeImage: "https://cdn.myanimelist.net/images/anime/2-frieren.jpg",
    detail: "امتیاز ۹.۵ از ۱۰ داد",
    timestamp: "1405/01/21 - 12:15",
    relativeTime: "۴ ساعت پیش",
    extra: "9.5 ⭐",
  },
  {
    id: "3",
    type: "completed",
    animeName: "Dandadan",
    animeImage: "https://cdn.myanimelist.net/images/anime/3-dandadan.jpg",
    detail: "انیمه رو تکمیل کرد!",
    timestamp: "1405/01/21 - 10:00",
    relativeTime: "۶ ساعت پیش",
    extra: "12/12 EP",
  },
  {
    id: "4",
    type: "reviewed",
    animeName: "Attack on Titan: The Final Season",
    animeImage: "https://cdn.myanimelist.net/images/anime/4-aot.jpg",
    detail: "نقد و بررسی نوشت",
    timestamp: "1405/01/20 - 22:45",
    relativeTime: "دیروز",
    extra: "نقد",
  },
  {
    id: "5",
    type: "favorited",
    animeName: "Steins;Gate",
    animeImage: "https://cdn.myanimelist.net/images/anime/5-steins.jpg",
    detail: "به لیست علاقه‌مندی اضافه کرد",
    timestamp: "1405/01/20 - 20:30",
    relativeTime: "دیروز",
  },
  {
    id: "6",
    type: "watched_episode",
    animeName: "Blue Lock Season 2",
    animeImage: "https://cdn.myanimelist.net/images/anime/6-bluelock.jpg",
    detail: "اپیزود ۱۲ رو تماشا کرد",
    timestamp: "1405/01/20 - 18:00",
    relativeTime: "دیروز",
    extra: "EP 12",
  },
  {
    id: "7",
    type: "planned",
    animeName: "Chainsaw Man Season 2",
    animeImage: "https://cdn.myanimelist.net/images/anime/7-csm.jpg",
    detail: "به برنامه تماشا اضافه کرد",
    timestamp: "1405/01/20 - 15:20",
    relativeTime: "دیروز",
  },
  {
    id: "8",
    type: "rewatched",
    animeName: "Death Note",
    animeImage: "https://cdn.myanimelist.net/images/anime/8-dn.jpg",
    detail: "تماشای مجدد شروع کرد",
    timestamp: "1405/01/19 - 21:00",
    relativeTime: "۲ روز پیش",
  },
  {
    id: "9",
    type: "scored",
    animeName: "Jujutsu Kaisen Season 2",
    animeImage: "https://cdn.myanimelist.net/images/anime/9-jjk.jpg",
    detail: "امتیاز ۸.۵ از ۱۰ داد",
    timestamp: "1405/01/19 - 16:45",
    relativeTime: "۲ روز پیش",
    extra: "8.5 ⭐",
  },
  {
    id: "10",
    type: "completed",
    animeName: "Mob Psycho 100 III",
    animeImage: "https://cdn.myanimelist.net/images/anime/10-mob.jpg",
    detail: "انیمه رو تکمیل کرد!",
    timestamp: "1405/01/18 - 14:30",
    relativeTime: "۳ روز پیش",
    extra: "12/12 EP",
  },
  {
    id: "11",
    type: "dropped",
    animeName: "Fairy Tail: 100 Year Quest",
    animeImage: "https://cdn.myanimelist.net/images/anime/11-ft.jpg",
    detail: "اپیزود ۵ رها کرد",
    timestamp: "1405/01/17 - 22:10",
    relativeTime: "۴ روز پیش",
    extra: "EP 5",
  },
  {
    id: "12",
    type: "watched_episode",
    animeName: "One Piece",
    animeImage: "https://cdn.myanimelist.net/images/anime/12-op.jpg",
    detail: "اپیزود ۱۱۲۲ رو تماشا کرد",
    timestamp: "1405/01/17 - 19:00",
    relativeTime: "۴ روز پیش",
    extra: "EP 1122",
  },
];

// ─── گروه‌بندی بر اساس تاریخ ───
function groupByDate(activities: Activity[]): Record<string, Activity[]> {
  const groups: Record<string, Activity[]> = {};
  activities.forEach((a) => {
    const dateKey =
      a.relativeTime === "۲ ساعت پیش" || a.relativeTime === "۴ ساعت پیش" || a.relativeTime === "۶ ساعت پیش"
        ? "امروز"
        : a.relativeTime === "دیروز"
        ? "دیروز"
        : a.relativeTime;
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(a);
  });
  return groups;
}

// ─── فیلترها ───
const FILTER_OPTIONS = [
  { key: "all", label: "همه", icon: <FiFilter size={12} /> },
  { key: "watched_episode", label: "تماشا", icon: <FiPlay size={12} /> },
  { key: "completed", label: "تکمیل", icon: <FiCheckCircle size={12} /> },
  { key: "scored", label: "امتیاز", icon: <FiStar size={12} /> },
  { key: "reviewed", label: "نقد", icon: <FiEdit3 size={12} /> },
  { key: "favorited", label: "علاقه‌مندی", icon: <FiHeart size={12} /> },
];

// ═══════════════════════════════════════════
const ActivityTimeline: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(8);

  const filtered =
    filter === "all"
      ? SAMPLE_ACTIVITIES
      : SAMPLE_ACTIVITIES.filter((a) => a.type === filter);

  const visible = filtered.slice(0, visibleCount);
  const grouped = groupByDate(visible);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* هدر */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>
            <FiClock style={{ marginLeft: 8, verticalAlign: "middle" }} />
            تایم‌لاین فعالیت
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,.4)" }}>
            تاریخچه فعالیت‌های اخیر شما
          </p>
        </div>

        {/* فیلترها */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setVisibleCount(8);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "5px 12px",
                borderRadius: 8,
                border:
                  filter === f.key
                    ? "1px solid rgba(255,107,53,.4)"
                    : "1px solid rgba(255,255,255,.08)",
                background:
                  filter === f.key
                    ? "rgba(255,107,53,.12)"
                    : "rgba(255,255,255,.03)",
                color:
                  filter === f.key
                    ? "#ff6b35"
                    : "rgba(255,255,255,.5)",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── تایم‌لاین ── */}
      {Object.entries(grouped).map(([dateKey, activities]) => (
        <div key={dateKey}>
          {/* عنوان روز */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <FiCalendar size={13} color="rgba(255,255,255,.3)" />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,.5)",
              }}
            >
              {dateKey}
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,.06)",
              }}
            />
          </div>

          {/* آیتم‌های فعالیت */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {activities.map((activity, idx) => {
              const config = ACTIVITY_CONFIG[activity.type];
              return (
                <div
                  key={activity.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    position: "relative",
                  }}
                >
                  {/* خط عمودی تایم‌لاین */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: 36,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: config.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: config.color,
                        flexShrink: 0,
                        zIndex: 1,
                      }}
                    >
                      {config.icon}
                    </div>
                    {idx < activities.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          minHeight: 16,
                          background: "rgba(255,255,255,.06)",
                        }}
                      />
                    )}
                  </div>

                  {/* محتوای فعالیت */}
                  <div
                    style={{
                      flex: 1,
                      padding: "10px 16px 20px",
                      borderRadius: 12,
                      background: "rgba(255,255,255,.02)",
                      border: "1px solid rgba(255,255,255,.05)",
                      marginBottom: idx < activities.length - 1 ? 0 : 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      transition: "border-color .2s, background .2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${config.color}33`;
                      e.currentTarget.style.background = "rgba(255,255,255,.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.05)";
                      e.currentTarget.style.background = "rgba(255,255,255,.02)";
                    }}
                  >
                    {/* تصویر انیمه placeholder */}
                    <div
                      style={{
                        width: 48,
                        height: 64,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${config.color}22, ${config.color}08)`,
                        border: `1px solid ${config.color}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      🎬
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          marginBottom: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activity.animeName}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,.5)",
                          marginBottom: 4,
                        }}
                      >
                        {activity.detail}
                      </div>

                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,.3)",
                        }}
                      >
                        {activity.timestamp}
                      </div>
                    </div>

                    {/* بج اضافی */}
                    {activity.extra && (
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: `${config.color}18`,
                          border: `1px solid ${config.color}33`,
                          fontSize: 11,
                          fontWeight: 600,
                          color: config.color,
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {activity.extra}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* دکمه نمایش بیشتر */}
      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 6)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "12px 24px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.03)",
            color: "rgba(255,255,255,.6)",
            fontSize: 13,
            cursor: "pointer",
            transition: "all .2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,107,53,.3)";
            e.currentTarget.style.color = "#ff6b35";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
            e.currentTarget.style.color = "rgba(255,255,255,.6)";
          }}
        >
          <FiChevronDown size={16} />
          نمایش بیشتر
        </button>
      )}

      {/* خالی بودن */}
      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "rgba(255,255,255,.3)",
            fontSize: 13,
          }}
        >
          هیچ فعالیتی با این فیلتر یافت نشد
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
