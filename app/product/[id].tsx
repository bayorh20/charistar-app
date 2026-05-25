import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { Button } from '../../components/Button';
import { ADD_ONS, formatPrice, getProduct } from '../../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { buildCartFromProduct, useCartStore } from '../../store/useCartStore';
import { useRewardsStore } from '../../store/useRewardsStore';
import { useWebLayout } from '../../hooks/useWebLayout';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id ?? '');
  const insets = useSafeAreaInsets();
  const { isDesktopWeb } = useWebLayout();
  const addItem = useCartStore((s) => s.addItem);
  const addPoints = useRewardsStore((s) => s.addPoints);
  const [size, setSize] = useState(product?.sizes[0] ?? '350ml');
  const [flavor, setFlavor] = useState(product?.flavors?.[0]);
  const [qty, setQty] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);

  if (!product) {
    return (
      <View style={styles.missing}>
        <Text>Product not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const selectedAddOns = ADD_ONS.filter((a) => addOns.includes(a.id));
  const lineTotal = product.price * qty + selectedAddOns.reduce((s, a) => s + a.price, 0) * qty;

  const addToCart = (buyNow = false) => {
    addItem(
      buildCartFromProduct(product, size, flavor, qty, selectedAddOns)
    );
    addPoints(10 * qty);
    if (buyNow) {
      router.push('/checkout');
    } else {
      router.push('/cart');
    }
  };

  const toggleAddOn = (addonId: string) => {
    setAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((x) => x !== addonId) : [...prev, addonId]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: isDesktopWeb ? 100 : 140 },
          isDesktopWeb && styles.scrollDesktop,
        ]}
      >
        <View style={[styles.topSection, isDesktopWeb && styles.topSectionDesktop]}>
          <View style={[styles.imageWrap, isDesktopWeb && styles.imageWrapDesktop]}>
            <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
            <AnimatedPressable
              style={[styles.back, { top: isDesktopWeb ? 16 : insets.top + 8 }]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.black} />
            </AnimatedPressable>
          </View>

          <View style={[styles.body, isDesktopWeb && styles.bodyDesktop]}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.desc}>{product.description}</Text>
          <Text style={styles.price}>{formatPrice(lineTotal)}</Text>

          <Text style={styles.sectionLabel}>Size</Text>
          <View style={styles.chips}>
            {product.sizes.map((s) => (
              <AnimatedPressable
                key={s}
                style={[styles.chip, size === s && styles.chipActive]}
                onPress={() => setSize(s)}
              >
                <Text style={[styles.chipText, size === s && styles.chipTextActive]}>{s}</Text>
              </AnimatedPressable>
            ))}
          </View>

          {product.flavors && (
            <>
              <Text style={styles.sectionLabel}>Flavor</Text>
              <View style={styles.chips}>
                {product.flavors.map((f) => (
                  <AnimatedPressable
                    key={f}
                    style={[styles.chip, flavor === f && styles.chipActive]}
                    onPress={() => setFlavor(f)}
                  >
                    <Text style={[styles.chipText, flavor === f && styles.chipTextActive]}>{f}</Text>
                  </AnimatedPressable>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionLabel}>Add-ons</Text>
          {ADD_ONS.map((a) => (
            <AnimatedPressable
              key={a.id}
              style={[styles.addonRow, addOns.includes(a.id) && styles.addonActive]}
              onPress={() => toggleAddOn(a.id)}
            >
              <Text style={styles.addonName}>{a.name}</Text>
              <Text style={styles.addonPrice}>+{formatPrice(a.price)}</Text>
            </AnimatedPressable>
          ))}

          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <AnimatedPressable style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
              <Ionicons name="remove" size={18} color={Colors.deepGreen} />
            </AnimatedPressable>
            <Text style={styles.qty}>{qty}</Text>
            <AnimatedPressable style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
              <Ionicons name="add" size={18} color={Colors.deepGreen} />
            </AnimatedPressable>
          </View>

          <Text style={styles.sectionLabel}>Benefits</Text>
          {product.benefits.map((b) => (
            <View key={b} style={styles.benefit}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.deepGreen} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          isDesktopWeb && styles.footerDesktop,
          { paddingBottom: isDesktopWeb ? 24 : insets.bottom + 16 },
        ]}
      >
        <Button title="Add to Cart" variant="outline" onPress={() => addToCart(false)} style={{ flex: 1 }} />
        <Button title="Buy Now" onPress={() => addToCart(true)} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  scrollDesktop: { paddingHorizontal: 24 },
  topSection: {},
  topSectionDesktop: { flexDirection: 'row', gap: 32, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  imageWrap: { height: 320, backgroundColor: Colors.softGreen },
  imageWrapDesktop: { flex: 1, height: 420, borderRadius: Radius.xl, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  back: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  body: { padding: Spacing.lg },
  bodyDesktop: { flex: 1, paddingTop: Spacing.lg },
  name: { ...Typography.hero, fontSize: 24, color: Colors.black },
  desc: { ...Typography.body, color: Colors.gray, marginTop: 6 },
  price: { ...Typography.title, color: Colors.deepGreen, marginTop: Spacing.md },
  sectionLabel: { ...Typography.caption, color: Colors.gray, marginTop: Spacing.lg, marginBottom: Spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softGreenMuted,
  },
  chipActive: { backgroundColor: Colors.deepGreen, borderColor: Colors.deepGreen },
  chipText: { ...Typography.caption, color: Colors.black },
  chipTextActive: { color: Colors.white },
  addonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  addonActive: { borderColor: Colors.deepGreen, backgroundColor: Colors.softGreen },
  addonName: { ...Typography.body, color: Colors.black },
  addonPrice: { ...Typography.caption, color: Colors.deepGreen },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { ...Typography.title, fontSize: 20 },
  benefit: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  benefitText: { ...Typography.body, color: Colors.black },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.cream,
    borderTopWidth: 1,
    borderTopColor: Colors.softGreen,
  },
  footerDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    left: 24,
    right: 24,
  },
});
