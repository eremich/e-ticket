import { ArrowsLeftRight, FlagCheckered, MapPin, Stairs, Wheelchair } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { clock } from '../lib/format';
import { Button } from './Button';
import { ArrivalChip, type ArrivalChipProps } from './ArrivalChip';
import { LineBadge, type MetroLine } from './LineBadge';

export interface StationPanelProps {
  line: MetroLine;
  lineName: string;
  stepFree?: boolean;
  /** Next trains per direction */
  directions: { towards: string; minutes?: number[]; scheduled?: number[] }[];
  transfer?: { name: string; line: MetroLine };
  /** Surface stops at the exits with their next arrival */
  exits: { name: string; walkMin: number; arrivals: ArrivalChipProps[] }[];
  onRouteFrom?: () => void;
  onRouteTo?: () => void;
  onExit?: (index: number) => void;
}

/** Body of the station sheet: trains both ways, transfer, step-free access, what waits at the exits, and routing */
export const StationPanel = ({ line, lineName, stepFree, directions, transfer, exits, onRouteFrom, onRouteTo, onExit }: StationPanelProps) => {
  const t = useT();
  return (
    <div className="flex flex-col gap-5">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-subheadline text-muted">
        <span className="flex items-center gap-1.5">
          <LineBadge transport="metro" number={line} size="sm" decorative />
          {t('station.line', { n: line, name: lineName })}
        </span>
        <span className="flex items-center gap-1">
          {stepFree ? <Wheelchair aria-hidden weight="bold" className="size-4 text-action" /> : <Stairs aria-hidden weight="bold" className="size-4" />}
          {stepFree ? t('station.stepFree') : t('station.stairs')}
        </span>
      </p>

      <section>
        <h3 className="section-title px-0 pb-2">{t('station.nextTrains')}</h3>
        <ul className="divide-y divide-line rounded-group bg-canvas">
          {directions.map((d) => (
            <li key={d.towards} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0 truncate text-body text-ink">{t('arrival.towards', { stop: d.towards })}</span>
              <span className="tnum flex shrink-0 items-baseline gap-2">
                {d.minutes ? (
                  d.minutes.map((m, i) => (
                    <span key={m} className={i === 0 ? 'text-arrival text-ink' : 'text-subheadline text-muted'}>
                      {i === 0 ? t('time.min', { n: m }) : m}
                    </span>
                  ))
                ) : (
                  <span className="text-subheadline text-muted">{t('time.scheduled', { time: clock(d.scheduled?.[0] ?? 0) })}</span>
                )}
              </span>
            </li>
          ))}
          {transfer && (
            <li className="flex items-center gap-2 px-3 py-2.5 text-body text-ink">
              <ArrowsLeftRight aria-hidden weight="bold" className="size-5 text-action" />
              {t('station.transfer', { name: transfer.name })}
              <LineBadge transport="metro" number={transfer.line} size="sm" />
            </li>
          )}
        </ul>
      </section>

      {exits.length > 0 && (
        <section>
          <h3 className="section-title px-0 pb-2">{t('station.exits')}</h3>
          <ul className="flex flex-col gap-2">
            {exits.map((e, i) => (
              <li key={e.name} className="rounded-group bg-canvas p-3">
                <button type="button" onClick={() => onExit?.(i)} className="press flex w-full items-center gap-2 text-left">
                  <MapPin aria-hidden weight="fill" className="size-4 text-muted" />
                  <span className="flex-1 truncate text-subheadline font-semibold text-ink">{e.name}</span>
                  <span className="tnum text-footnote text-muted">{t('time.walk', { n: e.walkMin })}</span>
                </button>
                <div className="scroll-x mt-2 flex gap-2">
                  {e.arrivals.map((a) => (
                    <ArrivalChip key={`${a.transport}${a.number}`} {...a} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-col gap-2">
        <Button variant="tinted" size="md" block onClick={onRouteFrom} icon={<MapPin aria-hidden weight="fill" className="size-5" />}>
          {t('station.routeFrom')}
        </Button>
        <Button variant="tinted" size="md" block onClick={onRouteTo} icon={<FlagCheckered aria-hidden weight="fill" className="size-5" />}>
          {t('station.routeTo')}
        </Button>
      </div>
    </div>
  );
};
