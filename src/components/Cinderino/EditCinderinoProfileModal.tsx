import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useCinderinoProfile } from "../../contexts/CinderinoProfileContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditCinderinoProfileModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { state, updateProfile } = useCinderinoProfile();
  const { user } = state;

  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [link, setLink] = useState(user.link);
  const [avatar, setAvatar] = useState(user.avatar);
  const [banner, setBanner] = useState(user.banner);
  const [isPrivate, setIsPrivate] = useState(user.isPrivate);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(user.displayName);
      setUsername(user.username);
      setBio(user.bio);
      setLink(user.link);
      setAvatar(user.avatar);
      setBanner(user.banner);
      setIsPrivate(user.isPrivate);
    }
  }, [isOpen, user]);

  const handleSave = () => {
    updateProfile({
      displayName: displayName.trim() || user.displayName,
      username: username.trim() || user.username,
      bio: bio.trim(),
      link: link.trim(),
      avatar: avatar.trim(),
      banner: banner.trim(),
      isPrivate,
    });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle: React.CSSProperties = {
    background: isDark ? "rgba(30,27,75,0.8)" : "rgba(241,240,255,0.8)",
    color: isDark ? "#e2e8f0" : "#1e293b",
    border: `1px solid ${isDark ? "rgba(124,58,237,0.3)" : "rgba(139,92,246,0.2)"}`,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5"
        style={{
          background: isDark
            ? "linear-gradient(180deg, #1e1b4b, #0f0c29)"
            : "linear-gradient(180deg, #faf5ff, #f3e8ff)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-bold"
            style={{ color: isDark ? "#e2e8f0" : "#1e293b" }}
          >
            ✏️ ویرایش پروفایل
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              color: isDark ? "#94a3b8" : "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Display Name */}
          <div>
            <label
              className="text-xs mb-1 block"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              نام نمایشی
            </label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/50"
              style={inputStyle}
              maxLength={30}
              placeholder="نام نمایشی..."
            />
          </div>

          {/* Username */}
          <div>
            <label
              className="text-xs mb-1 block"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              نام کاربری
            </label>
            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase())
              }
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/50 ltr"
              style={{ ...inputStyle, direction: "ltr" }}
              maxLength={20}
              placeholder="username"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              className="text-xs mb-1 block"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              بیو
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              style={inputStyle}
              rows={3}
              maxLength={150}
              placeholder="درباره خودت بنویس..."
            />
            <p
              className="text-[10px] text-left mt-0.5"
              style={{ color: isDark ? "#64748b" : "#94a3b8" }}
            >
              {bio.length}/150
            </p>
          </div>

          {/* Link */}
          <div>
            <label
              className="text-xs mb-1 block"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              لینک
            </label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/50 ltr"
              style={{ ...inputStyle, direction: "ltr" }}
              placeholder="https://..."
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label
              className="text-xs mb-1 block"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              آواتار (لینک تصویر)
            </label>
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/50 ltr"
              style={{ ...inputStyle, direction: "ltr" }}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Banner URL */}
          <div>
            <label
              className="text-xs mb-1 block"
              style={{ color: isDark ? "#94a3b8" : "#64748b" }}
            >
              بنر (لینک تصویر)
            </label>
            <input
              value={banner}
              onChange={(e) => setBanner(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/50 ltr"
              style={{ ...inputStyle, direction: "ltr" }}
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          {/* Private Toggle */}
          <div className="flex items-center justify-between">
            <span
              className="text-sm"
              style={{ color: isDark ? "#cbd5e1" : "#475569" }}
            >
              🔒 اکانت خصوصی
            </span>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="w-12 h-6 rounded-full relative transition-colors duration-200"
              style={{
                background: isPrivate
                  ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                  : isDark
                  ? "rgba(100,116,139,0.3)"
                  : "rgba(148,163,184,0.3)",
              }}
            >
              <div
                className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-200 shadow"
                style={{
                  left: isPrivate ? "calc(100% - 1.375rem)" : "0.125rem",
                }}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            color: "#fff",
            boxShadow: "0 4px 15px rgba(168,85,247,0.3)",
          }}
        >
          ✅ ذخیره تغییرات
        </button>
      </div>
    </div>
  );
};

export default EditCinderinoProfileModal;
