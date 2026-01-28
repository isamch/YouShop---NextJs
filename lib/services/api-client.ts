import { API_CONFIG, DEFAULT_HEADERS, HTTP_STATUS } from '@/lib/config/api';

// Types for API responses
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: any;
}

// Custom error class
export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    public details?: any
  ) {
    super(error);
    this.name = 'ApiClientError';
  }
}

// Token management
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken?: string): void {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }
}

// Request configuration interface
interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  timeout?: number;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Main request method
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const { method, url, data, headers = {}, requiresAuth = true, timeout = this.timeout } = config;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...headers,
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = TokenManager.getAccessToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    };

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${url}`, requestOptions);

      // Handle different response types
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      // Parse response
      const responseData = await this.parseResponse<T>(response);

      return {
        data: responseData,
        success: true,
      };
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle network errors
      throw new ApiClientError(
        0,
        'Network error occurred. Please check your connection.',
        error
      );
    }
  }

  // Handle error responses
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorData: any;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'An error occurred' };
    }

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          await this.refreshAccessToken();
          // Don't throw error, let the original request retry
          return;
        } catch {
          // Refresh failed, clear tokens and redirect to login
          TokenManager.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }
    }

    // معالجة رسائل الخطأ المتعددة من NestJS
    // Handle multiple error messages from NestJS validation
    let errorMessage = 'An error occurred';

    if (errorData.message) {
      if (Array.isArray(errorData.message)) {
        // إذا كانت رسائل متعددة، ندمجها
        // If multiple messages, join them
        errorMessage = errorData.message.join(', ');
      } else {
        errorMessage = errorData.message;
      }
    } else if (errorData.error) {
      errorMessage = errorData.error;
    }

    throw new ApiClientError(
      response.status,
      errorMessage,
      errorData
    );
  }

  // Parse response based on content type
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return await response.text() as unknown as T;
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    TokenManager.setTokens(data.accessToken, data.refreshToken);
  }

  // Convenience methods
  async get<T = any>(url: string, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, requiresAuth });
  }

  async post<T = any>(url: string, data?: any, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, requiresAuth });
  }

  async put<T = any>(url: string, data?: any, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, requiresAuth });
  }

  async patch<T = any>(url: string, data?: any, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, requiresAuth });
  }

  async delete<T = any>(url: string, requiresAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, requiresAuth });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { TokenManager };