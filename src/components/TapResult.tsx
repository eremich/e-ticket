import type { ReactNode } from 'react';
import { ArrowsLeftRight, Check, CloudSlash, ContactlessPayment, X } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { clock, money } from '../lib/format';
import { cx } from '../lib/cx';
import type { Transport } from '../lib/icons';
import { ApplePayButton } from './ApplePayButton';
import { Button } from './Button';
import { EticketCard, type EticketCardProps } from './EticketCard';
import { LineBadge } from './LineBadge';

export type TapState = 'hold' | 'success' | 'transfer' | 'declined' | 'ready';

export interface TapResultProps {
  state: TapState;
  card: EticketCardProps;
  /** Where and when the tap happened (time in minutes since midnight) */
  place: { transport: Transport; number: string | number; name: string; time: number };
  fare: number;
  /** Balance after the tap (success / transfer) or the current balance (declined, ready) */
  balance: number;
  /** End of the free transfer window, minutes since midnight */
  transferUntil?: number;
  topUpAmount?: number;
  offline?: boolean;
  onCancel?: () => void;
  onDone?: () => void;
  onTapAgain?: () => void;
  onTopUp?: () => void;
  onOtherTopUp?: () => void;
  topUpLoading?: boolean;
  /** Just added, shown on the ready screen after a top-up at the turnstile */
  toppedUp?: number;
}

/** Big round status mark. The check draws itself; a decline shakes once. */
const Mark = ({ tone, children }: { tone: 'ok' | 'error' | 'action'; children: ReactNode }) => (
  <span
    aria-hidden
    className={cx(
      'pop-in flex size-20 items-center justify-center rounded-chip',
      tone === 'ok' && 'bg-ok text-on-action',
      tone === 'error' && 'shake bg-error text-on-action',
      tone === 'action' && 'bg-action text-on-action',
    )}
  >
    {children}
  </span>
);

const DrawnCheck = () => (
  <svg viewBox="0 0 40 40" className="size-11" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 21 17 28 30 13" className="draw" style={{ ['--len' as string]: 30 }} />
  </svg>
);

const Offline = () => {
  const t = useT();
  return (
    <p className="flex items-center justify-center gap-1.5 text-footnote text-muted">
      <CloudSlash aria-hidden weight="bold" className="size-4" />
      {t('tap.offline')}
    </p>
  );
};

/**
 * Paying at the validator, as the Wallet would show it: hold near the reader, then paid, free transfer or declined.
 * A decline is also the fix: top up with Apple Pay right here, then tap again.
 */
export const TapResult = (p: TapResultProps) => {
  const t = useT();
  const m = (n: number, signed = false) => money(t.lang, n, signed);

  if (p.state === 'hold') {
    return (
      <div className="flex h-full flex-col px-6 pb-8">
        <div className="flex justify-end">
          <Button variant="plain" size="md" onClick={p.onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
        <div className="mt-2">
          <EticketCard {...p.card} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
          <span aria-hidden className="relative flex size-24 items-center justify-center text-action">
            <span className="ring-out absolute inset-0 rounded-chip border-2 border-action" />
            <span className="ring-out absolute inset-0 rounded-chip border-2 border-action [animation-delay:600ms]" />
            <ContactlessPayment weight="bold" className="size-14" />
          </span>
          <div>
            <h2 className="text-title2 text-ink">{t('tap.hold')}</h2>
            <p className="mt-1 text-subheadline text-muted">{t('tap.holdHint')}</p>
          </div>
        </div>
        {p.offline && <Offline />}
      </div>
    );
  }

  const where = (
    <p className="flex items-center justify-center gap-2 text-subheadline text-ink">
      <LineBadge transport={p.place.transport} number={p.place.number} size="sm" />
      {p.place.name} · <span className="tnum">{clock(p.place.time)}</span>
    </p>
  );

  // After topping up at the turnstile: the fix is done, one more tap
  if (p.state === 'ready') {
    return (
      <div role="status" className="flex h-full flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <Mark tone="ok">
            <DrawnCheck />
          </Mark>
          <div className="rise">
            <h2 className="text-title2 text-ink">{t('tap.ready')}</h2>
            <p className="tnum mt-1 text-body text-ink">{t('tap.readyBody', { amount: m(p.toppedUp ?? 0), balance: m(p.balance) })}</p>
          </div>
          {where}
        </div>
        <div className="rise flex flex-col gap-2 [animation-delay:120ms]">
          <Button block onClick={p.onTapAgain} icon={<ContactlessPayment aria-hidden weight="bold" className="size-5" />}>
            {t('tap.retry')}
          </Button>
          <Button variant="gray" block onClick={p.onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  if (p.state === 'declined') {
    const amount = p.topUpAmount ?? 100;
    return (
      <div role="alert" className="flex h-full flex-col px-6 pb-8">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <Mark tone="error">
            <X weight="bold" className="size-10" />
          </Mark>
          <div className="rise">
            <h2 className="text-title2 text-ink">{t('tap.declined')}</h2>
            <p className="tnum mt-1 text-body text-ink">{t('tap.declinedBody', { left: m(p.balance), fare: m(p.fare) })}</p>
          </div>
          {where}
        </div>
        <div className="rise flex flex-col gap-2 [animation-delay:120ms]">
          <ApplePayButton label={t('tap.topUpWith', { amount: m(amount) })} onClick={p.onTopUp} loading={p.topUpLoading} />
          <Button variant="plain" block onClick={p.onOtherTopUp}>
            {t('tap.otherMethod')}
          </Button>
          <Button variant="gray" block onClick={p.onCancel}>
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    );
  }

  const transfer = p.state === 'transfer';
  return (
    <div role="status" className="flex h-full flex-col px-6 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        {transfer ? (
          <Mark tone="action">
            <ArrowsLeftRight weight="bold" className="size-10" />
          </Mark>
        ) : (
          <Mark tone="ok">
            <DrawnCheck />
          </Mark>
        )}
        <div className="rise">
          <p className="text-headline text-muted">{transfer ? t('tap.transfer') : t('tap.paid')}</p>
          <p className="tnum text-large-title text-ink">{transfer ? m(0) : m(-p.fare, true)}</p>
        </div>
        {where}
        <dl className="rise mt-2 w-full divide-y divide-line rounded-group bg-surface text-left [animation-delay:80ms]">
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-body text-muted">{t('card.balance')}</dt>
            <dd className="tnum text-headline text-ink">{m(p.balance)}</dd>
          </div>
          {p.transferUntil !== undefined && (
            <div className="flex items-center gap-3 px-4 py-3">
              <ArrowsLeftRight aria-hidden weight="bold" className="size-5 shrink-0 text-action" />
              <dd className="tnum text-body text-ink">
                {transfer ? t('tap.transferBody') : t('tap.transferUntil', { time: clock(p.transferUntil) })}
              </dd>
            </div>
          )}
        </dl>
      </div>
      <div className="rise flex flex-col gap-2 [animation-delay:160ms]">
        {!transfer && p.onTapAgain && (
          <Button variant="tinted" block onClick={p.onTapAgain}>
            {t('tap.again')}
          </Button>
        )}
        <Button block onClick={p.onDone} icon={<Check aria-hidden weight="bold" className="size-5" />}>
          {t('common.done')}
        </Button>
        {p.offline && <Offline />}
      </div>
    </div>
  );
};
