import { Platform, useWindowDimensions } from 'react-native';
import { APP_FRAME, BREAKPOINTS, FLOATING_TAB_BAR_HEIGHT } from '../constants/layout';

export function useWebLayout() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktopWeb = isWeb && width >= BREAKPOINTS.desktop;
  const isTabletWeb = isWeb && width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const columns = isDesktopWeb ? 4 : isTabletWeb ? 3 : 2;

  const inPhoneFrame = isWeb && width > APP_FRAME.maxWidth;
  const contentWidth = inPhoneFrame ? APP_FRAME.maxWidth : width;

  return {
    isWeb,
    isDesktopWeb,
    isTabletWeb,
    isMobileWeb: isWeb && width < BREAKPOINTS.tablet,
    inPhoneFrame,
    contentWidth,
    width,
    height,
    columns,
    contentPaddingBottom: isDesktopWeb ? 32 : FLOATING_TAB_BAR_HEIGHT + 32,
  };
}
