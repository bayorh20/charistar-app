import { Ionicons } from '@expo/vector-icons';
import { Href, router, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { WEB } from '../constants/layout';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { AnimatedPressable } from './AnimatedPressable';

const NAV = [
  { path: '/', label: 'Home', icon: 'home-outline' as const, active: 'home' as const },
  { path: '/explore', label: 'Explore', icon: 'compass-outline' as const, active: 'compass' as const },
  { path: '/cart', label: 'Cart', icon: 'bag-outline' as const, active: 'bag' as const },
  { path: '/rewards', label: 'Rewards', icon: 'star-outline' as const, active: 'star' as const },
  { path: '/profile', label: 'Profile', icon: 'person-outline' as const, active: 'person' as const },
];

export function WebSidebar() {
  const pathname = usePathname();
  const count = useCartStore((s) => s.itemCount());

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '/index';
    return pathname.startsWith(path);
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoChar}>C</Text>
        </View>
        <View>
          <Text style={styles.brandName}>Charistar</Text>
          <Text style={styles.brandTag}>Fresh & healthy</Text>
        </View>
      </View>

      <View style={styles.nav}>
        {NAV.map((item) => {
          const active = isActive(item.path);
          return (
            <AnimatedPressable
              key={item.path}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => router.push(item.path as Href)}
            >
              <Ionicons
                name={active ? item.active : item.icon}
                size={20}
                color={active ? Colors.white : Colors.deepGreen}
              />
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
              {item.path === '/cart' && count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
                </View>
              )}
            </AnimatedPressable>
          );
        })}
      </View>

      <AnimatedPressable
        style={styles.preorder}
        onPress={() => router.push('/delivery-window')}
      >
        <Text style={styles.preorderTitle}>Preorder windows</Text>
        <Text style={styles.preorderSub}>Lunch & dinner delivery</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: WEB.sidebarWidth,
    backgroundColor: Colors.white,
    borderRightWidth: 1,
    borderRightColor: Colors.softGreen,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    height: '100%' as unknown as number,
    minHeight: '100vh' as unknown as number,
    flexShrink: 0,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoChar: { fontSize: 22, fontWeight: '700', color: Colors.deepGreen },
  brandName: { ...Typography.subtitle, color: Colors.deepGreen },
  brandTag: { ...Typography.micro, color: Colors.gray },
  nav: { flex: 1, gap: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  navItemActive: { backgroundColor: Colors.deepGreen },
  navLabel: { ...Typography.body, color: Colors.deepGreen, flex: 1 },
  navLabelActive: { color: Colors.white, fontWeight: '600' },
  badge: {
    backgroundColor: Colors.lemon,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.deepGreen },
  preorder: {
    backgroundColor: Colors.softGreen,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  preorderTitle: { ...Typography.caption, color: Colors.deepGreen, fontWeight: '600' },
  preorderSub: { ...Typography.micro, color: Colors.gray, marginTop: 2 },
});
