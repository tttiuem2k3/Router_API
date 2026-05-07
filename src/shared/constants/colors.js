// Professional blue/slate palette for Endpoint Proxy
// Light theme: Clean slate tones
// Dark theme: Deep navy/slate tones

export const COLORS = {
  // Primary - Professional blue
  primary: {
    DEFAULT: "#2563EB",
    hover: "#1D4ED8",
    light: "#60A5FA",
    dark: "#1E40AF",
  },

  // Light theme backgrounds
  light: {
    bg: "#F8FAFC",
    bgAlt: "#F1F5F9",
    surface: "#FFFFFF",
    sidebar: "rgba(241, 245, 249, 0.85)",
    border: "rgba(148, 163, 184, 0.35)",
    textMain: "#0F172A",
    textMuted: "#475569",
  },

  // Dark theme backgrounds
  dark: {
    bg: "#0B1220",
    bgAlt: "#111827",
    surface: "#1F2937",
    sidebar: "rgba(15, 23, 42, 0.85)",
    border: "rgba(148, 163, 184, 0.28)",
    textMain: "#E2E8F0",
    textMuted: "#94A3B8",
  },

  // Status colors
  status: {
    success: "#16A34A",
    successLight: "#DCFCE7",
    successDark: "#166534",
    warning: "#D97706",
    warningLight: "#FEF3C7",
    warningDark: "#92400E",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    errorDark: "#991B1B",
    info: "#0284C7",
    infoLight: "#E0F2FE",
    infoDark: "#075985",
  },
};

// CSS Variables mapping for Tailwind
export const CSS_VARIABLES = {
  light: {
    "--color-primary": COLORS.primary.DEFAULT,
    "--color-primary-hover": COLORS.primary.hover,
    "--color-bg": COLORS.light.bg,
    "--color-bg-alt": COLORS.light.bgAlt,
    "--color-surface": COLORS.light.surface,
    "--color-sidebar": COLORS.light.sidebar,
    "--color-border": COLORS.light.border,
    "--color-text-main": COLORS.light.textMain,
    "--color-text-muted": COLORS.light.textMuted,
  },
  dark: {
    "--color-primary": COLORS.primary.DEFAULT,
    "--color-primary-hover": COLORS.primary.hover,
    "--color-bg": COLORS.dark.bg,
    "--color-bg-alt": COLORS.dark.bgAlt,
    "--color-surface": COLORS.dark.surface,
    "--color-sidebar": COLORS.dark.sidebar,
    "--color-border": COLORS.dark.border,
    "--color-text-main": COLORS.dark.textMain,
    "--color-text-muted": COLORS.dark.textMuted,
  },
};
