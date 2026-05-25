import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { Button } from '../components/Button';
import { formatPrice } from '../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useRewardsStore } from '../store/useRewardsStore';

const PAYMENTS = ['Paystack', 'Card', 'Bank Transfer', 'Wallet'];

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const selectedWindow = useOrderStore((s) => s.selectedWindow);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const addPoints = useRewardsStore((s) => s.addPoints);
  const [payment, setPayment] = useState('Paystack');
  const [loading, setLoading] = useState(false);

  const windowLabel =
    selectedWindow === 'lunch'
      ? 'Lunch · 11:30 AM – 1:30 PM'
      : selectedWindow === 'dinner'
        ? 'Dinner · 5:30 PM – 8:00 PM'
        : 'Instant · 30–45 mins';

  const place = () => {
    setLoading(true);
    setTimeout(() => {
      const orderId = placeOrder({
        items: [...items],
        total: total(),
        address: 'University of Lagos, Akoka, Block B',
        deliveryWindow: selectedWindow,
        deliveryTime: windowLabel,
        paymentMethod: payment,
      });
      clearCart();
      addPoints(Math.floor(total() / 100));
      setLoading(false);
      router.replace({ pathname: '/order-tracking', params: { id: orderId } });
    }, 1500);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AnimatedPressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </AnimatedPressable>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <Text style={styles.cardValue}>University of Lagos, Akoka</Text>
          <Text style={styles.cardSub}>Block B, Room 204</Text>
        </View>

        <AnimatedPressable style={styles.card} onPress={() => router.push('/delivery-window')}>
          <Text style={styles.cardTitle}>Delivery Window</Text>
          <Text style={styles.cardValue}>{windowLabel}</Text>
          <Text style={styles.link}>Change window</Text>
        </AnimatedPressable>

        <Text style={styles.section}>Payment Method</Text>
        {PAYMENTS.map((p) => (
          <AnimatedPressable
            key={p}
            style={[styles.payRow, payment === p && styles.payActive]}
            onPress={() => setPayment(p)}
          >
            <Ionicons
              name={p === 'Paystack' ? 'card' : 'wallet-outline'}
              size={20}
              color={Colors.deepGreen}
            />
            <Text style={styles.payLabel}>{p}</Text>
            {payment === p && <Ionicons name="checkmark-circle" size={20} color={Colors.deepGreen} />}
          </AnimatedPressable>
        ))}

        <View style={styles.summary}>
          <Text style={styles.section}>Order Summary</Text>
          {items.map((i) => (
            <View key={i.cartId} style={styles.line}>
              <Text style={styles.lineName}>
                {i.name} × {i.quantity}
              </Text>
              <Text style={styles.linePrice}>{formatPrice(i.price * i.quantity)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{formatPrice(total())}</Text>
          </View>
        </View>

        {payment === 'Paystack' && (
          <View style={styles.paystack}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.deepGreen} />
            <Text style={styles.paystackText}>Secure payment via Paystack</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button title="Place Order" onPress={place} loading={loading} />
      </View>
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
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardTitle: { ...Typography.caption, color: Colors.gray },
  cardValue: { ...Typography.subtitle, color: Colors.black, marginTop: 4 },
  cardSub: { ...Typography.micro, color: Colors.gray, marginTop: 2 },
  link: { ...Typography.caption, color: Colors.deepGreen, marginTop: 8 },
  section: {
    ...Typography.caption,
    color: Colors.gray,
    marginLeft: Spacing.lg,
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  payActive: { borderColor: Colors.deepGreen, backgroundColor: Colors.softGreen },
  payLabel: { flex: 1, ...Typography.body, color: Colors.black },
  summary: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  lineName: { ...Typography.body, color: Colors.black, flex: 1 },
  linePrice: { ...Typography.caption, color: Colors.deepGreen },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.softGreen,
  },
  totalLabel: { ...Typography.subtitle, color: Colors.black },
  totalVal: { ...Typography.subtitle, color: Colors.deepGreen },
  paystack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  paystackText: { ...Typography.caption, color: Colors.gray },
  footer: { paddingHorizontal: Spacing.lg },
});
