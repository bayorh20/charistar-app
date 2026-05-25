import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { Button } from '../../components/Button';
import { formatPrice } from '../../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { useCartStore } from '../../store/useCartStore';
import { useWebLayout } from '../../hooks/useWebLayout';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const applyDiscount = useCartStore((s) => s.applyDiscount);
  const discountCode = useCartStore((s) => s.discountCode);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const deliveryFee = useCartStore((s) => s.deliveryFee);
  const subtotal = useCartStore((s) => s.subtotal);
  const total = useCartStore((s) => s.total);
  const { contentPaddingBottom, isDesktopWeb } = useWebLayout();
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');

  const applyCode = () => {
    const ok = applyDiscount(code);
    setCodeMsg(ok ? 'Discount applied!' : 'Invalid code. Try FRESH10');
  };

  if (!items.length) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top + 80 }]}>
        <Ionicons name="bag-outline" size={64} color={Colors.softGreenMuted} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>What are you craving today?</Text>
        <Button title="Browse Menu" onPress={() => router.push('/(tabs)')} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Your Cart</Text>
      <ScrollView
        contentContainerStyle={[
          { paddingBottom: contentPaddingBottom + 80 },
          isDesktopWeb && styles.desktopContent,
        ]}
      >
        {items.map((item) => (
          <View key={item.cartId} style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.thumb} contentFit="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.size}
                {item.flavor ? ` · ${item.flavor}` : ''}
              </Text>
              <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
              <View style={styles.qtyRow}>
                <AnimatedPressable
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.cartId, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color={Colors.deepGreen} />
                </AnimatedPressable>
                <Text style={styles.qty}>{item.quantity}</Text>
                <AnimatedPressable
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.cartId, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color={Colors.deepGreen} />
                </AnimatedPressable>
              </View>
            </View>
            <AnimatedPressable onPress={() => removeItem(item.cartId)}>
              <Ionicons name="trash-outline" size={20} color={Colors.grayLight} />
            </AnimatedPressable>
          </View>
        ))}

        <View style={styles.promo}>
          <TextInput
            style={styles.promoInput}
            placeholder="Discount code"
            placeholderTextColor={Colors.grayLight}
            value={code}
            onChangeText={setCode}
          />
          <AnimatedPressable style={styles.promoBtn} onPress={applyCode}>
            <Text style={styles.promoBtnText}>Apply</Text>
          </AnimatedPressable>
        </View>
        {codeMsg ? <Text style={styles.codeMsg}>{codeMsg}</Text> : null}
        {discountCode ? (
          <Text style={styles.applied}>Code {discountCode} applied</Text>
        ) : null}

        <View style={styles.summary}>
          <Row label="Subtotal" value={formatPrice(subtotal())} />
          <Row label="Delivery" value={formatPrice(deliveryFee)} />
          {discountAmount > 0 && (
            <Row label="Discount" value={`-${formatPrice(discountAmount)}`} accent />
          )}
          <View style={styles.divider} />
          <Row label="Total" value={formatPrice(total())} bold />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          isDesktopWeb && styles.footerDesktop,
          { paddingBottom: isDesktopWeb ? 24 : insets.bottom + 100 },
        ]}
      >
        <Button title="Checkout" onPress={() => router.push('/checkout')} />
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold, accent && { color: Colors.success }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  title: { ...Typography.hero, fontSize: 24, color: Colors.black, padding: Spacing.lg },
  empty: { flex: 1, backgroundColor: Colors.cream, alignItems: 'center', paddingHorizontal: Spacing.xl },
  emptyTitle: { ...Typography.title, color: Colors.black, marginTop: Spacing.lg },
  emptySub: { ...Typography.body, color: Colors.gray, marginTop: 4 },
  item: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 12,
    ...Shadow.card,
  },
  thumb: { width: 72, height: 72, borderRadius: Radius.md },
  itemInfo: { flex: 1 },
  itemName: { ...Typography.subtitle, fontSize: 14, color: Colors.black },
  itemMeta: { ...Typography.micro, color: Colors.gray, marginTop: 2 },
  itemPrice: { ...Typography.caption, color: Colors.deepGreen, marginTop: 4, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { ...Typography.body, fontWeight: '600', minWidth: 20, textAlign: 'center' },
  promo: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    gap: 8,
    marginTop: Spacing.sm,
  },
  promoInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    ...Typography.body,
    color: Colors.black,
  },
  promoBtn: {
    backgroundColor: Colors.deepGreen,
    borderRadius: Radius.md,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  promoBtnText: { ...Typography.caption, color: Colors.white, fontWeight: '600' },
  codeMsg: { ...Typography.micro, color: Colors.deepGreen, marginLeft: Spacing.lg, marginTop: 4 },
  applied: { ...Typography.micro, color: Colors.success, marginLeft: Spacing.lg, marginTop: 4 },
  summary: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.card,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { ...Typography.body, color: Colors.gray },
  rowValue: { ...Typography.body, color: Colors.black },
  bold: { fontWeight: '600', fontSize: 16, color: Colors.black },
  divider: { height: 1, backgroundColor: Colors.softGreen, marginVertical: 8 },
  footer: { paddingHorizontal: Spacing.lg },
  footerDesktop: {
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: Colors.softGreen,
    paddingTop: Spacing.md,
    backgroundColor: Colors.cream,
  },
  desktopContent: { maxWidth: 900, alignSelf: 'center', width: '100%' },
});
