import { ApiClientError } from '@/lib/services/api-client';
import { ApiErrorResponse } from '@/lib/types/api';

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiClientError) {
    return error.error || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Format error for display
export const formatApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof ApiClientError) {
    return {
      message: error.error,
      statusCode: error.statusCode,
      error: error.name,
      details: error.details,
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    error: 'UnknownError',
  };
};

// Check if error is network related
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof ApiClientError) {
    return error.statusCode === 0;
  }
  return false;
};

// Check if error is authentication related
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof ApiClientError) {
    return error.statusCode === 401 || error.statusCode === 403;
  }
  return false;
};

// Retry utility for failed requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry auth errors
      if (isAuthError(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Format date and time
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Debounce utility for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities with error handling
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
    } catch {
      // Ignore storage errors
    }
  },
  
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  },
};

// Query string utilities
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Moroccan format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Generate random ID (for temporary use)
export const generateTempId = (): string => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};