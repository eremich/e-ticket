import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowsClockwise, ArrowsLeftRight, Plus, PlusCircle, Wallet } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { CardCarousel } from '../../components/CardCarousel';
import { ListGroup, ListRow, RowIcon } from '../../components/ListRow';
import { TripRow } from '../../components/TripRow';
import { useName, useT } from '../../i18n';
import { date, money } from '../../lib/format';
import { cx } from '../../lib/cx';
import { useActiveCard, useStore } from '../../store/useStore';
import { useActivityRow } from './activity';
import { WalletSheet } from './WalletSheet';
import { AddCardSheet } from './AddCardSheet';

/** Round quick action under the card, like Wallet's */
const Action = ({ icon, label, onClick, primary }: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean }) => (
  <button type="button" onClick={onClick} className="press flex flex-1 flex-col items-center gap-1.5">
    <span className={cx('flex size-13 items-center justify-center rounded-chip [&>svg]:size-6', primary ? 'bg-accent text-on-accent' : 'bg-surface text-ink')}>{icon}</span>
    <span className="text-center text-footnote text-ink">{label}</span>
  </button>
);

/** The Card tab: the physical card as hero, quick actions, settings, recent activity */
export const CardTab = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const cards = useStore((s) => s.cards);
  const activeId = useStore((s) => s.activeCard);
  const setActive = useStore((s) => s.setActiveCard);
  const fare = useStore((s) => s.fare);
  const auto = useStore((s) => s.autoTopUp);
  const activity = useStore((s) => s.activity);
  const card = useActiveCard();
  const row = useActivityRow();
  const [wallet, setWallet] = useState(false);
  const [addCard, setAddCard] = useState(false);
  const recent = activity.filter((a) => a.cardId === card.id).slice(0, 3);
  const m = (n: number) => money(t.lang, n);

  return (
    <div className="flex flex-1 flex-col pb-8">
      <NavBar large title={t('tab.card')} />
      <CardCarousel
        cards={cards.map((c) => ({ id: c.id, name: name(c.name), number: c.number, balance: c.balance, fare, kind: c.kind, reduced: c.reduced, blocked: c.blocked, express: c.express }))}
        active={activeId}
        onChange={setActive}
      />
      <p className="tnum px-4 pt-1 text-center text-footnote text-muted">
        {card.reduced
          ? t('cardTab.reducedLeft', { fare: m(fare / 2), date: date(t.lang, card.reduced.until) })
          : t('cardTab.fareStandard', { fare: m(fare) })}
      </p>

      <div className="flex gap-2 px-6 py-5">
        <Action primary icon={<Plus weight="bold" />} label={t('cardTab.topUp')} onClick={() => navigate('/card/top-up')} />
        <Action icon={<ArrowsClockwise weight="bold" />} label={t('cardTab.auto')} onClick={() => navigate('/card/auto')} />
        <Action icon={<ArrowsLeftRight weight="bold" />} label={t('transfer.title')} onClick={() => navigate('/card/transfer')} />
        <Action icon={<Wallet weight="bold" />} label="Wallet" onClick={() => setWallet(true)} />
      </div>

      <div className="flex flex-col gap-6">
        <ListGroup header={t('cardTab.actions')} inset="icon">
          <ListRow
            leading={<RowIcon tone="ok"><ArrowsClockwise weight="bold" /></RowIcon>}
            title={t('cardTab.auto')}
            trailing={auto.on ? t('cardTab.autoOn', { below: m(auto.below), amount: m(auto.amount) }) : t('cardTab.off')}
            onClick={() => navigate('/card/auto')}
          />
          <ListRow leading={<RowIcon><ArrowsLeftRight weight="bold" /></RowIcon>} title={t('cardTab.transfer')} onClick={() => navigate('/card/transfer')} />
          <ListRow leading={<RowIcon tone="muted"><PlusCircle weight="bold" /></RowIcon>} title={t('cardTab.addCard')} onClick={() => setAddCard(true)} />
          <ListRow
            leading={<RowIcon tone="muted"><Wallet weight="bold" /></RowIcon>}
            title={card.express ? t('cardTab.inWallet') : t('cardTab.wallet')}
            onClick={card.express ? undefined : () => setWallet(true)}
          />
        </ListGroup>

        {recent.length > 0 && (
          <section className="px-4">
            <div className="flex items-baseline justify-between px-4 pb-1.5">
              <h2 className="section-title px-0">{t('cardTab.recent')}</h2>
              <button type="button" onClick={() => navigate('/profile/trips')} className="text-subheadline text-action">
                {t('cardTab.seeAll')}
              </button>
            </div>
            <div className="divide-y divide-line overflow-hidden rounded-group bg-surface">
              {recent.map((a) => (
                <TripRow key={a.id} {...row(a)} />
              ))}
            </div>
          </section>
        )}
      </div>
      <WalletSheet open={wallet} onClose={() => setWallet(false)} />
      <AddCardSheet open={addCard} onClose={() => setAddCard(false)} />
    </div>
  );
};
