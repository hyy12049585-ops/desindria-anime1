type UnknownRecord = Record<string, any>;

function safeJsonParse<T = unknown>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function cleanName(value: unknown): string {
  const name = normalizeText(value);

  if (!name) return "";

  const normalized = name.toLowerCase();

  const badNames = [
    "guest",
    "کاربر مهمان",
    "مهمان",
    "anonymous",
    "unknown",
    "null",
    "undefined",

    // این‌ها اسم اکانت واقعی نیستند، اسم عمومی/برند/پیش‌فرض پروژه‌اند
    "کاربر دسینیار",
    "دسینیار",
    "سندریا",
    "sindaria",
    "desiniar",
  ];

  if (badNames.includes(normalized)) return "";

  // اگر مقدار خیلی طولانی باشد احتمالاً اسم واقعی کاربر نیست
  if (name.length > 40) return "";

  return name;
}

function getValueByPath(data: any, path: string): unknown {
  if (!data || typeof data !== "object") return undefined;

  return path.split(".").reduce((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return acc[key];
  }, data);
}

function pickNameByKnownPaths(data: any): string {
  if (!data || typeof data !== "object") return "";

  const paths = [
    // حالت‌های ساده
    "displayName",
    "fullName",
    "name",
    "username",
    "userName",
    "nickname",
    "nickName",
    "firstName",

    // user
    "user.displayName",
    "user.fullName",
    "user.name",
    "user.username",
    "user.userName",
    "user.nickname",
    "user.firstName",

    // account
    "account.displayName",
    "account.fullName",
    "account.name",
    "account.username",
    "account.userName",
    "account.nickname",
    "account.firstName",

    // profile
    "profile.displayName",
    "profile.fullName",
    "profile.name",
    "profile.username",
    "profile.userName",
    "profile.nickname",
    "profile.firstName",

    // auth
    "auth.displayName",
    "auth.fullName",
    "auth.name",
    "auth.username",
    "auth.userName",
    "auth.nickname",
    "auth.firstName",

    // Zustand / Redux Persist common shapes
    "state.user.displayName",
    "state.user.fullName",
    "state.user.name",
    "state.user.username",
    "state.user.userName",
    "state.user.nickname",
    "state.user.firstName",

    "state.account.displayName",
    "state.account.fullName",
    "state.account.name",
    "state.account.username",
    "state.account.userName",
    "state.account.nickname",
    "state.account.firstName",

    "state.auth.user.displayName",
    "state.auth.user.fullName",
    "state.auth.user.name",
    "state.auth.user.username",
    "state.auth.user.userName",
    "state.auth.user.nickname",
    "state.auth.user.firstName",

    "state.currentUser.displayName",
    "state.currentUser.fullName",
    "state.currentUser.name",
    "state.currentUser.username",
    "state.currentUser.userName",
    "state.currentUser.nickname",
    "state.currentUser.firstName",

    "data.user.displayName",
    "data.user.fullName",
    "data.user.name",
    "data.user.username",
    "data.user.userName",
    "data.user.nickname",
    "data.user.firstName",
  ];

  for (const path of paths) {
    const name = cleanName(getValueByPath(data, path));
    if (name) return name;
  }

  return "";
}

function deepFindName(data: any, depth = 0): string {
  if (!data || typeof data !== "object") return "";
  if (depth > 5) return "";

  const preferredNameKeys = [
    "displayName",
    "fullName",
    "username",
    "userName",
    "nickname",
    "nickName",
    "firstName",
    "name",
  ];

  for (const key of preferredNameKeys) {
    const name = cleanName(data[key]);
    if (name) return name;
  }

  const preferredObjectKeys = [
    "user",
    "account",
    "profile",
    "auth",
    "currentUser",
    "currentAccount",
    "state",
    "data",
  ];

  for (const key of preferredObjectKeys) {
    if (data[key] && typeof data[key] === "object") {
      const name = deepFindName(data[key], depth + 1);
      if (name) return name;
    }
  }

  return "";
}

export function getCurrentAccountName(): string {
  if (typeof window === "undefined") return "کاربر مهمان";

  /**
   * فقط اول کلیدهای محتمل مربوط به اکانت/Auth را بررسی می‌کنیم.
   * این‌طوری اسم‌هایی مثل «کاربر دسینیار» از تنظیمات سایت اشتباهی انتخاب نمی‌شوند.
   */
  const preferredStorageKeys = [
    "currentUser",
    "currentAccount",
    "account",
    "user",
    "authUser",
    "loggedInUser",
    "loggedUser",
    "profile",
    "auth",
    "userInfo",
    "accountInfo",
    "sindariaUser",
    "sindariaAccount",

    // حالت‌های رایج Zustand / Redux Persist
    "auth-storage",
    "user-storage",
    "account-storage",
    "profile-storage",
    "sindaria-auth",
    "sindaria-user",
    "sindaria-storage",
  ];

  for (const key of preferredStorageKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    const directName = cleanName(raw);
    if (directName) return directName;

    const parsed = safeJsonParse(raw);

    const nameByPath = pickNameByKnownPaths(parsed);
    if (nameByPath) return nameByPath;

    const deepName = deepFindName(parsed);
    if (deepName) return deepName;
  }

  /**
   * اگر با کلیدهای بالا پیدا نشد، حالا کل localStorage را می‌گردیم
   * ولی فقط کلیدهایی که احتمالاً مربوط به auth/user/account هستند.
   */
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key) continue;

    const lowerKey = key.toLowerCase();

    const isProbablyUserKey =
      lowerKey.includes("user") ||
      lowerKey.includes("auth") ||
      lowerKey.includes("account") ||
      lowerKey.includes("profile") ||
      lowerKey.includes("login") ||
      lowerKey.includes("session");

    if (!isProbablyUserKey) continue;

    const raw = localStorage.getItem(key);
    if (!raw) continue;

    const directName = cleanName(raw);
    if (directName) return directName;

    const parsed = safeJsonParse(raw);

    const nameByPath = pickNameByKnownPaths(parsed);
    if (nameByPath) return nameByPath;

    const deepName = deepFindName(parsed);
    if (deepName) return deepName;
  }

  return "کاربر مهمان";
}
