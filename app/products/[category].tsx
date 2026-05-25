import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { ProductCard } from '../../components/ProductCard';
import { CATEGORIES, CategoryId, getProductsByCategory } from '../../constants/products';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useScreenInsets } from '../../hooks/useScreenInsets';
import { useWebLayout } from '../../hooks/useWebLayout';

export default function ProductListingScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { paddingTop, scrollPaddingBottom } = useScreenInsets();
  const { columns, isDesktopWeb } = useWebLayout();
  const cat = CATEGORIES.find((c) => c.id === category);
  const products = getProductsByCategory((category as CategoryId) || 'yogurts');

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <AnimatedPressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </AnimatedPressable>
        <Text style={styles.title}>{cat?.label ?? 'Products'}</Text>
        <View style={{ width: 22 }} />
      </View>
      <FlatList
        data={products}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: scrollPaddingBottom }]}
        columnWrapperStyle={columns > 1 ? styles.row : undefined}
        renderItem={({ item }) => (
          <View style={[styles.cell, isDesktopWeb && styles.cellDesktop]}>
            <ProductCard product={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No products in this category yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream, minHeight: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: { ...Typography.title, color: Colors.black },
  list: { paddingHorizontal: Spacing.lg - 8, paddingBottom: 40, flexGrow: 1 },
  row: { justifyContent: 'space-between' },
  cell: { flex: 1, marginHorizontal: 4 },
  cellDesktop: { maxWidth: 280 },
  empty: { ...Typography.body, color: Colors.gray, textAlign: 'center', marginTop: 48 },
});
