// Tokyo Night color constants for SVG fill/stroke attributes.
// These match the CSS custom properties in global.css.

export const colors = {
  // Backgrounds
  bgPrimary: '#1a1b26',
  bgSecondary: '#16161e',
  bgTertiary: '#24283b',

  // Foregrounds
  fgPrimary: '#c0caf5',
  fgSecondary: '#a9b1d6',
  fgMuted: '#565f89',

  // Accents
  accentBlue: '#7aa2f7',
  accentCyan: '#7dcfff',
  accentGreen: '#9ece6a',
  accentYellow: '#e0af68',
  accentOrange: '#ff9e64',
  accentRed: '#f7768e',
  accentPurple: '#bb9af7',
  accentMagenta: '#c0a7e0',

  // Borders
  border: '#292e42',
  hover: '#2f3549',

  // Semantic aliases for interactive components
  truthTrue: '#9ece6a',
  truthFalse: '#f7768e',
  signalActive: '#9ece6a',
  signalInactive: '#565f89',
  highlight: '#7aa2f7',
} as const;

export type ColorKey = keyof typeof colors;
