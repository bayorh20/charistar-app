import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect } from 'react';
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
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (count > 0) {
      pulse.value = withSequence(
        withTiming(1.15, { duration: 120 }),
        withTiming(1, { duration: 120 })
      );
    }
  }, [count]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: TabRoute, index: number) => {
          const tab = TABS.find((t) => t.name === route.name) ?? TABS[0];
          const focused = state.index === index;

          if (tab.center) {
            return (
              <AnimatedPressable
                key={route.key}
                style={styles.centerBtn}
                onPress={() => navigation.navigate(route.name)}
              >
                <Ionicons name={focused ? 'bag' : 'bag-outline'} size={24} color={Colors.white} />
                {count > 0 && (
                  <Animated.View style={[styles.badge, badgeStyle]}>
                    <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
                  </Animated.View>
                )}
              </AnimatedPressable>
            );
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.lg,
    zIndex: 100,
    elevation: 100,
    pointerEvents: 'box-none' as const,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    paddingVertical: 10,
    paddingHorizontal: 8,
    ...Shadow.soft,
  },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  label: { ...Typography.micro, color: Colors.grayLight },
  labelActive: { color: Colors.deepGreen },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    marginHorizontal: 4,
    ...Shadow.soft,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, fontWeight: '700', color: Colors.deepGreen },
});
