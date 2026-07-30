// src/data/newsData.ts

export interface NewsComment {
  id: string;
  author: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
  dislikes: number;
  replies: NewsComment[];
  timestamp?: number;
}

export interface NewsAuthor {
  name: string;
  avatar: string;
  bio: string;
  role: string;
  followers: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  excerpt?: string;
  content: string[];
  image: string;
  category: string;
  tags: string[];
  author: NewsAuthor;
  date: string;
  readTime: number;
  views: number;
  likes: number;
  commentsCount: number;
  bookmarks: number;
  isFeatured?: boolean;
  isHot?: boolean;
  comments: NewsComment[];
  relatedIds: string[];
}

export const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "فصل جدید Attack on Titan با استقبال گسترده طرفداران روبه‌رو شد",
    summary:
      "پخش فصل جدید Attack on Titan موجی از هیجان را میان طرفداران انیمه در سراسر جهان ایجاد کرده است.",
    content: [
      "فصل جدید Attack on Titan سرانجام منتشر شد و همان‌طور که انتظار می‌رفت، واکنش‌های بسیار گسترده‌ای از سوی طرفداران دریافت کرد.",
      "این فصل با تمرکز بیشتر روی درگیری‌های سیاسی، تصمیم‌های اخلاقی شخصیت‌ها و نبردهای عظیم، توانسته بار دیگر جایگاه این مجموعه را در میان محبوب‌ترین انیمه‌های تاریخ تثبیت کند.",
      "بسیاری از منتقدان معتقدند که کیفیت انیمیشن، موسیقی و کارگردانی این فصل نسبت به فصل‌های گذشته حتی پخته‌تر شده است.",
      "در شبکه‌های اجتماعی نیز هشتگ‌های مرتبط با این انیمه ترند شده و کاربران درباره سرنوشت شخصیت‌های محبوب خود بحث می‌کنند."
    ],
    image: "https://picsum.photos/seed/aot-news/800/450",
    category: "اخبار انیمه",
    tags: ["Attack on Titan", "انیمه", "فصل جدید", "اکشن"],
    author: {
      name: "آرمان کیانی",
      avatar: "https://picsum.photos/seed/author1/100/100",
      bio: "نویسنده و تحلیلگر انیمه‌های اکشن و فانتزی",
      role: "نویسنده ارشد",
      followers: 3200
    },
    date: "۱۴۰۵/۰۱/۰۲",
    readTime: 6,
    views: 18500,
    likes: 1250,
    commentsCount: 142,
    bookmarks: 410,
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c1",
        author: "مهدی حسینی",
        avatar: "https://picsum.photos/seed/user1/50/50",
        date: "۱۴۰۵/۰۱/۰۲",
        text: "این فصل واقعاً فوق‌العاده بود. مخصوصاً موسیقی متنش بی‌نظیر بود.",
        likes: 45,
        dislikes: 2,
        replies: [
          {
            id: "c1r1",
            author: "سارا محمدی",
            avatar: "https://picsum.photos/seed/user2/50/50",
            date: "۱۴۰۵/۰۱/۰۳",
            text: "کاملاً موافقم. صحنه‌های احساسی خیلی خوب درآمده بود.",
            likes: 18,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["2", "3", "10"]
  },
  {
    id: "2",
    title: "تریلر رسمی فصل دوم Jujutsu Kaisen رکورد بازدید را شکست",
    summary:
      "تریلر فصل دوم Jujutsu Kaisen تنها در چند ساعت میلیون‌ها بازدید گرفت و به یکی از پربازدیدترین تریلرهای انیمه تبدیل شد.",
    content: [
      "تریلر رسمی فصل دوم Jujutsu Kaisen منتشر شد و در مدت کوتاهی رکوردهای جدیدی در پلتفرم‌های ویدیویی ثبت کرد.",
      "در این تریلر، بخش‌هایی از آرک‌های محبوب مانگا به نمایش درآمده که باعث هیجان شدید طرفداران شده است.",
      "کیفیت بالای انیمیشن، طراحی صحنه‌های مبارزه و موسیقی پرانرژی از جمله نکاتی است که کاربران بسیار از آن تعریف کرده‌اند.",
      "انتظار می‌رود فصل دوم این مجموعه یکی از موفق‌ترین آثار سال باشد."
    ],
    image: "https://picsum.photos/seed/jjk-news/800/450",
    category: "تریلر",
    tags: ["Jujutsu Kaisen", "تریلر", "اکشن", "ماپا"],
    author: {
      name: "نیلوفر رضایی",
      avatar: "https://picsum.photos/seed/author3/100/100",
      bio: "خبرنگار و تحلیلگر صنعت انیمه",
      role: "سردبیر اخبار",
      followers: 2100
    },
    date: "۱۴۰۵/۰۱/۰۳",
    readTime: 5,
    views: 16400,
    likes: 980,
    commentsCount: 96,
    bookmarks: 290,
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c2",
        author: "علی اکبری",
        avatar: "https://picsum.photos/seed/user3/50/50",
        date: "۱۴۰۵/۰۱/۰۳",
        text: "فقط منتظر مبارزه‌های گوجو هستم!",
        likes: 34,
        dislikes: 1,
        replies: []
      }
    ],
    relatedIds: ["1", "4", "8"]
  },
  {
  id: "3",
  title: "استودیو MAPPA از پروژه جدید خود رونمایی کرد",
  summary:
    "استودیو MAPPA با معرفی یک پروژه جدید، بار دیگر توجه دوست‌داران انیمه را به خود جلب کرد.",
  content: [
    "استودیو MAPPA که طی سال‌های اخیر با تولید آثار محبوبی مانند Jujutsu Kaisen و Chainsaw Man شناخته شده، از پروژه جدید خود رونمایی کرد.",
    "طبق اطلاعات اولیه، این پروژه یک انیمه اکشن فانتزی با داستانی تاریک و شخصیت‌هایی پیچیده خواهد بود.",
    "هنوز تاریخ دقیق پخش این انیمه اعلام نشده، اما MAPPA وعده داده اطلاعات بیشتری در رویداد بعدی خود منتشر کند.",
    "طرفداران امیدوارند این پروژه با وجود فشار کاری بالای استودیو، کیفیت قابل قبولی داشته باشد."
  ],
  image: "https://picsum.photos/seed/mappa-news/800/450",
  category: "اخبار استودیوها",
  tags: ["MAPPA", "استودیو", "انیمه جدید", "اکشن"],
  author: {
    name: "کاوه مرادی",
    avatar: "https://picsum.photos/seed/author2/100/100",
    bio: "منتقد انیمه و دنبال‌کننده اخبار استودیوهای ژاپنی",
    role: "تحلیلگر",
    followers: 1800
  },
  date: "۱۴۰۵/۰۱/۰۴",
  readTime: 7,
  views: 13200,
  likes: 760,
  commentsCount: 84,
  bookmarks: 210,
  isFeatured: false,
  isHot: true,
  comments: [
    {
      id: "c3",
      author: "رضا نادری",
      avatar: "https://picsum.photos/seed/user4/50/50",
      date: "۱۴۰۵/۰۱/۰۴",
      text: "MAPPA خیلی پروژه می‌گیره، امیدوارم کیفیت قربانی سرعت نشه.",
      likes: 41,
      dislikes: 3,
      replies: [
        {
          id: "c3r1",
          author: "هانیه کریمی",
          avatar: "https://picsum.photos/seed/user5/50/50",
          date: "۱۴۰۵/۰۱/۰۵",
          text: "دقیقاً، ولی معمولاً خروجی‌شون خیلی خوبه.",
          likes: 15,
          dislikes: 1,
          replies: []
        }
      ]
    }
  ],
  relatedIds: ["2", "8", "10"]
},

  {
    id: "4",
    title: "بهترین انیمه‌های بهار ۱۴۰۵ معرفی شدند",
    summary:
      "فهرست محبوب‌ترین انیمه‌های فصل بهار ۱۴۰۵ بر اساس امتیاز کاربران و منتقدان منتشر شد.",
    content: [
      "با آغاز فصل بهار ۱۴۰۵، مجموعه‌ای از انیمه‌های جدید و دنباله‌های پرطرفدار وارد جدول پخش شدند.",
      "در این میان، آثار اکشن، فانتزی و عاشقانه بیشترین توجه کاربران را به خود جلب کرده‌اند.",
      "بر اساس بررسی‌ها، چند عنوان تازه‌وارد توانسته‌اند حتی با آثار شناخته‌شده رقابت کنند.",
      "منتقدان معتقدند تنوع ژانری در این فصل نسبت به فصل گذشته بیشتر است و مخاطبان انتخاب‌های جذاب‌تری دارند."
    ],
    image: "https://picsum.photos/seed/spring-anime/800/450",
    category: "رتبه‌بندی",
    tags: ["بهار ۱۴۰۵", "انیمه برتر", "رتبه‌بندی", "فصلی"],
    author: {
      name: "نیلوفر رضایی",
      avatar: "https://picsum.photos/seed/author3/100/100",
      bio: "خبرنگار و تحلیلگر صنعت انیمه",
      role: "سردبیر اخبار",
      followers: 2100
    },
    date: "۱۴۰۵/۰۱/۰۵",
    readTime: 8,
    views: 14900,
    likes: 870,
    commentsCount: 103,
    bookmarks: 330,
    isFeatured: true,
    isHot: false,
    comments: [
      {
        id: "c4",
        author: "سینا احمدی",
        avatar: "https://picsum.photos/seed/user6/50/50",
        date: "۱۴۰۵/۰۱/۰۵",
        text: "لیست خوبی بود ولی جای چندتا انیمه خالیه.",
        likes: 22,
        dislikes: 2,
        replies: []
      }
    ],
    relatedIds: ["1", "2", "7"]
  },
  {
    id: "5",
    title: "انیمه جدیدی از سازندگان Your Name در راه است",
    summary:
      "تیم سازنده Your Name از پروژه سینمایی جدیدی با حال‌وهوای عاشقانه و فانتزی خبر داد.",
    content: [
      "سازندگان Your Name اعلام کردند که روی یک فیلم سینمایی جدید کار می‌کنند.",
      "این اثر قرار است ترکیبی از درام عاشقانه، فانتزی و جلوه‌های بصری چشم‌نواز باشد.",
      "طبق توضیحات اولیه، داستان فیلم درباره دو شخصیت است که در زمان‌های متفاوت زندگی می‌کنند اما به شکلی عجیب با یکدیگر ارتباط پیدا می‌کنند.",
      "طرفداران آثار احساسی و بصری ژاپنی انتظار زیادی از این پروژه دارند."
    ],
    image: "https://picsum.photos/seed/yourname-new/800/450",
    category: "فیلم سینمایی",
    tags: ["Your Name", "فیلم انیمه", "عاشقانه", "فانتزی"],
    author: {
      name: "آرمان کیانی",
      avatar: "https://picsum.photos/seed/author1/100/100",
      bio: "نویسنده و تحلیلگر انیمه‌های اکشن و فانتزی",
      role: "نویسنده ارشد",
      followers: 3200
    },
    date: "۱۴۰۵/۰۱/۰۶",
    readTime: 6,
    views: 11800,
    likes: 690,
    commentsCount: 71,
    bookmarks: 260,
    isFeatured: false,
    isHot: false,
    comments: [
      {
        id: "c5",
        author: "مهسا رستمی",
        avatar: "https://picsum.photos/seed/user7/50/50",
        date: "۱۴۰۵/۰۱/۰۶",
        text: "اگه مثل Your Name باشه قطعاً شاهکار می‌شه.",
        likes: 37,
        dislikes: 1,
        replies: []
      }
    ],
    relatedIds: ["4", "7", "9"]
  },
  {
    id: "6",
    title: "بررسی قسمت اول انیمه فانتزی جدید سال",
    summary:
      "قسمت اول یک انیمه فانتزی تازه منتشر شده و واکنش‌های اولیه نشان می‌دهد با اثری امیدوارکننده روبه‌رو هستیم.",
    content: [
      "قسمت اول این انیمه فانتزی با معرفی دنیایی پرجزئیات و شخصیت‌هایی مرموز آغاز شد.",
      "داستان با ریتمی آرام شروع می‌شود اما در نیمه دوم قسمت، اتفاقات هیجان‌انگیزی رخ می‌دهد که مخاطب را برای ادامه کنجکاو می‌کند.",
      "طراحی محیط‌ها و موسیقی متن از نقاط قوت قسمت اول هستند.",
      "اگر سازندگان بتوانند همین کیفیت را حفظ کنند، این انیمه می‌تواند به یکی از آثار محبوب فصل تبدیل شود."
    ],
    image: "https://picsum.photos/seed/fantasy-review/800/450",
    category: "نقد و بررسی",
    tags: ["فانتزی", "نقد", "قسمت اول", "انیمه جدید"],
    author: {
      name: "کاوه مرادی",
      avatar: "https://picsum.photos/seed/author2/100/100",
      bio: "منتقد انیمه و دنبال‌کننده اخبار استودیوهای ژاپنی",
      role: "تحلیلگر",
      followers: 1800
    },
    date: "۱۴۰۵/۰۱/۰۷",
    readTime: 10,
    views: 9200,
    likes: 510,
    commentsCount: 55,
    bookmarks: 170,
    isFeatured: false,
    isHot: false,
    comments: [
      {
        id: "c6",
        author: "امیر شریفی",
        avatar: "https://picsum.photos/seed/user8/50/50",
        date: "۱۴۰۵/۰۱/۰۷",
        text: "فضاسازی قسمت اول خیلی خوب بود، امیدوارم افت نکنه.",
        likes: 19,
        dislikes: 0,
        replies: []
      }
    ],
    relatedIds: ["3", "4", "8"]
  },
  {
    id: "7",
    title: "محبوب‌ترین شخصیت‌های انیمه‌ای هفته معرفی شدند",
    summary:
      "نتایج نظرسنجی هفتگی محبوب‌ترین شخصیت‌های انیمه‌ای منتشر شد و چند نام آشنا در صدر قرار گرفتند.",
    content: [
      "در نظرسنجی این هفته، هزاران کاربر به شخصیت‌های محبوب خود رأی دادند.",
      "شخصیت‌های اصلی آثار اکشن و فانتزی بار دیگر بیشترین رأی را کسب کردند.",
      "نکته جالب حضور چند شخصیت فرعی در میان رتبه‌های برتر است که نشان می‌دهد مخاطبان فقط به قهرمان‌های اصلی توجه ندارند.",
      "این نظرسنجی هر هفته برگزار می‌شود و تغییرات رتبه‌ها معمولاً بحث‌های زیادی در شبکه‌های اجتماعی ایجاد می‌کند."
    ],
    image: "https://picsum.photos/seed/anime-characters/800/450",
    category: "نظرسنجی",
    tags: ["شخصیت انیمه", "محبوب‌ترین‌ها", "نظرسنجی", "رتبه‌بندی"],
    author: {
      name: "نیلوفر رضایی",
      avatar: "https://picsum.photos/seed/author3/100/100",
      bio: "خبرنگار و تحلیلگر صنعت انیمه",
      role: "سردبیر اخبار",
      followers: 2100
    },
    date: "۱۴۰۵/۰۱/۰۸",
    readTime: 5,
    views: 10100,
    likes: 620,
    commentsCount: 88,
    bookmarks: 190,
    isFeatured: false,
    isHot: true,
    comments: [
      {
        id: "c7",
        author: "پارسا ملک‌زاده",
        avatar: "https://picsum.photos/seed/user9/50/50",
        date: "۱۴۰۵/۰۱/۰۸",
        text: "رتبه اول کاملاً حقش بود!",
        likes: 28,
        dislikes: 4,
        replies: [
          {
            id: "c7r1",
            author: "نرگس زمانی",
            avatar: "https://picsum.photos/seed/user10/50/50",
            date: "۱۴۰۵/۰۱/۰۸",
            text: "من فکر می‌کردم شخصیت دیگه‌ای اول بشه.",
            likes: 11,
            dislikes: 1,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["4", "5", "9"]
  },
  {
    id: "8",
    title: "Chainsaw Man با فصل جدید بازمی‌گردد",
    summary:
      "گزارش‌های جدید نشان می‌دهد فصل تازه Chainsaw Man وارد مرحله تولید شده است.",
    content: [
      "پس از مدت‌ها انتظار، خبرهایی درباره تولید فصل جدید Chainsaw Man منتشر شده است.",
      "هرچند هنوز اعلام رسمی کاملی انجام نشده، منابع نزدیک به پروژه از آغاز مراحل تولید خبر داده‌اند.",
      "طرفداران امیدوارند فصل جدید با ریتم بهتر و اقتباسی دقیق‌تر از مانگا ساخته شود.",
      "Chainsaw Man همچنان یکی از بحث‌برانگیزترین و محبوب‌ترین آثار اکشن سال‌های اخیر محسوب می‌شود."
    ],
    image: "https://picsum.photos/seed/chainsaw-news/800/450",
    category: "اخبار انیمه",
    tags: ["Chainsaw Man", "MAPPA", "فصل جدید", "اکشن"],
    author: {
      name: "آرمان کیانی",
      avatar: "https://picsum.photos/seed/author1/100/100",
      bio: "نویسنده و تحلیلگر انیمه‌های اکشن و فانتزی",
      role: "نویسنده ارشد",
      followers: 3200
    },
    date: "۱۴۰۵/۰۱/۰۸",
    readTime: 6,
    views: 15600,
    likes: 940,
    commentsCount: 110,
    bookmarks: 350,
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c8",
        author: "کیان فرهادی",
        avatar: "https://picsum.photos/seed/user11/50/50",
        date: "۱۴۰۵/۰۱/۰۸",
        text: "بالاخره! خیلی منتظر فصل جدید بودم.",
        likes: 52,
        dislikes: 2,
        replies: []
      }
    ],
    relatedIds: ["2", "3", "10"]
  },
  {
    id: "9",
    title: "ده موسیقی متن فراموش‌نشدنی در دنیای انیمه",
    summary:
      "در این مطلب نگاهی داریم به چند موسیقی متن ماندگار که تجربه تماشای انیمه‌ها را چند برابر احساسی‌تر کردند.",
    content: [
      "موسیقی متن همیشه یکی از عناصر مهم در موفقیت انیمه‌ها بوده است.",
      "از قطعات حماسی در نبردهای بزرگ گرفته تا موسیقی‌های آرام در صحنه‌های احساسی، آهنگ‌سازی نقش مهمی در ماندگاری یک اثر دارد.",
      "آثاری مانند Attack on Titan، Your Name و Demon Slayer نمونه‌هایی هستند که موسیقی آن‌ها در ذهن مخاطبان باقی مانده است.",
      "در این لیست، تلاش کرده‌ایم موسیقی‌هایی را معرفی کنیم که نه‌تنها در زمان پخش، بلکه سال‌ها بعد نیز شنیدنی هستند."
    ],
    image: "https://picsum.photos/seed/anime-music/800/450",
    category: "ویژه",
    tags: ["موسیقی متن", "OST", "انیمه", "لیست"],
    author: {
      name: "کاوه مرادی",
      avatar: "https://picsum.photos/seed/author2/100/100",
      bio: "منتقد انیمه و دنبال‌کننده اخبار استودیوهای ژاپنی",
      role: "تحلیلگر",
      followers: 1800
    },
    date: "۱۴۰۵/۰۱/۰۹",
    readTime: 9,
    views: 8800,
    likes: 580,
    commentsCount: 64,
    bookmarks: 240,
    isFeatured: false,
    isHot: false,
    comments: [
      {
        id: "c9",
        author: "ترانه شمس",
        avatar: "https://picsum.photos/seed/user12/50/50",
        date: "۱۴۰۵/۰۱/۰۹",
        text: "موسیقی Attack on Titan واقعاً یه چیز دیگه‌ست.",
        likes: 31,
        dislikes: 0,
        replies: []
      }
    ],
    relatedIds: ["1", "5", "7"]
  },
  {
    id: "10",
    title: "فصل چهارم Demon Slayer: آرک هاشیراها آغاز شد",
    summary:
      "فصل جدید Demon Slayer با تمرکز بر آرک هاشیراها شروع شده و طرفداران از کیفیت بصری آن تعریف می‌کنند.",
    content: [
      "فصل چهارم Demon Slayer رسماً آغاز شد و این بار تمرکز اصلی داستان روی هاشیراها و آماده‌سازی برای نبردهای بزرگ آینده است.",
      "استودیو Ufotable بار دیگر با کیفیت بصری چشم‌نواز خود توجه مخاطبان را جلب کرده است.",
      "اگرچه قسمت‌های ابتدایی بیشتر روی شخصیت‌پردازی و تمرین‌ها تمرکز دارند، اما انتظار می‌رود در ادامه شاهد نبردهای سنگین‌تری باشیم.",
      "طرفداران مانگا می‌دانند که این فصل مقدمه‌ای برای یکی از هیجان‌انگیزترین بخش‌های داستان است."
    ],
    image: "https://picsum.photos/seed/demonslayer-news/800/450",
    category: "اخبار انیمه",
    tags: ["Demon Slayer", "هاشیرا", "Ufotable", "فصل چهارم"],
    author: {
      name: "آرمان کیانی",
      avatar: "https://picsum.photos/seed/author1/100/100",
      bio: "نویسنده و تحلیلگر انیمه‌های اکشن و فانتزی",
      role: "نویسنده ارشد",
      followers: 3200
    },
    date: "۱۴۰۵/۰۱/۰۹",
    readTime: 7,
    views: 17200,
    likes: 1120,
    commentsCount: 130,
    bookmarks: 390,
    isFeatured: true,
    isHot: true,
    comments: [
      {
        id: "c10",
        author: "حسام یوسفی",
        avatar: "https://picsum.photos/seed/user13/50/50",
        date: "۱۴۰۵/۰۱/۰۹",
        text: "انیمیشن Ufotable همیشه عالیه، مخصوصاً صحنه‌های مبارزه.",
        likes: 49,
        dislikes: 1,
        replies: [
          {
            id: "c10r1",
            author: "مریم صفری",
            avatar: "https://picsum.photos/seed/user14/50/50",
            date: "۱۴۰۵/۰۱/۱۰",
            text: "کاملاً، فقط امیدوارم ریتم داستان هم خوب باشه.",
            likes: 16,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["1", "2", "8"]
  },
  {
    id: "11",
    title: "راهنمای شروع تماشای انیمه برای تازه‌واردها",
    summary:
      "اگر تازه می‌خواهید وارد دنیای انیمه شوید، این راهنما چند پیشنهاد مناسب برای شروع به شما معرفی می‌کند.",
    content: [
      "ورود به دنیای انیمه ممکن است برای تازه‌واردها کمی گیج‌کننده باشد، چون تعداد آثار بسیار زیاد است.",
      "بهتر است شروع را با آثاری انتخاب کنید که ریتم مناسب، داستان قابل‌فهم و شخصیت‌های جذاب دارند.",
      "برای علاقه‌مندان اکشن، آثاری مانند Jujutsu Kaisen و Demon Slayer گزینه‌های خوبی هستند.",
      "اگر به داستان‌های احساسی علاقه دارید، فیلم‌هایی مانند Your Name یا A Silent Voice می‌توانند شروع مناسبی باشند."
    ],
    image: "https://picsum.photos/seed/anime-guide/800/450",
    category: "راهنما",
    tags: ["شروع انیمه", "راهنما", "پیشنهاد", "تازه‌واردها"],
    author: {
      name: "نیلوفر رضایی",
      avatar: "https://picsum.photos/seed/author3/100/100",
      bio: "خبرنگار و تحلیلگر صنعت انیمه",
      role: "سردبیر اخبار",
      followers: 2100
    },
    date: "۱۴۰۵/۰۱/۱۰",
    readTime: 8,
    views: 7600,
    likes: 430,
    commentsCount: 48,
    bookmarks: 310,
    isFeatured: false,
    isHot: false,
    comments: [
      {
        id: "c11",
        author: "سپهر علوی",
        avatar: "https://picsum.photos/seed/user15/50/50",
        date: "۱۴۰۵/۰۱/۱۰",
        text: "برای شروع واقعاً Demon Slayer گزینه خوبیه.",
        likes: 21,
        dislikes: 2,
        replies: []
      }
    ],
    relatedIds: ["4", "5", "10"]
  },
  {
    id: "12",
    title: "چرا انیمه‌های ورزشی هنوز محبوب‌اند؟",
    summary:
      "انیمه‌های ورزشی با ترکیب رقابت، دوستی و رشد شخصیت‌ها همچنان طرفداران زیادی در سراسر جهان دارند.",
    content: [
      "انیمه‌های ورزشی سال‌هاست که جایگاه ویژه‌ای میان مخاطبان دارند.",
      "این آثار معمولاً فقط درباره مسابقه نیستند، بلکه مسیر رشد شخصیت‌ها، شکست‌ها، تمرین‌ها و انگیزه‌ها را نشان می‌دهند.",
      "آثاری مانند Haikyuu و Blue Lock ثابت کرده‌اند که ژانر ورزشی می‌تواند به اندازه آثار اکشن هیجان‌انگیز باشد.",
      "ترکیب رقابت سالم، کار تیمی و لحظات احساسی باعث شده این ژانر همچنان تازه و جذاب بماند."
    ],
    image: "https://picsum.photos/seed/sports-anime/800/450",
    category: "تحلیل",
    tags: ["انیمه ورزشی", "Haikyuu", "Blue Lock", "تحلیل"],
    author: {
      name: "کاوه مرادی",
      avatar: "https://picsum.photos/seed/author2/100/100",
      bio: "منتقد انیمه و دنبال‌کننده اخبار استودیوهای ژاپنی",
      role: "تحلیلگر",
      followers: 1800
    },
    date: "۱۴۰۵/۰۱/۱۰",
    readTime: 9,
    views: 6900,
    likes: 390,
    commentsCount: 42,
    bookmarks: 150,
    isFeatured: false,
    isHot: false,
    comments: [
      {
        id: "c12",
        author: "مانی جهانگیری",
        avatar: "https://picsum.photos/seed/user16/50/50",
        date: "۱۴۰۵/۰۱/۱۰",
        text: "هایکیو هنوز برای من بهترین انیمه ورزشیه.",
        likes: 26,
        dislikes: 1,
        replies: [
          {
            id: "c12r1",
            author: "آوا کمالی",
            avatar: "https://picsum.photos/seed/user17/50/50",
            date: "۱۴۰۵/۰۱/۱۱",
            text: "Blue Lock هم خیلی هیجان‌انگیزه.",
            likes: 10,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["7", "9", "11"]
  },
  {
    id: "13",
    title: "مصاحبه اختصاصی با دوبلور فارسی انیمه‌های محبوب",
    summary:
      "گفتگویی صمیمی با یکی از محبوب‌ترین دوبلورهای فارسی انیمه درباره چالش‌ها و خاطرات دوبله.",
    content: [
      "در این مصاحبه اختصاصی، با یکی از محبوب‌ترین دوبلورهای فارسی انیمه گفتگو کرده‌ایم؛ کسی که صدای بسیاری از شخصیت‌های محبوب انیمه را به فارسی درآورده است.",
      "او درباره چالش‌های دوبله انیمه می‌گوید: «بزرگ‌ترین چالش، انتقال احساسات اصلی شخصیت به زبان فارسی است. باید هم به متن وفادار باشی و هم احساس صداپیشه اصلی را منتقل کنی.»",
      "درباره خاطرات جالب دوبله، او تعریف می‌کند: «یک بار برای دوبله یک صحنه احساسی واقعاً گریه‌ام گرفت و مجبور شدیم چند بار ضبط را تکرار کنیم. اما همان برداشت احساسی بهترین شد.»",
      "او به جوانانی که می‌خواهند وارد حرفه دوبله شوند توصیه می‌کند: «تمرین صدا، تماشای زیاد انیمه با زبان اصلی و شرکت در کارگاه‌های بازیگری صدا سه قدم اول هستند.»"
    ],
    image: "https://picsum.photos/seed/dubbing/800/450",
    category: "مصاحبه",
    tags: ["دوبله", "صداپیشه", "فارسی", "مصاحبه"],
    author: {
      name: "نیلوفر رضایی",
      avatar: "https://picsum.photos/seed/author3/100/100",
      bio: "خبرنگار و تحلیلگر صنعت انیمه",
      role: "سردبیر اخبار",
      followers: 2100
    },
    date: "۱۴۰۵/۰۱/۱۱",
    readTime: 9,
    views: 7800,
    likes: 489,
    commentsCount: 78,
    bookmarks: 123,
    isFeatured: false,
    isHot: false,
    comments: [
      {
        id: "c16",
        author: "یاسمن توکلی",
        avatar: "https://picsum.photos/seed/user20/50/50",
        date: "۱۴۰۵/۰۱/۱۱",
        text: "عاشق دوبله فارسی انیمه‌ها هستم! مصاحبه خیلی جالبی بود.",
        likes: 27,
        dislikes: 1,
        replies: [
          {
            id: "c16r1",
            author: "کامران نیکو",
            avatar: "https://picsum.photos/seed/user21/50/50",
            date: "۱۴۰۵/۰۱/۱۱",
            text: "منم می‌خوام دوبلور بشم. نکاتش خیلی مفید بود!",
            likes: 9,
            dislikes: 0,
            replies: []
          }
        ]
      }
    ],
    relatedIds: ["4", "7", "9"]
  }
];

// Helper functions

const withExcerpt = (article: NewsArticle): NewsArticle => {
  return {
    ...article,
    excerpt: article.excerpt ?? article.summary
  };
};

export const getArticleById = (id: string): NewsArticle | undefined => {
  const article = newsArticles.find((article) => String(article.id) === String(id));
  return article ? withExcerpt(article) : undefined;
};

export const getRelatedArticles = (article: NewsArticle): NewsArticle[] => {
  return article.relatedIds
    .map((id) => newsArticles.find((a) => String(a.id) === String(id)))
    .filter((a): a is NewsArticle => a !== undefined)
    .map(withExcerpt);
};

export const getFeaturedArticles = (): NewsArticle[] => {
  return newsArticles.filter((article) => article.isFeatured).map(withExcerpt);
};

export const getHotArticles = (): NewsArticle[] => {
  return newsArticles.filter((article) => article.isHot).map(withExcerpt);
};

export const getArticlesByCategory = (category: string): NewsArticle[] => {
  return newsArticles
    .filter((article) => article.category === category)
    .map(withExcerpt);
};

export const searchArticles = (query: string): NewsArticle[] => {
  const lowerQuery = query.trim().toLowerCase();

  if (!lowerQuery) {
    return newsArticles.map(withExcerpt);
  }

  return newsArticles
    .filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.summary.toLowerCase().includes(lowerQuery) ||
        article.category.toLowerCase().includes(lowerQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        article.author.name.toLowerCase().includes(lowerQuery)
    )
    .map(withExcerpt);
};

export const getAllCategories = (): string[] => {
  return Array.from(new Set(newsArticles.map((article) => article.category)));
};

export const getAllTags = (): string[] => {
  return Array.from(new Set(newsArticles.flatMap((article) => article.tags)));
};

export const getLatestArticles = (limit?: number): NewsArticle[] => {
  const articles = [...newsArticles].map(withExcerpt);

  return typeof limit === "number" ? articles.slice(0, limit) : articles;
};

export const getMostViewedArticles = (limit = 5): NewsArticle[] => {
  return [...newsArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
    .map(withExcerpt);
};

export const getMostLikedArticles = (limit = 5): NewsArticle[] => {
  return [...newsArticles]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit)
    .map(withExcerpt);
};

export const getArticleComments = (articleId: string): NewsComment[] => {
  const article = newsArticles.find((article) => String(article.id) === String(articleId));
  return article?.comments ?? [];
};
