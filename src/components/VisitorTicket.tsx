import { ContactlessPayment } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { clock, date } from '../lib/format';
import { cx } from '../lib/cx';
import { TODAY } from '../lib/time';
import { EticketLogo } from './EticketCard';

const DAY_MIN = 1440;

export interface VisitorTicketProps {
  kind: 'single' | 'day' | 'days3';
  /** Minutes on the mock clock; past 1440 means tomorrow or later */
  validUntil: number;
  rides: number;
  expired?: boolean;
}

/** "09:14", or "08:14, 14 Oct" once the ticket runs past midnight */
export const validUntilLabel = (lang: 'en' | 'uk', min: number) => {
  const days = Math.floor(min / DAY_MIN);
  if (days === 0) return clock(min);
  const d = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + days);
  return `${clock(min)}, ${date(lang, d, { day: 'numeric', month: 'short' })}`;
};

/** A ticket bought without an account, drawn like a Wallet pass. Expired tickets go grey. */
export const VisitorTicket = ({ kind, validUntil, rides, expired = false }: VisitorTicketProps) => {
  const t = useT();
  const name = t(`visitor.${kind}`);
  const until = validUntilLabel(t.lang, validUntil);
  return (
    <article aria-label={`${t('visitor.ticket')}: ${name}`} className={cx('relative isolate overflow-hidden rounded-eticket bg-surface shadow-object', expired && 'grayscale')}>
      <header className={cx('flex items-center justify-between px-5 py-4 text-white', expired ? 'bg-muted' : 'bg-card-face')}>
        <EticketLogo className="text-title2" />
        <span className="text-subheadline text-white/90">{t('visitor.city')}</span>
      </header>
      <div className="flex flex-col gap-1 px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="section-title px-0">{t('visitor.ticket')}</p>
            <h2 className={cx('text-large-title', expired ? 'text-muted' : 'text-ink')}>{name}</h2>
          </div>
          {expired ? (
            <span className="shrink-0 rounded-chip bg-raised px-2.5 py-1 text-caption text-muted">{t('visitor.expiredLabel')}</span>
          ) : (
            <ContactlessPayment aria-hidden weight="bold" className="size-9 shrink-0 text-action" />
          )}
        </div>
        <p className={cx('tnum text-headline', expired ? 'text-muted' : 'text-ink')}>{t('visitor.validUntil', { time: until })}</p>
        <p className="tnum text-subheadline text-muted">{t.n('visitor.rides', rides)}</p>
      </div>
    </article>
  );
};
