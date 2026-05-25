import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

export default function OtpScreen() {
  const insets = useSafeAreaInsets();
  const pendingPhone = useAuthStore((s) => s.pendingPhone);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const [digits, setDigits] = useState(['', '', '', '']);
  const refs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const d = text.slice(-1);
    const next = [...digits];
    next[index] = d;
    setDigits(next);
    if (d && index < 3) refs.current[index + 1]?.focus();
  };

  const verify = () => {
    verifyOtp();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 48 }]}>
      <Text style={styles.title}>Verify your number</Text>
      <Text style={styles.sub}>
        We sent a code to {pendingPhone || 'your phone'}. Enter any 4 digits to continue.
      </Text>
      <View style={styles.otpRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => { refs.current[i] = r; }}
            style={[styles.otpBox, d && styles.otpFilled]}
            keyboardType="number-pad"
            maxLength={1}
            value={d}
            onChangeText={(t) => handleChange(t, i)}
          />
        ))}
      </View>
      <Button title="Verify & Continue" onPress={verify} style={{ marginTop: Spacing.xl }} />
      <Text style={styles.hint}>Demo: enter any digits — OTP is simulated.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream, paddingHorizontal: Spacing.xl },
  title: { ...Typography.hero, fontSize: 24, color: Colors.black },
  sub: { ...Typography.body, color: Colors.gray, marginTop: 8, marginBottom: Spacing.xl },
  otpRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: Colors.black,
    borderWidth: 1.5,
    borderColor: Colors.softGreenMuted,
  },
  otpFilled: { borderColor: Colors.deepGreen, backgroundColor: Colors.softGreen },
  hint: { ...Typography.micro, color: Colors.grayLight, textAlign: 'center', marginTop: Spacing.lg },
});
