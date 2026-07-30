import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Smartphone,
  Music,
  Newspaper,
  Swords,
  Clapperboard,
  Sparkles,
  User,
  Settings,
  LogOut,
  CheckCheck,
  Clock,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useUserData } from "../../../contexts/UserDataContext";

// زمان نسبی فارسی برای اعلان‌ها
function timeAgo(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "همین الان";
  if (m < 60) return `${m.toLocaleString("fa-IR")} دقیقه پیش`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h.toLocaleString("fa-IR")} ساعت پیش`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d.toLocaleString("fa-IR")} روز پیش`;
  try {
    return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "short", day: "numeric" }).format(then);
  } catch {
    return "";
  }
}

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { profile, isAuthenticated, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useUserData();

  // نمایش/مخفی‌کردن زنگوله بر اساس سوییچ «اعلان‌ها» در پروفایل
  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    const v = localStorage.getItem('pref-notifications');
    return v === null ? true : v === 'true';
  });
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.key === 'pref-notifications') setNotifEnabled(!!detail.value);
    };
    window.addEventListener('localtoggle', handler);
    return () => window.removeEventListener('localtoggle', handler);
  }, []);


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notif-container")) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotifications]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const navItems = [
    { href: "/", label: "خانه", icon: <Home size={19} strokeWidth={2.2} /> },
    { href: "/anime", label: "انیمه‌ها", icon: <Swords size={19} strokeWidth={2.2} /> },
    { href: "/animation", label: "انیمیشن", icon: <Clapperboard size={19} strokeWidth={2.2} /> },
    { href: "/music", label: "موزیک", icon: <Music size={19} strokeWidth={2.2} /> },
    { href: "/news", label: "اخبار", icon: <Newspaper size={19} strokeWidth={2.2} /> },
    {
      href: "/cinderino",
      label: "سیندرینو",
      icon: <Sparkles size={19} strokeWidth={2.2} />,
      badge: "در حال توسعه",
    },
  ];

  const getInitial = () => {
    if (profile?.displayName) return profile.displayName.charAt(0).toUpperCase();
    if (profile?.username) return profile.username.charAt(0).toUpperCase();
    return "U";
  };

  const iconColor = "var(--text-secondary)";
  const iconHoverBg = "var(--bg-hover)";
  const iconHoverColor = "var(--accent)";
  const textHoverColor = "var(--text-primary)";

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: "var(--bg-navbar)",
        backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border-color)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 4px 30px var(--shadow-color)"
          : "none",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-[68px]">
          {/* === سمت راست: لوگو + منو === */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* لوگو */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #6366f1, #ec4899)",
                  boxShadow:
                    "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.15)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </div>
              <span
                className="hidden sm:block text-2xl font-black tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #c084fc, #a855f7, #7c3aed, #6366f1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 12px rgba(168, 85, 247, 0.3))",
                  fontFamily: "'IranNastaliq', serif",
                  fontSize: "1.7rem",
                  lineHeight: 1.4,
                }}
              >
                سیندریا
              </span>
            </Link>

            {/* منوی دسکتاپ */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
                  style={{
                    color: isActive(item.href)
                      ? "var(--accent)"
                      : iconColor,
                    backgroundColor: isActive(item.href)
                      ? "var(--bg-hover)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.href)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = iconHoverBg;
                      (e.currentTarget as HTMLElement).style.color = textHoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.href)) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = iconColor;
                    }
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="absolute -top-1.5 -left-2 px-1.5 py-0.5 text-[8px] font-bold rounded-md whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #f97316)",
                        color: "#fff",
                        lineHeight: 1,
                        boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
                        animation: "pulse-glow 2s infinite",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive(item.href) && (
                    <span
                      className="absolute bottom-0 right-3 left-3 h-[2px] rounded-full"
                      style={{
                        background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))",
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* === بخش چپ === */}
          <div className="flex items-center gap-2 lg:gap-3">
            <button
              className="p-2 rounded-xl transition-all duration-200"
              style={{ color: iconColor }}
              onClick={() => navigate("/search")}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = iconHoverBg;
                (e.currentTarget as HTMLElement).style.color = iconHoverColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = iconColor;
              }}
              title="جستجو"
            >
              <Search size={22} strokeWidth={2.2} />
            </button>

            {notifEnabled && (
            <div className="notif-container relative">
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative p-2 rounded-xl transition-all duration-200"
                style={{ color: showNotifications ? "var(--accent)" : iconColor, backgroundColor: showNotifications ? "var(--bg-hover)" : "transparent" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = iconHoverBg;
                  (e.currentTarget as HTMLElement).style.color = textHoverColor;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = showNotifications ? "var(--bg-hover)" : "transparent";
                  (e.currentTarget as HTMLElement).style.color = showNotifications ? "var(--accent)" : iconColor;
                }}
                aria-label="اعلان‌ها"
              >
                <Bell size={22} strokeWidth={2.2} />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.7)", animation: "fadeInDown 0.2s ease-out" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute left-0 top-full mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden z-[100]"
                  style={{
                    background: "var(--bg-navbar)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 20px 60px var(--shadow-color), 0 0 30px rgba(168, 85, 247, 0.1)",
                    animation: "fadeInDown 0.2s ease-out",
                  }}
                  dir="rtl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold font-[Vazirmatn]" style={{ color: "var(--text-primary)" }}>اعلان‌ها</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--accent)" }}>
                          {unreadCount.toLocaleString("fa-IR")} جدید
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead()}
                        className="flex items-center gap-1 text-[11px] font-medium font-[Vazirmatn] transition-colors hover:opacity-80"
                        style={{ color: "var(--accent)" }}
                      >
                        <CheckCheck size={14} /> خواندن همه
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-hover)" }}>
                          <Bell size={26} style={{ color: "var(--text-secondary)" }} />
                        </div>
                        <p className="text-[13px] font-[Vazirmatn]" style={{ color: "var(--text-secondary)" }}>اعلان جدیدی نداری</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const dot =
                          n.type === "success" ? "#22c55e" :
                          n.type === "warning" ? "#f59e0b" :
                          n.type === "error" ? "#ef4444" : "var(--accent)";
                        return (
                          <button
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className="w-full flex items-start gap-3 px-4 py-3 text-right transition-colors border-b last:border-b-0"
                            style={{ borderColor: "var(--border-color)", background: n.read ? "transparent" : "color-mix(in srgb, var(--accent) 7%, transparent)" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = n.read ? "transparent" : "color-mix(in srgb, var(--accent) 7%, transparent)"; }}
                          >
                            <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: n.read ? "transparent" : dot, boxShadow: n.read ? "none" : `0 0 6px ${dot}`, border: n.read ? "1px solid var(--border-color)" : "none" }} />
                            <span className="flex-1 min-w-0">
                              <span className="block text-[13px] font-bold font-[Vazirmatn] truncate" style={{ color: "var(--text-primary)" }}>{n.title}</span>
                              <span className="block text-[12px] font-[Vazirmatn] leading-5 mt-0.5 line-clamp-2" style={{ color: "var(--text-secondary)" }}>{n.message}</span>
                              <span className="flex items-center gap-1 text-[10px] font-[Vazirmatn] mt-1" style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
                                <Clock size={10} /> {timeAgo(n.createdAt)}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <Link
                      to="/profile"
                      onClick={() => setShowNotifications(false)}
                      className="block px-4 py-3 text-center text-[12px] font-bold font-[Vazirmatn] border-t transition-colors hover:opacity-80"
                      style={{ borderColor: "var(--border-color)", color: "var(--accent)" }}
                    >
                      مشاهده در پروفایل
                    </Link>
                  )}
                </div>
              )}
            </div>
            )}

            <button
              className="p-2 rounded-xl transition-all duration-300"
              style={{ color: iconColor }}
              onClick={toggleTheme}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = iconHoverBg;
                (e.currentTarget as HTMLElement).style.color = iconHoverColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = iconColor;
              }}
              title={theme === "dark" ? "تم روشن" : "تم تاریک"}
            >
              {theme === "dark" ? (
                <Sun size={22} strokeWidth={2.2} />
              ) : (
                <Moon size={22} strokeWidth={2.2} />
              )}
            </button>

            <button
              className="hidden lg:flex p-2 rounded-xl transition-all duration-200"
              style={{ color: iconColor }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = iconHoverBg;
                (e.currentTarget as HTMLElement).style.color = textHoverColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLElement).style.color = iconColor;
              }}
              title="نصب اپلیکیشن"
            >
              <Smartphone size={22} strokeWidth={2.2} />
            </button>

            {isAuthenticated && profile ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-2xl transition-all duration-300"
                  style={{
                    border: "2px solid transparent",
                    background: showUserMenu ? "rgba(168, 85, 247, 0.1)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(168, 85, 247, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    if (!showUserMenu) {
                      (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                    }
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #7c3aed, #6366f1)",
                      color: "#fff",
                      boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)",
                    }}
                  >
                    {getInitial()}
                  </div>
                  <span
                    className="hidden lg:block text-[13px] font-medium font-[Vazirmatn] max-w-[100px] truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {profile.displayName || profile.username || "کاربر"}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hidden lg:block transition-transform duration-200"
                    style={{
                      color: "var(--text-secondary)",
                      transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div
                    className="absolute left-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-[100]"
                    style={{
                      background: "var(--bg-navbar)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--border-color)",
                      boxShadow: "0 20px 60px var(--shadow-color), 0 0 30px rgba(168, 85, 247, 0.1)",
                      animation: "fadeInDown 0.2s ease-out",
                    }}
                  >
                    <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
                      <p className="text-[13px] font-bold font-[Vazirmatn] truncate" style={{ color: "var(--text-primary)" }}>
                        {profile.displayName || profile.username || "کاربر"}
                      </p>
                      <p className="text-[11px] font-[Vazirmatn] truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                        {profile.email || ""}
                      </p>
                    </div>
                    <div className="py-1.5">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-[Vazirmatn] transition-all duration-200"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(168, 85, 247, 0.08)";
                          (e.currentTarget as HTMLElement).style.color = "#a855f7";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        }}
                      >
                        <User size={16} strokeWidth={2} />
                        <span>پروفایل من</span>
                      </Link>
                      <Link
                        to="/profile/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-[Vazirmatn] transition-all duration-200"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(168, 85, 247, 0.08)";
                          (e.currentTarget as HTMLElement).style.color = "#a855f7";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                        }}
                      >
                        <Settings size={16} strokeWidth={2} />
                        <span>تنظیمات</span>
                      </Link>
                    </div>
                    <div className="border-t py-1.5" style={{ borderColor: "var(--border-color)" }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-[Vazirmatn] transition-all duration-200"
                        style={{ color: "#ef4444" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239, 68, 68, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        }}
                      >
                        <LogOut size={16} strokeWidth={2} />
                        <span>خروج از حساب</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #7c3aed, #6366f1)",
                  color: "#fff",
                  boxShadow: "0 4px 25px rgba(168, 85, 247, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 6px 35px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 25px rgba(168, 85, 247, 0.35), inset 0 1px 0 rgba(255,255,255,0.15)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                }}
              >
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)",
                    animation: "shimmer 2.5s infinite",
                  }}
                />
                <span className="relative z-10 flex items-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  ورود / ثبت‌نام
                </span>
              </Link>
            )}

            <button
              className="lg:hidden p-2 rounded-xl transition-all duration-200"
              style={{ color: iconColor }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = iconHoverBg;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              {isMobileMenuOpen ? <X size={24} strokeWidth={2.2} /> : <Menu size={24} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      </div>

      {/* ===== منوی موبایل ===== */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-t"
          style={{
            backgroundColor: "var(--bg-navbar)",
            backdropFilter: "blur(20px)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive(item.href) ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: isActive(item.href) ? "var(--bg-hover)" : "transparent",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className="mr-auto px-1.5 py-0.5 text-[9px] font-bold rounded-md"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #f97316)",
                      color: "#fff",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {isAuthenticated && profile ? (
              <>
                <div
                  className="flex items-center gap-3 px-4 py-3 mt-2 rounded-xl"
                  style={{ backgroundColor: "rgba(168, 85, 247, 0.06)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                      color: "#fff",
                    }}
                  >
                    {getInitial()}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold font-[Vazirmatn]" style={{ color: "var(--text-primary)" }}>
                      {profile.displayName || profile.username || "کاربر"}
                    </p>
                    <p className="text-[11px] font-[Vazirmatn]" style={{ color: "var(--text-secondary)" }}>
                      {profile.email || ""}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <User size={19} strokeWidth={2.2} />
                  <span className="font-[Vazirmatn]">پروفایل من</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ color: "#ef4444" }}
                >
                  <LogOut size={19} strokeWidth={2.2} />
                  <span className="font-[Vazirmatn]">خروج از حساب</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                className="flex items-center justify-center gap-2 mt-3 px-5 py-3 rounded-2xl text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #7c3aed, #6366f1)",
                  color: "#fff",
                  boxShadow: "0 4px 25px rgba(168, 85, 247, 0.35)",
                }}
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
