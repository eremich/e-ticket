import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { EticketCard } from '../../components/EticketCard';
import { useName, useT } from '../../i18n';
import { money } from '../../lib/format';
import { useStore } from '../../store/useStore';
import { FOUND_MS, HoldIllustration, READING_MS } from '../onboarding/AddCard';
import { Footer } from './parts';

type Phase = 'hold' | 'reading' | 'done';

/** Plastic card to phone: hold it to the back of the phone, the balance moves to a virtual card and the plastic one is blocked */
export const ToPhone = () => {
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
  const startBalance = useRef(card?.balance ?? 0);
  const [phase, setPhase] = useState<Phase>('hold');
  const [newId, setNewId] = useState<string | null>(null);

  useEffect(() => {
    if (!card || card.blocked) return;
    const a = setTimeout(() => setPhase('reading'), READING_MS);
    const b = setTimeout(() => {
      setNewId(blockAndMove(card.id));
      setPhase('done');
      toast(t('lost.blocked'));
    }, FOUND_MS);
    return () => [a, b].forEach(clearTimeout);
    // The simulation runs once per visit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!card) return <Navigate to="/profile/cards" replace />;
  const fresh = cards.find((c) => c.id === newId);
  const done = () => {
    if (newId) setActive(newId);
    navigate('/card');
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar title={t('cards.toPhone')} onBack={phase === 'done' ? undefined : () => navigate(-1)} backLabel={t('common.back')} />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-4">
        {phase === 'done' && fresh ? (
          <div className="rise flex flex-col items-center gap-5 text-center">
            <div className="w-full">
              <EticketCard name={name(fresh.name)} number={fresh.number} balance={fresh.balance} fare={fare} kind="virtual" />
            </div>
            <CheckCircle aria-hidden weight="fill" className="pop-in size-10 text-ok" />
            <div className="flex flex-col gap-1">
              <h1 className="tnum text-title2 text-ink">{t('toPhone.doneTitle', { amount: money(t.lang, startBalance.current) })}</h1>
              <p className="text-body text-muted">{t('toPhone.doneBody')}</p>
            </div>
          </div>
        ) : (
          <>
            <HoldIllustration />
            <div aria-live="polite" className="flex flex-col items-center gap-1 text-center">
              <h1 className="text-title2 text-ink">{t('toPhone.holdTitle')}</h1>
              <p className="text-body text-muted">{t('toPhone.holdBody')}</p>
              {phase === 'reading' && (
                <p className="mt-2 flex items-center gap-2 text-subheadline text-action">
                  <CircleNotch aria-hidden weight="bold" className="size-4 animate-spin" />
                  {t('toPhone.reading')}
                </p>
              )}
            </div>
          </>
        )}
      </div>
      {phase === 'done' && (
        <Footer>
          <Button block onClick={done}>
            {t('common.done')}
          </Button>
        </Footer>
      )}
    </div>
  );
};
