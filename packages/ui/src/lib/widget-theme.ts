const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{6})$/;

export const DEFAULT_WIDGET_ACCENT_COLOR = "#3B82F6";

const clampChannel = (value: number) => {
  return Math.max(0, Math.min(255, Math.round(value)));
};

const hexToRgb = (color: string) => {
  const normalized = color.slice(1);

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
};

const mixHex = (baseColor: string, mixColor: string, weight: number) => {
  const base = hexToRgb(baseColor);
  const mix = hexToRgb(mixColor);

  return rgbToHex(
    base.r + (mix.r - base.r) * weight,
    base.g + (mix.g - base.g) * weight,
    base.b + (mix.b - base.b) * weight,
  );
};

const getContrastColor = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  const luminance = (r * 299 + g * 587 + b * 114) / 1000;

  return luminance > 160 ? "#111827" : "#FFFFFF";
};

export const normalizeWidgetAccentColor = (color?: string | null) => {
  if (!color) {
    return DEFAULT_WIDGET_ACCENT_COLOR;
  }

  const normalized = color.trim().toUpperCase();

  return HEX_COLOR_PATTERN.test(normalized)
    ? normalized
    : DEFAULT_WIDGET_ACCENT_COLOR;
};

export const getWidgetAccentShadow = (color?: string | null) => {
  const normalized = normalizeWidgetAccentColor(color);
  const { r, g, b } = hexToRgb(normalized);

  return `rgba(${r}, ${g}, ${b}, 0.35)`;
};

export const getAccentThemeStyle = (color?: string | null) => {
  const normalized = normalizeWidgetAccentColor(color);
  const contrastColor = getContrastColor(normalized);
  const lightAccent = mixHex(normalized, "#FFFFFF", 0.88);
  const darkAccent = mixHex(normalized, "#111827", 0.72);

  return {
    "--primary": normalized,
    "--primary-foreground": contrastColor,
    "--ring": normalized,
    "--accent": lightAccent,
    "--accent-foreground": getContrastColor(lightAccent),
    "--sidebar-primary": normalized,
    "--sidebar-primary-foreground": contrastColor,
    "--sidebar-accent": lightAccent,
    "--sidebar-accent-foreground": getContrastColor(lightAccent),
    "--widget-accent-light": lightAccent,
    "--widget-accent-light-foreground": getContrastColor(lightAccent),
    "--widget-accent-dark": darkAccent,
    "--widget-accent-dark-foreground": getContrastColor(darkAccent),
  } as const;
};

export const getWidgetThemeStyle = (color?: string | null) => {
  return getAccentThemeStyle(color);
};

export const WIDGET_ACCENT_COLOR_PATTERN = HEX_COLOR_PATTERN;
