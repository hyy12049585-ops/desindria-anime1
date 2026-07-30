import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';

const SettingsTab: React.FC = () => {
  const { preferences, updatePreferences, resetAllData } = useUserStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const qualityOptions = ['480p', '720p', '1080p', '4K'];
  const languageOptions = [
    { value: 'fa', label: 'فارسی' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
  ];
  const themeOptions = [
    { value: 'dark', label: 'تاریک' },
    { value: 'light', label: 'روشن' },
    { value: 'auto', label: 'خودکار' },
  ];

  const ToggleSwitch = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
        enabled ? 'bg-purple-600' : 'bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
          enabled ? 'translate-x-0.5' : 'translate-x-6'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6 max-w-2xl" dir="rtl">
      {/* Playback */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          🎬 تنظیمات پخش
        </h3>

        {/* Quality */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">کیفیت پیش‌فرض</span>
          <div className="flex gap-2">
            {qualityOptions.map((q) => (
              <button
                key={q}
                onClick={() => updatePreferences({ defaultQuality: q })}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  preferences.defaultQuality === q
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Autoplay */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">پخش خودکار قسمت بعد</span>
          <ToggleSwitch
            enabled={preferences.autoPlay}
            onChange={(val) => updatePreferences({ autoPlay: val })}
          />
        </div>

        {/* Subtitle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">نمایش زیرنویس</span>
          <ToggleSwitch
            enabled={preferences.showSubtitle}
            onChange={(val) => updatePreferences({ showSubtitle: val })}
          />
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          🎨 ظاهر
        </h3>

        {/* Theme */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">تم</span>
          <div className="flex gap-2">
            {themeOptions.map((t) => (
              <button
                key={t.value}
                onClick={() => updatePreferences({ theme: t.value as any })}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  preferences.theme === t.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">زبان</span>
          <div className="flex gap-2">
            {languageOptions.map((l) => (
              <button
                key={l.value}
                onClick={() => updatePreferences({ language: l.value as any })}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  preferences.language === l.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          🔔 اعلان‌ها
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">اعلان قسمت جدید</span>
          <ToggleSwitch
            enabled={preferences.notifications}
            onChange={(val) => updatePreferences({ notifications: val })}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">اعلان ایمیلی</span>
          <ToggleSwitch
            enabled={preferences.emailNotifications}
            onChange={(val) => updatePreferences({ emailNotifications: val })}
          />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-5 space-y-4">
        <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
          ⚠️ منطقه خطر
        </h3>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition text-sm"
          >
            حذف تمام داده‌ها و ریست کامل
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-300">
              آیا مطمئنی؟ تمام اطلاعات پروفایل، واچ‌لیست، لایک‌ها، تاریخچه، دانلودها و نقدها پاک میشن.
              این عمل غیرقابل بازگشته!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm transition"
              >
                بله، همه چیز پاک شود
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition"
              >
                انصراف
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;
