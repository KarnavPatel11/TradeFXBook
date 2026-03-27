import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  totalPnl: number;
  winRate: number;
  totalTrades: number;
  theme: string;
  currency: string;
  timezone: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true, isLoading: false });
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error', error);
        } finally {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          window.location.href = '/login';
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const token = localStorage.getItem('token');
          
          if (!token) {
            // Try silent refresh
            try {
              const res = await api.post('/auth/refresh');
              const newToken = res.data.data.accessToken;
              localStorage.setItem('token', newToken);
              
              const userRes = await api.get('/auth/me');
              set({ user: userRes.data.data.user, token: newToken, isAuthenticated: true, isLoading: false });
              return;
            } catch {
              set({ user: null, token: null, isAuthenticated: false, isLoading: false });
              return;
            }
          }

          const res = await api.get('/auth/me');
          set({ user: res.data.data.user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
