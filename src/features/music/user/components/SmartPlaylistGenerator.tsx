import { useState } from "react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { createPlaylist, updatePlaylist } from "../data/playlistData";
import { useMusic } from "../../../../hooks/useMusic";
import { Sparkles, Zap, Music2, User, Tag, Plus } from "lucide-react";

type Strategy = "genre" | "artist" | "most-played" | "recent";

interface StrategyOption {
  id: Strategy;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const STRATEGIES: StrategyOption[] = [
  {
    id: "genre",
    label: "بر اساس ژانر",
    description: "آهنگ‌هایی با ژانر مشابه",
    icon: <Tag size={16} />,
  },
  {
    id: "artist",
    label: "بر اساس هنرمند",
    description: "همه آهنگ‌های یک هنرمند",
    icon: <User size={16} />,
  },
  {
    id: "most-played",
    label: "بیشترین پخش",
    description: "آهنگ‌هایی که بیشتر گوش دادید",
    icon: <Zap size={16} />,
  },
  {
    id: "recent",
    label: "اخیراً شنیده‌شده",
    description: "آخرین آهنگ‌های پخش شده",
    icon: <Music2 size={16} />,
  },
];

interface Props {
  onCreated?: (playlistId: number) => void;
}

export default function SmartPlaylistGenerator({ onCreated }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [open, setOpen] = useState(false);
  const [strategy, setStrategy] = useState<Strategy>("genre");
  const [selectedValue, setSelectedValue] = useState("");
  const [generating, setGenerating] = useState(false);

  const { tracks: allMusic } = useMusic();

  const genres = [...new Set(allMusic.map((m: any) => m.genre).filter(Boolean))];
  const artists = [...new Set(allMusic.map((m: any) => m.artist).filter(Boolean))];

  const getPlayHistory = (): { trackId: string; playedAt: string }[] => {
    try {
      return JSON.parse(localStorage.getItem("music_play_history") || "[]");
    } catch {
      return [];
    }
  };

  const generatePlaylist = () => {
    setGenerating(true);
    let trackIds: number[] = [];
    let name = "";
    let description = "";

    switch (strategy) {
      case "genre": {
        if (!selectedValue) {
          setGenerating(false);
          return;
        }
        const filtered = allMusic.filter((m: any) => m.genre === selectedValue);
        trackIds = filtered.map((m: any) => m.id);
        name = `🎵 ${selectedValue}`;
        description = `آهنگ‌های ژانر ${selectedValue}`;
        break;
      }

      case "artist": {
        if (!selectedValue) {
          setGenerating(false);
          return;
        }
        const filtered = allMusic.filter((m: any) => m.artist === selectedValue);
        trackIds = filtered.map((m: any) => m.id);
        name = `🎤 بهترین‌های ${selectedValue}`;
        description = `همه آهنگ‌های ${selectedValue}`;
        break;
      }

      case "most-played": {
        const history = getPlayHistory();
        const counts: Record<string, number> = {};
        history.forEach((h) => {
          counts[h.trackId] = (counts[h.trackId] || 0) + 1;
        });
        const topIds = Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 20)
          .map(([id]) => Number(id))
          .filter((id) => allMusic.some((m: any) => m.id === id));

        if (topIds.length === 0) {
          trackIds = [...allMusic]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10)
            .map((m: any) => m.id);
          name = "⚡ پیشنهاد ویژه";
          description = "آهنگ‌های پیشنهادی";
        } else {
          trackIds = topIds;
          name = "⚡ بیشترین پخش شما";
          description = "آهنگ‌هایی که بیشتر گوش دادید";
        }
        break;
      }

      case "recent": {
        const history = getPlayHistory();
        const seen = new Set<number>();
        const recentIds: number[] = [];
        for (const h of history) {
          const numId = Number(h.trackId);
          if (!seen.has(numId) && allMusic.some((m: any) => m.id === numId)) {
            seen.add(numId);
            recentIds.push(numId);
            if (recentIds.length >= 15) break;
          }
        }
        trackIds = recentIds;

        if (trackIds.length === 0) {
          trackIds = allMusic.slice(0, 10).map((m: any) => m.id);
          name = "🕐 آهنگ‌های تازه";
          description = "آهنگ‌های جدید";
        } else {
          name = "🕐 اخیراً شنیده‌شده";
          description = "آخرین آهنگ‌هایی که گوش دادید";
        }
        break;
      }
    }

    if (trackIds.length === 0) {
      setGenerating(false);
      return;
    }

    // ساخت پلی‌لیست — createPlaylist فقط name و description می‌گیره
    const newPlaylist = createPlaylist(
      name,
      `${description} — ${new Date().toLocaleDateString("fa-IR")}`
    );

    // بعد trackIds رو با updatePlaylist ست می‌کنیم
    updatePlaylist(newPlaylist.id, { trackIds });

    setGenerating(false);
    setOpen(false);
    setSelectedValue("");
    onCreated?.(newPlaylist.id);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
          isDark
            ? "bg-gradient-to-r from-amber-900/20 to-orange-900/20 text-amber-400 border border-amber-800/30 hover:border-amber-700/50"
            : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 hover:border-amber-300"
        }`}
      >
        <Sparkles size={16} />
        پلی‌لیست هوشمند
      </button>

      {open && (
        <div
          className={`mt-4 p-5 rounded-2xl border ${
            isDark
              ? "bg-gray-900/80 border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-sm font-black mb-4 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            <Sparkles size={15} className="text-amber-500" />
            ساخت پلی‌لیست هوشمند
          </h3>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {STRATEGIES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setStrategy(s.id);
                  setSelectedValue("");
                }}
                className={`flex items-center gap-2 p-3 rounded-xl text-right transition-all text-xs font-bold ${
                  strategy === s.id
                    ? isDark
                      ? "bg-amber-900/30 border border-amber-700/50 text-amber-300"
                      : "bg-amber-50 border border-amber-300 text-amber-800"
                    : isDark
                    ? "bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600"
                    : "bg-gray-50 border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {s.icon}
                <div>
                  <p>{s.label}</p>
                  <p className={`text-[10px] font-normal mt-0.5 ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {s.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {(strategy === "genre" || strategy === "artist") && (
            <div className="mb-4">
              <label className={`text-xs font-bold mb-1.5 block ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                {strategy === "genre" ? "انتخاب ژانر:" : "انتخاب هنرمند:"}
              </label>
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${
                  isDark
                    ? "bg-gray-800 text-white border border-gray-700 focus:border-amber-600"
                    : "bg-gray-50 text-gray-900 border border-gray-200 focus:border-amber-400"
                }`}
              >
                <option value="">
                  {strategy === "genre" ? "یک ژانر انتخاب کنید..." : "یک هنرمند انتخاب کنید..."}
                </option>
                {(strategy === "genre" ? genres : artists).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={generatePlaylist}
            disabled={
              generating ||
              ((strategy === "genre" || strategy === "artist") && !selectedValue)
            }
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {generating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {generating ? "در حال ساخت..." : "ساخت پلی‌لیست"}
          </button>
        </div>
      )}
    </div>
  );
}
