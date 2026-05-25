import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { Button } from '../../components/Button';
import { formatPrice } from '../../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { STATUS_LABELS, useOrderStore } from '../../store/useOrderStore';
import { useAdminStore } from '../../store/useAdminStore';

type Tab = 'orders' | 'products' | 'inventory' | 'riders' | 'promos' | 'windows' | 'analytics' | 'push';

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('orders');
  const orders = useOrderStore((s) => s.orders);
  const {
    products,
    inventory,
    riders,
    promos,
    lunchWindowOpen,
    dinnerWindowOpen,
    pushMessage,
    updateInventory,
    togglePromo,
    setWindow,
    setPushMessage,
    getRevenue,
  } = useAdminStore();

  const liveOrders = orders.filter((o) => o.status !== 'delivered');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'orders', label: 'Orders', icon: 'receipt' },
    { id: 'products', label: 'Products', icon: 'cube' },
    { id: 'inventory', label: 'Stock', icon: 'layers' },
    { id: 'riders', label: 'Riders', icon: 'bicycle' },
    { id: 'promos', label: 'Promos', icon: 'pricetag' },
    { id: 'windows', label: 'Windows', icon: 'time' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
    { id: 'push', label: 'Push', icon: 'notifications' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AnimatedPressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </AnimatedPressable>
        <View>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.sub}>Charistar Operations</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabs}
      >
        {tabs.map((t) => (
          <AnimatedPressable
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}
          >
            <Ionicons
              name={`${t.icon}-outline` as 'receipt-outline'}
              size={16}
              color={tab === t.id ? Colors.white : Colors.deepGreen}
            />
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
          </AnimatedPressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {tab === 'orders' && (
          <>
            <View style={styles.statRow}>
              <StatCard label="Live Orders" value={String(liveOrders.length)} />
              <StatCard label="Revenue" value={formatPrice(getRevenue())} />
            </View>
            {liveOrders.length === 0 ? (
              <Text style={styles.empty}>No live orders right now.</Text>
            ) : (
              liveOrders.map((o) => (
                <View key={o.id} style={styles.card}>
                  <Text style={styles.cardId}>{o.id}</Text>
                  <Text style={styles.cardMeta}>
                    {STATUS_LABELS[o.status]} · {formatPrice(o.total)}
                  </Text>
                  <Text style={styles.cardSub}>{o.address}</Text>
                </View>
              ))
            )}
            {orders.slice(0, 5).map((o) => (
              <View key={`all-${o.id}`} style={[styles.card, styles.cardMuted]}>
                <Text style={styles.cardId}>{o.id}</Text>
                <Text style={styles.cardMeta}>{STATUS_LABELS[o.status]}</Text>
              </View>
            ))}
          </>
        )}

        {tab === 'products' && (
          products.map((p) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.cardId}>{p.name}</Text>
              <Text style={styles.cardMeta}>
                {formatPrice(p.price)} · {p.category}
                {p.badge ? ` · ${p.badge}` : ''}
              </Text>
            </View>
          ))
        )}

        {tab === 'inventory' && (
          products.map((p) => (
            <View key={p.id} style={styles.inventoryRow}>
              <Text style={styles.invName}>{p.name}</Text>
              <View style={styles.invControls}>
                <AnimatedPressable
                  onPress={() => updateInventory(p.id, (inventory[p.id] ?? 0) - 5)}
                >
                  <Ionicons name="remove-circle-outline" size={24} color={Colors.deepGreen} />
                </AnimatedPressable>
                <Text style={styles.invQty}>{inventory[p.id] ?? 0}</Text>
                <AnimatedPressable
                  onPress={() => updateInventory(p.id, (inventory[p.id] ?? 0) + 5)}
                >
                  <Ionicons name="add-circle-outline" size={24} color={Colors.deepGreen} />
                </AnimatedPressable>
              </View>
            </View>
          ))
        )}

        {tab === 'riders' && (
          riders.map((r) => (
            <View key={r.id} style={styles.card}>
              <Text style={styles.cardId}>{r.name}</Text>
              <Text style={styles.cardMeta}>
                {r.status} · {r.deliveries} deliveries today
              </Text>
              <Text style={styles.cardSub}>{r.phone}</Text>
            </View>
          ))
        )}

        {tab === 'promos' && (
          promos.map((p) => (
            <View key={p.code} style={styles.promoRow}>
              <View>
                <Text style={styles.cardId}>{p.code}</Text>
                <Text style={styles.cardMeta}>
                  {p.discount}% off · {p.uses} uses
                </Text>
              </View>
              <Switch
                value={p.active}
                onValueChange={() => togglePromo(p.code)}
                trackColor={{ true: Colors.deepGreen }}
              />
            </View>
          ))
        )}

        {tab === 'windows' && (
          <>
            <View style={styles.windowRow}>
              <Text style={styles.windowLabel}>Lunch Window (10:30 cutoff)</Text>
              <Switch
                value={lunchWindowOpen}
                onValueChange={(v) => setWindow('lunch', v)}
                trackColor={{ true: Colors.deepGreen }}
              />
            </View>
            <View style={styles.windowRow}>
              <Text style={styles.windowLabel}>Dinner Window</Text>
              <Switch
                value={dinnerWindowOpen}
                onValueChange={(v) => setWindow('dinner', v)}
                trackColor={{ true: Colors.deepGreen }}
              />
            </View>
          </>
        )}

        {tab === 'analytics' && (
          <View style={styles.analytics}>
            <StatCard label="Total Revenue" value={formatPrice(getRevenue())} large />
            <StatCard label="Total Orders" value={String(orders.length)} large />
            <StatCard
              label="Avg Order"
              value={formatPrice(orders.length ? Math.round(getRevenue() / orders.length) : 0)}
              large
            />
            <Text style={styles.chartPlaceholder}>Sales chart — connect backend for live data</Text>
          </View>
        )}

        {tab === 'push' && (
          <View style={styles.pushSection}>
            <Text style={styles.sectionTitle}>Push Notification Manager</Text>
            <TextInput
              style={styles.pushInput}
              placeholder="Write notification message..."
              placeholderTextColor={Colors.grayLight}
              multiline
              value={pushMessage}
              onChangeText={setPushMessage}
            />
            <Button
              title="Send Push (Demo)"
              onPress={() => setPushMessage('')}
              variant="secondary"
            />
            <Text style={styles.pushHint}>Demo mode — integrates with FCM in production.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <View style={[styles.stat, large && styles.statLarge]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, large && { fontSize: 22 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { ...Typography.title, color: Colors.black },
  sub: { ...Typography.micro, color: Colors.gray },
  tabScroll: { maxHeight: 44, marginBottom: Spacing.md },
  tabs: { paddingHorizontal: Spacing.lg, gap: 8 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.softGreen,
  },
  tabActive: { backgroundColor: Colors.deepGreen },
  tabText: { ...Typography.micro, color: Colors.deepGreen },
  tabTextActive: { color: Colors.white },
  statRow: { flexDirection: 'row', gap: 10, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  stat: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  statLarge: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md },
  statLabel: { ...Typography.micro, color: Colors.gray },
  statValue: { ...Typography.subtitle, color: Colors.deepGreen, marginTop: 4 },
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 8,
    ...Shadow.card,
  },
  cardMuted: { opacity: 0.7 },
  cardId: { ...Typography.subtitle, fontSize: 14, color: Colors.black },
  cardMeta: { ...Typography.caption, color: Colors.deepGreen, marginTop: 2 },
  cardSub: { ...Typography.micro, color: Colors.gray, marginTop: 2 },
  empty: { ...Typography.body, color: Colors.gray, textAlign: 'center', marginTop: 24 },
  inventoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 8,
  },
  invName: { ...Typography.body, color: Colors.black, flex: 1 },
  invControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  invQty: { ...Typography.subtitle, minWidth: 32, textAlign: 'center' },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 8,
  },
  windowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  windowLabel: { ...Typography.body, color: Colors.black },
  analytics: { paddingTop: Spacing.sm },
  chartPlaceholder: {
    ...Typography.caption,
    color: Colors.grayLight,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
  },
  pushSection: { paddingHorizontal: Spacing.lg },
  sectionTitle: { ...Typography.subtitle, color: Colors.black, marginBottom: Spacing.md },
  pushInput: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
    ...Typography.body,
    color: Colors.black,
  },
  pushHint: { ...Typography.micro, color: Colors.grayLight, textAlign: 'center', marginTop: Spacing.md },
});
