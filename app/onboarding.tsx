import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Fresh Yogurt Made for You',
    subtitle: 'Creamy, healthy, and crafted daily for your cravings.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80',
  },
  {
    title: 'Order Parfait, Granola & Healthy Snacks',
    subtitle: 'Build your perfect parfait with premium add-ons.',
    image: 'https://images.unsplash.com/photo-1517673400267-025144a246e8?w=900&q=80',
  },
  {
    title: 'Fast Delivery to Your Location',
    subtitle: 'Campus & city delivery across Lagos — fresh every time.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=80',
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const finish = () => {
    setOnboarded();
    router.replace('/login');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={styles.imageCard}>
              <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
              <LinearGradient
                colors={['transparent', Colors.cream]}
                style={styles.imageGradient}
              />
            </View>
            <Animated.View entering={FadeIn.duration(400)} style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </Animated.View>
          </View>
        )}
      />
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Button
          title={index === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          onPress={next}
        />
        {index < SLIDES.length - 1 && (
          <Button title="Skip" variant="outline" onPress={finish} style={{ marginTop: 12 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  imageCard: {
    height: width * 0.85,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginTop: Spacing.md,
  },
  image: { width: '100%', height: '100%' },
  imageGradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 },
  textBlock: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  title: { ...Typography.hero, fontSize: 26, color: Colors.black, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, color: Colors.gray, lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.lg },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.softGreenMuted },
  dotActive: { width: 20, backgroundColor: Colors.deepGreen },
  footer: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
});
