import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CircleNotch } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { EticketCard } from '../../components/EticketCard';
import { useName, useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import { StickyFooter } from './parts';

const MOVE_MS = 1500;

type Phase = 'ask' | 'moving' | 'done';

/** After signing in on a new phone: bring the card and its balance here. The old phone stops working as a card. */
export const NewPhone = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const cards = useStore((s) => s.cards);
  const fare = useStore((s) => s.fare);
  const card = cards.find((c) => c.id === 'main') ?? cards[0];
  const [phase, setPhase] = useState<Phase>('ask');

  useEffect(() => {
    if (phase !== 'moving') return;
    const id = setTimeout(() => setPhase('done'), MOVE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-6 px-4 pb-6 pt-8">
        <div className="w-full">
          <EticketCard name={name(card.name)} number={card.number} balance={card.balance} fare={fare} kind={card.kind} reduced={card.reduced} />
        </div>
        <div aria-live="polite" className="flex flex-col items-center gap-2 text-center">
          {phase === 'ask' && (
            <>
              <h1 className="text-title2 text-ink">{t('newPhone.title')}</h1>
              <p className="text-body text-muted">{t('newPhone.body')}</p>
            </>
          )}
          {phase === 'moving' && (
            <p role="status" className="flex items-center gap-2 text-headline text-ink">
              <CircleNotch aria-hidden weight="bold" className="size-5 animate-spin text-action" />
              {t('newPhone.moving')}
            </p>
          )}
          {phase === 'done' && (
            <>
              <CheckCircle aria-hidden weight="fill" className="pop-in size-12 text-ok" />
              <h1 className="text-title2 text-ink">{t('newPhone.doneTitle')}</h1>
              <p className="text-body text-muted">{t('newPhone.doneBody')}</p>
            </>
          )}
        </div>
      </div>
      <StickyFooter>
        {phase === 'done' ? (
          <Button block onClick={() => navigate('/')}>
            {t('onboarding.continue')}
          </Button>
        ) : (
          <>
            <Button block loading={phase === 'moving'} onClick={() => setPhase('moving')}>
              {t('newPhone.move')}
            </Button>
            <Button variant="plain" block disabled={phase === 'moving'} onClick={() => navigate('/')}>
              {t('newPhone.notNow')}
            </Button>
          </>
        )}
      </StickyFooter>
    </div>
  );
};
