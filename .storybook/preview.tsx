import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/index.css';
import './docs.css';
import { eticketTheme } from './theme';
import { useLang, type Lang } from '../src/i18n';

// Docs pages are always light (Storybook's docs theme), so the preview must not follow the OS dark mode.
if (!document.documentElement.dataset.theme) document.documentElement.dataset.theme = 'light';

type ThemeGlobal = 'light' | 'dark' | 'both';

/**
 * Same switch as the app: data-theme flips the token variables.
 * Docs pages stay light and only the examples go dark.
 * "both" renders the story twice, light and dark side by side.
 */
const withTheme: Decorator = (Story, ctx) => {
  const theme = (ctx.globals.theme as ThemeGlobal) ?? 'light';
  const fullscreen = ctx.parameters.layout === 'fullscreen';
  const docs = ctx.viewMode === 'docs';
  document.documentElement.dataset.theme = !docs && theme === 'dark' ? 'dark' : 'light';
  const frame = (t: 'light' | 'dark') => (
    <div data-theme={t} className={`relative bg-canvas font-sans text-ink ${fullscreen ? '' : 'rounded-group p-6'}`}>
      <Story />
    </div>
  );
  if (docs && theme === 'dark') return frame('dark');
  if (theme !== 'both' || fullscreen) return <div className="font-sans text-ink"><Story /></div>;
  return (
    <div className="flex flex-wrap items-start gap-4">
      {frame('light')}
      {frame('dark')}
    </div>
  );
};

/** English / Ukrainian: components that format money and time read the language store */
const withLang: Decorator = (Story, ctx) => {
  const lang = (ctx.globals.lang as Lang) ?? 'en';
  if (useLang.getState().lang !== lang) useLang.getState().setLang(lang);
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'both', title: 'Both side by side', icon: 'sidebyside' },
        ],
      },
    },
    lang: {
      description: 'Language',
      toolbar: {
        title: 'Language',
        icon: 'globe',
        dynamicTitle: true,
        items: [
          { value: 'en', title: 'English' },
          { value: 'uk', title: 'Українська' },
        ],
      },
    },
  },
  initialGlobals: { theme: 'light', lang: 'en' },
  decorators: [
    (Story) => (
      <>
        <Story />
        {/* Sheets portal here, like in the app's phone frame */}
        <div id="sheet-root" className="pointer-events-none fixed inset-0 z-sheet" />
      </>
    ),
    withTheme,
    withLang,
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { disabled: true },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i }, sort: 'requiredFirst' },
    docs: { theme: eticketTheme, toc: { headingSelector: 'h2, h3', title: 'On this page' } },
    options: {
      storySort: {
        order: ['Introduction', 'Guidelines', 'Foundations', 'Components', 'Patterns'],
        method: 'alphabetical',
      },
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
