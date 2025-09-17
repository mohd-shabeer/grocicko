// Grociko App Theme Configuration
// Modern grocery app theme with teal primary and subtle orange accents

export const colors = {
  // Primary Theme Colors
  primary: {
    teal: '#3caa91',
    tealLight: '#5dbca5',
    tealDark: '#2d8a73',
    orange: '#FF8A65',
    orangeLight: '#FFB74D',
    orangeDark: '#FF7043',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAF9',
    accent: '#F0F9F7', // Very light teal
    card: '#FFFFFF',
    modal: 'rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(60, 170, 145, 0.1)',
  },
  
  // Text Colors
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    tertiary: '#718096',
    accent: '#3caa91',
    inverse: '#FFFFFF',
    placeholder: '#A0AEC0',
    success: '#38A169',
    warning: '#FF8A65',
    error: '#E53E3E',
  },
  
  // Border Colors
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E0',
    dark: '#A0AEC0',
    focus: '#3caa91',
    error: '#E53E3E',
  },
  
  // Status Colors
  status: {
    success: '#38A169',
    warning: '#FF8A65',
    error: '#E53E3E',
    info: '#3182CE',
  },
  
  // Neutral Grays
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 50,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#3caa91',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const typography = {
  fonts: {
    light: 'System',
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    huge: 32,
    display: 40,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 200,
  },
};

// Component Styles
export const components = {
  button: {
    primary: {
      backgroundColor: colors.primary.teal,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      ...shadows.md,
    },
    secondary: {
      backgroundColor: colors.primary.orange,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      ...shadows.md,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary.teal,
      borderRadius: borderRadius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
    },
  },
  
  card: {
    default: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.xl,
      padding: spacing.lg,
      ...shadows.lg,
    },
  },
  
  input: {
    default: {
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border.light,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    focused: {
      borderColor: colors.border.focus,
      borderWidth: 2,
      backgroundColor: colors.background.primary,
    },
  },
};

// Utility Functions
export const getColor = (path) => {
  const keys = path.split('.');
  let result = colors;
  for (const key of keys) {
    result = result?.[key];
  }
  return result || colors.primary.teal;
};

export const getFontStyle = (size = 'base', weight = 'regular') => ({
  fontSize: typography.sizes[size],
  fontWeight: weight === 'regular' ? '400' : weight === 'medium' ? '500' : weight === 'semiBold' ? '600' : '700',
});

export default {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
  animations,
  components,
  getColor,
  getFontStyle,
};