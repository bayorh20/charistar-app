import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product } from '../constants/products';

export interface CartItem {
  cartId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  flavor?: string;
  quantity: number;
  addOns: { id: string; name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
  discountCode: string;
  discountAmount: number;
  deliveryFee: number;
  favorites: string[];
  addItem: (item: Omit<CartItem, 'cartId'>) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  applyDiscount: (code: string) => boolean;
  clearDiscount: () => void;
  toggleFavorite: (productId: string) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
  total: () => number;
}

const PROMO_CODES: Record<string, number> = {
  FRESH10: 0.1,
  CAMPUS15: 0.15,
  CHARISTAR: 0.2,
};

function cartId() {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: '',
      discountAmount: 0,
      deliveryFee: 500,
      favorites: [],
      addItem: (item) =>
        set((s) => ({
          items: [...s.items, { ...item, cartId: cartId() }],
        })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.cartId !== id) })),
      updateQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.cartId === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),
      applyDiscount: (code) => {
        const rate = PROMO_CODES[code.toUpperCase()];
        if (!rate) return false;
        const sub = get().subtotal();
        set({
          discountCode: code.toUpperCase(),
          discountAmount: Math.round(sub * rate),
        });
        return true;
      },
      clearDiscount: () => set({ discountCode: '', discountAmount: 0 }),
      toggleFavorite: (productId) =>
        set((s) => ({
          favorites: s.favorites.includes(productId)
            ? s.favorites.filter((id) => id !== productId)
            : [...s.favorites, productId],
        })),
      clearCart: () => set({ items: [], discountCode: '', discountAmount: 0 }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => {
          const addOnTotal = i.addOns.reduce((a, o) => a + o.price, 0);
          return sum + (i.price + addOnTotal) * i.quantity;
        }, 0),
      total: () => {
        const { subtotal, discountAmount, deliveryFee } = get();
        return Math.max(0, subtotal() - discountAmount + deliveryFee);
      },
    }),
    {
      name: 'charistar-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function buildCartFromProduct(
  product: Product,
  size: string,
  flavor: string | undefined,
  quantity: number,
  addOns: { id: string; name: string; price: number }[]
): Omit<CartItem, 'cartId'> {
  return {
    productId: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    size,
    flavor,
    quantity,
    addOns,
  };
}
