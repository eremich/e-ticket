import { Navigate, useNavigate } from 'react-router-dom';
import { ContactlessPayment } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
import { VisitorTicket } from '../../components/VisitorTicket';
import { useT } from '../../i18n';
import { clock } from '../../lib/format';
import { useStore } from '../../store/useStore';
import { StickyFooter } from '../onboarding/parts';

/** The ticket after purchase: confirmation, how to use it, and what to do once it has expired */
export const VisitorTicketScreen = () => {
  const t = useT();
  const navigate = useNavigate();
  const ticket = useStore((s) => s.visitorTicket);
  if (!ticket) return <Navigate to="/visitor" replace />;
  const expired = !!ticket.expired;

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-4">
        {!expired && (
          <div className="flex justify-center">
            <Toast message={t('visitor.added')} />
          </div>
        )}
        <VisitorTicket kind={ticket.kind} validUntil={ticket.validUntil} rides={ticket.rides} expired={expired} />
        {expired ? (
          <div className="flex flex-col gap-1">
            <h1 className="tnum text-title2 text-ink">{t('visitor.expired', { time: clock(ticket.validUntil) })}</h1>
            <p className="text-body text-muted">{t('visitor.expiredBody')}</p>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-action-soft text-action">
              <ContactlessPayment aria-hidden weight="bold" className="size-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-headline text-ink">{t('visitor.howTo')}</h1>
              <p className="text-subheadline text-muted">{t('visitor.howToBody')}</p>
            </div>
          </div>
        )}
      </div>
      <StickyFooter>
        {expired ? (
          <>
            <Button block onClick={() => navigate('/visitor')}>
              {t('visitor.buyAnother')}
            </Button>
            <Button variant="plain" block onClick={() => navigate('/onboarding/sign-in')}>
              {t('visitor.createAccount')}
            </Button>
          </>
        ) : (
          <Button block onClick={() => navigate('/visitor')}>
            {t('visitor.done')}
          </Button>
        )}
      </StickyFooter>
    </div>
  );
};
