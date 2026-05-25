import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { formatPrice, Product } from '../constants/products';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { useProductSheetStore } from '../store/useProductSheetStore';
import { AnimatedPressable } from './AnimatedPressable';

interface Props {
  product: Product;
  width?: number;
}

export function ProductCard({ product, width }: Props) {
  const favorites = useCartStore((s) => s.favorites);
  const toggleFavorite = useCartStore((s) => s.toggleFavorite);
  const openSheet = useProductSheetStore((s) => s.open);
  const isFav = favorites.includes(product.id);

  return (
    <View style={[styles.card, width ? { width } : undefined]}>
      <AnimatedPressable
        style={styles.tapArea}
        onPress={() => router.push(`/product/${product.id}`)}
      >
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
          {product.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          <AnimatedPressable
            style={styles.favBtn}
            onPress={() => toggleFavorite(product.id)}
            haptic={false}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={16}
              color={isFav ? Colors.deepGreen : Colors.gray}
            />
          </AnimatedPressable>
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.size}>{product.sizes[0]}</Text>
      </AnimatedPressable>

      <View style={styles.row}>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <AnimatedPressable
          style={styles.addBtn}
          onPress={() => openSheet(product)}
        >
          <Ionicons name="add" size={18} color={Colors.white} />
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  tapArea: { flex: 1 },
  imageWrap: {
    height: 140,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    backgroundColor: Colors.softGreen,
  },
  image: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.lemon,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  badgeText: { ...Typography.micro, color: Colors.deepGreen },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  name: { ...Typography.subtitle, fontSize: 13, color: Colors.black, marginBottom: 2 },
  size: { ...Typography.micro, color: Colors.grayLight, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { ...Typography.caption, fontSize: 13, color: Colors.deepGreen, fontWeight: '600' },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
