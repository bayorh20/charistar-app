import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AnimatedPressable } from '../../components/AnimatedPressable';
import { Button } from '../../components/Button';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { useRewardsStore } from '../../store/useRewardsStore';
import { useScreenInsets } from '../../hooks/useScreenInsets';

export default function RewardsScreen() {
  const { scrollPaddingBottom } = useScreenInsets();
  const { points, referralCode, cashback, spin, spinPrize, redeemPoints } = useRewardsStore();
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => {
      spin();
      setSpinning(false);
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rewards</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: scrollPaddingBottom }}
      >
        <View style={styles.pointsCard}>
          <Text style={styles.pointsLabel}>Your balance</Text>
          <Text style={styles.points}>{points}</Text>
          <Text style={styles.pointsUnit}>Charistar Points</Text>
          <View style={styles.cashback}>
            <Ionicons name="cash-outline" size={16} color={Colors.lemon} />
            <Text style={styles.cashbackText}>₦{cashback.toLocaleString()} cashback</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Refer & Earn</Text>
          <Text style={styles.code}>{referralCode}</Text>
          <Text style={styles.cardSub}>Share with friends — you both earn 100 points.</Text>
        </View>

        <View style={styles.earnGrid}>
          {[
            { icon: 'cart', label: 'Order', pts: '+50 pts' },
            { icon: 'people', label: 'Refer', pts: '+100 pts' },
            { icon: 'star', label: 'Review', pts: '+25 pts' },
          ].map((item) => (
            <View key={item.label} style={styles.earnItem}>
              <Ionicons name={`${item.icon}-outline` as 'cart-outline'} size={22} color={Colors.deepGreen} />
              <Text style={styles.earnLabel}>{item.label}</Text>
              <Text style={styles.earnPts}>{item.pts}</Text>
            </View>
          ))}
        </View>

        <AnimatedPressable
          style={styles.redeem}
          onPress={() => redeemPoints(200)}
        >
          <Text style={styles.redeemTitle}>Redeem 200 pts</Text>
          <Text style={styles.redeemSub}>Get ₦500 off your next order</Text>
        </AnimatedPressable>

        <View style={styles.spinCard}>
          <Text style={styles.spinTitle}>Spin & Win</Text>
          <Text style={styles.spinSub}>Try your luck for bonus rewards</Text>
          {spinPrize && <Text style={styles.prize}>Last win: {spinPrize}</Text>}
          <Button
            title={spinning ? 'Spinning...' : 'Spin Now'}
            variant="lemon"
            onPress={handleSpin}
            loading={spinning}
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream, minHeight: 0 },
  scroll: { flex: 1 },
  title: { ...Typography.hero, fontSize: 26, color: Colors.black, padding: Spacing.lg },
  pointsCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.deepGreen,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.soft,
  },
  pointsLabel: { ...Typography.caption, color: Colors.softGreen },
  points: { fontSize: 48, fontWeight: '700', color: Colors.lemon, marginVertical: 4 },
  pointsUnit: { ...Typography.body, color: Colors.white },
  cashback: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.md },
  cashbackText: { ...Typography.caption, color: Colors.lemon },
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardTitle: { ...Typography.subtitle, color: Colors.black },
  code: {
    ...Typography.hero,
    fontSize: 22,
    color: Colors.deepGreen,
    letterSpacing: 2,
    marginVertical: 8,
  },
  cardSub: { ...Typography.caption, color: Colors.gray },
  earnGrid: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    gap: 10,
    marginBottom: Spacing.md,
  },
  earnItem: {
    flex: 1,
    backgroundColor: Colors.softGreen,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  earnLabel: { ...Typography.micro, color: Colors.black, marginTop: 6 },
  earnPts: { ...Typography.micro, color: Colors.deepGreen, fontWeight: '700' },
  redeem: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.lemon,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  redeemTitle: { ...Typography.subtitle, color: Colors.deepGreen },
  redeemSub: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  spinCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadow.card,
  },
  spinTitle: { ...Typography.title, fontSize: 20, color: Colors.black },
  spinSub: { ...Typography.caption, color: Colors.gray, marginTop: 4 },
  prize: { ...Typography.caption, color: Colors.deepGreen, marginTop: 12, fontWeight: '600' },
});
