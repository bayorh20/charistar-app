import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  name: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  isGuest: boolean;
  hasOnboarded: boolean;
  isAuthenticated: boolean;
  pendingPhone: string;
  setOnboarded: () => void;
  setPendingPhone: (phone: string) => void;
  login: (name: string, phone: string) => void;
  loginAsGuest: () => void;
  verifyOtp: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isGuest: false,
      hasOnboarded: false,
      isAuthenticated: false,
      pendingPhone: '',
      setOnboarded: () => set({ hasOnboarded: true }),
      setPendingPhone: (phone) => set({ pendingPhone: phone }),
      login: (name, phone) =>
        set({
          user: { name, phone },
          isGuest: false,
          isAuthenticated: true,
          pendingPhone: phone,
        }),
      loginAsGuest: () =>
        set({
          user: { name: 'Guest', phone: '' },
          isGuest: true,
          isAuthenticated: true,
        }),
      verifyOtp: () => {
        const { pendingPhone, user } = get();
        if (user) {
          set({ isAuthenticated: true, user: { ...user, phone: pendingPhone } });
        } else {
          set({
            isAuthenticated: true,
            user: { name: 'Charistar Friend', phone: pendingPhone },
          });
        }
      },
      logout: () =>
        set({
          user: null,
          isGuest: false,
          isAuthenticated: false,
          pendingPhone: '',
        }),
    }),
    {
      name: 'charistar-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        isGuest: s.isGuest,
        hasOnboarded: s.hasOnboarded,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
