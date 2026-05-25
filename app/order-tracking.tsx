import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { Button } from '../components/Button';
import { formatPrice } from '../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { OrderStatus, STATUS_LABELS, useOrderStore } from '../store/useOrderStore';

const STEPS: OrderStatus[] = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const orders = useOrderStore((s) => s.orders);
  const advanceStatus = useOrderStore((s) => s.advanceStatus);
  const order = orders.find((o) => o.id === id) ?? orders[0];

  useEffect(() => {
    if (!order || order.status === 'delivered') return;
    const timers = [
      setTimeout(() => advanceStatus(order.id), 4000),
      setTimeout(() => advanceStatus(order.id), 8000),
      setTimeout(() => advanceStatus(order.id), 12000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [order?.id]);

  if (!order) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No active orders</Text>
        <Button title="Order Now" onPress={() => router.replace('/(tabs)')} />
      </View>
    );
  }

  const stepIndex = STEPS.indexOf(order.status);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AnimatedPressable onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="close" size={22} color={Colors.black} />
        </AnimatedPressable>
        <Text style={styles.title}>Track Order</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.orderId}>{order.id}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>

        <View style={styles.timeline}>
          {STEPS.map((step, i) => {
            const done = i <= stepIndex;
            const active = i === stepIndex;
            return (
              <View key={step} style={styles.step}>
                <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                  {done && <Ionicons name="checkmark" size={12} color={Colors.white} />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, done && styles.stepDone]}>
                    {STATUS_LABELS[step]}
                  </Text>
                  {active && step !== 'delivered' && (
                    <Text style={styles.stepSub}>In progress...</Text>
                  )}
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.line, i < stepIndex && styles.lineDone]} />
                )}
              </View>
            );
          })}
        </View>

        {order.rider && order.status !== 'delivered' && (
          <View style={styles.rider}>
            <Text style={styles.riderTitle}>Your Rider</Text>
            <Text style={styles.riderName}>{order.rider.name}</Text>
            <Text style={styles.riderMeta}>{order.rider.phone}</Text>
            <Text style={styles.riderMeta}>Plate: {order.rider.plate}</Text>
            <AnimatedPressable style={styles.callBtn}>
              <Ionicons name="call" size={18} color={Colors.white} />
              <Text style={styles.callText}>Call Rider</Text>
            </AnimatedPressable>
          </View>
        )}

        <View style={styles.otpCard}>
          <Ionicons name="qr-code-outline" size={32} color={Colors.deepGreen} />
          <View style={styles.otpInfo}>
            <Text style={styles.otpTitle}>Delivery OTP</Text>
            <Text style={styles.otpCode}>{order.deliveryOtp}</Text>
            <Text style={styles.otpSub}>Share with rider for safe handoff</Text>
          </View>
        </View>

        {order.status === 'delivered' && (
          <Button
            title="Order Again"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginHorizontal: Spacing.lg, marginTop: Spacing.lg }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: Colors.cream },
  emptyText: { ...Typography.body, color: Colors.gray },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { ...Typography.title, color: Colors.black },
  orderId: {
    ...Typography.caption,
    color: Colors.gray,
    textAlign: 'center',
    letterSpacing: 1,
  },
  total: {
    ...Typography.hero,
    fontSize: 28,
    color: Colors.deepGreen,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  timeline: { marginHorizontal: Spacing.xl, marginBottom: Spacing.xl },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.softGreenMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dotDone: { backgroundColor: Colors.deepGreen },
  dotActive: { backgroundColor: Colors.lemon, borderWidth: 2, borderColor: Colors.deepGreen },
  stepContent: { flex: 1, paddingBottom: 20 },
  stepTitle: { ...Typography.body, color: Colors.grayLight },
  stepDone: { color: Colors.black, fontWeight: '600' },
  stepSub: { ...Typography.micro, color: Colors.deepGreen, marginTop: 2 },
  line: {
    position: 'absolute',
    left: 11,
    top: 24,
    width: 2,
    height: 40,
    backgroundColor: Colors.softGreenMuted,
  },
  lineDone: { backgroundColor: Colors.deepGreen },
  rider: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  riderTitle: { ...Typography.caption, color: Colors.gray },
  riderName: { ...Typography.subtitle, color: Colors.black, marginTop: 4 },
  riderMeta: { ...Typography.micro, color: Colors.gray, marginTop: 2 },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.deepGreen,
    borderRadius: Radius.full,
    paddingVertical: 12,
    marginTop: Spacing.md,
  },
  callText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  otpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.lemon,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  otpInfo: { flex: 1 },
  otpTitle: { ...Typography.caption, color: Colors.deepGreen },
  otpCode: { fontSize: 36, fontWeight: '700', color: Colors.deepGreen, letterSpacing: 8 },
  otpSub: { ...Typography.micro, color: Colors.gray },
});
