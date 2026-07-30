// src/services/api/authApi.ts

import type {
  LoginRequest,
  RegisterRequest,
  OtpVerifyRequest,
  StoredUser,
  ApiResponse,
  PendingOtp,
} from '../../types/auth.types';

// ===== Storage Keys =====
const USERS_KEY = 'syndria_users';
const PENDING_KEY = 'syndria_pending_otp';
const SESSION_KEY = 'syndria_session';
const TOKEN_KEY = 'syndria_token';

// ===== Internal Helpers =====

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(phone: string): StoredUser | undefined {
  return getUsers().find((u) => u.phone === phone);
}

function getPending(): PendingOtp | null {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
  } catch {
    return null;
  }
}

function savePending(p: PendingOtp | null) {
  if (p) localStorage.setItem(PENDING_KEY, JSON.stringify(p));
  else localStorage.removeItem(PENDING_KEY);
}

function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateToken(): string {
  return 'token_' + Date.now() + '_' + Math.random().toString(36).slice(2);
}

function delay(ms = 500): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ===== authApi Object (AuthContext اینو import می‌کنه) =====

export const authApi = {

  // ──── ثبت‌نام ────
  async register(data: RegisterRequest): Promise<ApiResponse> {
    await delay();

    const existing = findUser(data.phone);
    if (existing) {
      return {
        success: false,
        message: `شما قبلاً با شماره ${data.phone} و نام "${existing.fullName}" ثبت‌نام کرده‌اید. لطفاً از بخش ورود استفاده کنید.`,
      };
    }

    const code = generateOtp();
    const pending: PendingOtp = {
      phone: data.phone,
      code,
      type: 'register',
      expiresAt: Date.now() + 2 * 60 * 1000,
      fullName: data.fullName,
      password: data.password,
    };
    savePending(pending);

    console.log(`📱 کد تأیید ثبت‌نام: ${code}`);

    return {
      success: true,
      message: 'کد تأیید ارسال شد',
      data: { otpCode: code, phone: data.phone },
    };
  },

  // ──── ورود ────
  async login(data: LoginRequest): Promise<ApiResponse> {
    await delay();

    const user = findUser(data.phone);
    if (!user) {
      return {
        success: false,
        message: 'حسابی با این شماره یافت نشد. لطفاً ابتدا ثبت‌نام کنید.',
      };
    }

    if (user.password !== data.password) {
      return {
        success: false,
        message: 'رمز عبور اشتباه است',
      };
    }

    const code = generateOtp();
    const pending: PendingOtp = {
      phone: data.phone,
      code,
      type: 'login',
      expiresAt: Date.now() + 2 * 60 * 1000,
    };
    savePending(pending);

    console.log(`📱 کد تأیید ورود: ${code}`);

    return {
      success: true,
      message: 'کد تأیید ارسال شد',
      data: { otpCode: code, phone: data.phone },
    };
  },

  // ──── فراموشی رمز ────
  async forgotPassword(phone: string): Promise<ApiResponse> {
    await delay();

    const user = findUser(phone);
    if (!user) {
      return {
        success: false,
        message: 'حسابی با این شماره یافت نشد.',
      };
    }

    const code = generateOtp();
    const pending: PendingOtp = {
      phone,
      code,
      type: 'forgot',
      expiresAt: Date.now() + 2 * 60 * 1000,
    };
    savePending(pending);

    console.log(`📱 کد بازیابی رمز: ${code}`);

    return {
      success: true,
      message: 'کد تأیید ارسال شد',
      data: { otpCode: code, phone },
    };
  },

  // ──── تأیید OTP ────
  async verifyOtp(data: OtpVerifyRequest): Promise<ApiResponse<{ user: StoredUser; token: string }>> {
    await delay();

    const pending = getPending();

    if (!pending || pending.phone !== data.phone) {
      return { success: false, message: 'درخواست نامعتبر. لطفاً دوباره تلاش کنید.' };
    }

    // ✅ اول کد رو چک کن (نه انقضا!)
    if (pending.code !== data.code) {
      return { success: false, message: 'کد تأیید اشتباه است. لطفاً دوباره بررسی کنید.' };
    }

    // ✅ بعد انقضا
    if (Date.now() > pending.expiresAt) {
      return { success: false, message: 'کد تأیید منقضی شده. لطفاً کد جدید دریافت کنید.' };
    }

    // === کد درسته و منقضی نشده ===
    let user: StoredUser;

    if (pending.type === 'register') {
      // ثبت‌نام: کاربر جدید بساز
      const users = getUsers();
      user = {
        id: 'user_' + Date.now(),
        phone: pending.phone,
        fullName: pending.fullName || 'کاربر',
        password: pending.password || '1234',
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      saveUsers(users);
    } else if (pending.type === 'login') {
      const found = findUser(pending.phone);
      if (!found) {
        return { success: false, message: 'خطای سیستمی. کاربر یافت نشد.' };
      }
      user = found;
    } else {
      // forgot
      const found = findUser(pending.phone);
      if (!found) {
        return { success: false, message: 'خطای سیستمی. کاربر یافت نشد.' };
      }
      user = found;
    }

    // token بساز
    const token = generateToken();

    // pending پاک کن
    savePending(null);

    // session ذخیره کن (برای همه حالات غیر forgot)
    if (pending.type !== 'forgot') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      localStorage.setItem(TOKEN_KEY, token);
    }

    return {
      success: true,
      message: pending.type === 'forgot'
        ? 'هویت تأیید شد. رمز جدید را وارد کنید.'
        : 'خوش آمدید!',
      data: { user, token },
    };
  },

  // ──── ارسال مجدد OTP ────
  async resendOtp(phone: string): Promise<ApiResponse> {
    await delay();

    const oldPending = getPending();
    const code = generateOtp();

    const newPending: PendingOtp = {
      phone,
      code,
      type: oldPending?.phone === phone ? oldPending.type : 'login',
      expiresAt: Date.now() + 2 * 60 * 1000,
      fullName: oldPending?.phone === phone ? oldPending.fullName : undefined,
      password: oldPending?.phone === phone ? oldPending.password : undefined,
    };
    savePending(newPending);

    console.log(`📱 کد جدید: ${code}`);

    return {
      success: true,
      message: 'کد جدید ارسال شد',
      data: { otpCode: code },
    };
  },

  // ──── تغییر رمز ────
  async resetPassword(phone: string, newPassword: string): Promise<ApiResponse> {
    await delay();

    const users = getUsers();
    const idx = users.findIndex((u) => u.phone === phone);
    if (idx === -1) {
      return { success: false, message: 'کاربر یافت نشد.' };
    }

    users[idx].password = newPassword;
    saveUsers(users);

    // لاگین هم بکن
    const token = generateToken();
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));
    localStorage.setItem(TOKEN_KEY, token);

    return {
      success: true,
      message: 'رمز عبور با موفقیت تغییر کرد',
      data: { user: users[idx], token },
    };
  },

  // ──── آپدیت پروفایل ────
  async updateProfile(data: {
    phone: string;
    fullName?: string;
    newPassword?: string;
  }): Promise<ApiResponse> {
    await delay();

    const users = getUsers();
    const idx = users.findIndex((u) => u.phone === data.phone);
    if (idx === -1) {
      return { success: false, message: 'کاربر یافت نشد.' };
    }

    if (data.fullName) users[idx].fullName = data.fullName;
    if (data.newPassword) users[idx].password = data.newPassword;
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[idx]));

    return {
      success: true,
      message: 'پروفایل به‌روزرسانی شد',
      data: { user: users[idx] },
    };
  },

  // ──── دریافت کاربر فعلی (persist login) ────
  getCurrentUser(): { user: StoredUser | null; token: string | null } {
    try {
      const user = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      const token = localStorage.getItem(TOKEN_KEY) || null;
      return { user, token };
    } catch {
      return { user: null, token: null };
    }
  },

  // ──── خروج ────
  logoutUser(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PENDING_KEY);
  },
};

// Default export هم اضافه می‌کنیم برای سازگاری
export default authApi;
