import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { CardNumberField, isCardNumber } from '../../components/CardNumberField';
import { EticketCard } from '../../components/EticketCard';
import { useName, useT } from '../../i18n';
import { money } from '../../lib/format';
import { useStore } from '../../store/useStore';
import { StickyFooter } from './parts';
import { buildCard, FOUND_BALANCE, FOUND_NUMBER } from './newCard';

export const READING_MS = 1600;
export const FOUND_MS = 2800;

type Phase = 'hold' | 'reading' | 'found';

/** A phone with a card at its back and rings spreading from the reader */
export const HoldIllustration = () => (
  <div aria-hidden className="relative mx-auto flex h-56 w-48 items-center justify-center">
    {[0, 1].map((i) => (
      <span key={i} className="ring-out absolute size-40 rounded-full border-2 border-action" style={{ animationDelay: `${i * 0.9}s` }} />
    ))}
    <span className="relative h-52 w-28 rounded-[24px] border-[3px] border-ink bg-surface">
      <span className="absolute left-1/2 top-2.5 size-4 -translate-x-1/2 rounded-full bg-raised ring-1 ring-line" />
    </span>
    <span className="absolute bottom-6 right-3 h-20 w-32 rotate-[-12deg] rounded-inner bg-card-face shadow-object" />
  </div>
);

/** Hold the card to the phone (simulated read), or type the number. Both end in a linked card. */
export const AddCard = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const [q, setQ] = useSearchParams();
  const number = q.get('mode') === 'number';
  const fromCard = q.get('from') === 'card';
  const cards = useStore((s) => s.cards);
  const addCard = useStore((s) => s.addCard);
  const toast = useStore((s) => s.toast);
  const fare = useStore((s) => s.fare);
  const [phase, setPhase] = useState<Phase>('hold');
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (number) return;
    setPhase('hold');
    const a = setTimeout(() => setPhase('reading'), READING_MS);
    const b = setTimeout(() => setPhase('found'), FOUND_MS);
    return () => [a, b].forEach(clearTimeout);
  }, [number]);

  const link = (digits: string) => {
    const card = buildCard(cards, digits, FOUND_BALANCE, 'plastic');
    addCard(card);
    if (fromCard) {
      toast(t('addCard.added'));
      navigate('/card');
    } else {
      navigate('/onboarding/reduced');
    }
  };
  const preview = buildCard(cards, FOUND_NUMBER, FOUND_BALANCE, 'plastic');

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar title={t('addCard.title')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      {number ? (
        <>
          <div className="flex flex-1 flex-col gap-4 px-4 pb-6 pt-4">
            <CardNumberField value={typed} onChange={setTyped} />
          </div>
          <StickyFooter>
            <Button block disabled={!isCardNumber(typed)} onClick={() => link(typed)}>
              {t('addCard.add')}
            </Button>
          </StickyFooter>
        </>
      ) : (
        <>
          <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-4">
            {phase === 'found' ? (
              <div className="rise flex flex-col gap-5">
                <div className="mx-auto w-full max-w-72">
                  <EticketCard name={name(preview.name)} number={preview.number} balance={preview.balance} fare={fare} />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <CheckCircle aria-hidden weight="fill" className="pop-in size-10 text-ok" />
                  <h1 className="text-title2 text-ink">{t('addCard.found')}</h1>
                  <p className="tnum text-body text-muted">{t('addCard.foundBody', { amount: money(t.lang, FOUND_BALANCE) })}</p>
                </div>
              </div>
            ) : (
              <>
                <HoldIllustration />
                <div aria-live="polite" className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-title2 text-ink">{t('addCard.holdTitle')}</h1>
                  <p className="text-body text-muted">{t('addCard.holdBody')}</p>
                  {phase === 'reading' && (
                    <p className="mt-2 flex items-center gap-2 text-subheadline text-action">
                      <CircleNotch aria-hidden weight="bold" className="size-4 animate-spin" />
                      {t('addCard.reading')}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <StickyFooter>
            {phase === 'found' ? (
              <Button block onClick={() => link(FOUND_NUMBER)}>
                {t('onboarding.continue')}
              </Button>
            ) : (
              <Button variant="plain" block onClick={() => setQ({ mode: 'number', ...(fromCard ? { from: 'card' } : {}) }, { replace: true })}>
                {t('addCard.switchToNumber')}
              </Button>
            )}
          </StickyFooter>
        </>
      )}
    </div>
  );
};
