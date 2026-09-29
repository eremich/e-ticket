import { Fragment } from 'react';
import { CaretRight, PersonSimpleWalk, Warning, Wheelchair } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { clock, money } from '../lib/format';
import { cx } from '../lib/cx';
import type { Transport } from '../lib/icons';
import { LineBadge } from './LineBadge';

export type RouteLeg = { kind: 'walk'; minutes: number } | { kind: 'ride'; transport: Transport; number: string | number };

export interface RouteOptionProps {
  legs: RouteLeg[];
  /** Door to door, minutes */
  totalMin: number;
  /** Departure and arrival, minutes since midnight */
  depart: number;
  arrive: number;
  /** Minutes until the first vehicle leaves */
  leavesIn: number;
  /** Where the first ride starts: "Saltivska" */
  from: string;
  transfers: number;
  walkMin: number;
  fare: number;
  /** Transfers cost nothing (inside the metro, or within 60 min) */
  freeTransfer?: boolean;
  stepFree?: boolean;
  /** The card balance is below the fare */
  short?: boolean;
  /** The fastest option gets the emphasis */
  best?: boolean;
  onClick?: () => void;
}

/** One option in Routes: time first, the chain of rides at a glance, then the facts that decide it — fare included */
export const RouteOption = (p: RouteOptionProps) => {
  const t = useT();
  const leaves = p.leavesIn <= 0 ? t('route.leavesNow') : t('route.leaves', { n: p.leavesIn });
  const Tag = p.onClick ? 'button' : 'div';

  return (
    <Tag
      type={p.onClick ? 'button' : undefined}
      onClick={p.onClick}
      className={cx(
        'flex w-full flex-col gap-2.5 rounded-group bg-surface p-4 text-left',
        p.best && 'ring-2 ring-inset ring-action',
        p.onClick && 'press transition-colors duration-100 active:bg-raised',
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="flex items-baseline gap-2">
          <span className="tnum text-title2 text-ink">{t('time.min', { n: p.totalMin })}</span>
          <span className="tnum text-subheadline text-muted">
            {clock(p.depart)}–{clock(p.arrive)}
          </span>
        </p>
        <p className="flex items-baseline gap-1 text-right">
          <span className="tnum text-headline text-ink">{money(t.lang, p.fare)}</span>
        </p>
      </div>

      <ol aria-label="Route" className="flex flex-wrap items-center gap-1">
        {p.legs.map((leg, i) => (
          <Fragment key={i}>
            {i > 0 && <CaretRight aria-hidden weight="bold" className="size-3 text-muted/70" />}
            <li className="flex items-center">
              {leg.kind === 'walk' ? (
                <span className="tnum flex items-center text-footnote text-muted">
                  <PersonSimpleWalk aria-hidden weight="bold" className="size-4" />
                  <span className="sr-only">Walk </span>
                  {leg.minutes}
                </span>
              ) : (
                <LineBadge transport={leg.transport} number={leg.number} size="sm" />
              )}
            </li>
          </Fragment>
        ))}
        {p.stepFree && (
          <li className="ml-auto flex items-center gap-1 text-footnote font-semibold text-action">
            <Wheelchair aria-hidden weight="bold" className="size-4" />
            {t('route.stepFree')}
          </li>
        )}
      </ol>

      <p className="tnum flex flex-wrap items-center gap-x-1.5 text-footnote text-muted">
        <span className={cx(p.leavesIn <= 3 && 'font-semibold text-ok-ink')}>{leaves}</span>
        <span aria-hidden>·</span>
        <span className="truncate">{p.from}</span>
        <span aria-hidden>·</span>
        <span>{!p.transfers ? t('route.direct') : p.freeTransfer ? t.n('route.freeTransfers', p.transfers) : t.n('route.transfers', p.transfers)}</span>
        <span aria-hidden>·</span>
        <span>{t('time.walk', { n: p.walkMin })}</span>
      </p>

      {p.short && (
        <p className="flex items-center gap-1.5 text-footnote font-semibold text-warn-ink">
          <Warning aria-hidden weight="fill" className="size-4" />
          {t('route.short')}
        </p>
      )}
    </Tag>
  );
};
