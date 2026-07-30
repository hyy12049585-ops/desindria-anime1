import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Download, ChevronDown, Check } from "lucide-react";

interface Quality {
  label: string;
  value: string;
  size: string;
}

const QUALITIES: Quality[] = [
  { label: "کیفیت بالا (320kbps)", value: "320", size: "~8 MB" },
  { label: "کیفیت متوسط (192kbps)", value: "192", size: "~5 MB" },
  { label: "کیفیت پایین (128kbps)", value: "128", size: "~3 MB" },
  { label: "FLAC (بدون افت)", value: "flac", size: "~25 MB" },
];

interface Props {
  trackId: string;
  trackTitle: string;
  audioUrl?: string;
}

export default function DownloadButton({ trackId, trackTitle, audioUrl }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ثبت دانلود در localStorage
  const recordDownload = (quality: string) => {
    const key = "music_downloads";
    const downloads = JSON.parse(localStorage.getItem(key) || "[]");
    downloads.unshift({
      trackId,
      quality,
      downloadedAt: new Date().toISOString(),
    });
    // نگه‌داری ۲۰۰ رکورد آخر
    if (downloads.length > 200) downloads.length = 200;
    localStorage.setItem(key, JSON.stringify(downloads));
  };

  const handleDownload = async (quality: Quality) => {
    setDownloading(quality.value);

    // شبیه‌سازی دانلود (چون بک‌اند نداریم)
    // اگر audioUrl وجود داشت، واقعاً دانلود می‌کنیم
    if (audioUrl) {
      try {
        const response = await fetch(audioUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${trackTitle} (${quality.label}).mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        // fallback: باز کردن لینک
        window.open(audioUrl, "_blank");
      }
    } else {
      // شبیه‌سازی: ۱.۵ ثانیه صبر
      await new Promise((r) => setTimeout(r, 1500));
    }

    recordDownload(quality.value);
    setDownloading(null);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
          isDark
            ? "bg-green-900/20 text-green-400 border border-green-800/30 hover:bg-green-900/40"
            : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
        }`}
      >
        <Download size={15} />
        دانلود
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl z-50 overflow-hidden ${
            isDark
              ? "bg-gray-900 border border-gray-800"
              : "bg-white border border-gray-200"
          }`}        >
          <div className={`px-3 py-2 text-[11px] font-bold ${
            isDark ? "text-gray-500 border-b border-gray-800" : "text-gray-400 border-b border-gray-100"
          }`}>
            انتخاب کیفیت دانلود
          </div>

          {QUALITIES.map((q) => (
            <button
              key={q.value}
              onClick={() => handleDownload(q)}
              disabled={downloading !== null}
              className={`w-full flex items-center justify-between px-4 py-3 text-right transition-colors ${
                downloading === q.value
                  ? isDark
                    ? "bg-green-900/20"
                    : "bg-green-50"
                  : isDark
                  ? "hover:bg-gray-800"
                  : "hover:bg-gray-50"
              }`}
            >
              <div>
                <p className={`text-sm font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {q.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  حجم تقریبی: {q.size}
                </p>
              </div>

              {downloading === q.value ? (
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download size={14} className={isDark ? "text-gray-600" : "text-gray-300"} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
