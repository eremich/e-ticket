import { useT } from '../i18n';
import { clock } from '../lib/format';
import { cx } from '../lib/cx';
import type { Transport } from '../lib/icons';
import { LineBadge } from './LineBadge';

export interface ArrivalChipProps {
  transport: Transport;
  /** Route number, or metro line number */
  number: string | number;
  /** Minutes until arrival from live data. 0 = arriving now. Omit when there is no live data. */
  minutes?: number;
  /** Timetable time (minutes since midnight), shown muted when there is no live data */
  scheduled?: number;
  /** Direction instead of the route label, for metro: "To Vokzalna" */
  towards?: string;
  /** Late by this many minutes (live data) */
  delay?: number;
  onClick?: () => void;
}

/**
 * The hero of waiting: "Tram 27 · 3 min". Live times are bold ink with a pulsing dot;
 * scheduled times are muted and say so, so riders know how much to trust them.
 */
export const ArrivalChip = ({ transport, number, minutes, scheduled, towards, delay, onClick }: ArrivalChipProps) => {
  const t = useT();
  const live = minutes !== undefined;
  const now = live && minutes <= 0;
  const when = live ? (now ? t('time.now') : t('time.min', { n: minutes })) : t('time.scheduled', { time: clock(scheduled ?? 0) });
  const route = towards ? t('arrival.towards', { stop: towards }) : `${t(`transport.${transport}`)} ${number}`;

  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cx(
        'inline-flex h-11 shrink-0 items-center gap-2 rounded-chip bg-surface pl-1.5 pr-3.5 ring-1 ring-inset ring-line',
        onClick && 'press transition-colors duration-150 hover:ring-muted/50',
      )}
    >
      {/* One spoken label; the visual parts are hidden from screen readers */}
      <span className="sr-only">{`${route}, ${when}${delay ? `, ${t('arrival.delay', { n: delay })}` : ''}`}</span>
      <LineBadge transport={transport} number={number} size="sm" decorative />
      {towards && (
        <span aria-hidden className="max-w-44 truncate text-subheadline text-ink">
          {route}
        </span>
      )}
      <span aria-hidden className="flex items-center gap-1.5">
        {live && <span className={cx('live-dot size-1.5 rounded-chip', delay ? 'bg-warn' : 'bg-ok')} />}
        <span className={cx('tnum whitespace-nowrap', live ? 'text-arrival' : 'text-subheadline text-muted', now && 'text-ok-ink', !!delay && 'text-warn-ink')}>
          {when}
        </span>
      </span>
    </Tag>
  );
};
