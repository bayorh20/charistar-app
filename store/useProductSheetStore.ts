import { create } from 'zustand';
import { Product } from '../constants/products';

interface ProductSheetState {
  product: Product | null;
  isOpen: boolean;
  open: (product: Product) => void;
  close: () => void;
}

export const useProductSheetStore = create<ProductSheetState>((set) => ({
  product: null,
  isOpen: false,
  open: (product) => set({ product, isOpen: true }),
  close: () => set({ isOpen: false, product: null }),
}));
