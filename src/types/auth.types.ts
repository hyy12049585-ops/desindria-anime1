// ============================================
// 🔐 Auth API Types
// ============================================

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  password: string;
}

export interface OtpVerifyRequest {
  phone: string;
  code: string;
}

export interface StoredUser {
  id: string;
  fullName: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PendingOtp {
  phone: string;
  fullName?: string;
  password?: string;
  code: string;
  type: 'login' | 'register' | 'forgot';
  expiresAt: number;
}
