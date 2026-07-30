// ============================================
// 🔧 API Client Configuration
// ============================================
// وقتی بک‌اند واقعی ساختی:
// 1. BASE_URL رو عوض کن
// 2. USE_MOCK رو بذار false
// ============================================

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  USE_MOCK: true,
  TIMEOUT: 10000,
};

export const simulateDelay = (ms: number = 1200): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('sindria_token') || ''}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'خطا در ارتباط با سرور');
    }
    return response.json();
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('sindria_token') || ''}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'خطا در ارتباط با سرور');
    }
    return response.json();
  },
};
