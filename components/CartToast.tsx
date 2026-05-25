import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useCartToastStore } from '../store/useCartToastStore';

export function CartToast() {
  const message = useCartToastStore((s) => s.message);
  const hide = useCartToastStore((s) => s.hide);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-120);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (message) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
      opacity.value = withTiming(1, { duration: 200 });
      const t = setTimeout(() => hide(), 2200);
      return () => clearTimeout(t);
    }
    translateY.value = withTiming(-120, { duration: 200 });
    opacity.value = withTiming(0, { duration: 180 });
  }, [message]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        anim,
        { top: insets.top + (Platform.OS === 'web' ? 12 : 8) },
        Platform.OS === 'web' && styles.wrapWeb,
      ]}
    >
      <Ionicons name="checkmark-circle" size={20} color={Colors.lemon} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10001,
    elevation: 10001,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.deepGreen,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    alignSelf: 'center',
    maxWidth: 400,
    ...Shadow.soft,
  },
  wrapWeb: {
    alignSelf: 'center',
    marginHorizontal: 'auto',
  },
  text: { ...Typography.body, color: Colors.white, fontWeight: '600', flex: 1 },
});
