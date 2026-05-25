import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import {
  TAB_BAR_CART_LIFT,
  TAB_BAR_CART_SIZE,
  TAB_BAR_HEIGHT,
} from '../constants/layout';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { AnimatedPressable } from './AnimatedPressable';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home-outline' as const, active: 'home' as const },
  { name: 'explore', label: 'Explore', icon: 'compass-outline' as const, active: 'compass' as const },
  { name: 'cart', label: 'Cart', icon: 'bag-outline' as const, active: 'bag' as const, center: true },
  { name: 'rewards', label: 'Rewards', icon: 'star-outline' as const, active: 'star' as const },
  { name: 'profile', label: 'Profile', icon: 'person-outline' as const, active: 'person' as const },
];

interface TabRoute {
  key: string;
  name: string;
}

interface Props {
  state: { index: number; routes: TabRoute[] };
  navigation: { navigate: (name: string) => void };
}

export function FloatingTabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const count = useCartStore((s) => s.itemCount());
  const badgeScale = useSharedValue(1);
  const cartScale = useSharedValue(1);

  const activeRoute = state.routes[state.index]?.name;
  const cartFocused = activeRoute === 'cart';

  useEffect(() => {
    if (count > 0) {
      badgeScale.value = withSequence(
        withTiming(1.2, { duration: 140 }),
        withSpring(1, { damping: 12, stiffness: 200 })
      );
      cartScale.value = withSequence(
        withTiming(1.06, { duration: 120 }),
        withSpring(1, { damping: 14, stiffness: 220 })
      );
    }
  }, [count]);

  const badgeAnim = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  const cartAnim = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}
      pointerEvents="box-none"
    >
      {/* Elevated cart button — sits above the pill, centered */}
      <View style={styles.fabLayer} pointerEvents="box-none">
        <Animated.View style={[styles.fabOuter, cartAnim]}>
          <AnimatedPressable
            style={[styles.fab, cartFocused && styles.fabFocused]}
            onPress={() => navigation.navigate('cart')}
            haptic
          >
            <Ionicons
              name={cartFocused ? 'bag' : 'bag-outline'}
              size={26}
              color={Colors.white}
            />
            {count > 0 && (
              <Animated.View style={[styles.badge, badgeAnim]}>
                <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
              </Animated.View>
            )}
          </AnimatedPressable>
        </Animated.View>
      </View>

      {/* Pill navigation bar */}
      <View style={styles.bar}>
        {state.routes.map((route: TabRoute, index: number) => {
          const tab = TABS.find((t) => t.name === route.name) ?? TABS[0];
          const focused = state.index === index;

          if (tab.center) {
            return <View key={route.key} style={styles.centerSlot} />;
          }

          return (
            <AnimatedPressable
              key={route.key}
              style={styles.tab}
              onPress={() => navigation.navigate(route.name)}
            >
              <Ionicons
                name={focused ? tab.active : tab.icon}
                size={22}
                color={focused ? Colors.deepGreen : Colors.grayLight}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}

const FAB_TOP = -(TAB_BAR_CART_LIFT + TAB_BAR_CART_SIZE / 2 - TAB_BAR_HEIGHT / 2);

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: 0,
    zIndex: 200,
    elevation: 200,
    overflow: 'visible',
  },
  fabLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: FAB_TOP,
    alignItems: 'center',
    zIndex: 201,
    overflow: 'visible',
  },
  fabOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: TAB_BAR_CART_SIZE,
    height: TAB_BAR_CART_SIZE,
    borderRadius: TAB_BAR_CART_SIZE / 2,
    backgroundColor: Colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.white,
    ...Shadow.soft,
  },
  fabFocused: {
    backgroundColor: Colors.deepGreenDark,
    borderColor: Colors.lemon,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.deepGreen,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingHorizontal: 6,
    overflow: 'visible',
    ...Shadow.soft,
  },
  centerSlot: {
    flex: 1,
    minWidth: 76,
    maxWidth: 88,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 8,
  },
  label: {
    ...Typography.micro,
    color: Colors.grayLight,
    fontSize: 10,
  },
  labelActive: {
    color: Colors.deepGreen,
    fontWeight: '600',
  },
});
