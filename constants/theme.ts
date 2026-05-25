export const Colors = {
  deepGreen: '#1B5E3B',
  deepGreenDark: '#0F3D28',
  lemon: '#F2E04B',
  lemonSoft: '#FFF9C4',
  cream: '#FAF8F3',
  softGreen: '#E8F3EC',
  softGreenMuted: '#D4E8DC',
  black: '#1A1A1A',
  gray: '#6B7280',
  grayLight: '#9CA3AF',
  white: '#FFFFFF',
  shadow: 'rgba(27, 94, 59, 0.08)',
  error: '#DC2626',
  success: '#16A34A',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const Typography = {
  hero: { fontSize: 28, fontWeight: '600' as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 16, fontWeight: '500' as const },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.4 },
  micro: { fontSize: 10, fontWeight: '500' as const, letterSpacing: 0.6 },
};

export const Shadow = {
  soft: {
    shadowColor: Colors.deepGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
};
