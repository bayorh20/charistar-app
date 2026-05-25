import { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';
import { useScreenInsets } from '../hooks/useScreenInsets';

interface Props extends PropsWithChildren {
  /** Fixed header rendered above scroll content */
  header?: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  noBottomInset?: boolean;
}

/**
 * Standard tab screen shell — respects top safe area (from tabs layout)
 * and reserves space for the floating bottom nav.
 */
export function TabScreen({
  children,
  header,
  scroll = true,
  style,
  noBottomInset,
}: Props) {
  const { scrollPaddingBottom, paddingBottom } = useScreenInsets({ tabBar: true });
  const bottom = noBottomInset ? 16 : scrollPaddingBottom;

  if (scroll) {
    return (
      <View style={[styles.root, style]}>
        {header}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottom }]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.root, style, { paddingBottom: noBottomInset ? 0 : paddingBottom }]}>
      {header}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.cream,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
