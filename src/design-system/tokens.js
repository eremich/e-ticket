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
 * Dark neutrals are true black and graphite (iOS system colors), not the brief's blue-grey: the user found it too blue.
 * Dark status and transport colors are the vivid iOS dark system colors (green #30D158, red #FF453A, yellow #FFD60A, blue #0A84FF).
 */
export const color = {
  ink: { light: '#121212', dark: '#F2F2F4', use: 'Primary text' },
  muted: { light: '#6B6B6B', dark: '#9D9DA4', use: 'Secondary text, scheduled (not live) times. AA on surface and canvas' },
  canvas: { light: '#F5F5F5', dark: '#000000', use: 'App background. Dark: true black, like iOS' },
  surface: { light: '#FFFFFF', dark: '#1C1C1E', use: 'Cards, sheets, grouped lists' },
  raised: { light: '#EBEBEB', dark: '#2C2C2E', use: 'Segmented track, pressed rows, skeletons' },
  line: { light: '#E3E3E3', dark: '#38383A', use: 'Dividers, borders' },

  brand: { light: '#006AFF', dark: '#1A6BFF', use: 'Eticket brand: the card face and brand marks' },
  action: { light: '#0062EB', dark: '#5A96FF', use: 'Blue text, links, icons and focus rings. AA on surface and canvas' },
  accent: { light: '#0062EB', dark: '#1A6BFF', use: 'The one accent fill: primary button, selected chip, active tab. White text on it' },
  'on-accent': { light: '#FFFFFF', dark: '#FFFFFF', use: 'Text and icons on accent fills' },
  'on-status': { light: '#FFFFFF', dark: '#000000', use: 'Icons on ok, warn and error fills' },
  'action-soft': { light: '#E6F0FF', dark: '#0E2440', use: 'Rare brand tint: the current step of a live trip' },

  metro: { light: '#1E7FD0', dark: '#0A84FF', use: 'Metro: icons, map strokes, markers' },
  tram: { light: '#E0483F', dark: '#FF453A', use: 'Tram: icons, map strokes, markers' },
  trolleybus: { light: '#1F9D4C', dark: '#30D158', use: 'Trolleybus: icons, map strokes, markers' },
  bus: { light: '#E8A300', dark: '#FFD60A', use: 'Bus: icons, map strokes, markers. Always with a dark icon or number on top' },
  'metro-badge': { light: '#1A6FB5', dark: '#409CFF', use: 'Metro line number badge fill' },
  'tram-badge': { light: '#C0342E', dark: '#FF6961', use: 'Tram number badge fill' },
  'trolleybus-badge': { light: '#15803D', dark: '#30D158', use: 'Trolleybus number badge fill' },
  'bus-badge': { light: '#E8A300', dark: '#FFD60A', use: 'Bus number badge fill' },
  'metro-ink': { light: '#135C9E', dark: '#64B5FF', use: 'Metro number and icon on its light tint. AA inside gray chips too' },
  'tram-ink': { light: '#A82C26', dark: '#FF7B73', use: 'Tram number and icon on its light tint' },
  'trolleybus-ink': { light: '#116A33', dark: '#30D158', use: 'Trolleybus number and icon on its light tint' },
  'bus-ink': { light: '#7A5700', dark: '#FFD60A', use: 'Bus number and icon on its light tint (yellow text fails on white)' },
  'm1-ink': { light: '#A5271F', dark: '#FF7B73', use: 'Line 1 text on its tint' },
  'm2-ink': { light: '#11549A', dark: '#64B5FF', use: 'Line 2 text on its tint' },
  'm3-ink': { light: '#116A35', dark: '#30D158', use: 'Line 3 text on its tint' },
  'on-transport': { light: '#FFFFFF', dark: '#000000', use: 'Numbers on metro, tram and trolleybus badges' },
  'on-bus': { light: '#12202E', dark: '#000000', use: 'Numbers on bus badges (yellow needs dark text in both themes)' },

  m1: { light: '#C8322B', dark: '#FF453A', use: 'Metro line 1 Kholodnohirsko-Zavodska (red). Always with "1"' },
  m2: { light: '#1565B8', dark: '#0A84FF', use: 'Metro line 2 Saltivska (blue). Always with "2"' },
  m3: { light: '#178041', dark: '#30D158', use: 'Metro line 3 Oleksiivska (green). Always with "3"' },

  ok: { light: '#1F8A4C', dark: '#30D158', use: 'Success: icons, fills' },
  'ok-ink': { light: '#177A43', dark: '#30D158', use: 'Success text. Light ok is 4.4:1, just under AA' },
  warn: { light: '#B97800', dark: '#FFD60A', use: 'Low balance, delays: icons, fills' },
  'warn-ink': { light: '#8A6200', dark: '#FFD60A', use: 'Warning text. Light warn is 3.7:1' },
  error: { light: '#C8363B', dark: '#FF453A', use: 'Declined, errors: text, icons' },

  'map-land': { light: '#E8EEF4', dark: '#121214', use: 'City map: ground' },
  'map-block': { light: '#DBE3EB', dark: '#1D1D20', use: 'City map: building blocks' },
  'map-road': { light: '#FFFFFF', dark: '#2E2E32', use: 'City map: streets' },
  'map-park': { light: '#D3E7D5', dark: '#14241A', use: 'City map: parks' },
  'map-water': { light: '#C5DCF0', dark: '#0C2233', use: 'City map: river' },

  scrim: { light: '#0D141B', dark: '#000000', use: 'Backdrop behind sheets (used at 40%)' },
  desk: { light: '#E4E4E4', dark: '#0A0A0B', use: 'Desktop background around the phone frame. Not part of the app' },
};

/** Physical phone bezel in the desktop frame. Same in both themes */
export const bezel = '#0D141B';

/** The Eticket card is a physical object; its face keeps the brand in both themes */
export const card = {
  face: { from: '#006AFF', to: '#006AFF', use: 'Main card: flat brand blue, no gradient' },
  virtual: { from: '#2E2E33', to: '#141416', use: 'Virtual card: same shape, graphite face' },
  text: '#FFFFFF',
};

export const themes = ['light', 'dark'];

export const font = {
  family: '"Onest Variable", -apple-system, BlinkMacSystemFont, sans-serif',
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
  sheet: { value: 28, use: 'Bottom sheets (top corners)' },
  eticket: { value: 24, use: 'The Eticket card' },
  group: { value: 22, use: 'Cards and grouped lists: soft, generous corners' },
  control: { value: 16, use: 'Inputs and multi-line fields. Buttons are pills (chip)' },
  inner: { value: 12, use: 'Segment thumb, small tiles' },
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
  floating: { value: '0 10px 30px rgba(0, 0, 0, 0.14), 0 1px 3px rgba(0, 0, 0, 0.08)', use: 'Floating glass tab bar' },
  object: { value: '0 10px 24px -14px rgba(0, 0, 0, 0.35)', use: 'The Eticket card only: a soft neutral lift, no colored glow' },
};

/**
 * Materials. Glass is reserved for system-level floating chrome (the tab bar), like iOS 26 Liquid Glass.
 * Never on cards or content.
 */
export const material = {
  glass: {
    blur: 24,
    saturate: 180,
    light: { alpha: 0.72, edge: 'rgba(255, 255, 255, 0.65)' },
    dark: { alpha: 0.62, edge: 'rgba(255, 255, 255, 0.09)' },
    use: 'Floating tab bar only: surface at partial opacity, backdrop blur and saturation, light inner edge',
  },
};

export const motion = {
  'ease-out': { value: 'cubic-bezier(0.23, 1, 0.32, 1)', use: 'Entrances, press feedback' },
  'ease-drawer': { value: 'cubic-bezier(0.32, 0.72, 0, 1)', use: 'Sheets and detent changes' },
  press: { value: '160ms', use: 'Scale to 0.97 on press' },
  sheet: { value: '320ms in / 200ms out', use: 'Sheet slide' },
  toast: { value: '240ms', use: 'Toast rise and fade' },
  skeleton: { value: '600ms', use: 'Simulated loading before live data appears' },
  'tab-indicator': { value: '260ms ease-out', use: 'Selected tab capsule slides to the new tab' },
};

/** Transport code: color never alone, always icon + number */
export const transport = {
  metro: { label: 'Metro', icon: 'Subway' },
  tram: { label: 'Tram', icon: 'Tram' },
  trolleybus: { label: 'Trolleybus', icon: 'Trolleybus (custom)' },
  bus: { label: 'Bus', icon: 'Bus' },
};
