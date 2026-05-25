import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProductBottomSheet } from '../components/ProductBottomSheet';
import { WebSidebar } from '../components/WebSidebar';
import { Colors } from '../constants/theme';
import { useWebLayout } from '../hooks/useWebLayout';
import { useAuthStore } from '../store/useAuthStore';

const AUTH_ONLY = ['/onboarding', '/login', '/otp'];

export default function RootLayout() {
  const { isWeb, isDesktopWeb } = useWebLayout();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAuthScreen = AUTH_ONLY.includes(pathname);
  const isAdmin = pathname.startsWith('/admin');
  const showSidebar = isDesktopWeb && isAuthenticated && !isAuthScreen && !isAdmin;

  const content = (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.cream },
          animation: isWeb ? 'fade' : 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="products/[category]" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="delivery-window" />
        <Stack.Screen name="order-tracking" />
        <Stack.Screen name="admin" />
      </Stack>
    </>
  );

  const Root = Platform.OS === 'web' ? View : GestureHandlerRootView;
  const rootProps = Platform.OS === 'web' ? { style: styles.webRoot } : { style: styles.nativeRoot };

  if (showSidebar) {
    return (
      <Root {...rootProps}>
        <View style={styles.desktopShell}>
          <WebSidebar />
          <View style={styles.desktopMain}>{content}</View>
        </View>
      </Root>
    );
  }

  if (isWeb && isAuthScreen) {
    return (
      <Root {...rootProps}>
        <View style={styles.authShell}>
          <View style={styles.authCard}>{content}</View>
        </View>
      </Root>
    );
  }

  return (
    <Root {...rootProps}>
      <View style={isWeb ? styles.webRoot : styles.nativeRoot}>{content}</View>
    </Root>
  );
}

const styles = StyleSheet.create({
  nativeRoot: { flex: 1 },
  webRoot: {
    flex: 1,
    minHeight: '100vh' as unknown as number,
    backgroundColor: Colors.cream,
  },
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
    minHeight: '100vh' as unknown as number,
    backgroundColor: Colors.cream,
  },
  desktopMain: {
    flex: 1,
    overflow: 'hidden',
  },
  authShell: {
    flex: 1,
    minHeight: '100vh' as unknown as number,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
    padding: 24,
  },
  authCard: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    maxHeight: 900,
  },
});
