import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useCinderinoProfile } from "../../contexts/CinderinoProfileContext";
import { CinderinoUser } from "../../types/cinderino";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "followers" | "following";
}

const CinderinoFollowersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = "followers",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { state, unfollowUser } = useCinderinoProfile();
  const [tab, setTab] = useState<"followers" | "following">(initialTab);

  if (!isOpen) return null;

  const list: CinderinoUser[] =
    tab === "followers" ? state.followers : state.following;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-hidden flex flex-col"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #1e1b4b, #0f0c29)"
            : "linear-gradient(180deg, #faf5ff, #f3e8ff)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: isDark ? "rgba(124,58,237,0.2)" : "rgba(139,92,246,0.15)" }}
        >
          <h3
            className="text-lg font-bold"
            style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
          >
            👥 ارتباطات
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              color: isDark ? "#94a3b8" : "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex">
          {(["followers", "following"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-sm font-medium transition-all"
              style={{
                color: tab === t ? "#a855f7" : isDark ? "#94a3b8" : "#64748b",
                borderBottom: tab === t ? "2px solid #a855f7" : "2px solid transparent",
              }}
            >
              {t === "followers"
                ? `فالوئرها (${state.followers.length})`
                : `فالوئینگ (${state.following.length})`}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {list.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">
                {tab === "followers" ? "👤" : "🔍"}
              </p>
              <p
                className="text-sm"
                style={{ color: isDark ? "#94a3b8" : "#64748b" }}
              >
                {tab === "followers"
                  ? "هنوز فالوئری نداری"
                  : "هنوز کسی رو فالو نکردی"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {list.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{
                    background: isDark
                      ? "rgba(30,27,75,0.5)"
                      : "rgba(255,255,255,0.7)",
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-lg"
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                        : "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                      color: "#fff",
                    }}
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      u.displayName.charAt(0)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
                      >
                        {u.displayName}
                      </p>
                      {u.isVerified && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <p
                      className="text-xs truncate"
                      style={{ color: isDark ? "#94a3b8" : "#64748b" }}
                    >
                      @{u.username}
                    </p>
                  </div>

                  {/* Action */}
                  {tab === "following" && (
                    <button
                      onClick={() => unfollowUser(u.id)}
                      className="text-xs px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                      style={{
                        background: isDark
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(239,68,68,0.1)",
                        color: "#ef4444",
                      }}
                    >
                      آنفالو
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CinderinoFollowersModal;
