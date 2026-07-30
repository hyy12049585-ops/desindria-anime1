// src/features/music/data/musicData.ts

export function getAllMusic(): MusicItem[] {
  return musicItems;
}




export interface MusicComment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
  dislikes: number;
  replies: MusicComment[];
  timestamp?: number;
}

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  anime: string;
  type: "اوپنینگ" | "اندینگ" | "OST" | "کاراکتر سانگ" | "ریمیکس";
  genre: string;
  summary: string;
  content: string[];
  coverImage: string;
  audioUrl?: string;
  duration: string;
  releaseDate: string;
  views: number;
  likes: number;
  commentsCount: number;
  bookmarks: number;
  tags: string[];
  isFeatured?: boolean;
  isHot?: boolean;
  lyrics?: string;
  comments: MusicComment[];
  relatedIds: string[];
  author: {
    name: string;
    avatar: string;
    bio: string;
    role: string;
    followers: number;
  };
}

export const musicItems: MusicItem[] = [
  {
    id: "1",
    title: "Zankyou Sanka — Aimer",
    artist: "Aimer",
    anime: "Demon Slayer: Kimetsu no Yaiba",
    type: "اوپنینگ",
    genre: "راک",
    summary: "اوپنینگ فوق‌العاده فصل دوم دیمون اسلیر با صدای بی‌نظیر Aimer که فضای حماسی آرک Entertainment District رو به تصویر می‌کشه.",
    content: [
      "Zankyou Sanka یکی از محبوب‌ترین اوپنینگ‌های تاریخ انیمه است که توسط Aimer اجرا شده. این آهنگ برای فصل دوم انیمه Demon Slayer ساخته شد و بلافاصله پس از انتشار به صدر چارت‌های موسیقی ژاپن رسید.",
      "ملودی قدرتمند و صدای خاص Aimer، همراه با انیمیشن خیره‌کننده استودیو ufotable، این اوپنینگ رو به یکی از نمادین‌ترین لحظات انیمه تبدیل کرده. ترکیب گیتار الکتریک با ارکستر سمفونیک، حس حماسی فوق‌العاده‌ای ایجاد می‌کنه.",
      "این آهنگ در سال ۲۰۲۲ بیش از ۳۰۰ میلیون بار در پلتفرم‌های مختلف استریم شد و جایزه بهترین آهنگ انیمه سال رو از Crunchyroll دریافت کرد."
    ],
    coverImage: "https://i.pinimg.com/736x/a2/5b/3c/a25b3c8e9f4d7a1b2c3d4e5f6a7b8c9d.jpg",
    duration: "4:12",
    releaseDate: "۱۴۰۱/۱۰/۱۵",
    views: 285000,
    likes: 42300,
    commentsCount: 1850,
    bookmarks: 8900,
    tags: ["Aimer", "Demon Slayer", "اوپنینگ", "راک", "ufotable"],
    isFeatured: true,
    isHot: true,
    lyrics: "鳴り響いた残響讃歌\n誰かの為に生きて...",
    comments: [
      {
        id: "c1",
        author: "آرین",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arian",
        date: "۱۴۰۵/۰۱/۲۰",
        text: "این آهنگ هر بار که گوش میدم بازم حس اولین بار رو دارم 🔥",
        likes: 45,
        dislikes: 1,
        replies: [
          {
            id: "c1r1",
            author: "سارا",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara",
            date: "۱۴۰۵/۰۱/۲۱",
            text: "دقیقاً! Aimer صداش جادو داره",
            likes: 12,
            dislikes: 0,
            replies: []
          }
        ]
      },
      {
        id: "c2",
        author: "محمد",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammad",
        date: "۱۴۰۵/۰۱/۱۸",
        text: "انیمیشن اوپنینگ هم یه شاهکار دیگه‌ست. ufotable واقعاً بی‌رقیبه",
        likes: 33,
        dislikes: 2,
        replies: []
      }
    ],
    relatedIds: ["2", "5", "8"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "2",
    title: "Kick Back — Kenshi Yonezu",
    artist: "Kenshi Yonezu",
    anime: "Chainsaw Man",
    type: "اوپنینگ",
    genre: "پاپ راک",
    summary: "اوپنینگ انرژیک و متفاوت Chainsaw Man با صدای Kenshi Yonezu که ترکیبی از پاپ، راک و الکترونیک رو ارائه میده.",
    content: [
      "Kick Back توسط Kenshi Yonezu، یکی از محبوب‌ترین خوانندگان ژاپن، برای انیمه Chainsaw Man ساخته شد. این آهنگ با ریتم سریع و انرژی بالا، شخصیت دنجی و دنیای آشفته Chainsaw Man رو به خوبی منعکس می‌کنه.",
      "نکته جالب این آهنگ، سمپل‌گیری از آهنگ Morning از Whiteberry هست که یه حس نوستالژیک خاصی بهش اضافه کرده. Yonezu با هوشمندی این المان قدیمی رو با سبک مدرن خودش ترکیب کرده.",
      "موزیک ویدیوی این آهنگ هم با بیش از ۲۰۰ میلیون بازدید در یوتیوب، یکی از موفق‌ترین ویدیوهای موسیقی انیمه‌ای تاریخ شد."
    ],
    coverImage: "https://i.pinimg.com/736x/b3/6c/4d/b36c4d9e0a5b8c2d3e4f5a6b7c8d9e0f.jpg",
    duration: "3:18",
    releaseDate: "۱۴۰۱/۰۷/۲۰",
    views: 320000,
    likes: 51200,
    commentsCount: 2100,
    bookmarks: 11200,
    tags: ["Kenshi Yonezu", "Chainsaw Man", "اوپنینگ", "پاپ راک", "MAPPA"],
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c3",
        author: "نیما",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nima",
        date: "۱۴۰۵/۰۱/۱۹",
        text: "هر ۱۲ تا اندینگ Chainsaw Man عالی بودن ولی این اوپنینگ یه چیز دیگه‌ست 🎸",
        likes: 67,
        dislikes: 3,
        replies: [
          {
            id: "c3r1",
            author: "رضا",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
            date: "۱۴۰۵/۰۱/۲۰",
            text: "Yonezu هیچوقت ناامید نمی‌کنه. LEMON هنوزم بهترینشه ولی این هم خیلی خوبه",
            likes: 22,
            dislikes: 1,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["1", "3", "6"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "3",
    title: "Shinzou wo Sasageyo — Linked Horizon",
    artist: "Linked Horizon",
    anime: "Attack on Titan",
    type: "اوپنینگ",
    genre: "سمفونیک راک",
    summary: "نمادین‌ترین اوپنینگ Attack on Titan که به یکی از شناخته‌شده‌ترین آهنگ‌های انیمه در جهان تبدیل شده.",
    content: [
      "Shinzou wo Sasageyo (قلبت رو تقدیم کن!) سومین اوپنینگ Attack on Titan هست که توسط Linked Horizon اجرا شده. این آهنگ به قدری محبوب شد که حتی افرادی که انیمه نمی‌بینن هم اون رو می‌شناسن.",
      "ترکیب کُر ارکسترال با گیتار سنگین و صدای پرقدرت Revo، حس حماسی و جنگی فوق‌العاده‌ای ایجاد کرده. بخش 'Sasageyo! Sasageyo!' به یکی از نمادین‌ترین لحظات فرهنگ انیمه تبدیل شده.",
      "این آهنگ در رویدادهای انیمه‌ای در سراسر جهان اجرا می‌شه و همیشه با استقبال عظیم طرفداران روبه‌رو میشه. در ژاپن هم به عنوان آهنگ ورزشی در مسابقات مختلف استفاده شده."
    ],
    coverImage: "https://i.pinimg.com/736x/c4/7d/5e/c47d5e0f1b6c9d3e4f5a6b7c8d9e0f1a.jpg",
    duration: "5:14",
    releaseDate: "۱۳۹۶/۰۱/۱۲",
    views: 520000,
    likes: 78500,
    commentsCount: 3200,
    bookmarks: 15600,
    tags: ["Linked Horizon", "Attack on Titan", "اوپنینگ", "سمفونیک", "حماسی"],
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c4",
        author: "علی",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ali",
        date: "۱۴۰۵/۰۱/۱۵",
        text: "SASAGEYO SASAGEYO! 🫡 این آهنگ هیچوقت قدیمی نمیشه",
        likes: 120,
        dislikes: 2,
        replies: [
          {
            id: "c4r1",
            author: "مینا",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mina",
            date: "۱۴۰۵/۰۱/۱۶",
            text: "هر وقت میشنوم موهای دستم سیخ میشه 😭🔥",
            likes: 45,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["1", "7", "9"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "4",
    title: "Homura — LiSA",
    artist: "LiSA",
    anime: "Demon Slayer: Mugen Train",
    type: "اندینگ",
    genre: "پاپ",
    summary: "آهنگ احساسی فیلم Mugen Train با صدای LiSA که رکورد فروش موسیقی ژاپن رو شکست.",
    content: [
      "Homura (شعله) آهنگ اصلی فیلم Demon Slayer: Mugen Train هست که توسط LiSA اجرا شده. این آهنگ به قدری محبوب شد که رکورد فروش سینگل در ژاپن رو شکست و LiSA رو به یکی از بزرگ‌ترین خوانندگان ژاپن تبدیل کرد.",
      "ملودی احساسی و متن عمیق این آهنگ، داستان رنگوکو و فداکاری‌هاش رو به زیبایی روایت می‌کنه. بخش اوج آهنگ، جایی که صدای LiSA به اوج قدرت می‌رسه، یکی از احساسی‌ترین لحظات موسیقی انیمه‌ست.",
      "Homura در مراسم NHK Kouhaku Uta Gassen (بزرگ‌ترین رویداد موسیقی سالانه ژاپن) اجرا شد و بیش از ۵۰ میلیون بیننده تلویزیونی داشت."
    ],
    coverImage: "https://i.pinimg.com/736x/d5/8e/6f/d58e6f1a2b7c0d4e5f6a7b8c9d0e1f2a.jpg",
    duration: "4:33",
    releaseDate: "۱۳۹۹/۰۷/۲۵",
    views: 410000,
    likes: 63200,
    commentsCount: 2800,
    bookmarks: 13400,
    tags: ["LiSA", "Demon Slayer", "Mugen Train", "اندینگ", "احساسی"],
    isHot: true,
    comments: [
      {
        id: "c5",
        author: "فاطمه",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatemeh",
        date: "۱۴۰۵/۰۱/۲۲",
        text: "هر بار با این آهنگ یاد رنگوکو میفتم و گریم میگیره 😢🔥",
        likes: 88,
        dislikes: 0,
        replies: []
      }
    ],
    relatedIds: ["1", "5", "10"],
    author: {
      name: "سحر موسوی",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sahar",
      bio: "نویسنده و منتقد موسیقی انیمه",
      role: "نویسنده",
      followers: 8200
    }
  },
  {
    id: "5",
    title: "Unravel — TK from Ling Tosite Sigure",
    artist: "TK from Ling Tosite Sigure",
    anime: "Tokyo Ghoul",
    type: "اوپنینگ",
    genre: "پست‌راک",
    summary: "اوپنینگ افسانه‌ای Tokyo Ghoul که با صدای خاص TK، یکی از احساسی‌ترین آهنگ‌های تاریخ انیمه شده.",
    content: [
      "Unravel اوپنینگ فصل اول Tokyo Ghoul هست و توسط TK from Ling Tosite Sigure اجرا شده. صدای فالستوی خاص TK و ملودی پیچیده این آهنگ، درد و کشمکش درونی کانکی رو به شکل بی‌نظیری به تصویر می‌کشه.",
      "این آهنگ یکی از پرکاورترین آهنگ‌های انیمه در یوتیوب هست و هزاران نسخه کاور ازش وجود داره. نسخه آکوستیک و پیانو این آهنگ هم به شدت محبوب شدن.",
      "Unravel در نظرسنجی‌های مختلف همیشه در لیست ۱۰ بهترین اوپنینگ تاریخ انیمه قرار می‌گیره و به عنوان یکی از نمادهای فرهنگ انیمه شناخته میشه."
    ],
    coverImage: "https://i.pinimg.com/736x/e6/9f/7a/e69f7a2b3c8d1e5f6a7b8c9d0e1f2a3b.jpg",
    duration: "3:57",
    releaseDate: "۱۳۹۳/۰۴/۱۰",
    views: 680000,
    likes: 95400,
    commentsCount: 4100,
    bookmarks: 21000,
    tags: ["TK", "Tokyo Ghoul", "اوپنینگ", "پست‌راک", "کلاسیک"],
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c6",
        author: "امیرحسین",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amirhossein",
        date: "۱۴۰۵/۰۱/۲۳",
        text: "بعد از ۱۰ سال هنوز بهترین اوپنینگ انیمه‌ست. هیچی جاش رو نمیگیره 👑",
        likes: 156,
        dislikes: 5,
        replies: [
          {
            id: "c6r1",
            author: "پریسا",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=parisa",
            date: "۱۴۰۵/۰۱/۲۴",
            text: "نسخه آکوستیکش رو هم حتماً گوش بدید. اشک آدم درمیاد 🥺",
            likes: 34,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["3", "6", "9"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "6",
    title: "SPECIALZ — King Gnu",
    artist: "King Gnu",
    anime: "Jujutsu Kaisen فصل ۲",
    type: "اوپنینگ",
    genre: "آلترناتیو راک",
    summary: "اوپنینگ خفن فصل دوم جوجوتسو کایزن با صدای King Gnu که فضای تاریک آرک شیبویا رو عالی منتقل می‌کنه.",
    content: [
      "SPECIALZ اوپنینگ دوم فصل دوم Jujutsu Kaisen (آرک Shibuya Incident) هست که توسط King Gnu اجرا شده. این آهنگ با فضای تاریک و سنگینش، حال و هوای یکی از تاریک‌ترین آرک‌های انیمه رو به خوبی منتقل می‌کنه.",
      "King Gnu با سبک خاص خودشون که ترکیبی از راک، پاپ و موسیقی کلاسیک هست، یه آهنگ خلق کردن که هم از نظر موسیقایی پیچیده‌ست و هم از نظر احساسی تأثیرگذار. بخش بیس و درام این آهنگ فوق‌العاده قدرتمنده.",
      "انیمیشن اوپنینگ هم توسط MAPPA با کیفیت بالایی ساخته شده و صحنه‌های نمادین زیادی داره که طرفداران بارها تحلیلشون کردن."
    ],
    coverImage: "https://i.pinimg.com/736x/f7/a0/8b/f7a08b3c4d9e2f6a7b8c9d0e1f2a3b4c.jpg",
    duration: "3:42",
    releaseDate: "۱۴۰۲/۰۵/۱۵",
    views: 245000,
    likes: 38700,
    commentsCount: 1650,
    bookmarks: 7800,
    tags: ["King Gnu", "Jujutsu Kaisen", "اوپنینگ", "آلترناتیو", "MAPPA"],
    isHot: true,
    comments: [
      {
        id: "c7",
        author: "دانیال",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=danial",
        date: "۱۴۰۵/۰۱/۱۷",
        text: "آرک شیبویا + این آهنگ = ترکیب مرگبار 💀🔥",
        likes: 73,
        dislikes: 1,
        replies: []
      }
    ],
    relatedIds: ["2", "7", "11"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "7",
    title: "Blue Bird — Ikimono-gakari",
    artist: "Ikimono-gakari",
    anime: "Naruto Shippuden",
    type: "اوپنینگ",
    genre: "جی‌پاپ",
    summary: "یکی از نمادین‌ترین اوپنینگ‌های ناروتو شیپودن که نسل‌ها باهاش بزرگ شدن.",
    content: [
      "Blue Bird سومین اوپنینگ Naruto Shippuden هست و توسط Ikimono-gakari اجرا شده. این آهنگ با ملودی شاد و پرانرژیش، حس آزادی و امید رو منتقل می‌کنه و به یکی از نمادهای سری ناروتو تبدیل شده.",
      "متن آهنگ درباره پرواز به سوی آزادی و رها شدن از قفس هست که با مسیر شخصیت ناروتو همخوانی زیادی داره. بخش 'Habataitara modoranai to itte' یکی از شناخته‌شده‌ترین خطوط موسیقی انیمه‌ست.",
      "این آهنگ حتی بعد از بیش از ۱۵ سال هنوز در رویدادهای انیمه‌ای اجرا میشه و طرفداران با شور و شوق همراهیش می‌کنن."
    ],
    coverImage: "https://i.pinimg.com/736x/a8/b1/9c/a8b19c4d5e0f3a7b8c9d0e1f2a3b4c5d.jpg",
    duration: "3:38",
    releaseDate: "۱۳۸۷/۰۴/۱۵",
    views: 890000,
    likes: 112000,
    commentsCount: 5200,
    bookmarks: 28000,
    tags: ["Ikimono-gakari", "Naruto", "اوپنینگ", "جی‌پاپ", "کلاسیک", "نوستالژی"],
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c8",
        author: "حسین",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hossein",
        date: "۱۴۰۵/۰۱/۱۴",
        text: "بچگیم با این آهنگ گذشت. الان ۲۵ سالمه و هنوز گوش میدم 🥲💙",
        likes: 210,
        dislikes: 0,
        replies: [
          {
            id: "c8r1",
            author: "زهرا",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zahra",
            date: "۱۴۰۵/۰۱/۱۵",
            text: "ناروتو بدون Blue Bird ناروتو نیست ❤️",
            likes: 67,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["3", "9", "12"],
    author: {
      name: "سحر موسوی",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sahar",
      bio: "نویسنده و منتقد موسیقی انیمه",
      role: "نویسنده",
      followers: 8200
    }
  },
  {
    id: "8",
    title: "Gurenge — LiSA",
    artist: "LiSA",
    anime: "Demon Slayer: Kimetsu no Yaiba",
    type: "اوپنینگ",
    genre: "راک",
    summary: "اوپنینگ فصل اول Demon Slayer که LiSA رو به ملکه موسیقی انیمه تبدیل کرد.",
    content: [
      "Gurenge اوپنینگ فصل اول Demon Slayer هست و آهنگی‌ست که LiSA رو از یک خواننده محبوب به یک سوپراستار تبدیل کرد. این آهنگ با موفقیت عظیم انیمه Demon Slayer گره خورده و به یکی از پرفروش‌ترین سینگل‌های تاریخ ژاپن تبدیل شد.",
      "ملودی قدرتمند و صدای پرانرژی LiSA، همراه با متنی که درباره عزم و اراده تانجیرو صحبت می‌کنه، این آهنگ رو به یکی از نمادین‌ترین اوپنینگ‌های دهه تبدیل کرد. بخش کُر آهنگ به قدری قدرتمنده که حتی کسایی که ژاپنی بلد نیستن هم می‌تونن باهاش همخونی کنن.",
      "Gurenge در مراسم Japan Record Awards برنده شد و LiSA رو به اولین خواننده انیمه تبدیل کرد که در این مراسم معتبر برنده میشه. این آهنگ بیش از ۶۰۰ میلیون بار در پلتفرم‌های مختلف استریم شده."
    ],
    coverImage: "https://i.pinimg.com/736x/b9/c2/0d/b9c20d5e6f1a3b8c9d0e1f2a3b4c5d6e.jpg",
    duration: "4:08",
    releaseDate: "۱۳۹۸/۰۴/۱۰",
    views: 750000,
    likes: 98600,
    commentsCount: 4500,
    bookmarks: 24500,
    tags: ["LiSA", "Demon Slayer", "اوپنینگ", "راک", "ufotable"],
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c9",
        author: "مهدی",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehdi",
        date: "۱۴۰۵/۰۱/۲۱",
        text: "این آهنگ دروازه ورود من به دنیای انیمه بود. LiSA افسانه‌ست 👑",
        likes: 145,
        dislikes: 2,
        replies: [
          {
            id: "c9r1",
            author: "نگار",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=negar",
            date: "۱۴۰۵/۰۱/۲۲",
            text: "دقیقاً! Demon Slayer + Gurenge = ترکیب کامل",
            likes: 38,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["1", "4", "10"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "9",
    title: "The Rumbling — SiM",
    artist: "SiM",
    anime: "Attack on Titan فصل نهایی",
    type: "اوپنینگ",
    genre: "متال",
    summary: "اوپنینگ سنگین و حماسی فصل نهایی Attack on Titan که با فضای آخرالزمانی داستان همخوانی کامل داره.",
    content: [
      "The Rumbling اوپنینگ بخش دوم فصل نهایی Attack on Titan هست که توسط SiM اجرا شده. این آهنگ با سبک متال سنگین و صدای خشن، فضای آخرالزمانی و ترسناک Rumbling رو به خوبی منتقل می‌کنه.",
      "SiM یک بند متال ژاپنی هستن که سبک خاصی دارن که reggae و rap رو هم با متال ترکیب می‌کنن. این ترکیب منحصربه‌فرد باعث شده The Rumbling یکی از متفاوت‌ترین اوپنینگ‌های Attack on Titan باشه.",
      "این آهنگ در چارت‌های بیلبورد ژاپن به رتبه‌های بالایی رسید و نشون داد که موسیقی متال هنوز در ژاپن طرفدار زیادی داره."
    ],
    coverImage: "https://i.pinimg.com/736x/c0/d3/1e/c0d31e6f2a4b9c0d1e2f3a4b5c6d7e8f.jpg",
    duration: "3:54",
    releaseDate: "۱۴۰۰/۱۰/۲۰",
    views: 380000,
    likes: 56800,
    commentsCount: 2400,
    bookmarks: 12100,
    tags: ["SiM", "Attack on Titan", "اوپنینگ", "متال", "MAPPA"],
    isHot: true,
    comments: [
      {
        id: "c10",
        author: "سینا",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sina",
        date: "۱۴۰۵/۰۱/۱۶",
        text: "این اوپنینگ با فضای Rumbling خیلی خوب جور شده. سنگین و ترسناک 💀",
        likes: 92,
        dislikes: 4,
        replies: []
      }
    ],
    relatedIds: ["3", "5", "13"],
    author: {
      name: "ادمین موزیک",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=musicadmin",
      bio: "عاشق موسیقی انیمه و ژاپن",
      role: "ادمین",
      followers: 12500
    }
  },
  {
    id: "10",
    title: "Akeboshi — LiSA",
    artist: "LiSA",
    anime: "Demon Slayer: Swordsmith Village Arc",
    type: "اوپنینگ",
    genre: "راک",
    summary: "اوپنینگ فصل سوم Demon Slayer با صدای LiSA که دوباره ثابت کرد ملکه موسیقی انیمه‌ست.",
    content: [
      "Akeboshi (ستاره سحرگاهی) اوپنینگ فصل سوم Demon Slayer (آرک Swordsmith Village) هست. LiSA بار دیگر با این آهنگ نشون داد که چرا بهترین خواننده برای این سری انیمه‌ست.",
      "این آهنگ نسبت به Gurenge و Zankyou Sanka فضای متفاوتی داره و بیشتر روی امید و روشنایی تمرکز کرده. ملودی آهنگ شادتره ولی همچنان قدرت و انرژی LiSA رو داره.",
      "انیمیشن اوپنینگ توسط ufotable با کیفیت فوق‌العاده ساخته شده و صحنه‌های اکشن خیره‌کننده‌ای داره که با ریتم آهنگ کاملاً همخونی داره."
    ],
    coverImage: "https://i.pinimg.com/736x/d1/e4/2f/d1e42f7a3b5c0d6e1f2a3b4c5d6e7f8a.jpg",
    duration: "4:05",
    releaseDate: "۱۴۰۲/۰۱/۲۵",
    views: 290000,
    likes: 44500,
    commentsCount: 1900,
    bookmarks: 9200,
    tags: ["LiSA", "Demon Slayer", "اوپنینگ", "راک", "ufotable"],
    isHot: true,
    comments: [
      {
        id: "c11",
        author: "مریم",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maryam",
        date: "۱۴۰۵/۰۱/۱۸",
        text: "LiSA و Demon Slayer = جفت جادویی 🌟 هیچوقت ناامید نمی‌کنن",
        likes: 78,
        dislikes: 1,
        replies: []
      }
    ],
    relatedIds: ["1", "4", "8"],
    author: {
      name: "سحر موسوی",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sahar",
      bio: "نویسنده و منتقد موسیقی انیمه",
      role: "نویسنده",
      followers: 8200
    }
  }
];

// Helper functions
export const getTrackById = (id: string): MusicItem | undefined => {
  return musicItems.find(item => item.id === id);
};

export const getRelatedTracks = (trackId: string): MusicItem[] => {
  const track = getTrackById(trackId);
  if (!track || !track.relatedIds) return [];
  
  return track.relatedIds
    .map(id => getTrackById(id))
    .filter((item): item is MusicItem => item !== undefined);
};

export const incrementViews = (trackId: string): void => {
  const track = musicItems.find(item => item.id === trackId);
  if (track) {
    track.views += 1;
  }
};

export const trackPlay = (trackId: string): void => {
  incrementViews(trackId);
  console.log(`Track ${trackId} played. New view count: ${getTrackById(trackId)?.views}`);
};export const getHotTracks = (): MusicItem[] => {
  return [...musicItems]
    .filter(item => item.isHot)
    .sort((a, b) => b.views - a.views);
};

export const getFeaturedTracks = (): MusicItem[] => {
  return musicItems.filter(item => item.isFeatured);
};

export const getAllGenres = (): string[] => {
  const genres = new Set<string>();
  musicItems.forEach(item => genres.add(item.genre));
  return Array.from(genres);
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  musicItems.forEach(item => item.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags);
};

export const searchTracks = (query: string): MusicItem[] => {
  const q = query.toLowerCase();
  return musicItems.filter(
    item =>
      item.title.toLowerCase().includes(q) ||
      item.artist.toLowerCase().includes(q) ||
      item.anime.toLowerCase().includes(q) ||
      item.tags.some(tag => tag.toLowerCase().includes(q))
  );
};
export const getMusicById = (id: string): MusicItem | undefined => {
  return musicItems.find(item => item.id === id);
};
export const getAllTypes = (): string[] => {
  const types = new Set<string>();
  musicItems.forEach(item => types.add(item.type));
  return Array.from(types);
};

export const getTracksByType = (type: string): MusicItem[] => {
  return musicItems.filter(item => item.type === type);
};
