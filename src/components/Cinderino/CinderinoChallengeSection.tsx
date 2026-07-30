import React, { useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { sampleChallenges } from "../../data/cinderinoChallenge";
import CinderinoChallengeCard from "./CinderinoChallengeCard";

const CinderinoChallengeSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const activeChallenges = sampleChallenges.filter(
    (c) => new Date(c.endsAt).getTime() > Date.now()
  );

  if (activeChallenges.length === 0) return null;

  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: `1px solid ${isDark ? "rgba(139,92,246,0.1)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px 12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 20,
              animation: "challengeIconBounce 2s ease-in-out infinite",
              display: "inline-block",
            }}
          >
            🏆
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 700,
              color: isDark ? "#e2d9f3" : "#1a1a2e",
            }}
          >
            چالش‌های امروز
          </h3>
          <span
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 10,
            }}
          >
            {activeChallenges.length} فعال
          </span>
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: "none",
            border: "none",
            color: "#8b5cf6",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {showAll ? "کمتر" : "همه"}
        </button>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          padding: "4px 16px 12px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {(showAll ? activeChallenges : activeChallenges.slice(0, 3)).map((ch) => (
          <div key={ch.id} style={{ scrollSnapAlign: "start" }}>
            <CinderinoChallengeCard challenge={ch} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes challengeIconBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-5deg); }
          75% { transform: translateY(-3px) rotate(5deg); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CinderinoChallengeSection;
