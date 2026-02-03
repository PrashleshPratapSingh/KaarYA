/**
 * KaarYA Post-Gig Theme Configuration
 * Centralized design tokens for consistent UI/UX across all post-gig screens
 * Inspired by shadcn/ui and Tailwind CSS theming
 */

// =============================================================================
// COLOR PALETTE
// =============================================================================

export const COLORS = {
    // Primary Colors (Brand Yellow)
    primary: "#d4f906",
    primaryDark: "#ccf005",
    primaryMuted: "#e8f970",
    primaryForeground: "#171811",

    // Secondary Colors
    secondary: "#f8f8f5",
    secondaryDark: "#e6e5db",
    secondaryForeground: "#171811",

    // Background Colors
    background: "#d4f906",
    backgroundLight: "#fffdf5",
    backgroundDark: "#20230f",
    backgroundMuted: "#f8f8f5",

    // Text Colors
    foreground: "#171811",
    foregroundMuted: "#8a8760",
    foregroundLight: "rgba(23, 24, 17, 0.7)",
    foregroundLighter: "rgba(23, 24, 17, 0.5)",

    // Karya Brand Colors
    karyaBlack: "#171811",
    karyaYellow: "#d4f906",
    karyaGray: "#858c5f",

    // Utility Colors
    white: "#FFFFFF",
    black: "#000000",

    // Accent Colors
    accentRed: "#ff4d4d",
    accentGreen: "#4CAF50",
    accentBlue: "#2196F3",

    // Border Colors
    border: "#171811",
    borderLight: "#e6e5db",
    borderMuted: "rgba(23, 24, 17, 0.2)",

    // Input Colors
    input: "#FFFFFF",
    inputBorder: "#171811",
    inputPlaceholder: "rgba(23, 24, 17, 0.4)",

    // Card Colors
    card: "#FFFFFF",
    cardForeground: "#171811",
    cardMuted: "#f8f8f5",

    // Destructive
    destructive: "#ff4d4d",
    destructiveForeground: "#FFFFFF",

    // Muted
    muted: "#f8f8f5",
    mutedForeground: "#8a8760",

    // Ring (focus states)
    ring: "#171811",
    ringOffset: "#d4f906",
} as const;

// Dark Mode Colors (if needed in future)
export const COLORS_DARK = {
    primary: "#d4f906",
    primaryForeground: "#171811",
    background: "#20230f",
    backgroundLight: "#2a2b22",
    foreground: "#f8f8f5",
    foregroundMuted: "#a8a880",
    card: "#2a2b22",
    cardForeground: "#f8f8f5",
    border: "#3a3b32",
    borderLight: "#4a4b42",
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const TYPOGRAPHY = {
    // Font Families
    fonts: {
        sans: "System",
        serif: "Georgia",
        mono: "Menlo",
        display: "System", // For headings
    },

    // Font Sizes
    sizes: {
        "2xs": 10,
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
        "6xl": 60,
    },

    // Font Weights
    weights: {
        normal: "400" as const,
        medium: "500" as const,
        semibold: "600" as const,
        bold: "700" as const,
        extrabold: "800" as const,
        black: "900" as const,
    },

    // Line Heights
    lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
    },

    // Letter Spacing
    letterSpacing: {
        tighter: -1,
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
        widest: 2,
    },
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const SPACING = {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const RADIUS = {
    none: 0,
    sm: 4,
    DEFAULT: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 24,
    "3xl": 32,
    full: 9999,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const SHADOWS = {
    // Neobrutalist Shadows (offset shadows)
    neobrutalism: {
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    neobrutalismSm: {
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    neobrutalismLg: {
        shadowColor: COLORS.karyaBlack,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },

    // Standard Shadows (soft shadows)
    none: {
        shadowColor: "transparent",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    DEFAULT: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    "2xl": {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 12,
    },
} as const;

// =============================================================================
// BORDERS
// =============================================================================

export const BORDERS = {
    widths: {
        none: 0,
        DEFAULT: 1,
        2: 2,
        4: 4,
        8: 8,
    },
    styles: {
        solid: "solid" as const,
        dashed: "dashed" as const,
        dotted: "dotted" as const,
    },
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

export const Z_INDEX = {
    hide: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    overlay: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    toast: 80,
    max: 999,
} as const;

// =============================================================================
// ANIMATION
// =============================================================================

export const ANIMATION = {
    duration: {
        fastest: 50,
        faster: 100,
        fast: 150,
        normal: 200,
        slow: 300,
        slower: 400,
        slowest: 500,
    },
    easing: {
        linear: "linear",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    },
    spring: {
        default: { damping: 15, stiffness: 400 },
        gentle: { damping: 20, stiffness: 300 },
        bouncy: { damping: 10, stiffness: 500 },
        stiff: { damping: 30, stiffness: 600 },
    },
} as const;

// =============================================================================
// COMPONENT-SPECIFIC TOKENS
// =============================================================================

export const COMPONENTS = {
    // Header
    header: {
        height: 72,
        backgroundColor: COLORS.white,
        borderWidth: 4,
        borderColor: COLORS.karyaBlack,
        padding: SPACING[4],
    },

    // Back Button
    backButton: {
        size: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        backgroundColor: COLORS.white,
        ...SHADOWS.neobrutalismSm,
    },

    // Step Capsule
    stepCapsule: {
        backgroundColor: COLORS.karyaBlack,
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1.5],
        borderRadius: RADIUS.full,
        textColor: COLORS.white,
        fontSize: TYPOGRAPHY.sizes.xs,
        fontWeight: TYPOGRAPHY.weights.bold,
    },

    // Continue Button
    continueButton: {
        backgroundColor: COLORS.karyaBlack,
        paddingVertical: SPACING[4],
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        textColor: COLORS.white,
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold,
        letterSpacing: TYPOGRAPHY.letterSpacing.widest,
        ...SHADOWS.lg,
    },

    // Input Field
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[4],
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.bold,
        ...SHADOWS.neobrutalism,
    },

    // Card
    card: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        borderRadius: RADIUS.lg,
        padding: SPACING[4],
        ...SHADOWS.neobrutalism,
    },

    // Tag/Chip
    tag: {
        backgroundColor: COLORS.primaryMuted,
        paddingHorizontal: SPACING[3],
        paddingVertical: SPACING[1.5],
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.karyaBlack,
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.bold,
    },

    // Upload Zone
    uploadZone: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: RADIUS.lg,
        borderWidth: 4,
        borderStyle: "dashed" as const,
        borderColor: COLORS.karyaBlack,
        paddingVertical: SPACING[8],
        paddingHorizontal: SPACING[6],
    },

    // File Card
    fileCard: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.karyaBlack,
        padding: SPACING[3],
        ...SHADOWS.neobrutalism,
    },

    // Bottom Container
    bottomContainer: {
        position: "absolute" as const,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: SPACING[6],
        paddingBottom: SPACING[6],
        paddingTop: SPACING[12],
        zIndex: Z_INDEX.overlay,
    },
} as const;

// =============================================================================
// STRIPED BACKGROUND CONFIG
// =============================================================================

export const STRIPED_BACKGROUND = {
    primaryColor: COLORS.primary,
    stripeColor: COLORS.primaryDark,
    stripeHeight: 10,
    stripeSpacing: 20,
    rotation: 45,
    stripeCount: 60,
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Creates a striped background style
 */
export const createStripeStyle = (index: number) => ({
    position: "absolute" as const,
    left: -200,
    width: 1200,
    height: STRIPED_BACKGROUND.stripeHeight,
    backgroundColor: STRIPED_BACKGROUND.stripeColor,
    top: index * STRIPED_BACKGROUND.stripeSpacing - 300,
});

/**
 * Gets a color with opacity
 */
export const withOpacity = (color: string, opacity: number): string => {
    // For hex colors
    if (color.startsWith("#")) {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
};

/**
 * Creates a neobrutalist shadow with custom offset
 */
export const createNeobrutalShadow = (offset: number = 4) => ({
    shadowColor: COLORS.karyaBlack,
    shadowOffset: { width: offset, height: offset },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: offset,
});

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

const theme = {
    colors: COLORS,
    colorsDark: COLORS_DARK,
    typography: TYPOGRAPHY,
    spacing: SPACING,
    radius: RADIUS,
    shadows: SHADOWS,
    borders: BORDERS,
    zIndex: Z_INDEX,
    animation: ANIMATION,
    components: COMPONENTS,
    stripedBackground: STRIPED_BACKGROUND,
    // Helpers
    createStripeStyle,
    withOpacity,
    createNeobrutalShadow,
};

export default theme;
