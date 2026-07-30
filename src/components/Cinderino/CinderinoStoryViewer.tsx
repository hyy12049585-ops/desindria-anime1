import React, { useState, useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { CinderinoStoryGroup } from "../../types/cinderino";

interface Props {
  groups: CinderinoStoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
  onSeen: (groupId: string) => void;
}

const STORY_DURATION = 5000; // 5 ثانیه

const CinderinoStoryViewer: React.FC<Props> = ({
  groups,
  initialGroupIndex,
  onClose,
  onSeen,
}) => {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const elapsedRef = useRef(0);

  const currentGroup = groups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];
  const duration = currentStory?.duration ?? STORY_DURATION;

  // Mark seen
  useEffect(() => {
    if (currentGroup && !currentGroup.seen) {
      onSeen(currentGroup.id);
    }
  }, [groupIndex, currentGroup, onSeen]);

  // Progress timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current);
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        goNext();
      }
    }, 30);
  }, [duration, groupIndex, storyIndex, groups.length]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    elapsedRef.current += Date.now() - startTimeRef.current;
  }, []);

  // Reset and start on story change
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
    if (!paused) startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [groupIndex, storyIndex]);

  useEffect(() => {
    if (paused) pauseTimer();
    else startTimer();
  }, [paused]);

  const goNext = useCallback(() => {
    elapsedRef.current = 0;
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex((s) => s + 1);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex((g) => g + 1);
      setStoryIndex(0);
    } else {
      onClose();
    }
  }, [storyIndex, groupIndex, currentGroup, groups.length, onClose]);

  const goPrev = useCallback(() => {
    elapsedRef.current = 0;
    if (storyIndex > 0) {
      setStoryIndex((s) => s - 1);
    } else if (groupIndex > 0) {
      setGroupIndex((g) => g - 1);
      setStoryIndex(groups[groupIndex - 1].stories.length - 1);
    }
  }, [storyIndex, groupIndex, groups]);

  // Tap zones
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width * 0.3) goPrev();
    else if (x > rect.width * 0.7) goNext();
  };

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        // RTL: right = prev, left = next
        if (e.key === "ArrowRight") goPrev();
        else goNext();
      }
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onClose]);

  if (!currentGroup || !currentStory) return null;

  // Story content
  const renderContent = () => {
    if (currentStory.type === "text") {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: currentStory.bgColor || "linear-gradient(135deg, #8b5cf6, #ec4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
              textAlign: "center",
              lineHeight: 1.8,
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {currentStory.content}
          </p>
        </div>
      );
    }

    if (currentStory.type === "video") {
      return (
        <video
          src={currentStory.content}
          autoPlay
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      );
    }

    // image (default)
    return (
      <img
        src={currentStory.content}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          height: "100%",
          maxHeight: "100dvh",
          overflow: "hidden",
          borderRadius: 0,
        }}
      >
        {/* Story Content */}
        <div
          onClick={handleTap}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {renderContent()}
        </div>

        {/* Progress Bars */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: 3,
            padding: "10px 12px 0",
            zIndex: 10,
          }}
        >
          {currentGroup.stories.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: "rgba(255,255,255,0.3)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 2,
                  background: "#fff",
                  width:
                    i < storyIndex
                      ? "100%"
                      : i === storyIndex
                        ? `${progress}%`
                        : "0%",
                  transition: i === storyIndex ? "none" : "width 0.2s",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header: avatar + username + close */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src={currentGroup.avatar}
              alt={currentGroup.username}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "2px solid #fff",
                objectFit: "cover",
              }}
            />
            <div>
              <span
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {currentGroup.username}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  marginRight: 8,
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {new Date(currentStory.createdAt).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={20} color="#fff" />
          </button>
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 0,
              right: 0,
              padding: "0 20px",
              zIndex: 10,
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: 14,
                textAlign: "center",
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                background: "rgba(0,0,0,0.25)",
                borderRadius: 12,
                padding: "8px 16px",
                backdropFilter: "blur(4px)",
              }}
            >
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Nav arrows (desktop) */}
        {groupIndex > 0 && (
          <button
            onClick={goPrev}
            style={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.3)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              zIndex: 10,
            }}
          >
            <ChevronRight size={22} color="#fff" />
          </button>
        )}
        {groupIndex < groups.length - 1 && (
          <button
            onClick={goNext}
            style={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.3)",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              zIndex: 10,
            }}
          >
            <ChevronLeft size={22} color="#fff" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CinderinoStoryViewer;
