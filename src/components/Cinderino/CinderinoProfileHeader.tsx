import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useCinderinoProfile } from "../../contexts/CinderinoProfileContext";

interface Props {
  onEditClick: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

const CinderinoProfileHeader: React.FC<Props> = ({
  onEditClick,
  onFollowersClick,
  onFollowingClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { state, stats } = useCinderinoProfile();
  const { user } = state;

  const statItems: { label: string; value: number; onClick?: () => void }[] = [
    { label: "پست", value: stats.postsCount },
    { label: "فالوئر", value: stats.followersCount, onClick: onFollowersClick },
    { label: "فالوئینگ", value: stats.followingCount, onClick: onFollowingClick },
  ];

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="w-full h-36 rounded-b-2xl bg-cover bg-center relative"
        style={{
          background: user.banner
            ? `url(${user.banner}) center/cover`
            : isDark
            ? "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
            : "linear-gradient(135deg, #a18cd1, #fbc2eb, #f6d5f7)",
        }}
      >
        <div className="absolute inset-0 bg-black/20 rounded-b-2xl" />
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-14 relative z-10">
        <div
          className="w-28 h-28 rounded-full border-4 overflow-hidden shadow-lg"
          style={{
            borderColor: isDark ? "#a855f7" : "#8b5cf6",
            background: isDark
              ? "linear-gradient(135deg, #1e1b4b, #312e81)"
              : "linear-gradient(135deg, #ede9fe, #ddd6fe)",
          }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {user.displayName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-center mt-3 px-4">
        <div className="flex items-center justify-center gap-1.5">
          <h2
            className="text-xl font-bold"
            style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
          >
            {user.displayName}
          </h2>
          {user.isVerified && (
            <span className="text-blue-400 text-lg">✓</span>
          )}
        </div>

        <p
          className="text-sm mt-0.5"
          style={{ color: isDark ? "#94a3b8" : "#64748b" }}
        >
          @{user.username}
        </p>

        {user.bio && (
          <p
            className="text-sm mt-2 whitespace-pre-line leading-relaxed max-w-xs mx-auto"
            style={{ color: isDark ? "#cbd5e1" : "#475569" }}
          >
            {user.bio}
          </p>
        )}

        {user.link && (
          <a
            href={user.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs mt-1 inline-block hover:underline"
            style={{ color: "#a855f7" }}
          >
            🔗 {user.link.replace(/^https?:\/\//, "")}
          </a>
        )}
      </div>

      {/* Stats Row — کلیک‌پذیر */}
      <div className="flex justify-center gap-8 mt-4 px-4">
        {statItems.map((s) => (
          <div
            key={s.label}
            className={`text-center ${s.onClick ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
            onClick={s.onClick}
          >
            <p
              className="text-lg font-bold"
              style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
            >
              {s.value.toLocaleString("fa-IR")}
            </p>
            <p
              className="text-xs"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Edit Button */}
      <div className="flex justify-center mt-4 px-4">
        <button
          onClick={onEditClick}
          className="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #7c3aed, #a855f7)"
              : "linear-gradient(135deg, #8b5cf6, #a78bfa)",
            color: "#fff",
            boxShadow: isDark
              ? "0 4px 15px rgba(168,85,247,0.3)"
              : "0 4px 15px rgba(139,92,246,0.25)",
          }}
        >
          ✏️ ویرایش پروفایل
        </button>
      </div>
    </div>
  );
};

export default CinderinoProfileHeader;
