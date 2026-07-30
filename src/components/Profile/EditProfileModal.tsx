import React, { useState, useRef } from 'react';
import { useUserStore } from '../../store/userStore';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useUserStore();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [bannerPreview, setBannerPreview] = useState(profile.banner);
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'banner'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'avatar') {
        setAvatarPreview(result);
      } else {
        setBannerPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim() || profile.name,
        email: email.trim() || profile.email,
        bio: bio.trim(),
        avatar: avatarPreview,
        banner: bannerPreview,
      });
      setSaving(false);
      onClose();
    }, 400);
  };

  const getInitials = (n: string) =>
    n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Banner Preview */}
        <div
          className="relative h-32 rounded-t-2xl overflow-hidden cursor-pointer group"
          onClick={() => bannerInputRef.current?.click()}
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm">تغییر بنر</span>
          </div>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(e, 'banner')}
          />
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12">
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-900 cursor-pointer group"
            onClick={() => avatarInputRef.current?.click()}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl font-bold">
                {getInitials(name)}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs">تغییر</span>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'avatar')}
            />
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-white text-center mb-4">
            ویرایش پروفایل
          </h3>

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">نام</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="نام خود را وارد کنید"
              dir="rtl"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
              placeholder="email@example.com"
              dir="ltr"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">بیوگرافی</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
              placeholder="درباره خودت بنویس..."
              dir="rtl"
            />
            <div className="text-xs text-gray-500 text-left mt-1">
              {bio.length}/200
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium transition-all disabled:opacity-50"
            >
              {saving ? 'در ذخیره...' : 'ذخیره تغییرات'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium transition border border-white/10"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
