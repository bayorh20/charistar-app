import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedPressable } from '../components/AnimatedPressable';
import { Button } from '../components/Button';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const login = useAuthStore((s) => s.login);
  const setPendingPhone = useAuthStore((s) => s.setPendingPhone);
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);

  const continueLogin = () => {
    if (!phone.trim()) return;
    login(name.trim() || 'Charistar Friend', phone.trim());
    setPendingPhone(phone.trim());
    router.push('/otp');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 24 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.logoSmall}>
          <Text style={styles.logoChar}>C</Text>
        </View>
        <Text style={styles.welcome}>Welcome to Charistar</Text>
        <Text style={styles.sub}>Healthy treats delivered fresh to you.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Your name</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={18} color={Colors.gray} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Ada"
            placeholderTextColor={Colors.grayLight}
            value={name}
            onChangeText={setName}
          />
        </View>

        <Text style={[styles.label, { marginTop: Spacing.lg }]}>Phone number</Text>
        <View style={styles.inputWrap}>
          <Ionicons name="call-outline" size={18} color={Colors.gray} />
          <TextInput
            style={styles.input}
            placeholder="+234 801 234 5678"
            placeholderTextColor={Colors.grayLight}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <Button title="Continue" onPress={continueLogin} style={{ marginTop: Spacing.xl }} />
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <AnimatedPressable onPress={() => { loginAsGuest(); router.replace('/(tabs)'); }}>
          <Text style={styles.guest}>Continue as guest</Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={styles.adminLink}
          onPress={() => router.push('/admin')}
        >
          <Text style={styles.adminText}>Admin access</Text>
        </AnimatedPressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream, paddingHorizontal: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoSmall: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lemon,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoChar: { fontSize: 28, fontWeight: '700', color: Colors.deepGreen },
  welcome: { ...Typography.hero, fontSize: 24, color: Colors.black },
  sub: { ...Typography.body, color: Colors.gray, marginTop: 6, textAlign: 'center' },
  form: { flex: 1 },
  label: { ...Typography.caption, color: Colors.gray, marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    gap: 10,
    ...Shadow.card,
  },
  input: { flex: 1, paddingVertical: 16, ...Typography.body, color: Colors.black },
  footer: { alignItems: 'center', gap: 16 },
  guest: { ...Typography.body, color: Colors.deepGreen },
  adminLink: { padding: 8 },
  adminText: { ...Typography.micro, color: Colors.grayLight },
});
