import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { ProductCard } from '../../components/ProductCard';
import { SectionHeader } from '../../components/SectionHeader';
import { CATEGORIES, getProductsBySection, ProductSection } from '../../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useRewardsStore } from '../../store/useRewardsStore';
import { useScreenInsets } from '../../hooks/useScreenInsets';
import { useWebLayout } from '../../hooks/useWebLayout';

const SECTIONS: { key: ProductSection; title: string; href: string }[] = [
  { key: 'popular', title: 'Popular Picks', href: '/products/yogurts' },
  { key: 'hot-deals', title: 'Hot Deals', href: '/products/combos' },
  { key: 'new-arrivals', title: 'New Arrivals', href: '/products/parfait' },
  { key: 'best-sellers', title: 'Best Sellers', href: '/products/yogurts' },
  { key: 'preorder-lunch', title: 'Preorder Lunch Treats', href: '/delivery-window' },
];

export default function HomeScreen() {
  const { scrollPaddingBottom } = useScreenInsets({ tabBar: true });
  const { isDesktopWeb, isTabletWeb } = useWebLayout();
  const user = useAuthStore((s) => s.user);
  const points = useRewardsStore((s) => s.points);
  const heroY = useSharedValue(0);

  useEffect(() => {
    heroY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      true
    );
  }, []);

  const heroAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: heroY.value }],
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
        style={styles.scroll}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greet}>Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</Text>
            <Text style={styles.crave}>What do you crave today?</Text>
          </View>
          <View style={styles.topIcons}>
            <AnimatedPressable style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={Colors.black} />
            </AnimatedPressable>
            <AnimatedPressable
              style={styles.walletBadge}
              onPress={() => router.push('/(tabs)/rewards')}
            >
              <Ionicons name="wallet-outline" size={14} color={Colors.deepGreen} />
              <Text style={styles.walletText}>{points} pts</Text>
            </AnimatedPressable>
          </View>
        </View>

        <AnimatedPressable style={styles.location} onPress={() => router.push('/delivery-window')}>
          <Ionicons name="location" size={16} color={Colors.deepGreen} />
          <Text style={styles.locationText}>University of Lagos, Akoka</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.gray} />
        </AnimatedPressable>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={Colors.gray} />
          <TextInput
            placeholder="Search yogurt, parfait, snacks..."
            placeholderTextColor={Colors.grayLight}
            style={styles.search}
          />
        </View>

        <Animated.View style={[styles.hero, isDesktopWeb && styles.heroDesktop, heroAnim]}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80',
            }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(27,94,59,0.85)']}
            style={styles.heroGradient}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Taste the Creamy Goodness</Text>
            <Text style={styles.heroSub}>Fresh yogurt, made creamy.</Text>
            <AnimatedPressable
              style={styles.heroCta}
              onPress={() => router.push('/products/yogurts')}
            >
              <Text style={styles.heroCtaText}>Order Now</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.deepGreen} />
            </AnimatedPressable>
          </View>
        </Animated.View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <AnimatedPressable
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => router.push(`/products/${cat.id}`)}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={cat.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.deepGreen} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </AnimatedPressable>
          ))}
        </ScrollView>

        {SECTIONS.map((section) => {
          const products = getProductsBySection(section.key).slice(0, 4);
          if (!products.length) return null;
          return (
            <View key={section.key} style={styles.section}>
              <SectionHeader title={section.title} href={section.href} />
              <View style={[styles.grid, isDesktopWeb && styles.gridDesktop]}>
                {products.map((p) => (
                  <View
                    key={p.id}
                    style={[
                      styles.gridItem,
                      isDesktopWeb && styles.gridItemDesktop,
                      isTabletWeb && styles.gridItemTablet,
                    ]}
                  >
                    <ProductCard product={p} />
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream, minHeight: 0 },
  scroll: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  greet: { ...Typography.caption, color: Colors.gray },
  crave: { ...Typography.title, fontSize: 20, color: Colors.black },
  topIcons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.lemon,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  walletText: { ...Typography.micro, color: Colors.deepGreen, fontWeight: '700' },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  locationText: { ...Typography.caption, color: Colors.black, flex: 1 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    gap: 8,
    marginBottom: Spacing.lg,
    ...Shadow.card,
  },
  search: { flex: 1, paddingVertical: 14, ...Typography.body, color: Colors.black },
  hero: {
    height: 200,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadow.soft,
  },
  heroImage: { width: '100%', height: '100%' },
  heroGradient: { ...StyleSheet.absoluteFill },
  heroContent: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  heroTitle: { ...Typography.title, color: Colors.white, fontSize: 20 },
  heroSub: { ...Typography.caption, color: Colors.lemonSoft, marginTop: 4, marginBottom: 12 },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: Colors.lemon,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  heroCtaText: { ...Typography.caption, color: Colors.deepGreen, fontWeight: '700' },
  categories: { paddingHorizontal: Spacing.lg, gap: 12, marginBottom: Spacing.lg },
  categoryItem: { alignItems: 'center', marginRight: 4 },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: { ...Typography.micro, color: Colors.black },
  section: { marginBottom: Spacing.md },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg - 8,
  },
  gridItem: { width: '48%' },
  gridItemTablet: { width: '31%' },
  gridItemDesktop: { width: '23%' },
  gridDesktop: { gap: 16 },
  heroDesktop: { height: 280 },
});
