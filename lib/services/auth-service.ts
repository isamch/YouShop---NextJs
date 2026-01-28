import { AuthResponse, User } from '@/lib/types';
import { MOCK_USER } from '@/lib/mock-data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(800);
    // Mock validation
    if (email && password.length >= 6) {
      return {
        user: MOCK_USER,
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
    throw new Error('Invalid credentials');
  },

  // Register
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    await delay(800);
    if (name && email && password.length >= 6) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        email,
        name,
        addresses: [],
      };
      return {
        user: newUser,
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
    throw new Error('Invalid registration data');
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    // Check if token exists in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? MOCK_USER : null;
    }
    return null;
  },

  // Logout
  async logout(): Promise<void> {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // Update user profile
  async updateProfile(user: Partial<User>): Promise<User> {
    await delay(500);
    return { ...MOCK_USER, ...user };
  },
};
