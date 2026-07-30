import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { CinderinoChallenge } from "../../types/cinderino";
import { isChallengeJoined, joinChallenge, leaveChallenge } from "../../utils/cinderinoStorage";

interface Props {
  challenge: CinderinoChallenge;
}

const CinderinoChallengeCard: React.FC<Props> = ({ challenge }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [joined, setJoined] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [hovered, setHovered] = useState(false);
  const [joinAnim, setJoinAnim] = useState(false);

  useEffect(() => {
    setJoined(isChallengeJoined(challenge.id));
  }, [challenge.id]);

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const end = new Date(challenge.endsAt).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("تموم شد!");
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [challenge.endsAt]);

  const handleToggle = () => {
    setJoinAnim(true);
    setTimeout(() => setJoinAnim(false), 400);

    if (joined) {
      leaveChallenge(challenge.id);
      setJoined(false);
    } else {
      joinChallenge(challenge.id);
      setJoined(true);
    }
  };

  const [c1, c2] = challenge.coverGradient;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        minWidth: 260,
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        transform: hovered ? "scale(1.04) translateY(-4px)" : "scale(1)",
        boxShadow: hovered
          ? `0 12px 40px ${c1}40, 0 0 60px ${c1}15`
          : `0 4px 20px ${c1}20`,
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          opacity: 0.9,
        }}
      />

      {/* Glassmorphism overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "rgba(0,0,0,0.25)"
            : "rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Floating decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          transition: "transform 0.4s ease",
          transform: hovered ? "scale(1.3)" : "scale(1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -15,
          left: -15,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, padding: "20px 18px" }}>
        {/* Header: emoji + timer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span
            style={{
              fontSize: 36,
              filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
              transition: "transform 0.3s ease",
              transform: hovered ? "scale(1.2) rotate(-8deg)" : "scale(1)",
              display: "inline-block",
            }}
          >
            {challenge.emoji}
          </span>

          {/* Timer pill */}
          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "4px 12px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 10 }}>⏱️</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                fontFamily: "monospace",
                letterSpacing: 1,
              }}
            >
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 18,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {challenge.title}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 12,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.5,
            direction: "rtl",
          }}
        >
          {challenge.description}
        </p>

        {/* Reward badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            borderRadius: 12,
            padding: "5px 10px",
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 14 }}>{challenge.reward.emoji}</span>
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>
            {challenge.reward.title}
          </span>
        </div>

        {/* Footer: participants + join button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12 }}>👥</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
              {(challenge.participantsCount + (joined ? 1 : 0)).toLocaleString("fa-IR")}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            style={{
              background: joined
                ? "rgba(255,255,255,0.2)"
                : "rgba(255,255,255,0.95)",
              color: joined ? "#fff" : c1,
              border: "none",
              borderRadius: 14,
              padding: "7px 18px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: joinAnim ? "scale(1.15)" : "scale(1)",
              boxShadow: joined ? "none" : "0 4px 15px rgba(0,0,0,0.2)",
              fontFamily: "inherit",
            }}
          >
            {joined ? "✓ شرکت کردم" : "شرکت میکنم 🚀"}
          </button>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
            animation: "challengeShimmer 1.5s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      )}

      <style>{`
        @keyframes challengeShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default CinderinoChallengeCard;
