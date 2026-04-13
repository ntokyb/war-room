// Design tokens — single source of truth for colors, sizes, and shared styles

import type { CSSProperties } from "react";

export const colors = {
  primary: "#00ff88",
  error: "#ff5e7a",
  warn: "#ff9f00",
  info: "#00cfff",
  purple: "#bf7fff",
  yellow: "#ffe066",

  text: "#e0e0f0",
  textMuted: "#ccc",
  textDim: "#aaa",
  textFaint: "#888",
  textGhost: "#555",
  textDark: "#444",
  textDarker: "#333",

  bg: "#080810",
  bgCard: "#111118",
  bgDark: "#0d0d16",
  border: "#1e1e30",
  borderLight: "#2a2a3e",
};

export const sizes = {
  fontXs: "10px",
  fontSm: "11px",
  fontBase: "12px",
  fontMd: "13px",
  fontLg: "14px",
  fontXl: "18px",
  fontTitle: "20px",
  fontHero: "28px",

  radiusSm: "4px",
  radiusMd: "6px",
  radiusLg: "8px",
  radiusXl: "10px",

  spacingXs: "6px",
  spacingSm: "8px",
  spacingMd: "12px",
  spacingLg: "16px",
  spacingXl: "20px",
  spacing2xl: "24px",
  spacing3xl: "32px",
};

// Shared inline-style patterns
export const styles: Record<string, CSSProperties> = {
  label: {
    fontSize: sizes.fontSm,
    color: colors.textDark,
    letterSpacing: "2px",
  },
  labelSm: {
    fontSize: sizes.fontXs,
    color: colors.textGhost,
    letterSpacing: "2px",
  },
  cardBox: {
    background: colors.bgCard,
    border: `1px solid ${colors.border}`,
    borderRadius: sizes.radiusXl,
    padding: sizes.spacingXl,
  },
  mainLayout: {
    maxWidth: "820px",
    margin: "0 auto",
    padding: `${sizes.spacing3xl} ${sizes.spacingXl}`,
  },
  narrowLayout: {
    maxWidth: "620px",
    margin: "0 auto",
    padding: `${sizes.spacing3xl} ${sizes.spacingXl}`,
  },
  timerDisplay: {
    color: colors.info,
    fontSize: sizes.fontXl,
    fontVariantNumeric: "tabular-nums",
  },
  seniorBox: {
    background: "#0d1200",
    border: `1px solid ${colors.primary}30`,
    borderRadius: sizes.radiusXl,
    padding: "18px",
  },
};

// Reusable style functions
export function pillStyle(
  active: boolean,
  color: string = colors.primary,
): CSSProperties {
  return {
    background: active ? `${color}18` : colors.bgDark,
    border: `1px solid ${active ? color : colors.border}`,
    color: active ? color : colors.textGhost,
    borderRadius: sizes.radiusMd,
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: sizes.fontBase,
    fontWeight: active ? 700 : 400,
    fontFamily: "inherit",
    letterSpacing: "1px",
  };
}

export function filterBtnStyle(active: boolean, color: string): CSSProperties {
  return {
    background: active ? `${color}18` : colors.bgCard,
    border: `1px solid ${active ? color : colors.border}`,
    borderRadius: sizes.radiusMd,
    padding: "6px 12px",
    cursor: "pointer",
    color: active ? color : colors.textGhost,
    fontSize: sizes.fontSm,
    fontWeight: 600,
  };
}

export function actionBtnStyle(color: string): CSSProperties {
  return {
    background: `${color}18`,
    border: `1px solid ${color}`,
    color,
    borderRadius: "7px",
    padding: "11px 22px",
    fontSize: sizes.fontMd,
    fontWeight: 700,
    cursor: "pointer",
  };
}

export function primaryBtnStyle(color: string = colors.primary): CSSProperties {
  return {
    background: color,
    color: colors.bg,
    border: "none",
    borderRadius: sizes.radiusLg,
    padding: "13px 32px",
    fontSize: sizes.fontMd,
    fontWeight: 700,
    letterSpacing: "2px",
    cursor: "pointer",
  };
}

export function ghostBtnStyle(): CSSProperties {
  return {
    background: colors.bgDark,
    color: colors.textFaint,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: sizes.radiusLg,
    padding: "13px 24px",
    fontSize: sizes.fontMd,
    fontWeight: 700,
    letterSpacing: "2px",
    cursor: "pointer",
  };
}

export function backBtnStyle(): CSSProperties {
  return {
    background: "transparent",
    border: `1px solid ${colors.borderLight}`,
    color: "#666",
    borderRadius: sizes.radiusMd,
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: sizes.fontSm,
    letterSpacing: "2px",
    marginBottom: sizes.spacingXl,
  };
}

export function tagStyle(color: string): CSSProperties {
  return {
    fontSize: sizes.fontXs,
    padding: "3px 8px",
    borderRadius: sizes.radiusSm,
    background: `${color}15`,
    color,
    fontWeight: 600,
  };
}
