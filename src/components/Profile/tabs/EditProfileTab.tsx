import React, { useState, useRef } from "react";
import { UserPen, Camera, Save, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface Props {
  userId: string;
  onBack: () => void;
}

const EditProfileTab: React.FC<Props> = ({ userId, onBack }) => {
  const { user, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: "err", text: "حجم عکس نباید بیشتر از ۲ مگابایت باشه" });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      setMsg({ type: "err", text: "نام نمایشی نمی‌تونه خالی باشه" });
      return;
    }
    if (bio.length > 200) {
      setMsg({ type: "err", text: "بیوگرافی حداکثر ۲۰۰ کاراکتر" });
      return;
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));

      updateProfile({
        displayName: displayName.trim(),
        email: email.trim(),
        bio: bio.trim(),
        avatar: avatarPreview || undefined,
      });

      setMsg({ type: "ok", text: "پروفایل با موفقیت به‌روز شد" });
      setTimeout(() => setMsg(null), 3000);
    } catch {
      setMsg({ type: "err", text: "خطا در ذخیره‌سازی" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <UserPen className="w-5 h-5 text-purple-400" />
          ویرایش پروفایل
        </h2>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="بازگشت"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xl text-sm ${
            msg.type === "ok"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="flex justify-center">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-600">
                👤
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      </div>
      <p className="text-center text-[10px] text-gray-500">
        حداکثر ۲ مگابایت • JPG, PNG
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">نام کاربری</label>
          <input
            type="text"
            value={user?.username || ""}
            disabled
            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-gray-600 cursor-not-allowed"
          />
          <p className="text-[10px] text-gray-600 mt-1">نام کاربری قابل تغییر نیست</p>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">نام نمایشی</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="نام نمایشی"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">ایمیل</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
       </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1.5">
            بیوگرافی
            <span className="text-gray-600 mr-1">({bio.length}/200)</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= 200) setBio(e.target.value);
            }}
            placeholder="درباره خودت بنویس..."
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 rounded-xl text-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl text-sm transition-colors"
        >
          انصراف
        </button>
      </div>
    </div>
  );
};

export default EditProfileTab;
