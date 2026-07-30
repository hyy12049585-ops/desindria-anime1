// src/data/animationData.ts

export interface AnimationCharacter {
  id: number;
  name: string;
  nameEn?: string;
  role?: string; // نقش اصلی / فرعی / صداپیشه
  image: string;
}

export interface Animation {
  id: number;
  title: string;
  titleEn?: string;
  poster: string;
  banner?: string;
  rating: number;
  year: number;
  duration: string; // مثال: "۹۸ دقیقه"
  studio: string;
  director?: string;
  country?: string;
  genres: string[];
  synopsis: string;
  characters?: AnimationCharacter[];
  isTrending?: boolean;
  isNew?: boolean;
}

const ph = (seed: string, w = 600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
const phWide = (seed: string) => `https://picsum.photos/seed/${seed}/1600/600`;
const phChar = (seed: string) => `https://picsum.photos/seed/${seed}/300/300`;

export const mockAnimationList: Animation[] = [
  {
    id: 1,
    title: "عصر یخبندان",
    titleEn: "Ice Age",
    poster: ph("iceage1"),
    banner: phWide("iceage1-b"),
    rating: 7.5,
    year: 2002,
    duration: "۸۱ دقیقه",
    studio: "Blue Sky Studios",
    director: "Chris Wedge",
    country: "آمریکا",
    genres: ["ماجراجویی", "کمدی", "خانوادگی"],
    synopsis:
      "در عصر یخبندان، یک ماموت، یک تنبل و یک ببر دندان‌خنجری برای بازگرداندن یک نوزاد انسان به خانواده‌اش با هم همراه می‌شوند.",
    isTrending: true,
    characters: [
      { id: 101, name: "منی", nameEn: "Manny", role: "شخصیت اصلی", image: phChar("manny") },
      { id: 102, name: "سید", nameEn: "Sid", role: "شخصیت اصلی", image: phChar("sid") },
      { id: 103, name: "دیه‌گو", nameEn: "Diego", role: "شخصیت اصلی", image: phChar("diego") },
      { id: 104, name: "اسکرت", nameEn: "Scrat", role: "فرعی", image: phChar("scrat") },
    ],
  },
  {
    id: 2,
    title: "عصر یخبندان ۲",
    titleEn: "Ice Age: The Meltdown",
    poster: ph("iceage2"),
    banner: phWide("iceage2-b"),
    rating: 6.9,
    year: 2006,
    duration: "۹۱ دقیقه",
    studio: "Blue Sky Studios",
    director: "Carlos Saldanha",
    country: "آمریکا",
    genres: ["ماجراجویی", "کمدی", "خانوادگی"],
    synopsis:
      "ذوب‌شدن یخ‌ها دنیای منی، سید و دیه‌گو را تهدید می‌کند و آن‌ها باید پیش از وقوع سیل به جای امنی کوچ کنند.",
    isNew: true,
    characters: [
      { id: 201, name: "منی", nameEn: "Manny", role: "شخصیت اصلی", image: phChar("manny2") },
      { id: 202, name: "الی", nameEn: "Ellie", role: "شخصیت اصلی", image: phChar("ellie") },
      { id: 203, name: "کرش و ادی", nameEn: "Crash & Eddie", role: "فرعی", image: phChar("crasheddie") },
    ],
  },
  {
    id: 3,
    title: "شرک",
    titleEn: "Shrek",
    poster: ph("shrek1"),
    banner: phWide("shrek1-b"),
    rating: 7.9,
    year: 2001,
    duration: "۹۰ دقیقه",
    studio: "DreamWorks Animation",
    director: "Andrew Adamson",
    country: "آمریکا",
    genres: ["ماجراجویی", "کمدی", "فانتزی"],
    synopsis:
      "یک غول مردابی به نام شرک برای پس‌گرفتن آرامش مردابش، مأمور نجات شاهزاده فیونا می‌شود.",
    isTrending: true,
    characters: [
      { id: 301, name: "شرک", nameEn: "Shrek", role: "شخصیت اصلی", image: phChar("shrek") },
      { id: 302, name: "فیونا", nameEn: "Fiona", role: "شخصیت اصلی", image: phChar("fiona") },
      { id: 303, name: "الاغ", nameEn: "Donkey", role: "شخصیت اصلی", image: phChar("donkey") },
    ],
  },
  {
    id: 4,
    title: "شرک ۲",
    titleEn: "Shrek 2",
    poster: ph("shrek2"),
    banner: phWide("shrek2-b"),
    rating: 7.3,
    year: 2004,
    duration: "۹۳ دقیقه",
    studio: "DreamWorks Animation",
    director: "Andrew Adamson",
    country: "آمریکا",
    genres: ["ماجراجویی", "کمدی", "فانتزی"],
    synopsis:
      "شرک و فیونا برای دیدار با والدین فیونا به سرزمین «خیلی دور دور» سفر می‌کنند، جایی که همه‌چیز آن‌طور که انتظار می‌رود پیش نمی‌رود.",
    characters: [
      { id: 401, name: "شرک", nameEn: "Shrek", role: "شخصیت اصلی", image: phChar("shrek2c") },
      { id: 402, name: "گربه‌چکمه‌پوش", nameEn: "Puss in Boots", role: "شخصیت اصلی", image: phChar("puss") },
      { id: 403, name: "فیونا", nameEn: "Fiona", role: "شخصیت اصلی", image: phChar("fiona2") },
    ],
  },
  {
    id: 5,
    title: "کوکو",
    titleEn: "Coco",
    poster: ph("coco"),
    banner: phWide("coco-b"),
    rating: 8.4,
    year: 2017,
    duration: "۱۰۵ دقیقه",
    studio: "Pixar",
    director: "Lee Unkrich",
    country: "آمریکا",
    genres: ["خانوادگی", "موزیکال", "فانتزی"],
    synopsis:
      "میگل، پسری عاشق موسیقی، به‌طور اسرارآمیزی به سرزمین مردگان سفر می‌کند تا راز خانوادگی‌اش را کشف کند.",
    isTrending: true,
    characters: [
      { id: 501, name: "میگل", nameEn: "Miguel", role: "شخصیت اصلی", image: phChar("miguel") },
      { id: 502, name: "هکتور", nameEn: "Héctor", role: "شخصیت اصلی", image: phChar("hector") },
      { id: 503, name: "ارنستو", nameEn: "Ernesto", role: "آنتاگونیست", image: phChar("ernesto") },
      { id: 504, name: "دانته", nameEn: "Dante", role: "فرعی", image: phChar("dante") },
    ],
  },
  {
    id: 6,
    title: "درون‌بیرون",
    titleEn: "Inside Out",
    poster: ph("insideout"),
    banner: phWide("insideout-b"),
    rating: 8.1,
    year: 2015,
    duration: "۹۵ دقیقه",
    studio: "Pixar",
    director: "Pete Docter",
    country: "آمریکا",
    genres: ["خانوادگی", "کمدی", "درام"],
    synopsis:
      "احساسات درون ذهن دختری به نام رایلی تلاش می‌کنند او را در میان تغییرات بزرگ زندگی‌اش راهنمایی کنند.",
    isNew: true,
    characters: [
      { id: 601, name: "شادی", nameEn: "Joy", role: "شخصیت اصلی", image: phChar("joy") },
      { id: 602, name: "غم", nameEn: "Sadness", role: "شخصیت اصلی", image: phChar("sadness") },
      { id: 603, name: "خشم", nameEn: "Anger", role: "فرعی", image: phChar("anger") },
      { id: 604, name: "ترس", nameEn: "Fear", role: "فرعی", image: phChar("fear") },
      { id: 605, name: "انزجار", nameEn: "Disgust", role: "فرعی", image: phChar("disgust") },
    ],
  },
  {
    id: 7,
    title: "مرد عنکبوتی: به درون دنیای عنکبوتی",
    titleEn: "Spider-Man: Into the Spider-Verse",
    poster: ph("spiderverse"),
    banner: phWide("spiderverse-b"),
    rating: 8.4,
    year: 2018,
    duration: "۱۱۷ دقیقه",
    studio: "Sony Pictures Animation",
    director: "Bob Persichetti",
    country: "آمریکا",
    genres: ["اکشن", "ماجراجویی", "فانتزی"],
    synopsis:
      "مایلز مورالس با نسخه‌های دیگری از مرد عنکبوتی از ابعاد موازی متحد می‌شود تا چندجهانی را نجات دهد.",
    isTrending: true,
    characters: [
      { id: 701, name: "مایلز مورالس", nameEn: "Miles Morales", role: "شخصیت اصلی", image: phChar("miles") },
      { id: 702, name: "پیتر بی. پارکر", nameEn: "Peter B. Parker", role: "شخصیت اصلی", image: phChar("peterb") },
      { id: 703, name: "گوئن استیسی", nameEn: "Gwen Stacy", role: "شخصیت اصلی", image: phChar("gwen") },
    ],
  },
  {
    id: 8,
    title: "رئیس‌بچه",
    titleEn: "The Boss Baby",
    poster: ph("bossbaby"),
    banner: phWide("bossbaby-b"),
    rating: 6.3,
    year: 2017,
    duration: "۹۷ دقیقه",
    studio: "DreamWorks Animation",
    director: "Tom McGrath",
    country: "آمریکا",
    genres: ["کمدی", "خانوادگی", "ماجراجویی"],
    synopsis:
      "پسربچه‌ای هفت‌ساله متوجه می‌شود برادر نوزادش در واقع یک مأمور مخفی کت‌وشلوارپوش با یک مأموریت مهم است.",
    characters: [
      { id: 801, name: "رئیس‌بچه", nameEn: "Boss Baby", role: "شخصیت اصلی", image: phChar("bossbaby-c") },
      { id: 802, name: "تیم", nameEn: "Tim", role: "شخصیت اصلی", image: phChar("tim") },
    ],
  },
];

// ─── Helpers (sync، بدون نیاز به API) ───
export const getAnimationById = (id: number): Animation | undefined =>
  mockAnimationList.find((a) => a.id === id);

export const getSimilarAnimations = (id: number, limit = 6): Animation[] => {
  const current = getAnimationById(id);
  if (!current) return [];
  return mockAnimationList
    .filter((a) => a.id !== id && a.genres.some((g) => current.genres.includes(g)))
    .slice(0, limit);
};

export const searchAnimations = (query: string): Animation[] => {
  const q = query.trim().toLowerCase();
  if (!q) return mockAnimationList;
  return mockAnimationList.filter(
    (a) => a.title.includes(query) || a.titleEn?.toLowerCase().includes(q)
  );
};

export const getAllAnimationGenres = (): string[] =>
  Array.from(new Set(mockAnimationList.flatMap((a) => a.genres)));

// همهٔ کاراکترهای انیمیشن‌ها (برای صفحه‌ها/پروفایل)
export const getAllAnimationCharacters = (): (AnimationCharacter & { animationTitle: string; animationId: number })[] =>
  mockAnimationList.flatMap((a) =>
    (a.characters || []).map((c) => ({ ...c, animationTitle: a.title, animationId: a.id }))
  );
