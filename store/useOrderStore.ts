import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';

export type OrderStatus =
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered';

export type DeliveryWindowType = 'lunch' | 'dinner' | 'instant';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  deliveryWindow: DeliveryWindowType;
  deliveryTime: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  rider?: { name: string; phone: string; plate: string };
  deliveryOtp: string;
}

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;
  selectedWindow: DeliveryWindowType;
  setSelectedWindow: (w: DeliveryWindowType) => void;
  placeOrder: (params: {
    items: CartItem[];
    total: number;
    address: string;
    deliveryWindow: DeliveryWindowType;
    deliveryTime: string;
    paymentMethod: string;
  }) => string;
  advanceStatus: (orderId: string) => void;
  setActiveOrder: (id: string | null) => void;
}

function orderId() {
  return `CHR-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

function otp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrderId: null,
      selectedWindow: 'lunch',
      setSelectedWindow: (w) => set({ selectedWindow: w }),
      placeOrder: (params) => {
        const id = orderId();
        const order: Order = {
          id,
          ...params,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          deliveryOtp: otp(),
          rider: {
            name: 'Emeka Okafor',
            phone: '+234 801 234 5678',
            plate: 'LAG-482-CH',
          },
        };
        set((s) => ({
          orders: [order, ...s.orders],
          activeOrderId: id,
        }));
        return id;
      },
      advanceStatus: (orderId) => {
        const flow: OrderStatus[] = [
          'confirmed',
          'preparing',
          'out_for_delivery',
          'delivered',
        ];
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== orderId) return o;
            const idx = flow.indexOf(o.status);
            const next = flow[Math.min(idx + 1, flow.length - 1)];
            return { ...o, status: next };
          }),
        }));
      },
      setActiveOrder: (id) => set({ activeOrderId: id }),
    }),
    {
      name: 'charistar-orders',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: 'Order Confirmed',
  preparing: 'Preparing Fresh',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};
