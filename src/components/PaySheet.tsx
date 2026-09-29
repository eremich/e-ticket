import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AppleLogo, CheckCircle, CreditCard, ScanSmiley } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { money } from '../lib/format';
import { cx } from '../lib/cx';

export interface PaySheetProps {
  open: boolean;
  amount: number;
  /** What is being paid for: "Eticket Kharkiv" */
  merchant: string;
  /** Face ID label instead of the side button (transfers) */
  faceIdOnly?: boolean;
  title?: string;
  onDone: () => void;
  onCancel: () => void;
  container?: HTMLElement | null;
}

type Step = 'confirm' | 'scanning' | 'done';

/** Timings of the simulated confirmation (side button → Face ID → done) */
const SCAN_MS = 900;
const DONE_MS = 1700;
const CLOSE_MS = 2400;

/**
 * Simulated Apple Pay sheet, as iOS draws it: dark card, merchant, amount, then Face ID and a check.
 * It runs by itself — in a real phone the rider double-clicks the side button.
 */
export const PaySheet = ({ open, amount, merchant, faceIdOnly = false, title, onDone, onCancel, container }: PaySheetProps) => {
  const t = useT();
  const [step, setStep] = useState<Step>('confirm');

  useEffect(() => {
    if (!open) {
      setStep('confirm');
      return;
    }
    const a = setTimeout(() => setStep('scanning'), SCAN_MS);
    const b = setTimeout(() => setStep('done'), DONE_MS);
    const c = setTimeout(onDone, CLOSE_MS);
    return () => [a, b, c].forEach(clearTimeout);
    // onDone is called once per opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const target = container ?? (typeof document !== 'undefined' ? document.getElementById('sheet-root') : null);
  if (!open || !target) return null;

  return createPortal(
    <div className="pointer-events-auto absolute inset-0 z-overlay flex flex-col justify-end">
      <div aria-hidden onClick={onCancel} className="absolute inset-0 bg-scrim/40" />
      {/* Apple Pay is always dark, like the system sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? t('pay.sheetTitle')}
        data-theme="dark"
        className="rise relative rounded-t-sheet bg-surface px-5 pb-10 pt-4 text-ink shadow-sheet"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center text-headline">
            <AppleLogo aria-hidden weight="fill" className="-mt-0.5 size-5" />
            Pay
          </span>
          <button type="button" onClick={onCancel} className="text-body text-action">
            {t('common.cancel')}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-group bg-raised p-3">
          <span className="flex h-9 w-14 items-center justify-center rounded-inner bg-card-face text-white">
            <CreditCard aria-hidden weight="fill" className="size-5" />
          </span>
          <span className="text-body">{t('pay.card')}</span>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-b border-line pb-3">
          <span className="text-subheadline text-muted">{merchant}</span>
          <span className="tnum text-title2">{money(t.lang, amount)}</span>
        </div>
        <div aria-live="polite" className="mt-6 flex flex-col items-center gap-2">
          {step === 'done' ? (
            <CheckCircle aria-hidden weight="fill" className="pop-in size-14 text-ok" />
          ) : (
            <ScanSmiley aria-hidden weight="light" className={cx('size-14', step === 'scanning' ? 'animate-pulse text-action' : 'text-ink')} />
          )}
          <span className="text-subheadline text-ink">
            {step === 'done' ? t('pay.done') : step === 'scanning' || faceIdOnly ? t('pay.faceId') : t('pay.confirm')}
          </span>
        </div>
        {/* Side button hint: a bar at the right edge, as iOS shows it */}
        {step === 'confirm' && !faceIdOnly && <span aria-hidden className="absolute -right-0.5 top-10 h-16 w-1.5 animate-pulse rounded-l-chip bg-accent" />}
      </div>
    </div>,
    target,
  );
};
