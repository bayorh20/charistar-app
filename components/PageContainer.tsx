import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WEB } from '../constants/layout';
import { Colors } from '../constants/theme';
import { useWebLayout } from '../hooks/useWebLayout';

interface Props extends PropsWithChildren {
  style?: ViewStyle;
  noPadding?: boolean;
}

export function PageContainer({ children, style, noPadding }: Props) {
  const { isWeb, isDesktopWeb } = useWebLayout();

  return (
    <View
      style={[
        styles.wrap,
        isWeb && styles.webWrap,
        isDesktopWeb && styles.desktopWrap,
        !noPadding && isDesktopWeb && styles.desktopPad,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  webWrap: {
    width: '100%',
    maxWidth: WEB.maxContentWidth,
    alignSelf: 'center',
  },
  desktopWrap: { flex: 1 },
  desktopPad: { paddingHorizontal: 8 },
  screen: { flex: 1 },
});

export function WebScreen({ children, style }: Props) {
  const { isWeb } = useWebLayout();
  return (
    <View style={[styles.screen, isWeb && { backgroundColor: Colors.cream }, style]}>
      {children}
    </View>
  );
}
