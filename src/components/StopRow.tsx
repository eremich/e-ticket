import { CaretRight, Star, Wheelchair } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { cx } from '../lib/cx';
import type { Transport } from '../lib/icons';
import { ArrivalChip, type ArrivalChipProps } from './ArrivalChip';
import { TransportTile, type MetroLine } from './LineBadge';

export interface StopRowProps {
  name: string;
  walkMin: number;
  meters: number;
  /** Main transport at the stop, for the tile */
  transport: Transport;
  arrivals: ArrivalChipProps[];
  favorite?: boolean;
  onClick?: () => void;
}

/** A nearby stop on Home: name, walk, then the live arrival chips — arrivals, not just stops */
export const StopRow = ({ name, walkMin, meters, transport, arrivals, favorite, onClick }: StopRowProps) => {
  const t = useT();
  return (
    <div className="flex flex-col gap-2.5 py-3">
      <button type="button" onClick={onClick} className="press flex items-center gap-3 px-4 text-left">
        <TransportTile transport={transport} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1.5 text-headline text-ink">
            <span className="truncate">{name}</span>
            {favorite && <Star aria-label={t('stop.unfavorite')} weight="fill" className="size-4 shrink-0 text-warn" />}
          </span>
          <span className="tnum text-footnote text-muted">{t('stop.walk', { n: walkMin, m: meters })}</span>
        </span>
        <CaretRight aria-hidden weight="bold" className="size-4 shrink-0 text-muted/70" />
      </button>
      <div className="scroll-x flex gap-2 px-4 pl-16">
        {arrivals.map((a) => (
          <ArrivalChip key={`${a.transport}${a.number}`} {...a} />
        ))}
      </div>
    </div>
  );
};

export interface NearestStationProps {
  name: string;
  line: MetroLine;
  lineName: string;
  walkMin: number;
  stepFree?: boolean;
  /** One chip per direction: towards + minutes (or scheduled) */
  directions: ArrivalChipProps[];
  onClick?: () => void;
}

/** The nearest metro station, first on Home: the core daily journey */
export const NearestStation = ({ name, line, lineName, walkMin, stepFree, directions, onClick }: NearestStationProps) => {
  const t = useT();
  return (
    <div className="flex flex-col gap-3 rounded-group bg-surface py-3.5">
      <button type="button" onClick={onClick} className="press flex items-center gap-3 px-4 text-left">
        <TransportTile transport="metro" line={line} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-title2 text-ink">{name}</span>
          <span className="tnum flex items-center gap-1.5 text-footnote text-muted">
            {t('station.line', { n: line, name: lineName })} · {t('time.walk', { n: walkMin })}
            {stepFree && <Wheelchair aria-label={t('route.stepFree')} weight="bold" className="size-4 text-action" />}
          </span>
        </span>
        <CaretRight aria-hidden weight="bold" className="size-4 shrink-0 text-muted/70" />
      </button>
      <div className={cx('scroll-x flex gap-2 px-4')}>
        {directions.map((d) => (
          <ArrivalChip key={d.towards} {...d} />
        ))}
      </div>
    </div>
  );
};
