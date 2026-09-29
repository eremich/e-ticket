import { Wallet } from '@phosphor-icons/react';
import { Sheet } from '../../components/Sheet';
import { EticketCard } from '../../components/EticketCard';
import { useName, useT } from '../../i18n';
import { useActiveCard, useStore } from '../../store/useStore';
import { WALLET_POINTS } from './walletPoints';

/** Simulated "Add to Apple Wallet": what express mode means, in three lines */
export const WalletSheet = ({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded?: () => void }) => {
  const t = useT();
  const name = useName();
  const card = useActiveCard();
  const fare = useStore((s) => s.fare);
  const add = useStore((s) => s.addToWallet);
  const toast = useStore((s) => s.toast);
  return (
    <Sheet
      open={open}
      title={t('wallet.title')}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={() => {
            add(card.id);
            toast(t('wallet.added'));
            onClose();
            onAdded?.();
          }}
          className="press flex min-h-13 w-full items-center justify-center gap-2 rounded-control bg-ink text-headline text-canvas"
        >
          <Wallet aria-hidden weight="fill" className="size-5" />
          {t('wallet.add')}
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="mx-auto w-64">
          <EticketCard name={name(card.name)} number={card.number} balance={card.balance} fare={fare} kind={card.kind} express />
        </div>
        <p className="text-body text-ink">{t('wallet.body')}</p>
        <ul className="flex flex-col gap-3">
          {WALLET_POINTS.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-center gap-3 text-body text-ink">
              <span className="flex size-9 items-center justify-center rounded-chip bg-raised text-ink">
                <Icon aria-hidden weight="bold" className="size-5" />
              </span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
};
