import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Spacing, Typography } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

export default function SplashScreen() {
  const hasOnboarded = useAuthStore((s) => s.hasOnboarded);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withSpring(1, { damping: 14 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    const timer = setTimeout(() => {
      if (!hasOnboarded) {
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/login');
      } else {
        router.replace('/(tabs)');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80',
        }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(27,94,59,0.75)', 'rgba(250,248,243,0.95)']}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoChar}>C</Text>
        </View>
        <Text style={styles.brand}>Charistar</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, textStyle]}>
        Healthy Cravings, Delivered Fresh
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoChar: { fontSize: 42, fontWeight: '700', color: Colors.deepGreen },
  brand: { ...Typography.hero, fontSize: 36, color: Colors.deepGreen, letterSpacing: -1 },
  tagline: { ...Typography.body, color: Colors.gray, textAlign: 'center', paddingHorizontal: 48 },
});
