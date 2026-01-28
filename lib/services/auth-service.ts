import { apiClient, TokenManager } from './api-client';
import { API_ENDPOINTS } from '@/lib/config/api';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  User,
} from '@/lib/types/api';

export const authService = {
  /**
   * تسجيل الدخول
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const loginData: LoginRequest = { email, password };

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      loginData,
      false // لا يتطلب مصادقة
    );

    // حفظ الرموز
    if (response.data.accessToken) {
      TokenManager.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response.data;
  },

  /**
   * تسجيل مستخدم جديد
   * Register new user
   */
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const registerData: RegisterRequest = {
      firstName,
      lastName,
      email,
      password,
    };

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      registerData,
      false // لا يتطلب مصادقة
    );

    // حفظ الرموز
    if (response.data.accessToken) {
      TokenManager.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response.data;
  },

  /**
   * تسجيل الخروج
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, true);
    } finally {
      // مسح الرموز حتى لو فشل الطلب
      TokenManager.clearTokens();
    }
  },

  /**
   * الحصول على المستخدم الحالي
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = TokenManager.getAccessToken();
      if (!token) {
        return null;
      }

      const response = await apiClient.get<User>(
        API_ENDPOINTS.AUTH.PROFILE,
        true
      );

      return response.data;
    } catch (error) {
      // في حالة فشل الحصول على المستخدم، مسح الرموز
      TokenManager.clearTokens();
      return null;
    }
  },

  /**
   * نسيت كلمة المرور
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email },
      false
    );
  },

  /**
   * إعادة تعيين كلمة المرور
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      { token, password },
      false
    );
  },

  /**
   * تحديث الرموز
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const refreshData: RefreshTokenRequest = { refreshToken };

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      refreshData,
      false
    );

    // تحديث الرموز
    if (response.data.accessToken) {
      TokenManager.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }

    return response.data;
  },

  /**
   * التحقق من حالة المصادقة
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!TokenManager.getAccessToken();
  },
};