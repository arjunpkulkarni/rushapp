export const colors = {
  navy: '#0B1B3B',
  electricBlue: '#0EA5FF',
  lightYellow: '#FFE866',
  surface: '#0E1220',
  success: '#22C55E',
  danger: '#EF4444',
  white: '#FFFFFF',
  black: '#0B0B0B',
  grey: '#8A8F98',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 14,
  lg: 24,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const durations = {
  fast: 120,
  base: 240,
  slow: 420,
};

export const easings = {
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const theme = { colors, spacing, radii, shadows, durations, easings };

export default theme;


