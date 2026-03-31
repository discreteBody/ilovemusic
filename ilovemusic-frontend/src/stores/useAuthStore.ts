import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  tokenExpiry: number | null;  // Timestamp when token expires
  login: (user: User, token?: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  isTokenExpired: () => boolean;  // Check if token is expired
  refreshToken: () => Promise<void>;  // Refresh token
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: localStorage.getItem('auth_token') || null,
  tokenExpiry: localStorage.getItem('auth_token_expiry') ? parseInt(localStorage.getItem('auth_token_expiry')!) : null,
  
  login: (user, token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      // Set expiry to 24 hours from now
      const expiry = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem('auth_token_expiry', expiry.toString());
      set({ user, isAuthenticated: true, token, tokenExpiry: expiry });
    } else {
      set({ user, isAuthenticated: true, token: null, tokenExpiry: null });
    }
  },
  
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token_expiry');
    set({ user: null, isAuthenticated: false, token: null, tokenExpiry: null });
  },
  
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    const expiry = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('auth_token_expiry', expiry.toString());
    set({ token, tokenExpiry: expiry });
  },

  isTokenExpired: () => {
    const state = get();
    if (!state.tokenExpiry) return true;
    return Date.now() > state.tokenExpiry;
  },

  refreshToken: async () => {
    // This will be called by API interceptor when token is about to expire
    // For now, just logout if expired
    if (get().isTokenExpired()) {
      get().logout();
    }
  },
}));


