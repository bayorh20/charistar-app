import { Stack, usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartToast } from '../components/CartToast';
import { ProductBottomSheet } from '../components/ProductBottomSheet';
import { WebAppFrame } from '../components/WebAppFrame';
import { WebSidebar } from '../components/WebSidebar';
import { Colors } from '../constants/theme';
import { useWebLayout } from '../hooks/useWebLayout';
import { useAuthStore } from '../store/useAuthStore';

const AUTH_ONLY = ['/onboarding', '/login', '/otp'];

function AppShell({ children }: { children: ReactNode }) {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.gestureRoot}>
        {children}
        <ProductBottomSheet />
        <CartToast />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

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
          contentStyle: { backgroundColor: Colors.cream, flex: 1 },
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
      <AppShell>
        <Root {...rootProps}>
          <View style={styles.desktopShell}>
            <WebSidebar />
            <View style={styles.desktopMain}>{content}</View>
          </View>
        </Root>
      </AppShell>
    );
  }

  if (isWeb && isAuthScreen) {
    return (
      <AppShell>
        <WebAppFrame>
          <Root {...rootProps}>
            <View style={styles.authShell}>
              <View style={styles.authCard}>{content}</View>
            </View>
          </Root>
        </WebAppFrame>
      </AppShell>
    );
  }

  if (isWeb) {
    return (
      <AppShell>
        <WebAppFrame>
          <Root {...rootProps}>
            <View style={styles.webRoot}>{content}</View>
          </Root>
        </WebAppFrame>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Root {...rootProps}>
        <View style={styles.nativeRoot}>{content}</View>
      </Root>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1, minHeight: 0 },
  nativeRoot: { flex: 1 },
  webRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 0,
    backgroundColor: Colors.cream,
  },
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    minHeight: 0,
    backgroundColor: Colors.cream,
  },
  desktopMain: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
  },
  authShell: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cream,
    padding: 24,
  },
  authCard: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    maxHeight: '100%',
    minHeight: 0,
  },
});
