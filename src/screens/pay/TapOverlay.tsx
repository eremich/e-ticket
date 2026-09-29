import { useEffect, useRef, useState } from 'react';
import { TapResult } from '../../components/TapResult';
import { PaySheet } from '../../components/PaySheet';
import { TAP_PLACES, TRANSFER_WINDOW } from '../../data/cards';
import { useName, useT } from '../../i18n';
import { NOW } from '../../lib/time';
import { money } from '../../lib/format';
import { useActiveCard, useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

/** How long the phone "stays at the reader" before the validator answers */
const HOLD_MS = 1400;
const TOP_UP = 100;

/**
 * Paying at the validator, full screen over the app like the Wallet pass.
 * Hold → paid / free transfer / declined → (Apple Pay top-up → ready → tap again).
 */
export const TapOverlay = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const tap = useStore((s) => s.tap);
  const resolve = useStore((s) => s.resolveTap);
  const close = useStore((s) => s.closeTap);
  const start = useStore((s) => s.startTap);
  const setPaying = useStore((s) => s.setTapPaying);
  const topUp = useStore((s) => s.topUp);
  const toast = useStore((s) => s.toast);
  const offline = useStore((s) => s.offline);
  const lastPaidAt = useStore((s) => s.lastPaidAt);
  const fare = useStore((s) => s.fare);
  const card = useActiveCard();
  const sheetRoot = useRef<HTMLDivElement>(null);
  const [toppedUp, setToppedUp] = useState(0);

  useEffect(() => {
    if (tap?.step !== 'hold') return;
    const id = setTimeout(resolve, HOLD_MS);
    return () => clearTimeout(id);
  }, [tap?.step, resolve]);

  if (!tap) return null;
  const place = TAP_PLACES.find((p) => p.id === tap.placeId)!;

  return (
    <div role="dialog" aria-modal="true" aria-label={t('tap.hold')} className="rise absolute inset-x-0 bottom-0 top-[54px] z-overlay flex flex-col bg-canvas">
      <TapResult
        state={tap.step}
        card={{ name: name(card.name), number: card.number, balance: card.balance, fare, kind: card.kind, reduced: card.reduced, express: card.express }}
        place={{ transport: place.transport, number: place.number, name: name(place.name), time: NOW }}
        fare={tap.fare}
        balance={card.balance}
        transferUntil={lastPaidAt !== null ? lastPaidAt + TRANSFER_WINDOW : undefined}
        topUpAmount={TOP_UP}
        toppedUp={toppedUp}
        offline={offline}
        onCancel={close}
        onDone={close}
        onTapAgain={() => start(tap.step === 'success')}
        onTopUp={() => setPaying(true)}
        onOtherTopUp={() => {
          close();
          navigate('/card/top-up');
        }}
      />
      <div ref={sheetRoot} className="pointer-events-none absolute inset-0" />
      <PaySheet
        open={!!tap.paying}
        amount={TOP_UP}
        merchant={t('pay.merchant')}
        container={sheetRoot.current}
        onCancel={() => setPaying(false)}
        onDone={() => {
          topUp(TOP_UP, 'applepay');
          setToppedUp(TOP_UP);
          toast(t('topup.done', { amount: money(t.lang, TOP_UP) }));
          useStore.setState((s) => ({ tap: s.tap ? { ...s.tap, step: 'ready', paying: false } : null }));
        }}
      />
    </div>
  );
};
