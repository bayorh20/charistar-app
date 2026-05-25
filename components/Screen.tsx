import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useScreenInsets } from '../hooks/useScreenInsets';
import { useWebLayout } from '../hooks/useWebLayout';
import { AnimatedPressable } from './AnimatedPressable';

interface Props extends PropsWithChildren {
  title?: string;
  showBack?: boolean;
  scroll?: boolean;
  footer?: ReactNode;
  style?: ViewStyle;
}

/** Stack screens (product, checkout, etc.) with safe areas and optional footer. */
export function Screen({
  children,
  title,
  showBack = true,
  scroll = true,
  footer,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  const { paddingTop, scrollPaddingBottom, safeBottom, stackFooterPad } =
    useScreenInsets();
  const { isDesktopWeb } = useWebLayout();

  const top = Math.max(paddingTop, insets.top, 8);
  const bottomPad = footer ? stackFooterPad : scrollPaddingBottom;

  const header = (
    <View style={[styles.header, { paddingTop: top }]}>
      {showBack && (
        <AnimatedPressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.black} />
        </AnimatedPressable>
      )}
      {title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }} />}
      {showBack && !title && <View style={{ width: 40 }} />}
    </View>
  );

  const body = scroll ? (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.body, { paddingBottom: bottomPad }]}>{children}</View>
  );

  return (
    <View style={[styles.root, isDesktopWeb && styles.rootDesktop, style]}>
      {header}
      {body}
      {footer && (
        <View style={[styles.footer, { paddingBottom: Math.max(safeBottom, 12) }]}>{footer}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
    minHeight: 0,
  },
  rootDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.card,
  },
  title: {
    flex: 1,
    ...Typography.title,
    color: Colors.black,
    textAlign: 'center',
    marginRight: 40,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.softGreen,
    backgroundColor: Colors.cream,
  },
});
