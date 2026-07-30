// src/components/DebugTheme.tsx
import { useEffect, useState } from "react";

interface DebugData {
  htmlClasses: string;
  hasLight: boolean;
  hasThemeLight: boolean;
  cssLoaded: boolean;
  bgPrimary: string;
  textPrimary: string;
  bodyBg: string;
  hardcodedCount: number;
  hardcodedList: { tag: string; classes: string; id: string }[];
}

// کلاس‌هایی که theme رو دور می‌زنن (هاردکد تیره)
const BAD_PATTERNS = [
  /^bg-gray-[789]00$/,
  /^bg-gray-[789]00\/\d+$/,
  /^bg-black$/,
  /^bg-black\/\d+$/,
  /^bg-white\/\d+$/,
  /^text-white$/,
  /^text-white\/\d+$/,
  /^bg-slate-[789]00$/,
  /^bg-zinc-[789]00$/,
  /^bg-neutral-[789]00$/,
  /^border-white\/\d+$/,
];

function isBadClass(cls: string): boolean {
  return BAD_PATTERNS.some((re) => re.test(cls));
}

export default function DebugTheme() {
  const [d, setD] = useState<DebugData | null>(null);

  const run = () => {
    const html = document.documentElement;
    const htmlClasses = html.className;

    const styles = getComputedStyle(html);
    const bgPrimary = styles.getPropertyValue("--bg-primary").trim();
    const textPrimary = styles.getPropertyValue("--text-primary").trim();
    const bodyBg = getComputedStyle(document.body).backgroundColor;

    // CSS لود شده؟ اگه --bg-primary مقدار داشته باشه یعنی آره
    const cssLoaded = bgPrimary !== "";

    // پیدا کردن المان‌های هاردکد
    const all = document.querySelectorAll<HTMLElement>("*");
    const hardcodedList: DebugData["hardcodedList"] = [];

    all.forEach((el) => {
      const classList = Array.from(el.classList);
      const bad = classList.filter(isBadClass);
      if (bad.length > 0) {
        hardcodedList.push({
          tag: el.tagName.toLowerCase(),
          classes: bad.join(" "),
          id: el.id || "—",
        });
      }
    });

    const data: DebugData = {
      htmlClasses,
      hasLight: html.classList.contains("light"),
      hasThemeLight: html.classList.contains("theme-light"),
      cssLoaded,
      bgPrimary: bgPrimary || "(empty)",
      textPrimary: textPrimary || "(empty)",
      bodyBg,
      hardcodedCount: hardcodedList.length,
      hardcodedList,
    };

    setD(data);

    // خروجی کنسول
    console.group("%c🎨 DebugTheme Report", "color:#a855f7;font-weight:bold");
    console.log("HTML classes:", htmlClasses);
    console.log("has .light:", data.hasLight, "| has .theme-light:", data.hasThemeLight);
    console.log("CSS loaded:", cssLoaded);
    console.log("--bg-primary:", data.bgPrimary, "| --text-primary:", data.textPrimary);
    console.log("body bg:", bodyBg);
    console.log(`%c⚠️ Hardcoded elements: ${hardcodedList.length}`, "color:#ef4444;font-weight:bold");
    console.table(hardcodedList);
    console.groupEnd();
  };

  useEffect(() => {
    run();
    // هر بار تغییر کلاس html دوباره اجرا کن
    const obs = new MutationObserver(run);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  if (!d) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 99999,
        width: 340,
        maxHeight: "70vh",
        overflow: "auto",
        background: "#0f172a",
        color: "#e2e8f0",
        border: "1px solid #334155",
        borderRadius: 12,
        padding: 14,
        fontFamily: "monospace",
        fontSize: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", maginBottom: 8 }}>
        <strong style={{ color: "#a855f7" }}>🎨 Debug Theme</strong>
        <button
          onClick={run}
          style={{
            background: "#a855f7",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "2px 8px",
            ursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      <Row label="HTML class" value={d.htmlClasses || "(none)"} />
      <Row label=".light" value={d.hasLight ? "✅" : "❌"} ok={d.hasLight} />
      <Row label=".theme-light" value={d.hasThemeLight ? "✅" : "❌"} />
      <Row label="CSS loaded" value={d.cssLoaded ? "✅" : "❌"} ok={d.cssLoaded} />
      <Row label="--bg-primary" value={d.bgPrimary} />
      <Row label="--text-primary" value={d.textPrimary} />
      <Row label="body bg" value={d.bodyBg} />
      <Row
        label="Hardcoded"
        value={`${d.hardcodedCount} ⚠️`}
        ok={d.hardcodedCount === 0}
      />

      <div style={{ marginTop: 8, borderTop: "1px solid #334155", paddingTop: 8 }}>
        <strong style={{ color: "#ef4444" }}>Problematic elements:</strong>
        {d.hardcodedList.length === 0 && (
          <div style={{ color: "#22c55e", marginTop: 4 }}>✅ None — clean!</div>
        )}
        {d.hardcodedList.map((h, i) => (
          <div
            key={i}
            style={{
              marginTop: 6,
              padding: 6,
              background: "#1e293b",
              borderRadius: 6,
              fontSize: 11,
            }}
          >
            <span style={{ color: "#38bdf8" }}>&lt;{h.tag}&gt;</span>{" "}
            {h.id !== "—" && <span style={{ color: "#fbbf24" }}>#{h.id} </span>}
            <div style={{ color: "#f87171", marginTop: 2 }}>{h.classes}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, fontSize: 10, color: "#64748b" }}>
        Open DevTools console for full table →
      </div>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
      <span style={{ color: "#94a3b8" }}>{label}:</span>
      <span style={{ color: ok === undefined ? "#e2e8f0" : ok ? "#22c55e" : "#ef4444", maxWidth: 200, textAlign: "right", wordBreak: "break-all" }}>
        {value}
      </span>
    </div>
  );
}
