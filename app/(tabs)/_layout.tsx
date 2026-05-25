import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { FloatingTabBar } from '../../components/FloatingTabBar';
import { PageContainer } from '../../components/PageContainer';
import { Colors } from '../../constants/theme';
import { useScreenInsets } from '../../hooks/useScreenInsets';
import { useWebLayout } from '../../hooks/useWebLayout';

export default function TabsLayout() {
  const { isDesktopWeb } = useWebLayout();
  const { paddingTop } = useScreenInsets();

  return (
    <PageContainer style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop, minHeight: 0 }}>
        <Tabs
          tabBar={
            isDesktopWeb
              ? () => null
              : (props) => <FloatingTabBar {...props} />
          }
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
            sceneStyle: {
              flex: 1,
              backgroundColor: Colors.cream,
            },
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
