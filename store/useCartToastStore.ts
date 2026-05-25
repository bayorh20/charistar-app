import { create } from 'zustand';

interface CartToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

export const useCartToastStore = create<CartToastState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));
