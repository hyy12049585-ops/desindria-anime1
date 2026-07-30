/*
  NAVIGATION CONSTANTS
  
  Centralizing navigation data prevents typos and makes 
  it easy to add/remove/reorder menu items.
*/

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "Trending", href: "/trending" },
  { label: "Schedule", href: "/schedule" },
  { label: "My List", href: "/my-list" },
];

export const GENRE_LIST = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
  "Mecha",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Seinen",
  "Shonen",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "DMCA", href: "/dmca" },
  ],
  social: [
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Discord", href: "https://discord.gg" },
    { label: "Reddit", href: "https://reddit.com" },
    { label: "Instagram", href: "https://instagram.com" },
  ],
};
