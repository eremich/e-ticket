import { AppleLogo } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface ApplePayButtonProps {
  /** Text before the mark: "Top up ₴100 with" */
  label: string;
  onClick?: () => void;
  loading?: boolean;
}

/** Apple Pay button: black on light, white on dark (ink flips with the theme), label then the Pay mark */
export const ApplePayButton = ({ label, onClick, loading = false }: ApplePayButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    aria-busy={loading || undefined}
    className={cx('press flex min-h-13 w-full items-center justify-center gap-1.5 rounded-control bg-ink text-headline text-canvas transition-opacity', loading && 'opacity-70')}
  >
    <span>{label}</span>
    <span aria-label="Apple Pay" className="flex items-center font-semibold">
      <AppleLogo aria-hidden weight="fill" className="-mt-0.5 size-5" />
      Pay
    </span>
  </button>
);
