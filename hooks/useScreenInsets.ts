import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FLOATING_TAB_BAR_HEIGHT,
  WEB_SAFE_BOTTOM,
  WEB_SAFE_TOP,
} from '../constants/layout';
import { useWebLayout } from './useWebLayout';

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const { isWeb, isDesktopWeb, isMobileWeb } = useWebLayout();

  const paddingTop = Math.max(
    insets.top,
    isWeb && isMobileWeb ? WEB_SAFE_TOP : 0,
    isWeb && isDesktopWeb ? 8 : 0
  );

  const safeBottom = Math.max(insets.bottom, isWeb ? WEB_SAFE_BOTTOM : 0);
  const tabBarSpace = isDesktopWeb ? 0 : FLOATING_TAB_BAR_HEIGHT;
  const paddingBottom = safeBottom + tabBarSpace;
  const scrollPaddingBottom = paddingBottom + 24;

  return {
    paddingTop,
    paddingBottom,
    scrollPaddingBottom,
    tabBarSpace,
    safeBottom,
  };
}
