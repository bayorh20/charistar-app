import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useRewardsStore } from '../../store/useRewardsStore';
import { useScreenInsets } from '../../hooks/useScreenInsets';

const MENU = [
  { icon: 'location-outline', label: 'Saved Addresses', route: '/delivery-window' },
  { icon: 'receipt-outline', label: 'Order History', action: 'orders' },
  { icon: 'wallet-outline', label: 'Wallet', route: '/(tabs)/rewards' },
  { icon: 'star-outline', label: 'Rewards', route: '/(tabs)/rewards' },
  { icon: 'help-circle-outline', label: 'Help Center', route: null },
  { icon: 'shield-outline', label: 'Admin Dashboard', route: '/admin' },
];

export default function ProfileScreen() {
  const { scrollPaddingBottom } = useScreenInsets({ tabBar: true });
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const orders = useOrderStore((s) => s.orders);
  const points = useRewardsStore((s) => s.points);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.name ?? 'G').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
          <Text style={styles.phone}>{user?.phone || 'Guest account'}</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{points}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.menu}>
          {MENU.map((item) => (
            <AnimatedPressable
              key={item.label}
              style={styles.menuItem}
              onPress={() => {
                if (item.route) router.push(item.route as never);
                else if (item.action === 'orders' && orders[0]) {
                  router.push({ pathname: '/order-tracking', params: { id: orders[0].id } });
                }
              }}
            >
              <Ionicons name={item.icon as 'location-outline'} size={20} color={Colors.deepGreen} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.grayLight} />
            </AnimatedPressable>
          ))}
        </View>

        <AnimatedPressable style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream, minHeight: 0 },
  scroll: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.deepGreen },
  name: { ...Typography.title, color: Colors.black },
  phone: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  stats: { flexDirection: 'row', marginTop: Spacing.lg },
  stat: { alignItems: 'center', paddingHorizontal: Spacing.xl },
  statVal: { ...Typography.title, fontSize: 20, color: Colors.deepGreen },
  statLabel: { ...Typography.micro, color: Colors.gray },
  statDivider: { width: 1, backgroundColor: Colors.softGreenMuted, height: 32 },
  menu: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softGreen,
  },
  menuLabel: { flex: 1, ...Typography.body, color: Colors.black },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  logoutText: { ...Typography.body, color: Colors.error },
});
