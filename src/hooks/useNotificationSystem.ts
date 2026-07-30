// src/hooks/useNotificationSystem.ts
import { useState, useCallback, useMemo } from "react";
import type { NotificationItem } from "../types/profile";

// ─── Mock Data ───
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "episode",
    title: "قسمت جدید منتشر شد",
    message: "قسمت ۲۵ از Attack on Titan فصل آخر منتشر شد.",
    date: "۲ ساعت پیش",
    read: false,
    animeId: 1,
  },
  {
    id: "n2",
    type: "dub",
    title: "دوبله فارسی اضافه شد",
    message: "دوبله فارسی Jujutsu Kaisen فصل ۲ اضافه شد.",
    date: "۵ ساعت پیش",
    read: false,
    animeId: 2,
  },
  {
    id: "n3",
    type: "achievement",
    title: "دستاورد جدید!",
    message: 'شما دستاورد "تماشاگر حرفه‌ای" را کسب کردید.',
    date: "۱ روز پیش",
    read: true,
  },
  {
    id: "n4",
    type: "system",
    title: "به‌روزرسانی سیستم",
    message: "نسخه جدید سایت با قابلیت‌های جدید منتشر شد.",
    date: "۲ روز پیش",
    read: true,
  },
  {
    id: "n5",
    type: "episode",
    title: "قسمت جدید منتشر شد",
    message: "قسمت ۱۲ از Demon Slayer فصل ۴ منتشر شد.",
    date: "۳ روز پیش",
    read: false,
    animeId: 3,
  },
  {
    id: "n6",
    type: "dub",
    title: "زیرنویس فارسی اضافه شد",
    message: "زیرنویس فارسی Solo Leveling فصل ۲ آماده شد.",
    date: "۳ روز پیش",
    read: true,
    animeId: 4,
  },
  {
    id: "n7",
    type: "system",
    title: "اشتراک شما",
    message: "اشتراک ویژه شما تا ۱۵ روز دیگر اعتبار دارد.",
    date: "۵ روز پیش",
    read: true,
  },
  {
    id: "n8",
    type: "achievement",
    title: "دستاورد جدید!",
    message: 'شما دستاورد "۱۰۰ ساعت تماشا" را کسب کردید.',
    date: "۱ هفته پیش",
    read: true,
  },
];

export type NotificationFilter = "all" | "unread" | "episode" | "dub" | "system" | "achievement";

export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  // ─── آمار ───
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // ─── فیلتر شده ───
  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  // ─── خواندن یک نوتیفیکیشن ───
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // ─── خواندن همه ───
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // ─── حذف یک نوتیفیکیشن ───
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ─── حذف همه خوانده‌شده‌ها ───
  const clearRead = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  // ─── حذف همه ───
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // ─── اضافه کردن نوتیفیکیشن جدید (برای استفاده real-time) ───
  const addNotification = useCallback((notif: Omit<NotificationItem, "id" | "read">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `n_${Date.now()}`,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  return {
    notifications: filtered,
    allNotifications: notifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearRead,
    clearAll,
    addNotification,
  };
}
