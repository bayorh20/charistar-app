import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ADD_ONS, formatPrice } from '../constants/products';
import { APP_FRAME } from '../constants/layout';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useWebLayout } from '../hooks/useWebLayout';
import { buildCartFromProduct, useCartStore } from '../store/useCartStore';
import { useCartToastStore } from '../store/useCartToastStore';
import { useProductSheetStore } from '../store/useProductSheetStore';
import { useRewardsStore } from '../store/useRewardsStore';
import { AnimatedPressable } from './AnimatedPressable';
import { Button } from './Button';

const SPRING = { damping: 22, stiffness: 280 };

export function ProductBottomSheet() {
  const product = useProductSheetStore((s) => s.product);
  const isOpen = useProductSheetStore((s) => s.isOpen);
  const closeStore = useProductSheetStore((s) => s.close);
  const { height: screenH, width: screenW } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isDesktopWeb, inPhoneFrame } = useWebLayout();
  const addItem = useCartStore((s) => s.addItem);
  const addPoints = useRewardsStore((s) => s.addPoints);
  const showToast = useCartToastStore((s) => s.show);

  const [size, setSize] = useState('');
  const [flavor, setFlavor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const sheetMaxWidth = inPhoneFrame
    ? APP_FRAME.maxWidth
    : isDesktopWeb
      ? 480
      : screenW;
  const sheetHeight = Math.min(screenH * 0.9, isDesktopWeb ? 680 : 760);
  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(sheetHeight);
  const dragY = useSharedValue(0);

  const dismiss = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(sheetHeight, { duration: 260 });
    dragY.value = withSpring(0);
    setTimeout(() => {
      setMounted(false);
      closeStore();
    }, 280);
  }, [sheetHeight, closeStore]);

  useEffect(() => {
    if (isOpen && product) {
      setSize(product.sizes[0] ?? '');
      setFlavor(product.flavors?.[0]);
      setQty(1);
      setAddOnIds([]);
      setMounted(true);
      dragY.value = 0;
      translateY.value = sheetHeight;
      backdropOpacity.value = 0;
      requestAnimationFrame(() => {
        backdropOpacity.value = withTiming(1, { duration: 280 });
        translateY.value = withSpring(0, SPRING);
      });
    }
  }, [isOpen, product?.id, sheetHeight]);

  const pan = Gesture.Pan()
    .activeOffsetY(8)
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
    opacity: backdropOpacity.value * 0.5,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value + dragY.value }],
  }));

  const toggleAddOn = (id: string) => {
    setAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (!product) return;
    const selectedAddOns = ADD_ONS.filter((a) => addOnIds.includes(a.id));
    addItem(buildCartFromProduct(product, size, flavor, qty, selectedAddOns));
    addPoints(10 * qty);
    showToast(`${product.name} added to cart`);
    dismiss();
  };

  if (!mounted || !product) return null;

  const selectedAddOns = ADD_ONS.filter((a) => addOnIds.includes(a.id));
  const addOnTotal = selectedAddOns.reduce((s, a) => s + a.price, 0) * qty;
  const lineTotal = product.price * qty + addOnTotal;

  const sheet = (
    <View style={[styles.overlay, Platform.OS === 'web' && styles.overlayWeb]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Close">
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </Pressable>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            {
              height: sheetHeight,
              width: sheetMaxWidth,
              maxWidth: '100%',
            },
          ]}
        >
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
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
            {product.isInstant && (
              <View style={styles.instantTag}>
                <Ionicons name="flash" size={12} color={Colors.deepGreen} />
                <Text style={styles.instantText}>Instant delivery available</Text>
              </View>
            )}

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

            {product.flavors && product.flavors.length > 0 && (
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

            <Text style={styles.sectionLabel}>Add-ons</Text>
            {ADD_ONS.map((addon) => {
              const selected = addOnIds.includes(addon.id);
              return (
                <AnimatedPressable
                  key={addon.id}
                  style={[styles.addonRow, selected && styles.addonActive]}
                  onPress={() => toggleAddOn(addon.id)}
                >
                  <Ionicons
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={selected ? Colors.deepGreen : Colors.grayLight}
                  />
                  <Text style={styles.addonName}>{addon.name}</Text>
                  <Text style={styles.addonPrice}>+{formatPrice(addon.price)}</Text>
                </AnimatedPressable>
              );
            })}

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
                setTimeout(() => router.push(`/product/${product.id}`), 320);
              }}
            >
              <Text style={styles.viewFullText}>View full product page</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.deepGreen} />
            </AnimatedPressable>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <Button title="Add to Cart" onPress={handleAdd} />
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismiss}
      presentationStyle="overFullScreen"
    >
      {Platform.OS === 'web' ? (
        sheet
      ) : (
        <GestureHandlerRootView style={styles.modalRoot}>{sheet}</GestureHandlerRootView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlayWeb: {
    position: 'fixed' as unknown as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
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
    flexDirection: 'column',
    alignSelf: 'center',
    ...Shadow.soft,
  },
  scrollView: { flex: 1, minHeight: 0 },
  handleWrap: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.softGreenMuted,
  },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  hero: {
    width: '100%',
    aspectRatio: 16 / 9,
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
  instantTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: Colors.softGreen,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  instantText: { ...Typography.micro, color: Colors.deepGreen, fontWeight: '600' },
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
  addonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  addonActive: { borderColor: Colors.deepGreen, backgroundColor: Colors.softGreen },
  addonName: { flex: 1, ...Typography.body, color: Colors.black },
  addonPrice: { ...Typography.caption, color: Colors.deepGreen, fontWeight: '600' },
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
