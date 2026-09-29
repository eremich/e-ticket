import { useT } from '../i18n';
import { clock } from '../lib/format';
import { cx } from '../lib/cx';
import { TRANSPORT_ICON, type Transport } from '../lib/icons';

export interface LineStop {
  name: string;
  /** Live minutes until the next vehicle reaches this stop */
  minutes?: number;
  /** Timetable time when there is no live data */
  scheduled?: number;
  /** The rider's stop */
  here?: boolean;
}

export interface LineStopListProps {
  transport: Transport;
  stops: LineStop[];
  /** Vehicles between stops: 1.5 = halfway from stop 1 to stop 2 */
  vehicles?: number[];
  onStop?: (index: number) => void;
}

const LINE_COLOR: Record<Transport, string> = { metro: 'bg-metro', tram: 'bg-tram', trolleybus: 'bg-trolleybus', bus: 'bg-bus' };
const BADGE: Record<Transport, string> = {
  metro: 'bg-metro-badge text-on-transport',
  tram: 'bg-tram-badge text-on-transport',
  trolleybus: 'bg-trolleybus-badge text-on-transport',
  bus: 'bg-bus-badge text-on-bus',
};

const ROW = 52;

/** A line's stops as a timeline in the transport color, with vehicles riding between them and live times on the right */
export const LineStopList = ({ transport, stops, vehicles = [], onStop }: LineStopListProps) => {
  const t = useT();
  const Icon = TRANSPORT_ICON[transport];
  return (
    <div className="relative">
      {/* Track */}
      <span aria-hidden className={cx('absolute left-[27px] w-1 rounded-chip', LINE_COLOR[transport])} style={{ top: ROW / 2, height: (stops.length - 1) * ROW }} />
      {/* Vehicles */}
      {vehicles.map((v) => (
        <span
          key={v}
          aria-hidden
          className={cx('absolute left-[17px] z-10 flex size-6 items-center justify-center rounded-chip ring-2 ring-surface', BADGE[transport])}
          style={{ top: ROW / 2 + v * ROW - 12 }}
        >
          <Icon weight="fill" className="size-3.5" />
        </span>
      ))}
      <ol>
        {stops.map((s, i) => {
          const when = s.minutes !== undefined ? (s.minutes <= 0 ? t('time.now') : t('time.min', { n: s.minutes })) : s.scheduled !== undefined ? clock(s.scheduled) : '';
          return (
            <li key={s.name} style={{ height: ROW }}>
              <button type="button" onClick={() => onStop?.(i)} className="flex h-full w-full items-center gap-3 pl-5 pr-4 text-left active:bg-raised">
                <span
                  aria-hidden
                  className={cx('relative z-[1] shrink-0 rounded-chip border-[3px] bg-surface', s.here ? 'size-[18px] border-ink' : 'size-3.5 border-line', i === 0 || i === stops.length - 1 ? 'border-ink' : '')}
                  style={{ marginLeft: s.here ? 0 : 2 }}
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className={cx('truncate text-body text-ink', s.here && 'font-semibold')}>{s.name}</span>
                  {s.here && <span className="text-footnote text-muted">{t('line.here')}</span>}
                </span>
                <span className={cx('tnum shrink-0', s.minutes !== undefined ? 'text-headline text-ink' : 'text-subheadline text-muted')}>{when}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
