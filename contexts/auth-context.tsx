'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/services/auth-service';
import { ApiClientError } from '@/lib/services/api-client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // التحقق من المصادقة عند تحميل الصفحة
  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // تسجيل الدخول
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof ApiClientError
        ? err.error
        : 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تسجيل مستخدم جديد
  // Register function
  const register = useCallback(async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(firstName, lastName, email, password);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof ApiClientError
        ? err.error
        : 'فشل التسجيل. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // تسجيل الخروج
  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      // حتى لو فشل الطلب، نقوم بمسح المستخدم محلياً
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // مسح الأخطاء
  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
