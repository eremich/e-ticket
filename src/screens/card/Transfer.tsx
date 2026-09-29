import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { AmountChips } from '../../components/AmountChips';
import { Button } from '../../components/Button';
import { PaySheet } from '../../components/PaySheet';
import { useName, useT } from '../../i18n';
import { money } from '../../lib/format';
import { cx } from '../../lib/cx';
import { useActiveCard, useStore } from '../../store/useStore';

const AMOUNTS = [20, 50, 100];

/** 16 digits in groups of four, as printed on the card */
const groupDigits = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

/** Send balance to a saved card (Mom's) or any Eticket number, confirmed with Face ID */
export const Transfer = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const fieldId = useId();
  const me = useActiveCard();
  const cards = useStore((s) => s.cards);
  const transferTo = useStore((s) => s.transferTo);
  const toast = useStore((s) => s.toast);
  const others = cards.filter((c) => c.id !== me.id);
  const [to, setTo] = useState<string>(others[0]?.id ?? 'number');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState(50);
  const [confirm, setConfirm] = useState(false);
  const m = (n: number) => money(t.lang, n);

  const digits = number.replace(/\s/g, '').length;
  const numberInvalid = to === 'number' && digits > 0 && digits < 16;
  const tooMuch = amount > me.balance;
  const ready = !tooMuch && (to !== 'number' || digits === 16);
  const target = cards.find((c) => c.id === to);
  const targetName = target ? name(target.name) : `•••• ${number.slice(-4)}`;

  return (
    <div className="flex flex-1 flex-col">
      <NavBar title={t('transfer.title')} onBack={() => navigate(-1)} backLabel={t('tab.card')} />
      <div className="flex flex-1 flex-col gap-6 pb-6 pt-2">
        <ListGroup header={t('transfer.to')}>
          {others.map((c) => (
            <ListRow
              key={c.id}
              title={name(c.name)}
              subtitle={`•••• ${c.number.slice(-4)}`}
              chevron={false}
              trailing={to === c.id ? <Check aria-label="Selected" weight="bold" className="size-5 text-action" /> : undefined}
              onClick={() => setTo(c.id)}
            />
          ))}
          <ListRow
            title={t('transfer.number')}
            chevron={false}
            trailing={to === 'number' ? <Check aria-label="Selected" weight="bold" className="size-5 text-action" /> : undefined}
            onClick={() => setTo('number')}
          />
        </ListGroup>
        {to === 'number' && (
          <div className="rise flex flex-col gap-1 px-4">
            <label htmlFor={fieldId} className="sr-only">
              {t('transfer.number')}
            </label>
            <input
              id={fieldId}
              inputMode="numeric"
              autoComplete="off"
              placeholder="0124 0000 0000 0000"
              value={number}
              onChange={(e) => setNumber(groupDigits(e.target.value))}
              aria-invalid={numberInvalid || undefined}
              aria-describedby={`${fieldId}-hint`}
              className={cx('tnum h-13 rounded-control bg-surface px-4 text-headline text-ink outline-none ring-1 ring-inset placeholder:text-muted/60 focus:ring-2', numberInvalid ? 'ring-error' : 'ring-line focus:ring-action')}
            />
            <p id={`${fieldId}-hint`} className={cx('px-1 text-footnote', numberInvalid ? 'text-error' : 'text-muted')}>
              {numberInvalid ? t('transfer.invalid') : t('transfer.numberHint')}
            </p>
          </div>
        )}
        <section className="flex flex-col gap-2 px-4">
          <h2 className="section-title px-1">{t('transfer.amount')}</h2>
          <AmountChips label={t('transfer.amount')} amounts={AMOUNTS} value={amount} onChange={setAmount} />
          <p className={cx('tnum px-1 text-footnote', tooMuch ? 'text-error' : 'text-muted')}>
            {tooMuch ? t('transfer.notEnough', { balance: m(me.balance) }) : `${t('card.balance')} ${m(me.balance)}`}
          </p>
        </section>
      </div>
      <div className="sticky bottom-0 z-10 border-t border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur">
        <Button block disabled={!ready} onClick={() => setConfirm(true)}>
          {t('transfer.send', { amount: m(amount) })}
        </Button>
      </div>
      <PaySheet
        open={confirm}
        faceIdOnly
        title={t('transfer.confirm')}
        amount={amount}
        merchant={targetName}
        onCancel={() => setConfirm(false)}
        onDone={() => {
          setConfirm(false);
          transferTo(target ? target.id : 'external', amount);
          toast(t('transfer.done', { amount: m(amount), name: targetName }));
          navigate('/card', { replace: true });
        }}
      />
    </div>
  );
};
