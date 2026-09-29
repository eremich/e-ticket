import { create } from 'storybook/theming/create';
import { color, font } from '../src/design-system/tokens.js';

// The Storybook UI itself is themed from the same token file as the app.
export const eticketTheme = create({
  base: 'light',
  brandTitle: 'Eticket · Design system',
  brandUrl: './',
  brandTarget: '_self',

  colorPrimary: color.action.light,
  colorSecondary: color.action.light,

  appBg: color.canvas.light,
  appContentBg: color.surface.light,
  appPreviewBg: color.surface.light,
  appBorderColor: color.line.light,
  appBorderRadius: 12,

  textColor: color.ink.light,
  textMutedColor: color.muted.light,
  barTextColor: color.muted.light,
  barSelectedColor: color.action.light,
  barBg: color.surface.light,

  inputBg: color.surface.light,
  inputBorder: color.line.light,
  inputTextColor: color.ink.light,
  inputBorderRadius: 12,

  fontBase: font.family,
  fontCode: 'ui-monospace, Consolas, monospace',
});
