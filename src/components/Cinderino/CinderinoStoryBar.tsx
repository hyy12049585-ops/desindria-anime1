import React, { useState, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { CinderinoStoryGroup } from "../../types/cinderino";
import { sampleStoryGroups } from "../../data/cinderinoStories";
import CinderinoStoryViewer from "./CinderinoStoryViewer";

const CinderinoStoryBar: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);

  const [storyGroups, setStoryGroups] =
    useState<CinderinoStoryGroup[]>(sampleStoryGroups);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const openStory = (index: number) => {
    setActiveGroupIndex(index);
    setViewerOpen(true);
  };

  const markSeen = (groupId: string) => {
    setStoryGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, seen: true } : g))
    );
  };

  const closeViewer = () => setViewerOpen(false);

  const sorted = [...storyGroups].sort(
    (a, b) => Number(a.seen) - Number(b.seen)
  );

  // رنگ‌های مختلف برای هر Orb
  const orbColors = [
    ["#8b5cf6", "#ec4899"],
    ["#06b6d4", "#3b82f6"],
    ["#f59e0b", "#ef4444"],
    ["#10b981", "#06b6d4"],
    ["#ec4899", "#f59e0b"],
    ["#8b5cf6", "#06b6d4"],
    ["#ef4444", "#ec4899"],
    ["#3b82f6", "#8b5cf6"],
  ];

  const getOrbGradient = (index: number) => {
    const colors = orbColors[index % orbColors.length];
    return `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  };

  const getOrbGlow = (index: number) => {
    const colors = orbColors[index % orbColors.length];
    return colors[0];
  };

  return (
    <>
      <div
        style={{
          padding: "16px 0 12px",
          borderBottom: `1px solid ${isDark ? "rgba(139,92,246,0.12)" : "rgba(0,0,0,0.06)"}`,
          background: isDark
            ? "linear-gradient(180deg, rgba(15,10,26,0.6), transparent)"
            : "linear-gradient(180deg, rgba(139,92,246,0.03), transparent)",
        }}
      >
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 18,
            overflowX: "auto",
            padding: "8px 16px 12px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* ─── Add Story Orb ─── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              flexShrink: 0,
            }}
            onMouseEnter={() => setHoveredId("add")}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              style={{
                position: "relative",
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: isDark
                  ? "rgba(139,92,246,0.1)"
                  : "rgba(139,92,246,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${isDark ? "rgba(139,92,246,0.5)" : "rgba(139,92,246,0.3)"}`,
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hoveredId === "add" ? "scale(1.12)" : "scale(1)",
                boxShadow: hoveredId === "add"
                  ? "0 0 30px rgba(139,92,246,0.3)"
                  : "none",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  color: "#8b5cf6",
                  transition: "transform 0.3s ease",
                  transform: hoveredId === "add" ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>

              {/* Floating particles */}
              {hoveredId === "add" && (
                <>
                  <span style={{ ...floatingDotStyle, top: -4, right: 8, animationDelay: "0s" }} />
                  <span style={{ ...floatingDotStyle, bottom: 2, left: 6, animationDelay: "0.3s" }} />
                  <span style={{ ...floatingDotStyle, top: 10, left: -2, animationDelay: "0.6s" }} />
                </>
              )}
            </div>
            <span
              style={{
                fontSize: 11,
                color: isDark ? "#c4b5fd" : "#7c3aed",
                fontWeight: 600,
                maxWidth: 68,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              استوری من
            </span>
          </div>

          {/* ─── Story Orbs ─── */}
          {sorted.map((group, idx) => {
            const isHovered = hoveredId === group.id;
            const isSeen = group.seen;

            return (
              <div
                key={group.id}
                onClick={() => openStory(idx)}
                onMouseEnter={() => setHoveredId(group.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 68,
                    height: 68,
                  }}
                >
                  {/* Outer glow ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: -3,
                      borderRadius: "50%",
                      background: isSeen
                        ? isDark
                          ? "rgba(100,100,100,0.2)"
                          : "rgba(200,200,200,0.3)"
                        : getOrbGradient(idx),
                      opacity: isSeen ? 0.5 : 1,
                      transition: "all 0.4s ease",
                      animation: !isSeen && isHovered
                        ? "cinderinoOrbPulse 1.5s ease-in-out infinite"
                        : "none",
                    }}
                  />

                  {/* Glow effect */}
                  {!isSeen && (
                    <div
                      style={{
                        position: "absolute",
                        inset: -8,
                        borderRadius: "50%",
                        background: getOrbGradient(idx),
                        filter: "blur(12px)",
                        opacity: isHovered ? 0.5 : 0.15,
                        transition: "opacity 0.4s ease",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* Avatar container */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      padding: 3,
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      transform: isHovered ? "scale(1.12)" : "scale(1)",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={group.avatar}
                      alt={group.username}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3px solid ${isDark ? "#0f0a1a" : "#fff"}`,
                      }}
                    />
                  </div>

                  {/* Story count badge */}
                  {group.stories.length > 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: isSeen
                          ? isDark ? "#444" : "#bbb"
                          : getOrbGlow(idx),
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${isDark ? "#0f0a1a" : "#fff"}`,
                        zIndex: 3,
                        boxShadow: isSeen
                          ? "none"
                          : `0 0 8px ${getOrbGlow(idx)}60`,
                      }}
                    >
                      {group.stories.length}
                    </div>
                  )}

                  {/* Floating particles on hover */}
                  {isHovered && !isSeen && (
                    <>
                      <span
                        style={{
                          ...floatingDotStyle,
                          top: -6,
                          right: 10,
                          background: getOrbGlow(idx),
                          animationDelay: "0s",
                        }}
                      />
                      <span
                        style={{
                          ...floatingDotStyle,
                          bottom: 0,
                          left: 4,
                          background: getOrbGlow(idx),
                          animationDelay: "0.4s",
                        }}
                      />
                      <span
                        style={{
                          ...floatingDotStyle,
                          top: 14,
                          left: -4,
                          background: getOrbGlow(idx),
                          animationDelay: "0.2s",
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Username */}
                <span
                  style={{
                    fontSize: 11,
                    color: isSeen
                      ? isDark ? "#555" : "#aaa"
                      : isHovered
                        ? getOrbGlow(idx)
                        : isDark ? "#e2d9f3" : "#333",
                    fontWeight: isSeen ? 400 : 600,
                    maxWidth: 68,
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    transition: "color 0.3s ease",
                  }}
                >
                  {group.username}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {viewerOpen && (
        <CinderinoStoryViewer
          groups={sorted}
          initialGroupIndex={activeGroupIndex}
          onClose={closeViewer}
          onSeen={markSeen}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes cinderinoOrbPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes cinderinoFloatDot {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-18px) scale(0); opacity: 0; }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

/* ─── Floating Dot Style ─── */
const floatingDotStyle: React.CSSProperties = {
  position: "absolute",
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "#8b5cf6",
  animation: "cinderinoFloatDot 1.2s ease-in-out infinite",
  pointerEvents: "none",
  zIndex: 10,
};

export default CinderinoStoryBar;
