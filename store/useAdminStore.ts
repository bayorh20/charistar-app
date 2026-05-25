import { create } from 'zustand';
import { PRODUCTS, Product } from '../constants/products';
import { Order, useOrderStore } from './useOrderStore';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  deliveries: number;
}

export interface PromoCode {
  code: string;
  discount: number;
  active: boolean;
  uses: number;
}

interface AdminState {
  products: Product[];
  inventory: Record<string, number>;
  riders: Rider[];
  promos: PromoCode[];
  lunchWindowOpen: boolean;
  dinnerWindowOpen: boolean;
  pushMessage: string;
  updateInventory: (productId: string, qty: number) => void;
  toggleProduct: (productId: string) => void;
  addPromo: (code: string, discount: number) => void;
  togglePromo: (code: string) => void;
  setWindow: (window: 'lunch' | 'dinner', open: boolean) => void;
  setPushMessage: (msg: string) => void;
  getRevenue: () => number;
  getLiveOrders: () => Order[];
}

export const useAdminStore = create<AdminState>((set, get) => ({
  products: [...PRODUCTS],
  inventory: Object.fromEntries(PRODUCTS.map((p) => [p.id, 50 + Math.floor(Math.random() * 50)])),
  riders: [
    { id: 'r1', name: 'Emeka Okafor', phone: '+234 801 234 5678', status: 'busy', deliveries: 12 },
    { id: 'r2', name: 'Ada Bello', phone: '+234 802 345 6789', status: 'available', deliveries: 8 },
    { id: 'r3', name: 'Tunde Adeyemi', phone: '+234 803 456 7890', status: 'available', deliveries: 15 },
  ],
  promos: [
    { code: 'FRESH10', discount: 10, active: true, uses: 124 },
    { code: 'CAMPUS15', discount: 15, active: true, uses: 89 },
    { code: 'CHARISTAR', discount: 20, active: true, uses: 42 },
  ],
  lunchWindowOpen: true,
  dinnerWindowOpen: true,
  pushMessage: '',
  updateInventory: (productId, qty) =>
    set((s) => ({
      inventory: { ...s.inventory, [productId]: Math.max(0, qty) },
    })),
  toggleProduct: (productId) =>
    set((s) => ({
      products: s.products.map((p) =>
        p.id === productId ? { ...p, badge: p.badge === 'Hidden' ? undefined : 'Hidden' } : p
      ),
    })),
  addPromo: (code, discount) =>
    set((s) => ({
      promos: [...s.promos, { code: code.toUpperCase(), discount, active: true, uses: 0 }],
    })),
  togglePromo: (code) =>
    set((s) => ({
      promos: s.promos.map((p) =>
        p.code === code ? { ...p, active: !p.active } : p
      ),
    })),
  setWindow: (window, open) =>
    set(window === 'lunch' ? { lunchWindowOpen: open } : { dinnerWindowOpen: open }),
  setPushMessage: (msg) => set({ pushMessage: msg }),
  getRevenue: () => {
    const orders = useOrderStore.getState().orders;
    return orders.reduce((sum, o) => sum + o.total, 0);
  },
  getLiveOrders: () => {
    return useOrderStore
      .getState()
      .orders.filter((o) => o.status !== 'delivered');
  },
}));
