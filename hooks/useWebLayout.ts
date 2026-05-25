import { Platform, useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '../constants/layout';

export function useWebLayout() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isDesktopWeb = isWeb && width >= BREAKPOINTS.desktop;
  const isTabletWeb = isWeb && width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const columns = isDesktopWeb ? 4 : isTabletWeb ? 3 : 2;

  return {
    isWeb,
    isDesktopWeb,
    isTabletWeb,
    isMobileWeb: isWeb && width < BREAKPOINTS.tablet,
    width,
    height,
    columns,
    contentPaddingBottom: isDesktopWeb ? 48 : 120,
  };
}
