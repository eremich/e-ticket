import { useNavigate } from 'react-router-dom';
import { Wallet } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { EticketCard } from '../../components/EticketCard';
import { WALLET_POINTS } from '../card/walletPoints';
import { useName, useT } from '../../i18n';
import { useActiveCard, useStore } from '../../store/useStore';
import { StickyFooter } from './parts';

/** Onboarding step: add the card to Apple Wallet for express mode, or skip */
export const WalletStep = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const card = useActiveCard();
  const fare = useStore((s) => s.fare);
  const add = useStore((s) => s.addToWallet);
  const toast = useStore((s) => s.toast);
  const next = () => navigate('/onboarding/location');
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('wallet.title')} />
      <div className="flex flex-1 flex-col gap-5 px-4 pb-6 pt-2">
        <div className="mx-auto w-full max-w-72">
          <EticketCard name={name(card.name)} number={card.number} balance={card.balance} fare={fare} kind={card.kind} reduced={card.reduced} express />
        </div>
        <p className="text-body text-ink">{t('wallet.body')}</p>
        <ul className="flex flex-col gap-3">
          {WALLET_POINTS.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-center gap-3 text-body text-ink">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-chip bg-action-soft text-action">
                <Icon aria-hidden weight="bold" className="size-5" />
              </span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
      <StickyFooter>
        <button
          type="button"
          onClick={() => {
            add(card.id);
            toast(t('wallet.added'));
            next();
          }}
          className="press flex min-h-13 w-full items-center justify-center gap-2 rounded-control bg-ink text-headline text-canvas"
        >
          <Wallet aria-hidden weight="fill" className="size-5" />
          {t('wallet.add')}
        </button>
        <Button variant="plain" block onClick={next}>
          {t('onboarding.skip')}
        </Button>
      </StickyFooter>
    </div>
  );
};
