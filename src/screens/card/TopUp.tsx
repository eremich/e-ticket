import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppleLogo, Check, CheckCircle, CreditCard, GoogleLogo, ShareNetwork } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { AmountChips } from '../../components/AmountChips';
import { ListGroup, ListRow } from '../../components/ListRow';
import { ApplePayButton } from '../../components/ApplePayButton';
import { Button } from '../../components/Button';
import { Banner } from '../../components/Banner';
import { PaySheet } from '../../components/PaySheet';
import { SAVED_CARD_LAST, type PayMethod } from '../../data/cards';
import { useName, useT } from '../../i18n';
import { clock, date, money } from '../../lib/format';
import { NOW, TODAY } from '../../lib/time';
import { useActiveCard, useStore } from '../../store/useStore';

const AMOUNTS = [50, 100, 200];
const MIN = 10;
const MAX = 2000;

const METHOD_ICON: Record<PayMethod, JSX.Element> = {
  applepay: <AppleLogo weight="fill" className="size-5" />,
  googlepay: <GoogleLogo weight="bold" className="size-5" />,
  card: <CreditCard weight="fill" className="size-5" />,
};

/** Top up: amount, method, pay. Apple Pay is the default because riders already use it. */
export const TopUp = () => {
  const t = useT();
  const navigate = useNavigate();
  const card = useActiveCard();
  const method = useStore((s) => s.method);
  const setMethod = useStore((s) => s.setMethod);
  const topUp = useStore((s) => s.topUp);
  const [amount, setAmount] = useState(100);
  const [custom, setCustom] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(false);
  const m = (n: number) => money(t.lang, n);
  const valid = amount >= MIN && amount <= MAX;
  const label = (k: PayMethod) => (k === 'card' ? t('method.card', { last: SAVED_CARD_LAST }) : t(`method.${k}`));

  const finish = () => {
    setPaying(false);
    if (!topUp(amount, method)) {
      setError(true);
      return;
    }
    navigate(`/card/top-up/done?amount=${amount}&method=${method}`, { replace: true });
  };

  return (
    <div className="flex flex-1 flex-col">
      <NavBar title={t('topup.title')} onBack={() => navigate(-1)} backLabel={t('tab.card')} />
      <div className="flex flex-1 flex-col gap-6 px-4 pb-6 pt-2">
        <p className="tnum text-subheadline text-muted">
          {t('card.balance')} <span className="font-semibold text-ink">{m(card.balance)}</span>
        </p>
        <section className="flex flex-col gap-2">
          <h2 className="px-4 text-footnote uppercase text-muted">{t('topup.amount')}</h2>
          <AmountChips label={t('topup.amount')} amounts={AMOUNTS} value={amount} onChange={setAmount} other custom={custom} onCustom={setCustom} min={MIN} max={MAX} />
        </section>
        <div className="-mx-4">
          <ListGroup header={t('topup.method')} inset="icon">
            {(['applepay', 'googlepay', 'card'] as PayMethod[]).map((k) => (
              <ListRow
                key={k}
                leading={<span className="flex size-8 items-center justify-center rounded-inner bg-raised text-ink">{METHOD_ICON[k]}</span>}
                title={label(k)}
                trailing={method === k ? <Check aria-label="Selected" weight="bold" className="size-5 text-action" /> : undefined}
                chevron={false}
                onClick={() => {
                  setError(false);
                  setMethod(k);
                }}
              />
            ))}
          </ListGroup>
        </div>
        {error && (
          <Banner tone="error" title={t('topup.errorTitle')}>
            {t('topup.errorBody', { last: SAVED_CARD_LAST })}
          </Banner>
        )}
      </div>
      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur">
        <p className="tnum text-center text-footnote text-muted">{t('topup.after', { amount: m(card.balance + (valid ? amount : 0)) })}</p>
        {method === 'applepay' ? (
          <ApplePayButton label={t('tap.topUpWith', { amount: m(amount) })} onClick={() => valid && setPaying(true)} />
        ) : (
          <Button block disabled={!valid} onClick={() => (method === 'googlepay' ? setPaying(true) : finish())}>
            {t('topup.pay', { amount: m(amount) })}
          </Button>
        )}
      </div>
      <PaySheet open={paying} amount={amount} merchant={t('pay.merchant')} onDone={finish} onCancel={() => setPaying(false)} />
    </div>
  );
};

/** Top-up success with the receipt */
export const TopUpDone = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const [q] = useSearchParams();
  const card = useActiveCard();
  const toast = useStore((s) => s.toast);
  const amount = Number(q.get('amount') ?? 100);
  const method = (q.get('method') ?? 'applepay') as PayMethod;
  const m = (n: number) => money(t.lang, n);
  const rows: [string, string][] = [
    [t('receipt.date'), `${date(t.lang, TODAY)}, ${clock(NOW)}`],
    [t('receipt.method'), method === 'card' ? t('method.card', { last: SAVED_CARD_LAST }) : t(`method.${method}`)],
    [t('receipt.card'), `${name(card.name)} •••• ${card.number.slice(-4)}`],
    [t('receipt.balance'), m(card.balance)],
    [t('receipt.id'), 'ET-2610-0814-3371'],
  ];
  return (
    <div className="flex flex-1 flex-col px-4 pb-6 pt-14">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle aria-hidden weight="fill" className="pop-in size-20 text-ok" />
        <h1 className="tnum text-large-title text-ink">{t('topup.done', { amount: m(amount) })}</h1>
        <p className="text-body text-muted">{t('topup.doneBody')}</p>
      </div>
      <section className="rise mt-8">
        <h2 className="px-4 pb-1.5 text-footnote uppercase text-muted">{t('topup.receipt')}</h2>
        <dl className="divide-y divide-line rounded-group bg-surface">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-body text-muted">{k}</dt>
              <dd className="tnum text-right text-body text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <div className="mt-auto flex flex-col gap-2 pt-6">
        <Button variant="gray" block icon={<ShareNetwork aria-hidden weight="bold" className="size-5" />} onClick={() => toast(t('topup.share'))}>
          {t('topup.share')}
        </Button>
        <Button block onClick={() => navigate('/card', { replace: true })}>
          {t('common.done')}
        </Button>
      </div>
    </div>
  );
};
