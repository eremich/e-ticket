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

const FILL: Record<Transport, string> = {
  metro: 'bg-metro-badge text-on-transport',
  tram: 'bg-tram-badge text-on-transport',
  trolleybus: 'bg-trolleybus-badge text-on-transport',
  bus: 'bg-bus-badge text-on-bus',
};

const METRO_FILL: Record<MetroLine, string> = { 1: 'bg-m1', 2: 'bg-m2', 3: 'bg-m3' };

/**
 * Transport identity: color + icon + number, always together.
 * Metro lines use their own line color (1 red, 2 blue, 3 green) with the "M" mark.
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
        'tnum inline-flex shrink-0 items-center rounded-badge font-bold leading-none',
        size === 'md' ? 'h-7 gap-1 pl-1.5 pr-2 text-subheadline font-bold' : 'h-[22px] gap-0.5 pl-1 pr-1.5 text-footnote font-bold',
        isMetro ? cx(METRO_FILL[line] ?? 'bg-metro-badge', 'text-on-transport') : FILL[transport],
      )}
    >
      {isMetro ? (
        <span aria-hidden className={cx('font-bold', size === 'md' ? 'text-subheadline' : 'text-footnote')}>
          M
        </span>
      ) : (
        <Icon aria-hidden className={size === 'md' ? 'size-4' : 'size-3.5'} weight="fill" />
      )}
      <span aria-hidden>{number}</span>
    </span>
  );
};

/** Icon-only transport tile for list rows (stop type) */
export const TransportTile = ({ transport, line }: { transport: Transport; line?: MetroLine }) => {
  const Icon = TRANSPORT_ICON[transport];
  const fill = transport === 'metro' && line ? cx(METRO_FILL[line], 'text-on-transport') : FILL[transport];
  return (
    <span aria-hidden className={cx('flex size-9 shrink-0 items-center justify-center rounded-inner', fill)}>
      <Icon className="size-5" weight="fill" />
    </span>
  );
};
