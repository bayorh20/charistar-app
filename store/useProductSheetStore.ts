import { create } from 'zustand';
import { Product } from '../constants/products';

interface ProductSheetState {
  product: Product | null;
  open: (product: Product) => void;
  close: () => void;
}

export const useProductSheetStore = create<ProductSheetState>((set) => ({
  product: null,
  open: (product) => set({ product }),
  close: () => set({ product: null }),
}));
