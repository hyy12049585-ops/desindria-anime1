import { create } from "zustand";

// ======== Types ========

export interface RegisteredUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: string;
}

interface OTPData {
  code: string;
  expiresAt: number;
  phone: string;
  purpose: "register" | "login" | "forgot";
}

interface AuthState {
  currentUser: RegisteredUser | null;
  isLoggedIn: boolean;
  registeredUsers: RegisteredUser[];
  pendingOTP: OTPData | null;
  pendingRegistration: Partial<RegisteredUser> | null;

  // Actions
  register: (user: Omit<RegisteredUser, "id" | "createdAt" | "avatar">) => boolean;
  login: (phoneOrEmail: string, password: string) => { success: boolean; message: string };
  loginWithOTP: (phone: string) => { success: boolean; message: string; code?: string };
  logout: () => void;
  generateOTP: (phone: string, purpose: "register" | "login" | "forgot") => string;
  verifyOTP: (code: string) => { success: boolean; message: string };
  resetPassword: (phone: string, newPassword: string) => { success: boolean; message: string };
  userExists: (phone: string) => boolean;
  setPendingRegistration: (data: Partial<RegisteredUser> | null) => void;
  updateProfile: (data: Partial<RegisteredUser>) => void;
}

// ======== Helpers ========

const STORAGE_KEY = "auth_registered_users";
const CURRENT_USER_KEY = "auth_current_user";

const loadUsers = (): RegisteredUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: RegisteredUser[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const loadCurrentUser = (): RegisteredUser | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveCurrentUser = (user: RegisteredUser | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

const generateId = (): string =>
  `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const generateOTPCode = (): string =>
  Math.floor(10000 + Math.random() * 90000).toString();

// ======== Store ========

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: loadCurrentUser(),
  isLoggedIn: !!loadCurrentUser(),
  registeredUsers: loadUsers(),
  pendingOTP: null,
  pendingRegistration: null,

  register: (userData) => {
    const { registeredUsers } = get();
    const exists = registeredUsers.some(
      (u) => u.phone === userData.phone || u.email === userData.email
    );
    if (exists) return false;

    const newUser: RegisteredUser = {
      ...userData,
      id: generateId(),
      avatar: "",
      createdAt: new Date().toISOString(),
    };

    const updated = [...registeredUsers, newUser];
    saveUsers(updated);
    saveCurrentUser(newUser);
    set({
      registeredUsers: updated,
      currentUser: newUser,
      isLoggedIn: true,
      pendingRegistration: null,
    });
    return true;
  },

  login: (phoneOrEmail, password) => {
    const { registeredUsers } = get();
    const user = registeredUsers.find(
      (u) =>
        (u.phone === phoneOrEmail || u.email === phoneOrEmail) &&
        u.password === password
    );
    if (!user) {
      return { success: false, message: "شماره/ایمیل یا رمز عبور اشتباه است" };
    }
    saveCurrentUser(user);
    set({ currentUser: user, isLoggedIn: true });
    return { success: true, message: "ورود موفق" };
  },

  loginWithOTP: (phone) => {
    const { registeredUsers } = get();
    const user = registeredUsers.find((u) => u.phone === phone);
    if (!user) {
      return { success: false, message: "این شماره ثبت‌نام نشده است" };
    }
    const code = get().generateOTP(phone, "login");
    return { success: true, message: "کد ارسال شد", code };
  },

  logout: () => {
    saveCurrentUser(null);
    set({ currentUser: null, isLoggedIn: false });
  },

  generateOTP: (phone, purpose) => {
    const code = generateOTPCode();
    const otpData: OTPData = {
      code,
      expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
      phone,
      purpose,
    };
    set({ pendingOTP: otpData });
    return code;
  },

  verifyOTP: (code) => {
    const { pendingOTP, registeredUsers, pendingRegistration } = get();
    if (!pendingOTP) {
      return { success: false, message: "کد تأیید یافت نشد" };
    }
    if (Date.now() > pendingOTP.expiresAt) {
      set({ pendingOTP: null });
      return { success: false, message: "کد تأیید منقضی شده است" };
    }
    if (pendingOTP.code !== code) {
      return { success: false, message: "کد تأیید اشتباه است" };
    }

    // OTP verified
    if (pendingOTP.purpose === "login") {
      const user = registeredUsers.find((u) => u.phone === pendingOTP.phone);
      if (user) {
        saveCurrentUser(user);
        set({ currentUser: user, isLoggedIn: true, pendingOTP: null });
      }
    }

    if (pendingOTP.purpose === "register" && pendingRegistration) {
      const newUser: RegisteredUser = {
        id: generateId(),
        fullName: pendingRegistration.fullName || "",
        phone: pendingRegistration.phone || "",
        email: pendingRegistration.email || "",
        password: pendingRegistration.password || "",
        avatar: "",
        createdAt: new Date().toISOString(),
      };
      const updated = [...registeredUsers, newUser];
      saveUsers(updated);
      saveCurrentUser(newUser);
      set({
        registeredUsers: updated,
        currentUser: newUser,
        isLoggedIn: true,
        pendingOTP: null,
        pendingRegistration: null,
      });
    }

    if (pendingOTP.purpose === "forgot") {
      set({ pendingOTP: { ...pendingOTP, code: "__verified__" } });
    }

    return { success: true, message: "کد تأیید صحیح است" };
  },

  resetPassword: (phone, newPassword) => {
    const { registeredUsers } = get();
    const idx = registeredUsers.findIndex((u) => u.phone === phone);
    if (idx < 0) {
      return { success: false, message: "کاربری با این شماره یافت نشد" };
    }
    const updated = [...registeredUsers];
    updated[idx] = { ...updated[idx], password: newPassword };
    saveUsers(updated);
    set({ registeredUsers: updated, pendingOTP: null });
    return { success: true, message: "رمز عبور با موفقیت تغییر کرد" };
  },

  userExists: (phone) => {
    return get().registeredUsers.some((u) => u.phone === phone);
  },

  setPendingRegistration: (data) => {
    set({ pendingRegistration: data });
  },

  updateProfile: (data) => {
    const { currentUser, registeredUsers } = get();
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...data };
    const updatedUsers = registeredUsers.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );
    saveUsers(updatedUsers);
    saveCurrentUser(updatedUser);
    set({ currentUser: updatedUser, registeredUsers: updatedUsers });
  },
}));
