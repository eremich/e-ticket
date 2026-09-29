import { TRANSPORT_ICON, type Transport } from '../lib/icons';
import { cx } from '../lib/cx';

export type MetroLine = 1 | 2 | 3;

export interface LineBadgeProps {
  transport: Transport;
  /** Route number ("27", "16A") or metro line number */
  number: string | number;
  size?: 'sm' | 'md';
  /** Accessible name, e.g. "Tram 27". Defaults to transport + number. */
  label?: string;
  /** Hide from screen readers when the surrounding text already names the line */
  decorative?: boolean;
}

/** Text-safe shade of each transport color: the badge is just colored icon and number, no plate */
const INK: Record<Transport, string> = { metro: 'text-metro-ink', tram: 'text-tram-ink', trolleybus: 'text-trolleybus-ink', bus: 'text-bus-ink' };
const METRO_INK: Record<MetroLine, string> = { 1: 'text-m1-ink', 2: 'text-m2-ink', 3: 'text-m3-ink' };

/**
 * Transport identity: color + icon + number, always together, and nothing else — no plate behind it.
 * Metro lines use their line color (1 red, 2 blue, 3 green) with the "M" mark.
 */
export const LineBadge = ({ transport, number, size = 'md', label, decorative = false }: LineBadgeProps) => {
  const Icon = TRANSPORT_ICON[transport];
  const isMetro = transport === 'metro';
  const line = Number(number) as MetroLine;
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? `${transport} ${number}`)}
      className={cx(
        'tnum inline-flex shrink-0 items-center font-semibold leading-none',
        size === 'md' ? 'h-7 gap-1 text-headline' : 'h-[22px] gap-0.5 text-subheadline',
        isMetro ? (METRO_INK[line] ?? INK.metro) : INK[transport],
      )}
    >
      {isMetro ? (
        <span aria-hidden className={cx('font-semibold', size === 'md' ? 'text-subheadline' : 'text-footnote')}>
          M
        </span>
      ) : (
        <Icon aria-hidden className={size === 'md' ? 'size-4' : 'size-3.5'} weight="bold" />
      )}
      <span aria-hidden>{number}</span>
    </span>
  );
};

/** Icon-only transport mark for list rows: the icon in the transport color, no tile behind it */
export const TransportTile = ({ transport, line }: { transport: Transport; line?: MetroLine }) => {
  const Icon = TRANSPORT_ICON[transport];
  const ink = transport === 'metro' && line ? METRO_INK[line] : INK[transport];
  return (
    <span aria-hidden className={cx('flex size-7 shrink-0 items-center justify-center', ink)}>
      <Icon className="size-6" weight="regular" />
    </span>
  );
};
