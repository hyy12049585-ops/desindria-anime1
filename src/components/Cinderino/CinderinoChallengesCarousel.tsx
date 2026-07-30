// src/components/Cinderino/CinderinoChallengesCarousel.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CinderinoChallenge } from "../../types/cinderino";
import CinderinoChallengeCard from "./CinderinoChallengeCard";

interface Props {
  challenges: CinderinoChallenge[];
  onShowAll?: () => void;
}

export default function CinderinoChallengesCarousel({
  challenges,
  onShowAll,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  /* ───────────────── scroll helpers (RTL-safe) ───────────────── */

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    // اگه اصلاً اسکرول لازم نیست
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    // Chrome/Edge RTL: scrollLeft از 0 شروع شده و به سمت منفی میره
    // Firefox RTL: scrollLeft از 0 شروع شده و به سمت مثبت میره
    // Safari: ممکنه متفاوت باشه
    const sl = el.scrollLeft;
    const absSl = Math.abs(sl);

    // ═══════════════════════════════════════════════
    //  در RTL:
    //  • "سمت چپ بصری" = ادامه لیست (آیتم‌های بعدی)
    //  • "سمت راست بصری" = ابتدای لیست
    //
    //  canScrollLeft  = آیا میشه به چپ (بصری) رفت = آیتم بیشتری هست
    //  canScrollRight = آیا میشه به راست (بصری) برگشت = از ابتدا رد شدیم
    // ═══════════════════════════════════════════════

    setCanScrollLeft(absSl < maxScroll - 5);   // هنوز به انتها نرسیدیم
    setCanScrollRight(absSl > 5);               // از ابتدا رد شدیم
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // اولین چک بعد از رندر
    const timer = setTimeout(checkScroll, 150);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [challenges, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 290; // اندازه کارت + گپ

    // ═══════════════════════════════════════════════
    // Chrome RTL: scrollLeft منفی میشه
    //   → اسکرول به "چپ بصری" = scrollBy با left منفی
    //   → اسکرول به "راست بصری" = scrollBy با left مثبت
    // ═══════════════════════════════════════════════
    const scrollAmount = direction === "left" ? -amount : amount;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (challenges.length === 0) return null;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* ─── Header ─── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "0 2px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🏆</span>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: isDark ? "#fff" : "#111",
            }}
          >
            چالش‌های امروز
          </h2>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              borderRadius: 10,
              padding: "2px 8px",
            }}
          >
            {challenges.length}
          </span>
        </div>

        {/* ✅ دکمه نمایش همه - حتی اگه onShowAll نباشه، یه فالبک بذار */}
        <button
          onClick={() => {
            if (onShowAll) {
              onShowAll();
            } else {
              // فالبک: مثلاً اسکرول به پایین یا لاگ
              console.log("نمایش همه چالش‌ها");
            }
          }}
          style={{
            background: isDark
              ? "rgba(139,92,246,0.15)"
              : "rgba(139,92,246,0.08)",
            border: `1px solid ${
              isDark ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.15)"
            }`,
            borderRadius: 12,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: isDark ? "#c4b5fd" : "#7c3aed",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark
              ? "rgba(139,92,246,0.25)"
              : "rgba(139,92,246,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark
              ? "rgba(139,92,246,0.15)"
              : "rgba(139,92,246,0.08)";
          }}
        >
          نمایش همه ←
        </button>
      </div>

      {/* ─── Carousel Container ─── */}
      <div style={{ position: "relative" }}>
        {/* فلش چپ (بصری) — رفتن به آیتم‌های بعدی */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="اسکرول به چپ"
            style={{
              position: "absolute",
              left: -6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: isDark
                ? "rgba(30,20,50,0.9)"
                : "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            <ChevronLeft size={20} color={isDark ? "#c4b5fd" : "#7c3aed"} />
          </button>
        )}

        {/* فلش راست (بصری) — برگشت به ابتدا */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="اسکرول به راست"
            style={{
              position: "absolute",
              right: -6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: isDark
                ? "rgba(30,20,50,0.9)"
                : "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
            }}
          >
            <ChevronRight size={20} color={isDark ? "#c4b5fd" : "#7c3aed"} />
          </button>
        )}

        {/* ─── Fade edges ─── */}
        {canScrollLeft && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 40,
              background: isDark
                ? "linear-gradient(to right, rgba(17,12,29,0.9), transparent)"
                : "linear-gradient(to right, rgba(249,250,251,0.9), transparent)",
              pointerEvents: "none",
              zIndex: 5,
              borderRadius: "16px 0 0 16px",
            }}
          />
        )}
        {canScrollRight && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 40,
              background: isDark
                ? "linear-gradient(to left, rgba(17,12,29,0.9), transparent)"
                : "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
              pointerEvents: "none",
              zIndex: 5,
              borderRadius: "0 16px 16px 0",
            }}
          />
        )}

        {/* ─── Scrollable Cards ─── */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 14,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            padding: "4px 2px 12px",
            direction: "rtl",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              style={{
                scrollSnapAlign: "start",
                flexShrink: 0,
                animation: `cinderinoSlideIn 0.4s ease ${index * 0.08}s both`,
              }}
            >
              <CinderinoChallengeCard challenge={challenge} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Dot indicators ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 8,
        }}
      >
        {challenges.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isDark
                ? "rgba(139,92,246,0.3)"
                : "rgba(139,92,246,0.2)",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes cinderinoSlideIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
