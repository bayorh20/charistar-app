import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'lemon';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: Props) {
  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.wrap, style, (disabled || loading) && styles.disabled]}
      >
        <LinearGradient
          colors={[Colors.deepGreen, Colors.deepGreenDark]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.primaryText}>{title}</Text>
          )}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  const variantStyles = {
    secondary: { bg: Colors.softGreen, text: Colors.deepGreen },
    outline: { bg: 'transparent', text: Colors.deepGreen, border: true },
    lemon: { bg: Colors.lemon, text: Colors.deepGreen },
  }[variant === 'secondary' ? 'secondary' : variant === 'lemon' ? 'lemon' : 'outline'];

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.wrap,
        styles.flat,
        { backgroundColor: variantStyles.bg },
        variantStyles.border && styles.outline,
        style,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.deepGreen} />
      ) : (
        <Text style={[styles.flatText, { color: variantStyles.text }]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: Radius.full, overflow: 'hidden' },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { ...Typography.subtitle, color: Colors.white, fontSize: 15 },
  flat: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  flatText: { ...Typography.subtitle, fontSize: 15 },
  outline: { borderWidth: 1.5, borderColor: Colors.deepGreen },
  disabled: { opacity: 0.5 },
});
