import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatPrice } from '../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useWebLayout } from '../hooks/useWebLayout';
import { buildCartFromProduct, useCartStore } from '../store/useCartStore';
import { useProductSheetStore } from '../store/useProductSheetStore';
import { useRewardsStore } from '../store/useRewardsStore';
import { AnimatedPressable } from './AnimatedPressable';
import { Button } from './Button';

const SPRING = { damping: 22, stiffness: 280 };

export function ProductBottomSheet() {
  const product = useProductSheetStore((s) => s.product);
  const close = useProductSheetStore((s) => s.close);
  const { height: screenH, width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isDesktopWeb } = useWebLayout();
  const addItem = useCartStore((s) => s.addItem);
  const addPoints = useRewardsStore((s) => s.addPoints);

  const [size, setSize] = useState('');
  const [flavor, setFlavor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [visible, setVisible] = useState(false);

  const sheetHeight = Math.min(screenH * 0.88, isDesktopWeb ? 640 : 720);
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(sheetHeight);
  const dragY = useSharedValue(0);

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0] ?? '');
      setFlavor(product.flavors?.[0]);
      setQty(1);
      setVisible(true);
      dragY.value = 0;
      translateY.value = sheetHeight;
      backdropOpacity.value = 0;
      requestAnimationFrame(() => {
        backdropOpacity.value = withTiming(1, { duration: 280 });
        translateY.value = withSpring(0, SPRING);
      });
    } else if (visible) {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(sheetHeight, { duration: 260 });
      const t = setTimeout(() => setVisible(false), 280);
      return () => clearTimeout(t);
    }
  }, [product?.id]);

  const dismiss = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(sheetHeight, { duration: 260 });
    dragY.value = withSpring(0);
    setTimeout(() => {
      setVisible(false);
      close();
    }, 270);
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) dragY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 600) {
        runOnJS(dismiss)();
      } else {
        dragY.value = withSpring(0, SPRING);
      }
    });

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.45,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + dragY.value }],
  }));

  const handleAdd = () => {
    if (!product) return;
    addItem(buildCartFromProduct(product, size, flavor, qty, []));
    addPoints(10 * qty);
    dismiss();
  };

  if (!visible || !product) return null;

  const lineTotal = product.price * qty;

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={dismiss}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </Pressable>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.sheet,
              sheetStyle,
              {
                height: sheetHeight,
                maxWidth: isDesktopWeb ? 480 : screenW,
                alignSelf: 'center',
                width: isDesktopWeb ? 480 : '100%',
                paddingBottom: insets.bottom + Spacing.md,
              },
            ]}
          >
            <View style={styles.handleWrap}>
              <View style={styles.handle} />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scroll}
            >
              <View style={styles.hero}>
                <Image source={{ uri: product.image }} style={styles.heroImage} contentFit="cover" />
                {product.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{product.badge}</Text>
                  </View>
                )}
                <AnimatedPressable style={styles.closeBtn} onPress={dismiss} haptic={false}>
                  <Ionicons name="close" size={20} color={Colors.black} />
                </AnimatedPressable>
              </View>

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
                        <Text style={[styles.chipText, flavor === f && styles.chipTextActive]}>
                          {f}
                        </Text>
                      </AnimatedPressable>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.sectionLabel}>Quantity</Text>
              <View style={styles.qtyRow}>
                <AnimatedPressable
                  style={styles.qtyBtn}
                  onPress={() => setQty(Math.max(1, qty - 1))}
                >
                  <Ionicons name="remove" size={18} color={Colors.deepGreen} />
                </AnimatedPressable>
                <Text style={styles.qty}>{qty}</Text>
                <AnimatedPressable style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                  <Ionicons name="add" size={18} color={Colors.deepGreen} />
                </AnimatedPressable>
              </View>

              <Text style={styles.sectionLabel}>Why you'll love it</Text>
              {product.benefits.map((b) => (
                <View key={b} style={styles.benefit}>
                  <Ionicons name="checkmark-circle" size={15} color={Colors.deepGreen} />
                  <Text style={styles.benefitText}>{b}</Text>
                </View>
              ))}

              <AnimatedPressable
                style={styles.viewFull}
                onPress={() => {
                  dismiss();
                  setTimeout(() => router.push(`/product/${product.id}`), 300);
                }}
              >
                <Text style={styles.viewFullText}>View full details</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.deepGreen} />
              </AnimatedPressable>
            </ScrollView>

            <View style={styles.footer}>
              <Button title="Add to Cart" onPress={handleAdd} />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
  },
  sheet: {
    backgroundColor: Colors.cream,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.soft,
  },
  handleWrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.softGreenMuted,
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  hero: {
    height: 180,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    backgroundColor: Colors.softGreen,
  },
  heroImage: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: Colors.lemon,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  badgeText: { ...Typography.micro, color: Colors.deepGreen, fontWeight: '700' },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  name: { ...Typography.title, fontSize: 22, color: Colors.black },
  desc: { ...Typography.body, color: Colors.gray, marginTop: 6, lineHeight: 21 },
  price: { ...Typography.title, color: Colors.deepGreen, marginTop: Spacing.md },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.gray,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softGreenMuted,
  },
  chipActive: { backgroundColor: Colors.deepGreen, borderColor: Colors.deepGreen },
  chipText: { ...Typography.caption, color: Colors.black },
  chipTextActive: { color: Colors.white },
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
  benefitText: { ...Typography.body, color: Colors.black, flex: 1 },
  viewFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  viewFullText: { ...Typography.caption, color: Colors.deepGreen, fontWeight: '600' },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.softGreen,
    backgroundColor: Colors.cream,
  },
});
