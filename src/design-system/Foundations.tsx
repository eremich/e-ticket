import type { ReactNode } from 'react';
import { color, elevation, motion, radius, space, type } from './tokens.js';
import { LineBadge, TransportTile } from '../components/LineBadge';
import { TRANSPORTS } from '../lib/icons';
import { clock, money } from '../lib/format';

/** Foundations pages render tokens.js directly — values are never copied into docs. */

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const lum = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const Page = ({ title, lead, children }: { title: string; lead: string; children: ReactNode }) => (
  <div className="min-h-screen bg-surface p-8 font-sans text-ink">
    <h1 className="text-large-title">{title}</h1>
    <p className="mt-1 max-w-2xl text-body text-muted">{lead}</p>
    <div className="mt-8">{children}</div>
  </div>
);

const Grade = ({ ratio }: { ratio: number }) => {
  const pass = ratio >= 4.5 ? 'AA text' : ratio >= 3 ? 'Large text / UI' : 'Decorative';
  const tone = ratio >= 4.5 ? 'bg-ok/10 text-ok-ink' : ratio >= 3 ? 'bg-warn/15 text-warn-ink' : 'bg-raised text-muted';
  return (
    <span className={`tnum inline-flex rounded-chip px-2 py-0.5 text-caption ${tone}`}>
      {ratio.toFixed(2)}:1 · {pass}
    </span>
  );
};

type Theme = 'light' | 'dark';
type ColorName = keyof typeof color;

/** Fills are checked against the text that sits on them; everything else against surface and canvas */
const PAIRS: Partial<Record<ColorName, ColorName>> = {
  action: 'on-action',
  'metro-badge': 'on-transport',
  'tram-badge': 'on-transport',
  'trolleybus-badge': 'on-transport',
  'bus-badge': 'on-bus',
  m1: 'on-transport',
  m2: 'on-transport',
  m3: 'on-transport',
};

const Swatch = ({ name, hex, theme }: { name: ColorName; hex: string; theme: Theme }) => {
  const on = PAIRS[name];
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className="flex h-10 w-16 shrink-0 items-center justify-center rounded-inner border border-line text-subheadline font-bold"
          style={{ background: hex, color: on ? color[on][theme] : undefined }}
        >
          {on ? '27' : ''}
        </div>
        <code className="text-footnote text-muted">{hex}</code>
      </div>
      {on ? (
        <span className="text-footnote text-muted">
          {on} <Grade ratio={contrast(hex, color[on][theme])} />
        </span>
      ) : (
        <>
          <span className="text-footnote text-muted">
            surface <Grade ratio={contrast(hex, color.surface[theme])} />
          </span>
          <span className="text-footnote text-muted">
            canvas <Grade ratio={contrast(hex, color.canvas[theme])} />
          </span>
        </>
      )}
    </div>
  );
};

export const ColorsPage = () => (
  <Page
    title="Colors"
    lead="One set of names, two themes. Components use the names; the values flip with the theme. Contrast is computed live: fills against the text on them, everything else against surface and canvas."
  >
    <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 border-b border-line pb-2 text-footnote font-semibold text-muted">
      <span>Token</span>
      <span className="w-60">Light</span>
      <span className="w-60">Dark</span>
    </div>
    <div className="divide-y divide-line">
      {(Object.entries(color) as [ColorName, (typeof color)[ColorName]][]).map(([name, t]) => (
        <div key={name} className="grid grid-cols-[1fr_auto_auto] items-start gap-x-8 py-4">
          <div>
            <div className="text-headline">{name}</div>
            <div className="max-w-sm text-subheadline text-muted">{t.use}</div>
          </div>
          <div className="w-60">
            <Swatch name={name} hex={t.light} theme="light" />
          </div>
          <div className="w-60">
            <Swatch name={name} hex={t.dark} theme="dark" />
          </div>
        </div>
      ))}
    </div>
  </Page>
);

export const TransportPage = () => (
  <Page
    title="Transport code"
    lead="The strongest asset of the original app, kept. Color never works alone: every badge carries the transport icon (or the metro M) and the route number, so it reads in grayscale and for color-blind riders."
  >
    {(['light', 'dark'] as const).map((theme) => (
      <div key={theme} data-theme={theme} className="mb-4 flex flex-col gap-4 rounded-group bg-canvas p-6 text-ink">
        <p className="text-footnote font-semibold uppercase text-muted">{theme}</p>
        <div className="flex flex-wrap items-center gap-3">
          {TRANSPORTS.map((t) => (
            <TransportTile key={t} transport={t} />
          ))}
          <LineBadge transport="tram" number="27" />
          <LineBadge transport="tram" number="16A" />
          <LineBadge transport="trolleybus" number="35" />
          <LineBadge transport="bus" number="115" />
          <LineBadge transport="tram" number="27" size="sm" />
          <LineBadge transport="bus" number="115" size="sm" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LineBadge transport="metro" number={1} />
          <LineBadge transport="metro" number={2} />
          <LineBadge transport="metro" number={3} />
          <span className="text-subheadline text-muted">1 Kholodnohirsko-Zavodska · 2 Saltivska · 3 Oleksiivska</span>
        </div>
      </div>
    ))}
    <ul className="mt-6 max-w-2xl list-disc pl-5 text-body text-ink">
      <li>Brief colors (metro, tram, trolleybus, bus) are for strokes, map markers and icons.</li>
      <li>Badges use the *-badge fill with on-transport or on-bus text, AA in both themes.</li>
      <li>Status colors (ok, warn, error) never stand in for a transport, and transport colors never mean a status.</li>
    </ul>
  </Page>
);

export const TypePage = () => (
  <Page title="Typography" lead="SF Pro on Apple devices, Roboto elsewhere (Cyrillic included). iOS text styles. Tabular numerals for every time, balance and fare.">
    <div className="divide-y divide-line">
      {Object.entries(type).map(([name, t]) => (
        <div key={name} className="grid grid-cols-[180px_1fr] items-baseline gap-6 py-5">
          <div>
            <div className="text-headline">{name}</div>
            <div className="tnum text-footnote text-muted">
              {t.size}/{t.line} · {t.weight}
            </div>
            <div className="text-footnote text-muted">{t.use}</div>
          </div>
          <div className="flex flex-col gap-1" style={{ fontSize: t.size, lineHeight: `${t.line}px`, letterSpacing: t.tracking, fontWeight: t.weight }}>
            <span>
              Tram 27 · <span className="tnum">3 min</span>
            </span>
            <span>
              Трамвай 27 · <span className="tnum">3 хв</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  </Page>
);

const FORMAT_ROWS = [
  ['Fare', money('en', 8), money('uk', 8)],
  ['Charge', money('en', -8, true), money('uk', -8, true)],
  ['Balance', money('en', 98), money('uk', 98)],
  ['Time', clock(494), clock(494)],
  ['Arriving', '3 min', '3 хв'],
  ['Arriving now', 'Now', 'Зараз'],
  ['No live data', `Scheduled ${clock(500)}`, `За розкладом ${clock(500)}`],
  ['Walking', '4 min walk · 280 m', '4 хв пішки · 280 м'],
];

export const FormatsPage = () => (
  <Page title="Formats" lead="Money and arrivals come first. Currency and dates follow the locale; time is always 24-hour.">
    <table className="w-full max-w-3xl text-left text-body">
      <thead>
        <tr className="border-b border-line text-footnote text-muted">
          <th className="py-2">What</th>
          <th>English</th>
          <th>Українська</th>
        </tr>
      </thead>
      <tbody className="tnum">
        {FORMAT_ROWS.map(([what, a, b]) => (
          <tr key={what} className="border-b border-line">
            <td className="py-3 text-muted">{what}</td>
            <td>{a}</td>
            <td>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Page>
);

export const ShapePage = () => (
  <Page title="Shape, space and elevation" lead="Radius follows hierarchy. 4 pt grid, 16 pt screen padding, 44 pt touch targets. Elevation only on sheets, toasts and the physical card.">
    <h2 className="mb-3 text-title2">Radius</h2>
    <div className="flex flex-wrap gap-4">
      {Object.entries(radius).map(([name, t]) => (
        <div key={name} className="w-40">
          <div className="h-24 border-2 border-action bg-action-soft" style={{ borderRadius: Math.min(t.value, 48) }} />
          <div className="mt-2 text-headline">
            {name} <span className="tnum font-normal text-muted">{t.value}</span>
          </div>
          <div className="text-footnote text-muted">{t.use}</div>
        </div>
      ))}
    </div>
    <h2 className="mb-3 mt-10 text-title2">Spacing (4 pt grid)</h2>
    <div className="flex items-end gap-3">
      {space.steps.map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <div className="bg-action" style={{ width: s, height: s }} />
          <span className="tnum text-footnote text-muted">{s}</span>
        </div>
      ))}
    </div>
    <p className="mt-3 text-body text-muted">
      Screen padding {space.screen}. Touch targets at least {space.touch} × {space.touch}.
    </p>
    <h2 className="mb-3 mt-10 text-title2">Elevation</h2>
    <div className="flex flex-wrap gap-6 bg-canvas p-6">
      {Object.entries(elevation).map(([name, t]) => (
        <div key={name} className="w-48 rounded-group bg-surface p-4" style={{ boxShadow: t.value }}>
          <div className="text-headline">{name}</div>
          <div className="text-footnote text-muted">{t.use}</div>
        </div>
      ))}
      <div className="w-48 rounded-group bg-surface p-4">
        <div className="text-headline">group</div>
        <div className="text-footnote text-muted">No shadow. Surface on canvas is enough.</div>
      </div>
    </div>
  </Page>
);

export const MotionPage = () => (
  <Page title="Motion" lead="Motion shows state: a press, a sheet arriving, a tap going through. Under 300 ms, strong ease-out, and a crossfade when reduced motion is on.">
    <table className="w-full text-left text-body">
      <thead>
        <tr className="border-b border-line text-footnote text-muted">
          <th className="py-2">Token</th>
          <th>Value</th>
          <th>Use</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(motion).map(([name, t]) => (
          <tr key={name} className="border-b border-line">
            <td className="py-3 font-semibold">{name}</td>
            <td>
              <code className="text-footnote">{t.value}</code>
            </td>
            <td className="text-muted">{t.use}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Page>
);
