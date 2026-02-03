/**
 * KaarYa Brand Colors & Theme
 * Brutalist design with vibrant yellow and bold black
 */

// Brand Primary Colors
export const KARYA_YELLOW = '#FFE500';
export const KARYA_BLACK = '#000000';
export const KARYA_WHITE = '#FFFFFF';

// College Badge Colors
export const BADGE_COLORS = {
  nift: '#E91E63',      // Pink - NIFT Delhi
  iit: '#4CAF50',       // Green - IIT Bombay
  du: '#2196F3',        // Blue - DU North
  bits: '#FF9800',      // Orange - BITS
  nlu: '#9C27B0',       // Purple - NLU
} as const;

// Theme tokens
export const theme = {
  colors: {
    primary: KARYA_YELLOW,
    secondary: KARYA_BLACK,
    background: KARYA_YELLOW,
    surface: KARYA_WHITE,
    text: {
      primary: KARYA_BLACK,
      secondary: '#666666',
      inverse: KARYA_WHITE,
    },
    border: KARYA_BLACK,
    success: '#00C853',
    warning: '#FF9800',
    error: '#F44336',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 30,
    full: 9999,
  },
  borderWidth: {
    thin: 2,
    default: 3,
    thick: 4,
  },
  typography: {
    hero: {
      fontSize: 56,
      lineHeight: 56,
      fontWeight: '900' as const,
    },
    title: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '800' as const,
    },
    subtitle: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '700' as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
    },
    label: {
      fontSize: 11,
      lineHeight: 14,
      fontWeight: '600' as const,
    },
  },
};

// Legacy support
const tintColorLight = KARYA_YELLOW;
const tintColorDark = '#fff';

export default {
  light: {
    text: KARYA_BLACK,
    background: KARYA_YELLOW,
    tint: tintColorLight,
    tabIconDefault: '#888',
    tabIconSelected: KARYA_BLACK,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
