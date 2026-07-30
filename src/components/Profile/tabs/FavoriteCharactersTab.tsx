// src/components/Profile/tabs/FavoriteCharactersTab.tsx
import React, { useState } from "react";
import {
  FiHeart, FiStar, FiExternalLink, FiPlus, FiX,
  FiChevronLeft, FiChevronRight, FiSearch,
} from "react-icons/fi";

// ─── تایپ ───
interface FavoriteCharacter {
  id: string;
  name: string;
  nameJP: string;
  anime: string;
  image: string;
  role: "Main" | "Supporting" | "Antagonist";
  voiceActor: string;
  favorites: number;
  addedAt: string;
  color: string;
}

// ─── داده‌های نمونه ───
const FAVORITE_CHARACTERS: FavoriteCharacter[] = [
  {
    id: "1",
    name: "لِوی آکرمن",
    nameJP: "リヴァイ・アッカーマン",
    anime: "Attack on Titan",
    image: "",
    role: "Main",
    voiceActor: "Hiroshi Kamiya",
    favorites: 124_560,
    addedAt: "1404/09/15",
    color: "#4fc3f7",
  },
  {
    id: "2",
    name: "گوجو ساتورو",
    nameJP: "五条悟",
    anime: "Jujutsu Kaisen",
    image: "",
    role: "Supporting",
    voiceActor: "Yuichi Nakamura",
    favorites: 198_230,
    addedAt: "1404/10/02",
    color: "#ab47bc",
  },
  {
    id: "3",
    name: "ماکیما",
    nameJP: "マキマ",
    anime: "Chainsaw Man",
    image: "",
    role: "Antagonist",
    voiceActor: "Tomori Kusunoki",
    favorites: 87_430,
    addedAt: "1404/08/22",
    color: "#ef5350",
  },
  {
    id: "4",
    name: "فریرن",
    nameJP: "フリーレン",
    anime: "Frieren: Beyond Journey's End",
    image: "",
    role: "Main",
    voiceActor: "Atsumi Tanezaki",
    favorites: 156_890,
    addedAt: "1405/01/05",
    color: "#66bb6a",
  },
  {
    id: "5",
    name: "سونگ جین‌وو",
    nameJP: "成進雨",
    anime: "Solo Leveling",
    image: "",
    role: "Main",
    voiceActor: "Taito Ban",
    favorites: 210_340,
    addedAt: "1404/12/10",
    color: "#7c4dff",
  },
  {
    id: "6",
    name: "زِرو تو",
    nameJP: "ゼロツー",
    anime: "Darling in the Franxx",
    image: "",
    role: "Main",
    voiceActor: "Haruka Tomatsu",
    favorites: 143_670,
    addedAt: "1404/07/18",
    color: "#ff6b6b",
  },
  {
    id: "7",
    name: "اِل لاولایت",
    nameJP: "エル・ローライト",
    anime: "Death Note",
    image: "",
    role: "Main",
    voiceActor: "Kappei Yamaguchi",
    favorites: 176_500,
    addedAt: "1404/06/01",
    color: "#90a4ae",
  },
  {
    id: "8",
    name: "کاکاشی هاتاکه",
    nameJP: "はたけカカシ",
    anime: "Naruto",
    image: "",
    role: "Supporting",
    voiceActor: "Kazuhiko Inoue",
    favorites: 165_200,
    addedAt: "1404/05/20",
    color: "#78909c",
  },
];

// ─── اموجی برای نقش ───
const ROLE_CONFIG: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  Main: { emoji: "⭐", label: "شخصیت اصلی", color: "#ffa726" },
  Supporting: { emoji: "🌟", label: "شخصیت فرعی", color: "#4fc3f7" },
  Antagonist: { emoji: "🔥", label: "آنتاگونیست", color: "#ef5350" },
};

// ═══════════════════════════════════════════
const FavoriteCharactersTab: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* هدر */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>
            <FiHeart
              style={{ marginLeft: 8, verticalAlign: "middle", color: "#ef5350" }}
            />
            شخصیت‌های محبوب
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 12,
              color: "rgba(255,255,255,.4)",
            }}
          >
            {FAVORITE_CHARACTERS.length} شخصیت در لیست علاقه‌مندی
          </p>
        </div>

        {/* تغییر حالت نمایش */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["grid", "list"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border:
                  viewMode === mode
                    ? "1px solid rgba(255,107,53,.4)"
                    : "1px solid rgba(255,255,255,.08)",
                background:
                  viewMode === mode
                    ? "rgba(255,107,53,.12)"
                    : "rgba(255,255,255,.03)",
                color:
                  viewMode === mode
                    ? "#ff6b35"
                    : "rgba(255,255,255,.5)",
                fontSize: 11,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {mode === "grid" ? "گرید" : "لیست"}
            </button>
          ))}
        </div>
      </div>

      {/* ── حالت Grid ── */}
      {viewMode === "grid" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {FAVORITE_CHARACTERS.map((char, index) => {
            const role = ROLE_CONFIG[char.role];
            const isHovered = hoveredId === char.id;

            return (
              <div
                key={char.id}
                onMouseEnter={() => setHoveredId(char.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: isHovered
                    ? `1px solid ${char.color}44`
                    : "1px solid rgba(255,255,255,.06)",
                  background: isHovered
                    ? "rgba(255,255,255,.05)"
                    : "rgba(255,255,255,.02)",
                  transition: "all .3s",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  cursor: "pointer",
                }}
              >
                {/* تصویر placeholder */}
                <div
                  style={{
                    width: "100%",
                    height: 220,
                    background: `linear-gradient(180deg, ${char.color}25, ${char.color}08, rgba(13,13,20,.9))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: 60, opacity: 0.5 }}>
                    {index % 2 === 0 ? "🗡️" : "⚡"}
                  </span>

                  {/* رتبه */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,.6)",
                                            backdropFilter: "blur(6px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,.15)",
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* نقش */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 10,
                      background: "rgba(0,0,0,.55)",
                      color: role.color,
                      border: `1px solid ${role.color}55`,
                    }}
                  >
                    {role.emoji} {role.label}
                  </div>
                </div>

                {/* اطلاعات */}
                <div style={{ padding: 14 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 2,
                    }}
                  >
                    {char.name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.45)",
                      marginBottom: 6,
                    }}
                  >
                    {char.nameJP}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,.65)",
                      marginBottom: 10,
                    }}
                  >
                    {char.anime}
                  </div>

                  {/* پایین کارت */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 11,
                      color: "rgba(255,255,255,.45)",
                    }}
                  >
                    <span>
                      <FiHeart style={{ marginLeft: 4 }} />
                      {char.favorites.toLocaleString()}
                    </span>

                    <span>{char.voiceActor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* حالت لیست */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAVORITE_CHARACTERS.map((char) => {
            const role = ROLE_CONFIG[char.role];

            return (
              <div
                key={char.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.06)",
                  background: "rgba(255,255,255,.02)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 70,
                    borderRadius: 8,
                    background: `linear-gradient(135deg, ${char.color}33, ${char.color}10)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                  }}
                >
                  🎭
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                    {char.name}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,.45)",
                    }}
                  >
                    {char.anime} • {role.label}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: role.color,
                    fontWeight: 600,
                  }}
                >
                  {role.emoji}
                </div>

                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid rgba(255,255,255,.08)",
                    background: "rgba(255,255,255,.04)",
                    color: "rgba(255,255,255,.6)",
                    cursor: "pointer",
                  }}
                >
                  <FiExternalLink size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteCharactersTab;
