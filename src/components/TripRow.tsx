import { ArrowCounterClockwise, ArrowDown, ArrowUp, ArrowsLeftRight, Plus } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { clock, money } from '../lib/format';
import { cx } from '../lib/cx';
import type { Transport } from '../lib/icons';
import { TransportTile } from './LineBadge';

export interface TripRowProps {
  kind: 'ride' | 'transfer' | 'topup' | 'sent' | 'received' | 'refund';
  /** Line and stop for rides: "Metro 2 · Saltivska" */
  transport?: Transport;
  number?: string | number;
  place?: string;
  /** Minutes since midnight */
  time: number;
  amount: number;
  /** Payment method for top-ups */
  method?: string;
  onClick?: () => void;
}

const ICON_TILE = 'flex size-9 shrink-0 items-center justify-center rounded-inner';

/** One line of history: what, where, when, and the money — charges in ink, credits in green */
export const TripRow = ({ kind, transport, number, place, time, amount, method, onClick }: TripRowProps) => {
  const t = useT();
  const title =
    kind === 'ride' && transport
      ? `${t(`transport.${transport}`)} ${number}`
      : kind === 'transfer'
        ? t('trip.transfer')
        : kind === 'topup'
          ? t('trip.topup')
          : kind === 'refund'
            ? t('trip.refund')
            : kind === 'sent'
              ? t('trip.sent')
              : t('trip.received');
  const sub = [kind === 'topup' ? method : place, clock(time)].filter(Boolean).join(' · ');
  const leading =
    (kind === 'ride' || kind === 'transfer') && transport ? (
      kind === 'transfer' ? (
        <span className={cx(ICON_TILE, 'bg-raised text-action')}>
          <ArrowsLeftRight weight="bold" className="size-5" />
        </span>
      ) : (
        <TransportTile transport={transport} line={transport === 'metro' ? (Number(number) as 1 | 2 | 3) : undefined} />
      )
    ) : (
      <span className={cx(ICON_TILE, amount > 0 ? 'bg-ok/15 text-ok-ink' : 'bg-raised text-ink')}>
        {kind === 'refund' ? <ArrowCounterClockwise weight="bold" className="size-5" /> : kind === 'topup' ? <Plus weight="bold" className="size-5" /> : kind === 'received' ? <ArrowDown weight="bold" className="size-5" /> : <ArrowUp weight="bold" className="size-5" />}
      </span>
    );

  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={cx('flex min-h-15 w-full items-center gap-3 px-4 py-2 text-left', onClick && 'active:bg-raised')}>
      {leading}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body text-ink">{title}</span>
        <span className="tnum truncate text-footnote text-muted">{sub}</span>
      </span>
      <span className={cx('tnum shrink-0 text-headline', amount > 0 ? 'text-ok-ink' : amount === 0 ? 'text-muted' : 'text-ink')}>
        {money(t.lang, amount, true)}
      </span>
    </Tag>
  );
};
