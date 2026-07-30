import type { CommentAuthor } from "../types/comments";

type AnyRecord = Record<string, any>;

const GUEST_AUTHOR: CommentAuthor = {
  id: "guest",
  name: "کاربر مهمان",
};

function safeParse(value: string | null): any {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function isBadName(value: string): boolean {
  const name = value.trim().toLowerCase();

  if (!name) return true;

  const badNames = [
    "guest",
    "anonymous",
    "unknown",
    "null",
    "undefined",
    "user",
    "کاربر",
    "مهمان",
    "کاربر مهمان",
    "کاربر دسینیار",
    "دسینیار",
    "sindaria",
    "desiniar",
  ];

  if (badNames.includes(name)) return true;

  if (name.length > 40) return true;

  return false;
}

function cleanName(value: unknown): string {
  const name = normalizeString(value);
  if (isBadName(name)) return "";
  return name;
}

function cleanId(value: unknown): string {
  if (typeof value === "number") return String(value);

  const id = normalizeString(value);

  if (!id) return "";
  if (id.length > 120) return "";

  return id;
}

function getValueByPath(data: any, path: string): unknown {
  if (!data || typeof data !== "object") return undefined;

  return path.split(".").reduce((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    return acc[key];
  }, data);
}

function buildAuthorFromObject(data: any): CommentAuthor | null {
  if (!data || typeof data !== "object") return null;

  const namePaths = [
    "displayName",
    "fullName",
    "name",
    "username",
    "userName",
    "nickname",
    "nickName",
    "firstName",

    "user.displayName",
    "user.fullName",
    "user.name",
    "user.username",
    "user.userName",
    "user.nickname",
    "user.firstName",

    "account.displayName",
    "account.fullName",
    "account.name",
    "account.username",
    "account.userName",
    "account.nickname",
    "account.firstName",

    "profile.displayName",
    "profile.fullName",
    "profile.name",
    "profile.username",
    "profile.userName",
    "profile.nickname",
    "profile.firstName",

    "currentUser.displayName",
    "currentUser.fullName",
    "currentUser.name",
    "currentUser.username",
    "currentUser.userName",
    "currentUser.nickname",
    "currentUser.firstName",

    "auth.user.displayName",
    "auth.user.fullName",
    "auth.user.name",
    "auth.user.username",
    "auth.user.userName",
    "auth.user.nickname",
    "auth.user.firstName",

    "state.user.displayName",
    "state.user.fullName",
    "state.user.name",
    "state.user.username",
    "state.user.userName",
    "state.user.nickname",
    "state.user.firstName",

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
  ];

  const idPaths = [
    "id",
    "_id",
    "userId",
    "uid",
    "sub",

    "user.id",
    "user._id",
    "user.userId",
    "user.uid",

    "account.id",
    "account._id",
    "account.userId",
    "account.uid",

    "profile.id",
    "profile._id",
    "profile.userId",
    "profile.uid",

    "currentUser.id",
    "currentUser._id",
    "currentUser.userId",
    "currentUser.uid",

    "auth.user.id",
    "auth.user._id",
    "auth.user.userId",
    "auth.user.uid",

    "state.user.id",
    "state.user._id",
    "state.user.userId",
    "state.user.uid",

    "state.auth.user.id",
    "state.auth.user._id",
    "state.auth.user.userId",
    "state.auth.user.uid",

    "state.currentUser.id",
    "state.currentUser._id",
    "state.currentUser.userId",
    "state.currentUser.uid",
  ];

  const usernamePaths = [
    "username",
    "userName",
    "user.username",
    "user.userName",
    "account.username",
    "account.userName",
    "profile.username",
    "profile.userName",
    "currentUser.username",
    "currentUser.userName",
    "auth.user.username",
    "auth.user.userName",
    "state.user.username",
    "state.user.userName",
    "state.auth.user.username",
    "state.auth.user.userName",
    "state.currentUser.username",
    "state.currentUser.userName",
  ];

  const emailPaths = [
    "email",
    "user.email",
    "account.email",
    "profile.email",
    "currentUser.email",
    "auth.user.email",
    "state.user.email",
    "state.auth.user.email",
    "state.currentUser.email",
  ];

  let name = "";

  for (const path of namePaths) {
    name = cleanName(getValueByPath(data, path));
    if (name) break;
  }

  if (!name) return null;

  let id = "";

  for (const path of idPaths) {
    id = cleanId(getValueByPath(data, path));
    if (id) break;
  }

  let username = "";

  for (const path of usernamePaths) {
    username = cleanName(getValueByPath(data, path));
    if (username) break;
  }

  let email = "";

  for (const path of emailPaths) {
    email = normalizeString(getValueByPath(data, path));
    if (email) break;
  }

  const finalId = id || username || email || name;

  return {
    id: finalId,
    name,
    username: username || undefined,
    email: email || undefined,
  };
}

function deepFindAuthor(data: any, depth = 0): CommentAuthor | null {
  if (!data || typeof data !== "object") return null;
  if (depth > 6) return null;

  const direct = buildAuthorFromObject(data);
  if (direct) return direct;

  const preferredObjectKeys = [
    "user",
    "account",
    "profile",
    "currentUser",
    "currentAccount",
    "auth",
    "session",
    "state",
    "data",
  ];

  for (const key of preferredObjectKeys) {
    if (data[key] && typeof data[key] === "object") {
      const found = deepFindAuthor(data[key], depth + 1);
      if (found) return found;
    }
  }

  return null;
}

function getStorageItems(storage: Storage): Array<{ key: string; value: any }> {
  const items: Array<{ key: string; value: any }> = [];

  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key) continue;

    items.push({
      key,
      value: safeParse(storage.getItem(key)),
    });
  }

  return items;
}

function scoreStorageKey(key: string): number {
  const lower = key.toLowerCase();

  let score = 0;

  if (lower.includes("current")) score += 50;
  if (lower.includes("auth")) score += 45;
  if (lower.includes("login")) score += 45;
  if (lower.includes("session")) score += 40;
  if (lower.includes("user")) score += 35;
  if (lower.includes("account")) score += 35;
  if (lower.includes("profile")) score += 25;
  if (lower.includes("zustand")) score += 15;
  if (lower.includes("persist")) score += 15;

  if (lower.includes("comment")) score -= 100;
  if (lower.includes("comments")) score -= 100;
  if (lower.includes("setting")) score -= 80;
  if (lower.includes("theme")) score -= 80;
  if (lower.includes("site")) score -= 80;
  if (lower.includes("app")) score -= 20;

  return score;
}

function isProbablyAuthKey(key: string): boolean {
  return scoreStorageKey(key) > 0;
}

/**
 * این تابع باید هر اکانتی که واقعاً لاگین است را پیدا کند.
 * یعنی اگر فردا کاربر دیگری ثبت‌نام کرد و لاگین شد، کامنت با اسم همان کاربر ثبت شود.
 */
export function getCurrentAccount(): CommentAuthor {
  if (typeof window === "undefined") return GUEST_AUTHOR;

  const storages: Storage[] = [localStorage, sessionStorage];

  const preferredKeys = [
    "currentUser",
    "currentAccount",
    "loggedInUser",
    "loggedUser",
    "authUser",
    "user",
    "account",
    "profile",
    "auth",
    "session",
    "userInfo",
    "accountInfo",
    "auth-storage",
    "user-storage",
    "account-storage",
    "profile-storage",
    "sindaria-auth",
    "sindaria-user",
    "sindaria-storage",
  ];

  for (const storage of storages) {
    for (const key of preferredKeys) {
      const raw = storage.getItem(key);
      if (!raw) continue;

      const parsed = safeParse(raw);

      if (typeof parsed === "string") {
        const name = cleanName(parsed);
        if (name) {
          return {
            id: name,
            name,
          };
        }
      }

      const author = deepFindAuthor(parsed);
      if (author) return author;
    }
  }

  const candidates: Array<{ score: number; author: CommentAuthor }> = [];

  for (const storage of storages) {
    const items = getStorageItems(storage);

    for (const item of items) {
      if (!isProbablyAuthKey(item.key)) continue;

      const baseScore = scoreStorageKey(item.key);

      if (typeof item.value === "string") {
        const name = cleanName(item.value);
        if (name) {
          candidates.push({
            score: baseScore,
            author: {
              id: name,
              name,
            },
          });
        }
        continue;
      }

      const author = deepFindAuthor(item.value);

      if (author) {
        candidates.push({
          score: baseScore + 20,
          author,
        });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  if (candidates[0]?.author) {
    return candidates[0].author;
  }

  return GUEST_AUTHOR;
}

export function getCurrentAccountName(): string {
  return getCurrentAccount().name;
}
