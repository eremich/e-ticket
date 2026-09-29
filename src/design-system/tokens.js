/**
 * Eticket design tokens — the single source of truth.
 * tailwind.config.js builds the utility classes from this file,
 * and the Storybook Foundations pages render it directly, so docs and code cannot drift.
 * Each token: value per theme + what it is for.
 */

/**
 * Semantic colors. Names stay the same in both themes, so components never branch on light or dark.
 * Base values come from the brief. Where a brief color fails AA as text or under text,
 * a companion token carries the accessible value (`action`, `*-badge`, `on-*`, `*-ink`).
 */
export const color = {
  ink: { light: '#12202E', dark: '#EEF3F8', use: 'Primary text' },
  muted: { light: '#5A6878', dark: '#9AA8B8', use: 'Secondary text, scheduled (not live) times. AA on surface and canvas' },
  canvas: { light: '#F3F7FB', dark: '#0D141B', use: 'App background' },
  surface: { light: '#FFFFFF', dark: '#16202A', use: 'Cards, sheets, grouped lists' },
  raised: { light: '#E9EFF5', dark: '#202C38', use: 'Segmented track, pressed rows, skeletons' },
  line: { light: '#DCE5EE', dark: '#27333F', use: 'Dividers, borders' },

  brand: { light: '#1487D6', dark: '#3AA3EC', use: 'Eticket brand: logo, card, icons, selection. Not for text on white (3.8:1)' },
  action: { light: '#0B6FB8', dark: '#3AA3EC', use: 'Primary buttons, links, active tab. Brand deepened to 5.3:1 in light' },
  'on-action': { light: '#FFFFFF', dark: '#0D141B', use: 'Text and icons on action fills' },
  'action-soft': { light: '#E3F0FA', dark: '#16324A', use: 'Selected chips, brand tint surfaces' },

  metro: { light: '#1E7FD0', dark: '#4AA0E8', use: 'Metro: icons, map strokes, markers' },
  tram: { light: '#E0483F', dark: '#F0716A', use: 'Tram: icons, map strokes, markers' },
  trolleybus: { light: '#1F9D4C', dark: '#46C274', use: 'Trolleybus: icons, map strokes, markers' },
  bus: { light: '#E8A300', dark: '#F2BE3C', use: 'Bus: icons, map strokes, markers. Always with a dark icon or number on top' },
  'metro-badge': { light: '#1A6FB5', dark: '#4AA0E8', use: 'Metro line number badge fill' },
  'tram-badge': { light: '#C0342E', dark: '#F0716A', use: 'Tram number badge fill' },
  'trolleybus-badge': { light: '#15803D', dark: '#46C274', use: 'Trolleybus number badge fill' },
  'bus-badge': { light: '#E8A300', dark: '#F2BE3C', use: 'Bus number badge fill' },
  'on-transport': { light: '#FFFFFF', dark: '#0D141B', use: 'Numbers on metro, tram and trolleybus badges' },
  'on-bus': { light: '#12202E', dark: '#0D141B', use: 'Numbers on bus badges (yellow needs dark text in both themes)' },

  m1: { light: '#C8322B', dark: '#F0716A', use: 'Metro line 1 Kholodnohirsko-Zavodska (red). Always with "1"' },
  m2: { light: '#1565B8', dark: '#4AA0E8', use: 'Metro line 2 Saltivska (blue). Always with "2"' },
  m3: { light: '#178041', dark: '#46C274', use: 'Metro line 3 Oleksiivska (green). Always with "3"' },

  ok: { light: '#1F8A4C', dark: '#3CC37A', use: 'Success: icons, fills' },
  'ok-ink': { light: '#177A43', dark: '#3CC37A', use: 'Success text. Light ok is 4.4:1, just under AA' },
  warn: { light: '#B97800', dark: '#E7A33A', use: 'Low balance, delays: icons, fills' },
  'warn-ink': { light: '#8A6200', dark: '#E7A33A', use: 'Warning text. Light warn is 3.7:1' },
  error: { light: '#C8363B', dark: '#EF6A6E', use: 'Declined, errors: text, icons' },

  'map-land': { light: '#E8EEF4', dark: '#111A22', use: 'City map: ground' },
  'map-block': { light: '#DBE3EB', dark: '#18232E', use: 'City map: building blocks' },
  'map-road': { light: '#FFFFFF', dark: '#253241', use: 'City map: streets' },
  'map-park': { light: '#D3E7D5', dark: '#15291F', use: 'City map: parks' },
  'map-water': { light: '#C5DCF0', dark: '#0F2B40', use: 'City map: river' },

  scrim: { light: '#0D141B', dark: '#000000', use: 'Backdrop behind sheets (used at 40%)' },
  desk: { light: '#E2E9F0', dark: '#080C10', use: 'Desktop background around the phone frame. Not part of the app' },
};

/** Physical phone bezel in the desktop frame. Same in both themes */
export const bezel = '#0D141B';

/** The Eticket card is a physical object; its face keeps the brand in both themes */
export const card = {
  face: { from: '#1487D6', to: '#0B5E9E', use: 'Main card gradient' },
  virtual: { from: '#223447', to: '#0F1B27', use: 'Virtual card: same shape, graphite face' },
  text: '#FFFFFF',
};

export const themes = ['light', 'dark'];

export const font = {
  family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Roboto Variable", Roboto, sans-serif',
  weights: { normal: 400, semibold: 600, bold: 700 },
};

/** iOS text styles. Sizes and line heights are Apple's defaults, weights ours */
export const type = {
  'large-title': { size: 34, line: 41, weight: 700, tracking: '0.01em', use: 'Tab root titles, collapse on scroll' },
  title2: { size: 22, line: 28, weight: 700, tracking: '0', use: 'Sheet and section titles' },
  headline: { size: 17, line: 22, weight: 600, tracking: '-0.01em', use: 'Row titles, buttons' },
  body: { size: 17, line: 22, weight: 400, tracking: '-0.01em', use: 'Body text' },
  subheadline: { size: 15, line: 20, weight: 400, tracking: '-0.005em', use: 'Secondary lines, list subtitles' },
  footnote: { size: 13, line: 18, weight: 400, tracking: '0', use: 'Meta, section headers in grouped lists' },
  caption: { size: 12, line: 16, weight: 600, tracking: '0', use: 'Badges, tab labels' },
  tab: { size: 11, line: 13, weight: 600, tracking: '0', use: 'Tab bar labels (iOS uses 10; 11 for legibility)' },
  balance: { size: 40, line: 44, weight: 700, tracking: '-0.02em', use: 'Balance on the card' },
  arrival: { size: 17, line: 22, weight: 700, tracking: '0', use: 'Minutes in arrival chips' },
};

/** Radius by hierarchy */
export const radius = {
  sheet: { value: 14, use: 'Bottom sheets (top corners)' },
  eticket: { value: 18, use: 'The Eticket card' },
  group: { value: 12, use: 'Inset grouped lists, cards' },
  control: { value: 12, use: 'Buttons, inputs' },
  inner: { value: 8, use: 'Segment thumb, small tiles' },
  badge: { value: 6, use: 'Line number badges' },
  chip: { value: 999, use: 'Chips, arrival pills' },
};

/** 4 pt grid. Screen padding 16. Touch targets at least 44 */
export const space = {
  grid: 4,
  screen: 16,
  touch: 44,
  steps: [4, 8, 12, 16, 20, 24, 32, 40, 48],
};

/** Elevation is rare: sheets, toasts and the physical card. Lists and cards sit flat on canvas */
export const elevation = {
  sheet: { value: '0 -8px 32px rgba(13, 20, 27, 0.16)', use: 'Bottom sheets' },
  toast: { value: '0 8px 24px rgba(13, 20, 27, 0.24)', use: 'Toasts' },
  object: { value: '0 12px 28px -8px rgba(11, 94, 158, 0.45)', use: 'The Eticket card only' },
};

export const motion = {
  'ease-out': { value: 'cubic-bezier(0.23, 1, 0.32, 1)', use: 'Entrances, press feedback' },
  'ease-drawer': { value: 'cubic-bezier(0.32, 0.72, 0, 1)', use: 'Sheets and detent changes' },
  press: { value: '160ms', use: 'Scale to 0.97 on press' },
  sheet: { value: '320ms in / 200ms out', use: 'Sheet slide' },
  toast: { value: '240ms', use: 'Toast rise and fade' },
  skeleton: { value: '600ms', use: 'Simulated loading before live data appears' },
};

/** Transport code: color never alone, always icon + number */
export const transport = {
  metro: { label: 'Metro', icon: 'Subway' },
  tram: { label: 'Tram', icon: 'Tram' },
  trolleybus: { label: 'Trolleybus', icon: 'Trolleybus (custom)' },
  bus: { label: 'Bus', icon: 'Bus' },
};
