import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface RewardsState {
  points: number;
  referralCode: string;
  cashback: number;
  lastSpinAt: string | null;
  spinPrize: string | null;
  addPoints: (amount: number) => void;
  redeemPoints: (cost: number) => boolean;
  spin: () => string;
}

const PRIZES = [
  '50 bonus points',
  '₦200 off next order',
  'Free granola add-on',
  '100 bonus points',
  '₦500 off next order',
  'Double points today',
];

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      points: 420,
      referralCode: 'CHARI-NG42',
      cashback: 850,
      lastSpinAt: null,
      spinPrize: null,
      addPoints: (amount) => set((s) => ({ points: s.points + amount })),
      redeemPoints: (cost) => {
        const { points } = get();
        if (points < cost) return false;
        set({ points: points - cost });
        return true;
      },
      spin: () => {
        const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
        set({
          spinPrize: prize,
          lastSpinAt: new Date().toISOString(),
          points: get().points + 25,
        });
        return prize;
      },
    }),
    {
      name: 'charistar-rewards',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
