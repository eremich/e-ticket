import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Prohibit } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { EticketCard } from '../../components/EticketCard';
import { useName, useT } from '../../i18n';
import { money } from '../../lib/format';
import { useStore } from '../../store/useStore';
import { AlertPortal, Footer } from './parts';

/** Lost card: block it, and its balance moves to a new virtual card in the phone */
export const LostCard = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const { id } = useParams();
  const cards = useStore((s) => s.cards);
  const fare = useStore((s) => s.fare);
  const blockAndMove = useStore((s) => s.blockAndMove);
  const setActive = useStore((s) => s.setActiveCard);
  const toast = useStore((s) => s.toast);
  const card = cards.find((c) => c.id === id);
  const [confirm, setConfirm] = useState(false);
  const [moved, setMoved] = useState<{ amount: number; newId: string } | null>(null);

  if (!card) return <Navigate to="/profile/cards" replace />;
  const m = (n: number) => money(t.lang, n);

  const block = () => {
    setConfirm(false);
    const amount = card.balance;
    const newId = blockAndMove(card.id);
    setMoved({ amount, newId });
    toast(t('lost.blocked'));
  };
  const done = () => {
    if (moved) setActive(moved.newId);
    navigate('/card');
  };

  if (moved) {
    const fresh = cards.find((c) => c.id === moved.newId);
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar title={t('lost.blocked')} />
        <div className="flex flex-1 flex-col items-center gap-5 px-6 pb-6 pt-4 text-center">
          {/* The blocked card sits behind the new one, only its top edge showing */}
          <div className="w-full">
            <div className="mx-auto w-[90%]">
              <EticketCard name={name(card.name)} number={card.number} balance={card.balance} fare={fare} kind={card.kind} blocked />
            </div>
            {fresh && (
              <div className="relative -mt-32">
                <EticketCard name={name(fresh.name)} number={fresh.number} balance={fresh.balance} fare={fare} kind="virtual" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-title2 text-ink">{t('lost.blocked')}</h1>
            <p className="tnum text-body text-muted">{t('lost.doneBody', { amount: m(moved.amount) })}</p>
          </div>
        </div>
        <Footer>
          <Button block onClick={done}>
            {t('common.done')}
          </Button>
        </Footer>
      </div>
    );
  }

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('lost.title')} onBack={() => navigate(-1)} backLabel={name(card.name)} />
      <div className="flex flex-1 flex-col items-center gap-6 px-6 pt-6 text-center">
        <span aria-hidden className="flex size-24 items-center justify-center rounded-chip bg-error/10 text-error">
          <Prohibit weight="bold" className="size-12" />
        </span>
        <p className="text-body text-muted">{t('lost.body')}</p>
      </div>
      <Footer>
        <Button block className="!bg-error !text-on-action" onClick={() => setConfirm(true)}>
          {t('lost.block')}
        </Button>
      </Footer>
      {confirm && (
        <AlertPortal
          title={t('lost.alertTitle')}
          body={t('lost.alertBody', { amount: m(card.balance) })}
          actions={[
            { label: t('common.cancel'), onPress: () => setConfirm(false) },
            { label: t('lost.block'), primary: true, onPress: block },
          ]}
        />
      )}
    </div>
  );
};
