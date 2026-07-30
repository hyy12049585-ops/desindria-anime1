// src/components/DebugTheme.tsx
import { useEffect, useState } from "react";

interface Diag {
  htmlClass: string;
  cssFileLoaded: boolean;
  lightSelectorWorks: boolean;
  varBgPrimary: string;
  varTextPrimary: string;
  bodyComputedBg: string;
  hardcodedCount: number;
}

export default function DebugTheme() {
  const [d, setD] = useState<Diag | null>(null);

  const run = () => {
    const root = document.documentElement;
    const htmlClass = root.className || "(خالی)";

    // 1) آیا theme-fixes.css لود شده؟ با ساختن یک المان تستی چک می‌کنیم
    const probe = document.createElement("div");
    probe.setAttribute("data-theme-probe", "1");
    probe.style.cssText = "position:absolute;left:-9999px;";
    document.body.appendChild(probe);

    // آیا فایل CSS بین stylesheet ها هست؟
    let cssFileLoaded = false;
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules;
        for (const r of Array.from(rules)) {
          if (r.cssText && r.cssText.includes("--bg-primary")) {
            cssFileLoaded = true;
            break;
          }
        }
      } catch {
        // cross-origin sheet — رد می‌کنیم
      }
      if (cssFileLoaded) break;
    }

    // 2) آیا سلکتور .light واقعاً کار می‌کنه؟
    const cs = getComputedStyle(root);
    const varBgPrimary = cs.getPropertyValue("--bg-primary").trim() || "(تعریف نشده)";
    const varTextPrimary = cs.getPropertyValue("--text-primary").trim() || "(تعریف نشده)";

    // اگر کلاس light هست ولی متغیر تیره مونده => سلکتور یا فایل مشکل داره
    const isLight = root.classList.contains("light");
    const lightSelectorWorks =
      isLight && varBgPrimary !== "" && varBgPrimary !== "(تعریف نشده)";

    const bodyComputedBg = getComputedStyle(document.body).backgroundColor;

    // 3) شمارش کلاس‌های هاردکد که theme رو دور می‌زنن
    const hardcoded = document.querySelectorAll(
      '[class*="bg-gray-8"],[class*="bg-gray-9"],[class*="text-white/"],[class*="bg-black"]'
    );

    document.body.removeChild(probe);

    setD({
      htmlClass,
      cssFileLoaded,
      lightSelectorWorks,
      varBgPrimary,
      varTextPrimary,
      bodyComputedBg,
      hardcodedCount: hardcoded.length,
    });
  };

  useEffect(() => {
    run();
    const obs = new MutationObserver(run);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  if (!d) return null;

  const row = (label: string, ok: boolean, value: string) => (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
      <span style={{ fontSize: 14 }}>{ok ? "✅" : "❌"}</span>
      <strong style={{ minWidth: 150 }}>{label}</strong>
      <span style={{ opacity: 0.85, direction: "ltr" }}>{value}</span>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 99999,
        background: "#111",
        color: "#fff",
        border: "1px solid #444",
        borderRadius: 10,
        padding: 14,
        fontFamily: "monospace",
        fontSize: 13,
        maxWidth: 380,
        boxShadow: "0 8px 30px rgba(0,0,0,.5)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>🔍 Theme Debug</div>

      {row("CSS فایل لود شد؟", d.cssFileLoaded, d.cssFileLoaded ? "بله" : "خیر — theme-fixes.css لود نشده!")}
      {row("سلکتور .light کار می‌کند؟", d.lightSelectorWorks, d.lightSelectorWorks ? "بله" : "یر")}
      {row("html class", true, d.htmlClass)}
      {row("--bg-primary", d.varBgPrimary !== "(تعریف نشده)", d.varBgPrimary)}
      {row("--text-primary", d.varTextPrimary !== "(تعریف نشده)", d.varTextPrimary)}
      {row("body bg واقعی", true, d.bodyComputedBg)}
      {row(
        "کلاس‌های هاردکد",
        d.hardcodedCount === 0,
        d.hardcodedCount + " المان (theme را دور می‌زنند)"
      )}

      <hr style={{ borderColor: "#333", margin: "8px 0" }} />
      <div style={{ fontSize: 12, lineHeight: 1.6 }}>
        <strong>تشخیص:</strong>
        <br />
        {!d.cssFileLoaded && "→ مشکل از لود نشدن CSS است. import در main.tsx را چک کن."}
        {d.cssFileLoaded && !d.lightSelectorWorks &&
          "→ CSS لود شده ولی متغیرهای .light اعمال نمی‌شوند."}
        {d.cssFileLoaded && d.lightSelectorWorks && d.hardcodedCount > 0 &&
          "→ CSS درست است! مشکل از کلاس‌های هاردکد در کامپوننت‌هاست."}
        {d.cssFileLoaded && d.lightSelectorWorks && d.hardcodedCount === 0 &&
          "→ همه چیز سالم به نظر می‌رسد."}
      </div>
    </div>
  );
}
