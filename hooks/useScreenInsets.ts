import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FLOATING_TAB_BAR_HEIGHT,
  STACK_FOOTER_HEIGHT,
  WEB_SAFE_BOTTOM,
  WEB_SAFE_TOP,
} from '../constants/layout';
import { useWebLayout } from './useWebLayout';

type Options = {
  /** Reserve space for the floating bottom nav (tab screens only). */
  tabBar?: boolean;
};

export function useScreenInsets(options?: Options) {
  const insets = useSafeAreaInsets();
  const { isWeb, isDesktopWeb, isMobileWeb } = useWebLayout();
  const withTabBar = options?.tabBar ?? false;

  const paddingTop = Math.max(
    insets.top,
    isWeb && isMobileWeb ? WEB_SAFE_TOP : 0,
    isWeb && isDesktopWeb ? 8 : 0
  );

  const safeBottom = Math.max(insets.bottom, isWeb ? WEB_SAFE_BOTTOM : 0);
  const tabBarSpace =
    withTabBar && !isDesktopWeb ? FLOATING_TAB_BAR_HEIGHT : 0;
  const paddingBottom = safeBottom + tabBarSpace;
  const scrollPaddingBottom = paddingBottom + 20;

  return {
    paddingTop,
    paddingBottom,
    scrollPaddingBottom,
    tabBarSpace,
    safeBottom,
    stackFooterPad: safeBottom + STACK_FOOTER_HEIGHT,
    hasTabBar: withTabBar && !isDesktopWeb,
  };
}
