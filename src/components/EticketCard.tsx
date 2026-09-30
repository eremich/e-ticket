import { ContactlessPayment, Lock, Warning } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { date, money } from '../lib/format';
import { cx } from '../lib/cx';

/**
 * The Eticket logotype, taken from the brand slide: the E's counter is a ticket's punch notch and hole.
 * A mask of the original artwork, so it takes the current text color (white on blue, brand on white).
 * Height follows the font size of the context.
 */
export const EticketLogo = ({ className }: { className?: string }) => (
  <span
    role="img"
    aria-label="Eticket"
    className={cx('inline-block aspect-[4.13] h-[0.8em] shrink-0 bg-current align-[-0.05em]', className)}
    style={{ WebkitMask: 'url(/brand-eticket-logo.png) center / contain no-repeat', mask: 'url(/brand-eticket-logo.png) center / contain no-repeat' }}
  />
);

export interface EticketCardProps {
  /** Card name: "Eticket", "Mom's card" */
  name: string;
  /** 16 digits, grouped by 4 */
  number: string;
  balance: number;
  /** Typical fare, used for "trips left" and the low-balance state */
  fare: number;
  kind?: 'plastic' | 'virtual';
  /** Reduced fare status and its expiry */
  reduced?: { kind: 'student' | 'pensioner'; until: Date };
  blocked?: boolean;
  /** Added to Apple Wallet with express mode: pays without unlocking */
  express?: boolean;
}

/** Low when two rides no longer fit; empty when one does not */
export const balanceState = (balance: number, fare: number) => (balance < fare ? 'empty' : balance < fare * 2 ? 'low' : 'ok');

/**
 * The Eticket card — the hero of paying. A physical object on screen: brand face, balance, trips left.
 * Virtual cards keep the shape with a graphite face. Blocked cards lose their color and show a lock.
 */
export const EticketCard = ({ name, number, balance, fare, kind = 'plastic', reduced, blocked = false, express = false }: EticketCardProps) => {
  const t = useT();
  const state = balanceState(balance, fare);
  const last = number.replace(/\s/g, '').slice(-4);
  const trips = Math.floor(balance / fare);

  return (
    <article
      aria-label={t('card.label', { name, last })}
      className={cx(
        'relative isolate aspect-[1.586] w-full overflow-hidden rounded-eticket p-5 text-white shadow-object',
        kind === 'virtual' ? 'bg-card-virtual' : 'bg-card-face',
        blocked && 'grayscale',
      )}
    >
      {/* Pills on the face are white in both themes, so they use light-theme ink (data-theme="light") */}

      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <EticketLogo className="text-title2" />
            {/* The main card is simply "Eticket": the logo already says it */}
            {(kind === 'virtual' || name !== 'Eticket') && (
              <span className="text-footnote text-white/80">{kind === 'virtual' ? `${name} · ${t('card.virtual')}` : name}</span>
            )}
          </div>
          {blocked ? (
            <span data-theme="light" className="flex items-center gap-1 rounded-chip bg-white px-2.5 py-1 text-caption text-ink">
              <Lock aria-hidden weight="fill" className="size-3.5" />
              {t('card.blocked')}
            </span>
          ) : state !== 'ok' ? (
            <span data-theme="light" className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-chip bg-white px-2.5 py-1 text-caption text-warn-ink">
              <Warning aria-hidden weight="fill" className="size-3.5" />
              {t('card.low')}
            </span>
          ) : (
            <ContactlessPayment aria-hidden weight="bold" className="size-7 text-white/90" />
          )}
        </header>

        <div className="mt-auto">
          <p className="text-footnote text-white/80">{t('card.balance')}</p>
          <p className="tnum text-balance">{money(t.lang, balance)}</p>
          <p className="tnum mt-0.5 text-subheadline text-white/90">
            {state === 'empty'
              ? `${t('card.short', { amount: money(t.lang, fare - balance) })} · ${t('card.perRide', { fare: money(t.lang, fare) })}`
              : `${t.n('card.trips', trips)} · ${t('card.perRide', { fare: money(t.lang, fare) })}`}
          </p>
        </div>

        <footer className="mt-3 flex items-center justify-between gap-2 text-footnote">
          <span className="tnum shrink-0 whitespace-nowrap text-white/80">•••• {last}</span>
          {reduced ? (
            <span className="truncate rounded-chip bg-white/20 px-2 py-0.5 font-semibold">
              {t('card.until', { label: t(`reduced.${reduced.kind}`), date: date(t.lang, reduced.until, { day: '2-digit', month: '2-digit', year: 'numeric' }) })}
            </span>
          ) : express ? (
            <span className="text-white/80">{t('card.express')}</span>
          ) : null}
        </footer>
      </div>
    </article>
  );
};

export interface CardStripProps {
  balance: number;
  fare: number;
  onOpen?: () => void;
  onTopUp?: () => void;
}

/** Home's one-line card summary: balance, trips left, and a Top up action when it runs low */
export const CardStrip = ({ balance, fare, onOpen, onTopUp }: CardStripProps) => {
  const t = useT();
  const state = balanceState(balance, fare);
  const trips = Math.floor(balance / fare);
  return (
    <div className="flex items-center gap-3 rounded-group bg-surface p-3">
      <button type="button" onClick={onOpen} className="press flex min-w-0 flex-1 items-center gap-3 text-left">
        <span aria-hidden className="flex h-9 w-14 shrink-0 items-end rounded-inner bg-card-face p-1.5 text-white">
          <EticketLogo className="text-tab" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="tnum text-headline text-ink">{money(t.lang, balance)}</span>
          <span className={cx('flex items-center gap-1 truncate text-footnote', state === 'ok' ? 'text-muted' : 'text-warn-ink')}>
            {state !== 'ok' && <Warning aria-hidden weight="fill" className="size-3.5 shrink-0" />}
            {state === 'empty' ? t('card.short', { amount: money(t.lang, fare - balance) }) : t.n('card.trips', trips)}
          </span>
        </span>
      </button>
      {state !== 'ok' && onTopUp && (
        <button type="button" onClick={onTopUp} className="press min-h-11 shrink-0 rounded-chip bg-accent px-4 text-subheadline font-semibold text-on-accent">
          {t('card.topUp')}
        </button>
      )}
    </div>
  );
};
