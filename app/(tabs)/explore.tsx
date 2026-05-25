import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../../constants/products';
import { Colors, Radius, Spacing, Typography } from '../../constants/theme';
import { useWebLayout } from '../../hooks/useWebLayout';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { contentPaddingBottom, isDesktopWeb } = useWebLayout();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.sub}>Discover everything Charistar has to offer.</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: contentPaddingBottom }}
      >
        {CATEGORIES.map((cat) => {
          const items = PRODUCTS.filter((p) => p.category === cat.id).slice(0, 2);
          return (
            <View key={cat.id} style={styles.block}>
              <AnimatedPressable
                style={styles.blockHeader}
                onPress={() => router.push(`/products/${cat.id}`)}
              >
                <Text style={styles.blockTitle}>{cat.label}</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.deepGreen} />
              </AnimatedPressable>
              <View style={[styles.row, isDesktopWeb && styles.rowDesktop]}>
                {items.map((p) => (
                  <View key={p.id} style={[styles.half, isDesktopWeb && styles.halfDesktop]}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </View>
            </View>
          );
        })}
        <AnimatedPressable
          style={styles.preorderCard}
          onPress={() => router.push('/delivery-window')}
        >
          <Text style={styles.preorderTitle}>Preorder now, enjoy fresh later.</Text>
          <Text style={styles.preorderSub}>Lunch & dinner delivery windows</Text>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  title: { ...Typography.hero, fontSize: 26, color: Colors.black, paddingHorizontal: Spacing.lg },
  sub: { ...Typography.body, color: Colors.gray, paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  block: { marginBottom: Spacing.lg },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  blockTitle: { ...Typography.subtitle, color: Colors.black },
  row: { flexDirection: 'row', paddingHorizontal: Spacing.lg - 8 },
  rowDesktop: { flexWrap: 'wrap', gap: 12 },
  half: { flex: 1, marginHorizontal: 4 },
  halfDesktop: { flex: 0, width: '23%', minWidth: 200 },
  preorderCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.deepGreen,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  preorderTitle: { ...Typography.subtitle, color: Colors.lemon, marginBottom: 4 },
  preorderSub: { ...Typography.caption, color: Colors.softGreen },
});
