import { useT } from '../i18n';
import { byHour } from '../lib/arrivals';
import { cx } from '../lib/cx';

export interface TimetableGridProps {
  /** Departures, minutes since midnight */
  times: number[];
  /** The frozen clock; the first departure after it is highlighted and earlier ones are muted */
  now: number;
}

/** A day's departures by hour, like the board at the stop. The next one is filled so it is found at a glance. */
export const TimetableGrid = ({ times, now }: TimetableGridProps) => {
  const t = useT();
  const next = times.find((x) => x >= now);
  return (
    <table className="w-full border-separate border-spacing-0 text-left">
      <thead className="sr-only">
        <tr>
          <th>{t('timetable.hour')}</th>
          <th>Minutes</th>
        </tr>
      </thead>
      <tbody className="tnum">
        {byHour(times).map(([h, mins]) => {
          const current = next !== undefined && Math.floor(next / 60) === h;
          return (
            <tr key={h} className={cx(current && 'bg-action-soft/60')}>
              <th scope="row" className={cx('w-14 border-b border-line py-2.5 pl-4 align-top text-headline', h * 60 + 59 < now ? 'text-muted' : 'text-ink')}>
                {String(h).padStart(2, '0')}
              </th>
              <td className="border-b border-line py-2 pr-4">
                <span className="flex flex-wrap gap-x-1 gap-y-1">
                  {mins.map((m) => {
                    const at = h * 60 + m;
                    const isNext = at === next;
                    return (
                      <span
                        key={m}
                        aria-current={isNext ? 'time' : undefined}
                        className={cx(
                          'min-w-9 rounded-inner px-1.5 py-0.5 text-center text-body',
                          isNext ? 'bg-action font-semibold text-on-action' : at < now ? 'text-muted/70' : 'text-ink',
                        )}
                      >
                        {String(m).padStart(2, '0')}
                      </span>
                    );
                  })}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
