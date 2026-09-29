import type { ReactNode } from 'react';
import { ArrowsLeftRight, FlagCheckered, PersonSimpleWalk } from '@phosphor-icons/react';
import { clock } from '../lib/format';
import { cx } from '../lib/cx';
import type { Transport } from '../lib/icons';
import { LineBadge, type MetroLine } from './LineBadge';

export interface RouteStepProps {
  kind: 'walk' | 'ride' | 'transfer' | 'arrive';
  /** Clock time the step starts, minutes since midnight */
  time: number;
  title: string;
  detail?: ReactNode;
  transport?: Transport;
  number?: string | number;
  /** Live element on the right, e.g. the next train chip */
  aside?: ReactNode;
  /** Live trip: the step in progress is emphasized, finished ones fade */
  status?: 'done' | 'current' | 'next';
  last?: boolean;
}

const RAIL: Record<string, string> = { metro: 'bg-metro', tram: 'bg-tram', trolleybus: 'bg-trolleybus', bus: 'bg-bus' };
const METRO_RAIL: Record<MetroLine, string> = { 1: 'bg-m1', 2: 'bg-m2', 3: 'bg-m3' };

/**
 * One step of a route on a vertical rail: time, what to do, and the live detail.
 * Rides draw a solid rail in the line color; walks and transfers a dotted one.
 */
export const RouteStep = ({ kind, time, title, detail, transport, number, aside, status, last = false }: RouteStepProps) => {
  const rail =
    kind === 'ride' && transport
      ? transport === 'metro'
        ? METRO_RAIL[Number(number) as MetroLine]
        : RAIL[transport]
      : 'bg-[radial-gradient(circle,rgb(var(--c-muted))_1.2px,transparent_1.4px)] bg-[length:4px_7px] bg-repeat-y bg-center';
  const icon =
    kind === 'ride' && transport ? (
      <LineBadge transport={transport} number={number ?? ''} size="sm" />
    ) : (
      <span className={cx('flex size-7 items-center justify-center rounded-chip', kind === 'arrive' ? 'bg-ink text-canvas' : 'bg-raised text-ink')}>
        {kind === 'walk' ? (
          <PersonSimpleWalk aria-hidden weight="bold" className="size-4" />
        ) : kind === 'transfer' ? (
          <ArrowsLeftRight aria-hidden weight="bold" className="size-4" />
        ) : (
          <FlagCheckered aria-hidden weight="fill" className="size-4" />
        )}
      </span>
    );

  return (
    <li className={cx('relative grid grid-cols-[44px_52px_1fr] gap-x-2 transition-opacity duration-300', status === 'done' && 'opacity-45')}>
      <span className={cx('tnum pt-1 text-right text-footnote', status === 'current' ? 'font-semibold text-action' : 'text-muted')}>{clock(time)}</span>
      <span className="relative flex justify-center">
        {!last && <span aria-hidden className={cx('absolute bottom-0 top-8 w-1 rounded-chip', rail)} />}
        <span className="relative z-[1] pt-0.5">{icon}</span>
      </span>
      <div className={cx('flex min-w-0 items-start gap-2 pb-5', status === 'current' && '-ml-2 rounded-group bg-action-soft px-2 pb-3 pt-1')}>
        <div className="min-w-0 flex-1">
          <p className={cx('text-body text-ink', (kind === 'ride' || status === 'current') && 'font-semibold')}>{title}</p>
          {detail && <div className="mt-0.5 text-footnote text-muted">{detail}</div>}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </li>
  );
};

/** Ordered list wrapper so screen readers hear "list, 5 items" */
export const RouteSteps = ({ children }: { children: ReactNode }) => <ol className="flex flex-col">{children}</ol>;
