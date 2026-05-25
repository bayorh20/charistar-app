import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { APP_FRAME } from '../constants/layout';
import { Colors, Radius } from '../constants/theme';
import { useWebLayout } from '../hooks/useWebLayout';

interface Props extends PropsWithChildren {
  /** Desktop layout with sidebar — use full width, no phone frame */
  fullWidth?: boolean;
}

/**
 * On wide web viewports, centers the app in a phone-sized frame so aspect ratio
 * matches mobile. On narrow screens, fills the viewport edge-to-edge.
 */
export function WebAppFrame({ children, fullWidth }: Props) {
  const { isWeb, width, height } = useWebLayout();

  if (!isWeb || fullWidth) {
    return <View style={styles.fill}>{children}</View>;
  }

  const useFrame = width > APP_FRAME.maxWidth + 1;
  if (!useFrame) {
    return <View style={styles.fill}>{children}</View>;
  }

  const frameWidth = APP_FRAME.maxWidth;
  const frameHeight = Math.min(height, frameWidth / APP_FRAME.aspectRatio);

  return (
    <View style={styles.canvas}>
      <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 0,
    backgroundColor: Colors.cream,
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.softGreen,
  },
  frame: {
    overflow: 'hidden',
    backgroundColor: Colors.cream,
    borderRadius: Radius.xl,
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 12px 48px rgba(27, 94, 59, 0.18)',
        } as object)
      : {}),
  },
});
