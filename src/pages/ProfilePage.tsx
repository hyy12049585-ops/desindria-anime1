// src/pages/ProfilePage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMyFollowedCharacters, unfollowCharacter as dbUnfollowCharacter, type Character as DbCharacter } from '../services/charactersService';
import { useUserData } from '../contexts/UserDataContext';
import { getRecent, type RecentCategory } from '../services/recentService';
import { useTheme } from '../contexts/ThemeContext';
import { useNewsUserData } from '../hooks/useNewsUserData';
import { useAnimationUserData } from '../hooks/useAnimationUserData';
import { useMusicUserData } from '../hooks/useMusicUserData';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Bookmark, Download, Play, Users, Settings, LogOut,
  Star, Trash2, ChevronLeft, Film, Bell, BellDot,
  Camera, X, Check, Clock,
  Crown, Shield, Zap, Newspaper, Clapperboard, Music,
  Sun, Moon, BellOff, History
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/* ============================================================
   نقشهٔ رنگ accent — کلاس‌های literal (Tailwind فقط این‌ها را اسکن می‌کند).
   باگ نسخهٔ قبلی: bg-${accent}-500 ساخته می‌شد و هیچ‌وقت تولید نمی‌شد.
   ============================================================ */
type AccentKey = 'purple' | 'pink' | 'yellow' | 'cyan' | 'blue';
const ACCENT: Record<AccentKey, {
  badge: string; play: string; borderDark: string; borderLight: string;
}> = {
  purple: { badge: 'bg-purple-500/90', play: 'bg-purple-600/90', borderDark: 'hover:border-purple-500/40', borderLight: 'hover:border-purple-400/60' },
  pink:   { badge: 'bg-pink-500/90',   play: 'bg-pink-600/90',   borderDark: 'hover:border-pink-500/40',   borderLight: 'hover:border-pink-400/60' },
  yellow: { badge: 'bg-amber-500/90',  play: 'bg-amber-600/90',  borderDark: 'hover:border-amber-500/40',  borderLight: 'hover:border-amber-400/60' },
  cyan:   { badge: 'bg-cyan-500/90',   play: 'bg-cyan-600/90',   borderDark: 'hover:border-cyan-500/40',   borderLight: 'hover:border-cyan-400/60' },
  blue:   { badge: 'bg-blue-500/90',   play: 'bg-blue-600/90',   borderDark: 'hover:border-blue-500/40',   borderLight: 'hover:border-blue-400/60' },
};
const accentOf = (a?: string): AccentKey =>
  (a && a in ACCENT ? a : 'purple') as AccentKey;

// =============================================
// Premium Edit Profile Modal
// =============================================
const ACCENT_PRESETS = [
  '#a855f7', '#ec4899', '#06b6d4', '#3b82f6',
  '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
];
const BIO_MAX = 160;

const EditProfileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentEmail: string;
  currentAvatar?: string | null;
  currentBio?: string;
  currentBanner?: string | null;
  currentAccent?: string;
  stats?: { totalHours?: number; totalWatched?: number; achievements?: number; favorites?: number };
  onSave: (data: {
    displayName: string; avatar?: string | null;
    bio?: string; banner?: string | null; accentColor?: string;
  }) => void;
  isDark: boolean;
}> = ({
  isOpen, onClose, currentName, currentEmail, currentAvatar,
  currentBio = '', currentBanner = null, currentAccent = '#a855f7',
  stats = {}, onSave, isDark,
}) => {
  const [name, setName] = useState(currentName);
  const [bio, setBio] = useState(currentBio);
  const [avatar, setAvatar] = useState<string | null | undefined>(currentAvatar);
  const [banner, setBanner] = useState<string | null>(currentBanner);
  const [accent, setAccent] = useState(currentAccent);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setBio(currentBio);
      setAvatar(currentAvatar);
      setBanner(currentBanner);
      setAccent(currentAccent);
    }
  }, [isOpen, currentName, currentBio, currentAvatar, currentBanner, currentAccent]);

  if (!isOpen) return null;

  const readImage = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void,
    maxMB: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('لطفاً یک فایل عکس انتخاب کن'); return; }
    if (file.size > maxMB * 1024 * 1024) { alert(`حجم عکس باید کمتر از ${maxMB} مگابایت باشد`); return; }
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave({ displayName: name.trim() || currentName, avatar, bio: bio.trim(), banner, accentColor: accent });
    onClose();
  };

  const surface = isDark ? 'bg-white/[0.04] border-white/10 text-white placeholder-gray-600'
                         : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400';
  const labelCls = isDark ? 'text-gray-400' : 'text-gray-600';
  const statChips: { label: string; value: number }[] = [
    { label: 'ساعت تماشا', value: stats.totalHours ?? 0 },
    { label: 'انیمه', value: stats.totalWatched ?? 0 },
    { label: 'علاقه‌مندی', value: stats.favorites ?? 0 },
    { label: 'دستاورد', value: stats.achievements ?? 0 },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className={`relative w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-hide rounded-3xl border shadow-2xl ${
            isDark ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-white/10' : 'bg-white border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ===== Header ===== */}
          <div className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 backdrop-blur-xl border-b ${
            isDark ? 'bg-gray-900/80 border-white/5' : 'bg-white/85 border-gray-100'
          }`}>
            <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-800'}`}>
              <X className="w-5 h-5" />
            </button>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ویرایش پروفایل</h2>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 8px 24px ${accent}55` }}
            >
              <Check className="w-4 h-4" />ذخیره
            </button>
          </div>

          {/* ===== Live Preview: banner + avatar ===== */}
          <div className="relative">
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="group relative block h-28 w-full overflow-hidden"
              title="تغییر بنر"
            >
              {banner ? (
                <img src={banner} alt="banner" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" style={{ background: `linear-gradient(120deg, ${accent}, ${accent}55 60%, transparent)` }} />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Camera className="w-4 h-4" />تغییر بنر
                </span>
              </div>
            </button>
            <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e, setBanner, 3)} />

            {/* avatar overlapping banner */}
            <div className="absolute -bottom-10 right-5">
              <button onClick={() => avatarInputRef.current?.click()} className="group relative block" title="تغییر عکس">
                <div className="w-24 h-24 rounded-2xl p-[3px] shadow-xl" style={{ background: `linear-gradient(135deg, ${accent}, #ec4899, #f59e0b)` }}>
                  <div className={`w-full h-full rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-bold ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : (name.charAt(0) || '?').toUpperCase()}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => readImage(e, setAvatar, 2)} />
            </div>
          </div>

          {/* ===== Body ===== */}
          <div className="px-5 pt-14 pb-6 space-y-5">
            {/* Stats preview */}
            <div className="grid grid-cols-4 gap-2">
              {statChips.map((s) => (
                <div key={s.label} className={`rounded-xl py-2.5 text-center border ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                  <p className="text-base font-black" style={{ color: accent }}>{s.value}</p>
                  <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Display name */}
            <div>
              <label className={`block text-sm mb-2 text-right ${labelCls}`}>نام نمایشی</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-right outline-none transition-all focus:ring-2 ${surface}`}
                style={{ ['--tw-ring-color' as any]: accent }}
                onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                placeholder="نام خودت رو وارد کن"
              />
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{bio.length}/{BIO_MAX}</span>
                <label className={`text-sm text-right ${labelCls}`}>بایو</label>
              </div>
              <textarea
                value={bio} rows={3} maxLength={BIO_MAX} onChange={(e) => setBio(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-right outline-none resize-none transition-all ${surface}`}
                onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                onBlur={(e) => (e.currentTarget.style.borderColor = '')}
                placeholder="یه چیزی درباره‌ی خودت بنویس..."
              />
            </div>

            {/* Accent color */}
            <div>
              <label className={`block text-sm mb-2.5 text-right ${labelCls}`}>رنگ تم</label>
              <div className="flex items-center justify-end gap-2.5 flex-wrap">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c} onClick={() => setAccent(c)}
                    className="relative h-8 w-8 rounded-full transition-transform hover:scale-110"
                    style={{ background: c, boxShadow: accent === c ? `0 0 0 2px ${isDark ? '#0a0a1e' : '#fff'}, 0 0 0 4px ${c}` : 'none' }}
                    title={c}
                  >
                    {accent === c && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme preview */}
            <div className={`rounded-2xl border p-4 ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
              <p className={`text-[11px] mb-3 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>پیش‌نمایش</p>
              <div className="flex items-center justify-end gap-2">
                <span className="px-3 py-1.5 rounded-lg text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}>دکمه</span>
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: `${accent}22`, color: accent }}>برچسب</span>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
              </div>
            </div>

            {/* Email (locked) */}
            <div>
              <label className={`block text-sm mb-2 text-right ${labelCls}`}>ایمیل</label>
              <input
                type="email" value={currentEmail} disabled
                className={`w-full px-4 py-3 rounded-xl border text-right cursor-not-allowed ${isDark ? 'bg-white/5 border-white/5 text-gray-500' : 'bg-gray-100 border-gray-100 text-gray-400'}`}
              />
              <p className={`text-[11px] mt-1 text-right ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>ایمیل قابل تغییر نیست</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// =============================================
// Premium Empty State — هالهٔ aurora + حلقه‌های نبض‌دار + دیسک شیشه‌ای
// =============================================
const EmptyState: React.FC<{
  icon: React.ReactNode; title: string; subtitle: string;
  action?: React.ReactNode; isDark: boolean;
}> = ({ icon, title, subtitle, action, isDark }) => {
  const glow = isDark ? 0.55 : 0.26;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative flex flex-col items-center justify-center py-16 md:py-20 text-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-4 h-56 w-56 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.9) 0%, rgba(0,234,255,0.5) 45%, transparent 70%)',
          opacity: glow,
        }}
        animate={{ scale: [1, 1.12, 1], opacity: [glow * 0.7, glow, glow * 0.7] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      />
      <div className="relative mb-6 grid place-items-center">
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute rounded-full border"
            style={{ width: 132, height: 132, borderColor: 'var(--accent)' }}
            initial={{ opacity: 0.4, scale: 0.85 }}
            animate={{ opacity: [0.32, 0, 0.32], scale: [0.85, 1.4, 0.85] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeOut', delay: i * 1.4 }}
          />
        ))}
        <div
          className="relative h-28 w-28 rounded-[28px] p-[2px]"
          style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
            boxShadow: '0 12px 40px var(--accent-glow)',
          }}
        >
          <div
            className="grid h-full w-full place-items-center rounded-[26px]"
            style={{
              background: isDark
                ? 'linear-gradient(160deg, rgba(20,14,40,0.95), rgba(8,6,22,0.98))'
                : 'linear-gradient(160deg, #ffffff, #f5f3ff)',
            }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
              className="text-5xl leading-none [&_svg]:h-12 [&_svg]:w-12 [&_svg]:text-[var(--accent)]"
            >
              {icon}
            </motion.div>
          </div>
        </div>
      </div>
      <h3 className={`mb-1.5 text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className={`mb-5 max-w-xs text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>
      {action}
    </motion.div>
  );
};

// =============================================
// Premium Stat Card
// =============================================
const StatCard: React.FC<{
  icon: React.ReactNode; value: React.ReactNode; label: string;
  gradient: string; isDark: boolean; index?: number;
}> = ({ icon, value, label, gradient, isDark, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.35 }}
    whileHover={{ y: -3 }}
    className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
      isDark
        ? 'bg-white/[0.03] border-white/[0.07] hover:border-white/15'
        : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
    }`}
  >
    <div className={`pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-35`} />
    <div className="relative flex flex-col items-center gap-2">
      <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg [&_svg]:h-5 [&_svg]:w-5`}>
        {icon}
      </div>
      <p className={`bg-gradient-to-r ${gradient} bg-clip-text text-2xl font-black text-transparent`}>{value}</p>
      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{label}</p>
    </div>
  </motion.div>
);

// =============================================
// Media Card (باگ کلاس داینامیک رفع شد)
// =============================================
const MediaCard: React.FC<{
  id: string | number;
  title: string;
  poster: string;
  subtitle?: string;
  badge?: string;
  linkTo?: string;
  onRemove?: () => void;
  index?: number;
  isDark: boolean;
  accent?: string;
}> = ({ title, poster, subtitle, badge, linkTo, onRemove, index = 0, isDark, accent = 'purple' }) => {
  const a = ACCENT[accentOf(accent)];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${
        isDark
          ? `bg-white/[0.03] border-white/[0.06] ${a.borderDark}`
          : `bg-white border-gray-200 ${a.borderLight} shadow-sm`
      }`}
    >
      <Link to={linkTo || '#'} className="block">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = isDark
                ? 'https://placehold.co/300x400/1a1a2e/a855f7?text=?'
                : 'https://placehold.co/300x400/f3f0ff/7c3aed?text=?';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          {badge && (
            <span className={`absolute top-2.5 left-2.5 text-[10px] px-2.5 py-1 rounded-full text-white font-medium backdrop-blur-sm ${a.badge}`}>
              {badge}
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.div whileHover={{ scale: 1.1 }} className={`w-12 h-12 rounded-full ${a.play} flex items-center justify-center backdrop-blur-sm shadow-lg`}>
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </motion.div>
          </div>
        </div>
      </Link>
      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm shadow-lg"
          title="حذف"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      )}
      <div className="p-3">
        <p className={`text-sm truncate font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        {subtitle && <p className={`text-[11px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{subtitle}</p>}
      </div>
    </motion.div>
  );
};

const ItemCard: React.FC<any> = ({ title, poster, type, onRemove, linkTo, index = 0, isDark }) => (
  <MediaCard
    id=""
    title={title}
    poster={poster || '/placeholder-anime.jpg'}
    badge={type === 'anime' ? 'انیمه' : type === 'movie' ? 'فیلم' : type === 'series' ? 'سریال' : undefined}
    linkTo={linkTo}
    onRemove={onRemove}
    index={index}
    isDark={isDark}
    accent="purple"
  />
);

const CharacterCard: React.FC<any> = ({ char, onUnfollow, index, isDark }) => (
  <MediaCard
    id={char.id}
    title={char.name}
    poster={char.image || '/placeholder-character.jpg'}
    subtitle={char.animeName || char.anime}
    linkTo={`/character/${char.id}`}
    onRemove={onUnfollow}
    index={index}
    isDark={isDark}
    accent="pink"
  />
);

const RatingCard: React.FC<any> = ({ item, index, isDark }) => (
  <MediaCard
    id={item.id}
    title={item.title}
    poster={item.poster || '/placeholder-anime.jpg'}
    subtitle={`امتیاز: ${item.rating}/5`}
    linkTo={`/anime/${item.id}`}
    index={index}
    isDark={isDark}
    accent="yellow"
  />
);

const NewsCardProfile: React.FC<any> = ({ item, onRemove, index, isDark, accentColor }) => (
  <MediaCard
    id={item.id}
    title={item.title}
    poster={item.image}
    subtitle={item.date}
    badge={item.category}
    linkTo={`/news/${item.id}`}
    onRemove={onRemove}
    index={index}
    isDark={isDark}
    accent={accentColor}
  />
);

const NotificationCard: React.FC<any> = ({ notif, onRead, index, isDark }) => {
  const typeColorsDark: Record<string, string> = {
    info: 'border-blue-500/30 bg-blue-500/5',
    success: 'border-green-500/30 bg-green-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    error: 'border-red-500/30 bg-red-500/5',
  };
  const typeColorsLight: Record<string, string> = {
    info: 'border-blue-200 bg-blue-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-amber-200 bg-amber-50',
    error: 'border-red-200 bg-red-50',
  };
  const typeColors = isDark ? typeColorsDark : typeColorsLight;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onRead}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        notif.read
          ? isDark ? 'border-white/5 bg-white/[0.02] opacity-60' : 'border-gray-100 bg-gray-50 opacity-60'
          : typeColors[notif.type] || typeColors.info
      } ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-right flex-1">
          <p className={`text-sm font-medium ${notif.read ? (isDark ? 'text-gray-400' : 'text-gray-500') : (isDark ? 'text-white' : 'text-gray-900')}`}>{notif.title}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{notif.message}</p>
        </div>
        {!notif.read && <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0 animate-pulse" />}
      </div>
    </motion.div>
  );
};

// =============================================
// localStorage helpers (ذخیرهٔ واقعی، بدون وابستگی به Provider)
// =============================================
function useRecentList(category: RecentCategory): any[] {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    getRecent(category).then((list) => { if (active) setItems(list); });
    return () => { active = false; };
  }, [category]);
  return items;
}

function useLocalToggle(key: string, def: boolean) {
  const [on, setOn] = useState<boolean>(() => {
    const v = localStorage.getItem(key);
    return v === null ? def : v === 'true';
  });
  const toggle = () => setOn((p) => {
    const n = !p;
    localStorage.setItem(key, String(n));
    window.dispatchEvent(new CustomEvent('localtoggle', { detail: { key, value: n } }));
    return n;
  });
  return [on, toggle] as const;
}

// Quick-Settings toggle pill
const QuickToggle: React.FC<{
  icon: React.ReactNode; label: string; on: boolean; onToggle: () => void; isDark: boolean;
}> = ({ icon, label, on, onToggle, isDark }) => (
  <button
    onClick={onToggle}
    role="switch"
    aria-checked={on}
    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
      isDark ? 'bg-white/[0.03] border-white/[0.07] hover:border-white/15' : 'bg-white border-gray-200 hover:border-gray-300'
    }`}
  >
    <span className="grid h-8 w-8 place-items-center rounded-lg [&_svg]:h-4 [&_svg]:w-4"
      style={on
        ? { background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 14px var(--accent-glow)' }
        : { background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: isDark ? '#9ca3af' : '#6b7280' }}
    >
      {icon}
    </span>
    <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
    <span className={`relative ms-1 h-5 w-9 rounded-full transition-colors ${on ? '' : isDark ? 'bg-white/15' : 'bg-gray-300'}`}
      style={on ? { background: 'var(--accent)' } : undefined}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? 'left-0.5' : 'left-[18px]'}`} />
    </span>
  </button>
);

// =============================================
// Main Profile Page
// =============================================
const ProfilePage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const user = auth.profile || { displayName: 'کاربر', email: '', username: '', avatar: '' };

  const {
    favorites, watchlist, downloads, continueWatching,
    stats, ratings, notifications,
    toggleFavorite, toggleWatchlist, removeDownload,
    removeContinueWatching,
    markNotificationRead, markAllNotificationsRead, unreadCount
  } = useUserData();

  // کاراکترهای دنبال‌شده از Supabase (سیستم جدید فالو)
  const [dbFollowedChars, setDbFollowedChars] = useState<DbCharacter[]>([]);
  const loadDbFollowedChars = React.useCallback(() => {
    getMyFollowedCharacters().then(setDbFollowedChars).catch(() => setDbFollowedChars([]));
  }, []);
  useEffect(() => { loadDbFollowedChars(); }, [loadDbFollowedChars]);
  const handleDbUnfollowCharacter = async (id: string) => {
    try { await dbUnfollowCharacter(id); } catch { /* noop */ }
    loadDbFollowedChars();
  };

  const { likedNews, bookmarkedNews, toggleNewsLike, toggleNewsBookmark } = useNewsUserData();  const { likedAnimations, animationWatchlist, ratedAnimations, animationDownloads, followedAnimationCharacters, toggleAnimationLike, toggleAnimationWatchlist, removeAnimationDownload, toggleAnimationCharacter } = useAnimationUserData();
  const { likedMusic, myMusicList, ratedMusic, musicDownloads, toggleMusicLike, toggleMyMusic, removeMusicDownload } = useMusicUserData();

  // اخیراً دیده/شنیده‌شده (localStorage — توسط صفحات جزئیات پر می‌شود)
  const recentAnime = useRecentList('anime');
  const recentAnimation = useRecentList('animation');
  const recentMusic = useRecentList('music');
  const recentNews = useRecentList('news');

  // تنظیمات سریع (ذخیرهٔ واقعی در localStorage)
  const [notifOn, toggleNotif] = useLocalToggle('pref-notifications', true);
  const [autoplayOn, toggleAutoplay] = useLocalToggle('pref-autoplay', true);

  // خواننده‌های محبوب — از روی آهنگ‌های لایک‌شده + لیست من استخراج می‌شود
  const favoriteArtists = React.useMemo(() => {
    const map = new Map<string, { name: string; count: number; cover: string }>();
    [...likedMusic, ...myMusicList].forEach((t: any) => {
      const name = t.artist?.trim();
      if (!name) return;
      const cur = map.get(name);
      if (cur) cur.count += 1;
      else map.set(name, { name, count: 1, cover: t.cover });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [likedMusic, myMusicList]);

  const [activeTab, setActiveTab] = useState('favorites');
  const [tabGroup, setTabGroup] = useState<'anime' | 'animation' | 'music' | 'news'>('anime');
  const [editModalOpen, setEditModalOpen] = useState(false);

  const displayName = user.displayName || user.username || 'کاربر';

  const handleSaveProfile = (data: {
    displayName: string; avatar?: string | null;
    bio?: string; banner?: string | null; accentColor?: string;
  }) => {
    if (!auth.updateProfile) return;
    const patch: Record<string, unknown> = {
      displayName: data.displayName,
      avatar: data.avatar ?? null,
      bio: data.bio ?? '',
      banner: data.banner ?? null,
    };
    if (data.accentColor) {
      patch.theme = { ...(auth.profile?.theme || {}), accentColor: data.accentColor };
    }
    auth.updateProfile(patch);
  };

  const handleLogout = () => {
    if (auth.logout) { auth.logout(); navigate('/'); }
  };

  const handleGroupChange = (group: 'anime' | 'animation' | 'music' | 'news') => {
    setTabGroup(group);
    const firstTab: Record<string, string> = {
      anime: 'favorites',
      animation: 'animationLiked',
      music: 'musicLiked',
      news: 'likedNews',
    };
    setActiveTab(firstTab[group]);
  };

  const animeTabs = [
    { id: 'favorites',     label: 'علاقه‌مندی‌ها',  icon: Heart,    count: favorites.length,          color: 'from-red-500 to-pink-500' },
    { id: 'watchlist',     label: 'واچ‌لیست',       icon: Bookmark, count: watchlist.length,           color: 'from-blue-500 to-cyan-500' },
    { id: 'downloads',     label: 'دانلودها',       icon: Download, count: downloads.length,           color: 'from-green-500 to-emerald-500' },
    { id: 'ratings',       label: 'امتیازها',       icon: Star,     count: ratings.length,             color: 'from-yellow-400 to-amber-500' },
    { id: 'characters',    label: 'کاراکترها',      icon: Users,    count: dbFollowedChars.length,  color: 'from-pink-500 to-rose-500' },
    { id: 'notifications', label: 'اعلان‌ها',       icon: unreadCount > 0 ? BellDot : Bell, count: unreadCount, color: 'from-purple-500 to-violet-500' },
    { id: 'continue',      label: 'ادامه تماشا',    icon: Play,     count: continueWatching.length,    color: 'from-yellow-500 to-orange-500' },
    { id: 'animeRecent',   label: 'اخیراً تماشا‌شده', icon: History,  count: recentAnime.length,         color: 'from-cyan-500 to-blue-500' },
  ];

  const animationTabs = [
    { id: 'animationLiked',     label: 'علاقه‌مندی‌ها', icon: Heart,    count: likedAnimations.length,    color: 'from-red-500 to-pink-500' },
    { id: 'animationWatchlist', label: 'واچ‌لیست',      icon: Bookmark, count: animationWatchlist.length,  color: 'from-blue-500 to-cyan-500' },
    { id: 'animationDownloads', label: 'دانلودها',      icon: Download, count: animationDownloads.length,  color: 'from-green-500 to-emerald-500' },
    { id: 'animationRatings',   label: 'امتیازها',      icon: Star,     count: ratedAnimations.length,    color: 'from-yellow-400 to-amber-500' },
    { id: 'animationCharacters', label: 'کاراکترها',    icon: Users,    count: followedAnimationCharacters.length, color: 'from-pink-500 to-rose-500' },
    { id: 'notifications',      label: 'اعلان‌ها',      icon: unreadCount > 0 ? BellDot : Bell, count: unreadCount, color: 'from-purple-500 to-violet-500' },
    { id: 'animationRecent',    label: 'اخیراً تماشا‌شده', icon: History, count: recentAnimation.length, color: 'from-cyan-500 to-blue-500' },
  ];

  const musicTabs = [
    { id: 'musicLiked', label: 'آهنگ‌های لایک‌شده', icon: Heart, count: likedMusic.length, color: 'from-pink-500 to-rose-500' },
    { id: 'musicList',  label: 'لیست من',           icon: Music, count: myMusicList.length, color: 'from-cyan-500 to-blue-500' },
    { id: 'musicRatings',   label: 'امتیازها',      icon: Star,     count: ratedMusic.length,     color: 'from-yellow-400 to-amber-500' },
    { id: 'musicDownloads', label: 'دانلودها',      icon: Download, count: musicDownloads.length,  color: 'from-green-500 to-emerald-500' },
    { id: 'musicArtists',   label: 'خواننده‌های محبوب', icon: Users, count: favoriteArtists.length, color: 'from-pink-500 to-rose-500' },
    { id: 'musicRecent', label: 'اخیراً پخش‌شده',   icon: History, count: recentMusic.length, color: 'from-violet-500 to-purple-500' },
  ];

  const newsTabs = [
    { id: 'likedNews',      label: 'اخبار لایک‌شده',   icon: Heart,    count: likedNews.length,      color: 'from-red-500 to-pink-500' },
    { id: 'bookmarkedNews', label: 'اخبار ذخیره‌شده',  icon: Bookmark, count: bookmarkedNews.length,  color: 'from-yellow-500 to-orange-500' },
    { id: 'newsRecent',     label: 'اخیراً خوانده‌شده', icon: History,  count: recentNews.length,     color: 'from-cyan-500 to-blue-500' },
  ];

  const tabsByGroup: Record<string, any[]> = {
    anime: animeTabs, animation: animationTabs, music: musicTabs, news: newsTabs,
  };
  const tabs = tabsByGroup[tabGroup];

  const grid = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

  const renderTabContent = () => {
    switch (activeTab) {
      // ───── ANIME ─────
      case 'favorites':
        return favorites.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Heart />} title="هنوز چیزی لایک نکردی" subtitle="از صفحه اصلی انیمه‌ها رو لایک کن"
            action={<Link to="/" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به صفحه اصلی</Link>} />
        ) : (
          <div className={grid}>
            {favorites.map((item, i) => (
              <ItemCard key={item.id} isDark={isDark} title={item.title} poster={item.poster} type={item.type} linkTo={`/anime/${item.id}`} index={i}
                onRemove={() => toggleFavorite({ id: item.id, title: item.title, poster: item.poster, type: item.type })} />
            ))}
          </div>
        );
      case 'watchlist':
        return watchlist.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Bookmark />} title="واچ‌لیست خالیه" subtitle="انیمه‌هایی که میخوای ببینی رو بوکمارک کن" />
        ) : (
          <div className={grid}>
            {watchlist.map((item, i) => (
              <ItemCard key={item.id} isDark={isDark} title={item.title} poster={item.poster} type={item.type} linkTo={`/anime/${item.id}`} index={i}
                onRemove={() => toggleWatchlist({ id: item.id, title: item.title, poster: item.poster, type: item.type })} />
            ))}
          </div>
        );
      case 'downloads':
        return downloads.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Download />} title="هنوز چیزی دانلود نکردی" subtitle="از صفحه انیمه دانلود کن" />
        ) : (
          <div className={grid}>
            {downloads.map((item, i) => (
              <ItemCard key={item.id} isDark={isDark} title={item.title} poster={item.poster} linkTo={`/anime/${item.id}`} index={i}
                onRemove={() => removeDownload(item.id)} />
            ))}
          </div>
        );
      case 'continue':
        return continueWatching.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Play />} title="هنوز انیمه‌ای تماشا نکردی" subtitle="وقتی شروع کنی اینجا نشون داده میشه" />
        ) : (
          <div className={grid}>
            {continueWatching.map((item, i) => (
              <ItemCard key={item.id} isDark={isDark} title={item.title} poster={item.poster} linkTo={`/anime/${item.id}`} index={i}
                onRemove={() => removeContinueWatching(item.id)} />
            ))}
          </div>
        );
      case 'characters':
        return dbFollowedChars.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Users />} title="هنوز کاراکتری فالو نکردی" subtitle="از صفحهٔ کاراکترها یکی رو دنبال کن تا اینجا بیاد"
            action={<Link to="/characters" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به کاراکترها</Link>} />
        ) : (
          <div className={grid}>
            {dbFollowedChars.map((char, i) => (
              <CharacterCard key={char.id} isDark={isDark} char={char} onUnfollow={() => handleDbUnfollowCharacter(char.id)} index={i} />
            ))}
          </div>
        );
      case 'animeRecent':
        return recentAnime.length === 0 ? (
          <EmptyState isDark={isDark} icon={<History />} title="هنوز انیمه‌ای ندیدی" subtitle="هر انیمه‌ای که باز کنی، اینجا برای دسترسی سریع نگه داشته می‌شه"
            action={<Link to="/anime" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به انیمه‌ها</Link>} />
        ) : (
          <div className={grid}>
            {recentAnime.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.poster || item.cover} subtitle={item.subtitle}
                linkTo={item.linkTo || `/anime/${item.id}`} index={i} accent="cyan" />
            ))}
          </div>
        );
      case 'ratings':
        return ratings.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Star />} title="هنوز امتیازی ندادی" subtitle="به انیمه‌هایی که دیدی امتیاز بده" />
        ) : (
          <div className={grid}>
            {ratings.map((item, i) => <RatingCard key={item.id} isDark={isDark} item={item} index={i} />)}
          </div>
        );
      case 'notifications':
        return notifications.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Bell />} title="اعلانی نداری" subtitle="وقتی اتفاق جدیدی بیفته اینجا اطلاع میدیم" />
        ) : (
          <div className="space-y-3">
            {unreadCount > 0 && (
              <div className="flex justify-end">
                <button onClick={markAllNotificationsRead} className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Check className="w-4 h-4" /><span>علامت‌گذاری همه به‌عنوان خوانده‌شده</span>
                </button>
              </div>
            )}
            {notifications.map((notif, i) => (
              <NotificationCard key={notif.id} isDark={isDark} notif={notif} onRead={() => markNotificationRead(notif.id)} index={i} />
            ))}
          </div>
        );

      // ───── ANIMATION ─────
      case 'animationLiked':
        return likedAnimations.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Clapperboard />} title="هنوز انیمیشنی لایک نکردی" subtitle="از بخش انیمیشن، کارهای مورد علاقت رو لایک کن"
            action={<Link to="/animation" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به انیمیشن‌ها</Link>} />
        ) : (
          <div className={grid}>
            {likedAnimations.map((item, i) => (
              <MediaCard key={item.id} id={item.id} isDark={isDark} title={item.title} poster={item.poster} subtitle={item.year ? String(item.year) : undefined}
                linkTo={`/animation/${item.id}`} index={i} accent="purple"
                onRemove={() => toggleAnimationLike(item)} />
            ))}
          </div>
        );
      case 'animationWatchlist':
        return animationWatchlist.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Film />} title="لیست تماشای انیمیشن خالیه" subtitle="انیمیشن‌هایی که میخوای ببینی رو اضافه کن"
            action={<Link to="/animation" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به انیمیشن‌ها</Link>} />
        ) : (
          <div className={grid}>
            {animationWatchlist.map((item, i) => (
              <MediaCard key={item.id} id={item.id} isDark={isDark} title={item.title} poster={item.poster} subtitle={item.year ? String(item.year) : undefined}
                linkTo={`/animation/${item.id}`} index={i} accent="purple"
                onRemove={() => toggleAnimationWatchlist(item)} />
            ))}
          </div>
        );
      case 'animationRatings':
        return ratedAnimations.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Star />} title="هنوز به انیمیشنی امتیاز ندادی" subtitle="به انیمیشن‌هایی که دیدی امتیاز بده"
            action={<Link to="/animation" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به انیمیشن‌ها</Link>} />
        ) : (
          <div className={grid}>
            {ratedAnimations.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.poster}
                subtitle={`امتیاز: ${item.rating}/5`} linkTo={`/animation/${item.id}`} index={i} accent="yellow" />
            ))}
          </div>
        );
      case 'animationDownloads':
        return animationDownloads.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Download />} title="دانلودی نداری" subtitle="انیمیشن‌هایی که دانلود کنی اینجا نشون داده می‌شن" />
        ) : (
          <div className={grid}>
            {animationDownloads.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.poster}
                subtitle={item.quality} linkTo={`/animation/${item.id}`} index={i} accent="purple"
                onRemove={() => removeAnimationDownload(item.id)} />
            ))}
          </div>
        );
      case 'animationCharacters':
        return followedAnimationCharacters.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Users />} title="هنوز کاراکتری فالو نکردی" subtitle="از صفحهٔ هر انیمیشن، کاراکترهای موردعلاقت رو فالو کن"
            action={<Link to="/animation" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به انیمیشن‌ها</Link>} />
        ) : (
          <div className={grid}>
            {followedAnimationCharacters.map((char: any, i: number) => (
              <MediaCard key={char.id ?? i} id={char.id} isDark={isDark} title={char.name} poster={char.image}
                subtitle={char.animationTitle} index={i} accent="pink"
                linkTo={char.animationId ? `/animation/${char.animationId}` : '#'}
                onRemove={() => toggleAnimationCharacter(char)} />
            ))}
          </div>
        );
      case 'animationRecent':
        return recentAnimation.length === 0 ? (
          <EmptyState isDark={isDark} icon={<History />} title="هنوز انیمیشنی ندیدی" subtitle="هر انیمیشنی که باز کنی، اینجا برای دسترسی سریع نگه داشته می‌شه"
            action={<Link to="/animation" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">رفتن به انیمیشن‌ها</Link>} />
        ) : (
          <div className={grid}>
            {recentAnimation.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.poster || item.cover} subtitle={item.subtitle}
                linkTo={item.linkTo || `/animation/${item.id}`} index={i} accent="cyan" />
            ))}
          </div>
        );

      // ───── MUSIC ─────
      case 'musicLiked':
        return likedMusic.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Music />} title="هنوز آهنگی لایک نکردی" subtitle="از بخش موزیک، آهنگ‌های مورد علاقت رو لایک کن"
            action={<Link to="/music" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium transition-all">رفتن به موزیک</Link>} />
        ) : (
          <div className={grid}>
            {likedMusic.map((item, i) => (
              <MediaCard key={item.id} id={item.id} isDark={isDark} title={item.title} poster={item.cover} subtitle={item.artist}
                linkTo={`/music/${item.id}`} index={i} accent="pink"
                onRemove={() => toggleMusicLike(item)} />
            ))}
          </div>
        );
      case 'musicList':
        return myMusicList.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Music />} title="لیست موزیک تو خالیه" subtitle="آهنگ‌ها رو به لیست خودت اضافه کن"
            action={<Link to="/music" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium transition-all">رفتن به موزیک</Link>} />
        ) : (
          <div className={grid}>
            {myMusicList.map((item, i) => (
              <MediaCard key={item.id} id={item.id} isDark={isDark} title={item.title} poster={item.cover} subtitle={item.artist}
                linkTo={`/music/${item.id}`} index={i} accent="cyan"
                onRemove={() => toggleMyMusic(item)} />
            ))}
          </div>
        );
      case 'musicRatings':
        return ratedMusic.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Star />} title="هنوز به آهنگی امتیاز ندادی" subtitle="به آهنگ‌هایی که گوش دادی امتیاز بده"
            action={<Link to="/music" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium transition-all">رفتن به موزیک</Link>} />
        ) : (
          <div className={grid}>
            {ratedMusic.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.cover}
                subtitle={`امتیاز: ${item.rating}/5`} linkTo={`/music/${item.id}`} index={i} accent="yellow" />
            ))}
          </div>
        );
      case 'musicDownloads':
        return musicDownloads.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Download />} title="دانلودی نداری" subtitle="آهنگ‌هایی که دانلود کنی اینجا نشون داده می‌شن" />
        ) : (
          <div className={grid}>
            {musicDownloads.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.cover}
                subtitle={item.artist || item.quality} linkTo={`/music/${item.id}`} index={i} accent="cyan"
                onRemove={() => removeMusicDownload(item.id)} />
            ))}
          </div>
        );
      case 'musicArtists':
        return favoriteArtists.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Users />} title="هنوز خواننده‌ای نداری" subtitle="آهنگ‌ها رو لایک کن تا خواننده‌های محبوبت اینجا بیان"
            action={<Link to="/music" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium transition-all">رفتن به موزیک</Link>} />
        ) : (
          <div className={grid}>
            {favoriteArtists.map((artist, i) => (
              <MediaCard key={artist.name} id={artist.name} isDark={isDark} title={artist.name} poster={artist.cover}
                subtitle={`${artist.count} آهنگ`} index={i} accent="pink" linkTo="#" />
            ))}
          </div>
        );
      case 'musicRecent':
        return recentMusic.length === 0 ? (
          <EmptyState isDark={isDark} icon={<History />} title="هنوز آهنگی پخش نکردی" subtitle="آهنگ‌هایی که گوش می‌دی، اینجا برای دسترسی سریع نشون داده می‌شن"
            action={<Link to="/music" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white text-sm font-medium transition-all">رفتن به موزیک</Link>} />
        ) : (
          <div className={grid}>
            {recentMusic.map((item: any, i: number) => (
              <MediaCard key={item.id ?? i} id={item.id} isDark={isDark} title={item.title} poster={item.cover || item.poster} subtitle={item.artist || item.subtitle}
                linkTo={item.linkTo || `/music/${item.id}`} index={i} accent="purple" />
            ))}
          </div>
        );

      // ───── NEWS ─────
      case 'likedNews':
        return likedNews.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Heart />} title="هنوز خبری لایک نکردی" subtitle="از صفحه اخبار، خبرهای مورد علاقت رو لایک کن"
            action={<Link to="/news" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-medium transition-all">رفتن به اخبار</Link>} />
        ) : (
          <div className={grid}>
            {likedNews.map((item, i) => (
              <NewsCardProfile key={item.id} isDark={isDark} item={item} index={i} accentColor="blue" onRemove={() => toggleNewsLike(item)} />
            ))}
          </div>
        );
      case 'bookmarkedNews':
        return bookmarkedNews.length === 0 ? (
          <EmptyState isDark={isDark} icon={<Bookmark />} title="هنوز خبری ذخیره نکردی" subtitle="خبرهایی که میخوای بعداً بخونی رو بوکمارک کن"
            action={<Link to="/news" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white text-sm font-medium transition-all">رفتن به اخبار</Link>} />
        ) : (
          <div className={grid}>
            {bookmarkedNews.map((item, i) => (
              <NewsCardProfile key={item.id} isDark={isDark} item={item} index={i} accentColor="yellow" onRemove={() => toggleNewsBookmark(item)} />
            ))}
          </div>
        );
      case 'newsRecent':
        return recentNews.length === 0 ? (
          <EmptyState isDark={isDark} icon={<History />} title="هنوز خبری نخوندی" subtitle="خبرهایی که باز می‌کنی، اینجا برای دسترسی سریع نگه داشته می‌شن"
            action={<Link to="/news" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-medium transition-all">رفتن به اخبار</Link>} />
        ) : (
          <div className={grid}>
            {recentNews.map((item: any, i: number) => (
              <NewsCardProfile key={item.id ?? i} isDark={isDark} item={item} index={i} accentColor="blue" />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const groupBtn = (group: 'anime' | 'animation' | 'music' | 'news', label: string, Icon: any, activeClass: string) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleGroupChange(group)}
      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all duration-300 ${
        tabGroup === group
          ? `${activeClass} text-white shadow-lg`
          : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" /><span>{label}</span>
    </motion.button>
  );

  // =============================================
  // Render
  // =============================================
  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header bar */}
      <div className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${isDark ? 'bg-gray-950/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>پروفایل</h1>
          <button onClick={handleLogout} className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300' : 'hover:bg-red-50 text-red-600 hover:text-red-700'}`} title="خروج">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl mb-6 border shadow-xl relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20 border-white/10 shadow-purple-500/10'
                   : 'bg-gradient-to-br from-white via-white to-purple-50 border-gray-200 shadow-purple-500/5'
          }`}
        >
          {/* بنر گرادیانی بالای کارت */}
          <div className="relative h-24 w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-l from-purple-600 via-pink-500 to-cyan-500 opacity-90" />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35), transparent 45%)' }} />
            <button onClick={() => setEditModalOpen(true)} className="absolute top-3 left-3 p-2.5 rounded-xl bg-black/25 hover:bg-black/40 text-white backdrop-blur-sm transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[3px] shadow-[0_8px_30px_rgba(168,85,247,0.45)]">
                  <div className={`w-full h-full rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-bold ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    {(user as any).avatar ? (
                      <img src={(user as any).avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg ring-2 ring-white/20">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 text-right pb-1">
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{displayName}</h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</p>
                <div className="flex items-center justify-end gap-2 mt-2 flex-wrap">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />کاربر فعال
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-500 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />سطح {stats.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard isDark={isDark} index={0} icon={<Film />} value={stats.totalWatched} label="تماشا شده" gradient="from-purple-500 to-pink-500" />
              <StatCard isDark={isDark} index={1} icon={<Clock />} value={stats.totalHours} label="ساعت" gradient="from-blue-500 to-cyan-500" />
              <StatCard isDark={isDark} index={2} icon={<Crown />} value={stats.achievements} label="دستاورد" gradient="from-amber-400 to-orange-500" />
            </div>

            {/* تنظیمات سریع */}
            <div className="mt-4 flex items-center justify-end gap-2.5 flex-wrap">
              <QuickToggle isDark={isDark} on={notifOn} onToggle={toggleNotif} label="اعلان‌ها"
                icon={notifOn ? <Bell /> : <BellOff />} />
              <QuickToggle isDark={isDark} on={autoplayOn} onToggle={toggleAutoplay} label="پخش خودکار" icon={<Play />} />
              <QuickToggle isDark={isDark} on={isDark} onToggle={toggleTheme} label={isDark ? 'حالت تاریک' : 'حالت روشن'}
                icon={isDark ? <Moon /> : <Sun />} />
            </div>
          </div>
        </motion.div>

        {/* Group Switcher */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
          {groupBtn('anime', 'انیمه', Film, 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-purple-500/30')}
          {groupBtn('animation', 'انیمیشن', Clapperboard, 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-violet-500/30')}
          {groupBtn('music', 'موزیک', Music, 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-cyan-500/30')}
          {groupBtn('news', 'اخبار', Newspaper, 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/30')}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                  isActive ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>{tab.count}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        currentName={displayName}
        currentEmail={user.email}
        currentAvatar={(user as any).avatar}
        currentBio={(user as any).bio || ''}
        currentBanner={(user as any).banner || null}
        currentAccent={(user as any).theme?.accentColor || '#a855f7'}
        stats={{
          totalHours: stats.totalHours,
          totalWatched: stats.totalWatched,
          achievements: stats.achievements,
          favorites: favorites.length,
        }}
        onSave={handleSaveProfile}
        isDark={isDark}
      />
    </div>
  );
};

export default ProfilePage;
