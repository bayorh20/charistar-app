import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { AnimatedPressable } from './AnimatedPressable';

interface Props {
  title: string;
  subtitle?: string;
  href?: string;
}

export function SectionHeader({ title, subtitle, href }: Props) {
  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {href && (
        <AnimatedPressable onPress={() => router.push(href as never)}>
          <Text style={styles.seeAll}>See all</Text>
        </AnimatedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  title: { ...Typography.title, fontSize: 18, color: Colors.black },
  subtitle: { ...Typography.caption, color: Colors.gray, marginTop: 2 },
  seeAll: { ...Typography.caption, color: Colors.deepGreen },
});
