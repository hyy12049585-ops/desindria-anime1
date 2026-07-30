import type { CommentAuthor, RawAccount } from '../types/comments';

export function normalizeAuthor(value: RawAccount | any): CommentAuthor {
  return {
    id: String(
      value?.id ??
        value?.userId ??
        value?._id ??
        value?.uid ??
        'local-user'
    ),
    name: String(
      value?.name ??
        value?.fullName ??
        value?.displayName ??
        value?.username ??
        value?.firstName ??
        'کاربر'
    ),
    avatar:
      value?.avatar ??
      value?.avatarUrl ??
      value?.profileImage ??
      value?.image ??
      value?.photoURL ??
      null,
    username: value?.username ? String(value.username) : undefined,
    email: value?.email ? String(value.email) : undefined,
  };
}

export function getAvatarText(name?: string | null) {
  if (!name) return 'ک';
  return String(name).trim().charAt(0);
}

export function isSameAuthor(a?: CommentAuthor | null, b?: CommentAuthor | null) {
  if (!a || !b) return false;
  return String(a.id) === String(b.id);
}

export function getCurrentAccountFromStorage(): CommentAuthor {
  if (typeof window === 'undefined') {
    return {
      id: 'local-user',
      name: 'کاربر',
      avatar: null,
    };
  }

  const possibleKeys = [
    'currentAccount',
    'account',
    'user',
    'authUser',
    'profile',
    'loggedInUser',
  ];

  for (const key of possibleKeys) {
    try {
      const rawValue = localStorage.getItem(key);
      if (!rawValue) continue;

      const parsedValue = JSON.parse(rawValue);
      return normalizeAuthor(parsedValue);
    } catch {
      continue;
    }
  }

  return {
    id: 'local-user',
    name: 'کاربر',
    avatar: null,
  };
}
