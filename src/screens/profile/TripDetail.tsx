import { useNavigate, useParams } from 'react-router-dom';
import { Flag, ShareNetwork } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { ListGroup, ListRow } from '../../components/ListRow';
import { TransportTile } from '../../components/LineBadge';
import { useName, useT } from '../../i18n';
import { clock, date, money } from '../../lib/format';
import { useStore } from '../../store/useStore';
import { useActivityRow } from '../card/activity';
import { dayOf, receiptNo } from './data';
import { Footer } from './parts';

const Value = ({ children }: { children: React.ReactNode }) => <span className="tnum text-ink">{children}</span>;

/** One ride or receipt: what it was, what it cost, and what you can do about it */
export const TripDetail = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const { id } = useParams();
  const a = useStore((s) => s.activity.find((x) => x.id === id));
  const cards = useStore((s) => s.cards);
  const toast = useStore((s) => s.toast);
  const row = useActivityRow();
  const back = () => navigate('/profile/trips');

  if (!a) {
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar title={t('detail.trip')} onBack={back} backLabel={t('trips.title')} />
        <p className="px-4 pt-6 text-body text-muted">{t('detail.notFound')}</p>
      </div>
    );
  }

  const r = row(a);
  const card = cards.find((c) => c.id === a.cardId);
  const isRide = a.kind === 'ride';
  const when = `${a.daysAgo === 0 ? t('trip.today') : a.daysAgo === 1 ? t('trip.yesterday') : date(t.lang, dayOf(a.daysAgo), { day: 'numeric', month: 'short' })}, ${clock(a.time)}`;
  const title = isRide && a.place ? `${t(`transport.${a.place.transport}`)} ${a.place.number}` : a.kind === 'topup' ? t('trip.topup') : t('trip.refund');
  const method = r.method;

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar title={isRide ? t('detail.trip') : t('detail.topup')} onBack={back} backLabel={t('trips.title')} />
      <div className="flex flex-col items-center gap-2 px-4 pb-6 pt-4 text-center">
        {isRide && a.place && <TransportTile transport={a.place.transport} line={a.place.transport === 'metro' ? (Number(a.place.number) as 1 | 2 | 3) : undefined} />}
        <h1 className="text-headline text-ink">{title}</h1>
        <p className={`tnum text-large-title ${a.amount > 0 ? 'text-ok-ink' : 'text-ink'}`}>{money(t.lang, a.amount, true)}</p>
      </div>

      <div className="flex flex-col gap-6 pb-6">
        <ListGroup>
          {isRide && <ListRow chevron={false} title={t('detail.line')} trailing={<Value>{title}</Value>} />}
          {r.place && <ListRow chevron={false} title={t('detail.stop')} trailing={<Value>{r.place}</Value>} />}
          <ListRow chevron={false} title={t('detail.time')} trailing={<Value>{when}</Value>} />
          {isRide ? (
            <ListRow chevron={false} title={t('detail.fare')} trailing={<Value>{money(t.lang, -a.amount)}</Value>} />
          ) : (
            <ListRow chevron={false} title={t('detail.amount')} trailing={<Value>{money(t.lang, a.amount)}</Value>} />
          )}
          {method && <ListRow chevron={false} title={t('detail.method')} trailing={<Value>{method}</Value>} />}
          {card && <ListRow chevron={false} title={t('detail.card')} trailing={<Value>{`${name(card.name)} •••• ${card.number.slice(-4)}`}</Value>} />}
          <ListRow chevron={false} title={t('detail.receipt')} trailing={<Value>{receiptNo(a.id)}</Value>} />
        </ListGroup>
      </div>

      <Footer>
        <Button variant="tinted" block icon={<ShareNetwork aria-hidden weight="bold" className="size-5" />} onClick={() => toast(t('detail.shared'))}>
          {t('detail.share')}
        </Button>
        {isRide && (
          <Button variant="plain" block icon={<Flag aria-hidden weight="bold" className="size-5" />} onClick={() => navigate(`/profile/trips/${a.id}/report`)}>
            {t('detail.report')}
          </Button>
        )}
      </Footer>
    </div>
  );
};
