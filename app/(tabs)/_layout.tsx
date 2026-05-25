import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { FloatingTabBar } from '../../components/FloatingTabBar';
import { PageContainer } from '../../components/PageContainer';
import { useWebLayout } from '../../hooks/useWebLayout';

export default function TabsLayout() {
  const { isDesktopWeb } = useWebLayout();

  return (
    <PageContainer style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Tabs
          tabBar={
            isDesktopWeb
              ? () => null
              : (props) => <FloatingTabBar {...props} />
          }
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="explore" />
          <Tabs.Screen name="cart" />
          <Tabs.Screen name="rewards" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>
    </PageContainer>
  );
}
