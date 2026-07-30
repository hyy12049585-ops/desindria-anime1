import type { CinderinoStoryGroup } from "../types/cinderino";

export const sampleStoryGroups: CinderinoStoryGroup[] = [
  {
    id: "sg-1",
    userId: "user-1",
    username: "ali_design",
    avatar: "https://i.pravatar.cc/150?img=1",
    seen: false,
    lastUpdated: "2026-04-15T10:00:00Z",
    stories: [
      {
        id: "s-1-1",
        type: "image",
        content: "https://picsum.photos/seed/story1/1080/1920",
        duration: 5000,
        caption: "طرح جدید امروز 🎨",
        createdAt: "2026-04-15T09:00:00Z",
      },
      {
        id: "s-1-2",
        type: "text",
        content: "سلام به همه! امروز یه پروژه جدید شروع کردم 🚀",
        duration: 4000,
        bgColor: "linear-gradient(135deg, #667eea, #764ba2)",
        createdAt: "2026-04-15T10:00:00Z",
      },
    ],
  },
  {
    id: "sg-2",
    userId: "user-2",
    username: "sara_art",
    avatar: "https://i.pravatar.cc/150?img=5",
    seen: false,
    lastUpdated: "2026-04-15T08:30:00Z",
    stories: [
      {
        id: "s-2-1",
        type: "image",
        content: "https://picsum.photos/seed/story2/1080/1920",
        duration: 5000,
        caption: "نقاشی دیجیتال ✨",
        createdAt: "2026-04-15T08:30:00Z",
      },
    ],
  },
  {
    id: "sg-3",
    userId: "user-3",
    username: "reza_dev",
    avatar: "https://i.pravatar.cc/150?img=3",
    seen: true,
    lastUpdated: "2026-04-14T22:00:00Z",
    stories: [
      {
        id: "s-3-1",
        type: "image",
        content: "https://picsum.photos/seed/story3/1080/1920",
        duration: 5000,
        createdAt: "2026-04-14T21:00:00Z",
      },
      {
        id: "s-3-2",
        type: "image",
        content: "https://picsum.photos/seed/story3b/1080/1920",
        duration: 5000,
        caption: "داشبورد جدید 💻",
        createdAt: "2026-04-14T22:00:00Z",
      },
      {
        id: "s-3-3",
        type: "text",
        content: "فردا لایو کدنویسی دارم، بیاید!",
        duration: 4000,
        bgColor: "linear-gradient(135deg, #f093fb, #f5576c)",
        createdAt: "2026-04-14T22:30:00Z",
      },
    ],
  },
  {
    id: "sg-4",
    userId: "user-4",
    username: "mina_photo",
    avatar: "https://i.pravatar.cc/150?img=9",
    seen: false,
    lastUpdated: "2026-04-15T07:00:00Z",
    stories: [
      {
        id: "s-4-1",
        type: "image",
        content: "https://picsum.photos/seed/story4/1080/1920",
        duration: 5000,
        caption: "صبح بخیر از شمال 🌅",
        createdAt: "2026-04-15T07:00:00Z",
      },
    ],
  },
];
