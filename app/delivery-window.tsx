import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { Button } from '../components/Button';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { DeliveryWindowType, useOrderStore } from '../store/useOrderStore';
import { useAdminStore } from '../store/useAdminStore';

function useCountdown(targetHour: number, targetMin: number) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(targetHour, targetMin, 0, 0);
      if (target < now) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetHour, targetMin]);

  return remaining;
}

export default function DeliveryWindowScreen() {
  const insets = useSafeAreaInsets();
  const selected = useOrderStore((s) => s.selectedWindow);
  const setSelected = useOrderStore((s) => s.setSelectedWindow);
  const lunchOpen = useAdminStore((s) => s.lunchWindowOpen);
  const dinnerOpen = useAdminStore((s) => s.dinnerWindowOpen);
  const countdown = useCountdown(10, 30);

  const windows: {
    id: DeliveryWindowType;
    title: string;
    time: string;
    desc: string;
    icon: string;
    open: boolean;
  }[] = [
    {
      id: 'lunch',
      title: 'Lunch Delivery',
      time: '11:30 AM – 1:30 PM',
      desc: 'Preorder by 10:30 AM for fresh lunch arrival.',
      icon: 'sunny-outline',
      open: lunchOpen,
    },
    {
      id: 'dinner',
      title: 'Dinner Delivery',
      time: '5:30 PM – 8:00 PM',
      desc: 'Perfect for evening cravings and study sessions.',
      icon: 'moon-outline',
      open: dinnerOpen,
    },
    {
      id: 'instant',
      title: 'Instant Delivery',
      time: '30–45 minutes',
      desc: 'Granola, snacks & select items only.',
      icon: 'flash-outline',
      open: true,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AnimatedPressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </AnimatedPressable>
        <Text style={styles.title}>Delivery Windows</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.info}>
          <Text style={styles.infoText}>
            We deliver fresh based on preorder windows so your yogurt arrives perfect.
          </Text>
        </View>

        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Lunch preorder closes in</Text>
          <Text style={styles.timer}>{countdown}</Text>
        </View>

        {windows.map((w) => (
          <AnimatedPressable
            key={w.id}
            style={[
              styles.windowCard,
              selected === w.id && styles.windowActive,
              !w.open && styles.windowClosed,
            ]}
            onPress={() => w.open && setSelected(w.id)}
            disabled={!w.open}
          >
            <View style={styles.windowIcon}>
              <Ionicons name={w.icon as 'sunny-outline'} size={24} color={Colors.deepGreen} />
            </View>
            <View style={styles.windowInfo}>
              <Text style={styles.windowTitle}>{w.title}</Text>
              <Text style={styles.windowTime}>{w.time}</Text>
              <Text style={styles.windowDesc}>{w.desc}</Text>
              {!w.open && <Text style={styles.closed}>Window closed</Text>}
            </View>
            {selected === w.id && (
              <Ionicons name="checkmark-circle" size={22} color={Colors.deepGreen} />
            )}
          </AnimatedPressable>
        ))}

        <Button
          title="Confirm Window"
          onPress={() => router.back()}
          style={{ marginHorizontal: Spacing.lg, marginTop: Spacing.lg }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { ...Typography.title, color: Colors.black },
  info: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.softGreen,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  infoText: { ...Typography.body, color: Colors.deepGreen, lineHeight: 22 },
  timerCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.deepGreen,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.soft,
  },
  timerLabel: { ...Typography.caption, color: Colors.softGreen },
  timer: { fontSize: 32, fontWeight: '700', color: Colors.lemon, marginTop: 8 },
  windowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.card,
  },
  windowActive: { borderColor: Colors.deepGreen, backgroundColor: Colors.softGreen },
  windowClosed: { opacity: 0.5 },
  windowIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  windowInfo: { flex: 1 },
  windowTitle: { ...Typography.subtitle, color: Colors.black },
  windowTime: { ...Typography.caption, color: Colors.deepGreen, marginTop: 2 },
  windowDesc: { ...Typography.micro, color: Colors.gray, marginTop: 4 },
  closed: { ...Typography.micro, color: Colors.error, marginTop: 4 },
});
