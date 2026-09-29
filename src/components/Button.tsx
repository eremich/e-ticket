import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { CircleNotch } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

type Variant = 'filled' | 'tinted' | 'gray' | 'plain' | 'destructive';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** iOS button styles: filled (one per screen), tinted, gray, plain, destructive */
  variant?: Variant;
  size?: 'md' | 'lg';
  icon?: ReactNode;
  trailing?: ReactNode;
  loading?: boolean;
  block?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  filled: 'bg-action text-on-action hover:bg-action/90 disabled:bg-raised disabled:text-muted',
  tinted: 'bg-action-soft text-action hover:bg-action-soft/70 disabled:text-muted',
  gray: 'bg-raised text-ink hover:bg-line disabled:text-muted',
  plain: 'bg-transparent text-action hover:bg-action-soft disabled:text-muted',
  destructive: 'bg-raised text-error hover:bg-error/10 disabled:text-muted',
};

export const Button = ({
  variant = 'filled',
  size = 'lg',
  icon,
  trailing,
  loading = false,
  block = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) => (
  <button
    type="button"
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={cx(
      'press inline-flex items-center justify-center gap-2 rounded-control text-headline transition-colors duration-150 disabled:cursor-not-allowed',
      size === 'lg' ? 'min-h-13 px-5' : 'min-h-11 px-4',
      block && 'w-full',
      VARIANTS[variant],
      className,
    )}
    {...rest}
  >
    {loading ? <CircleNotch aria-hidden className="size-5 animate-spin" weight="bold" /> : icon}
    {children}
    {!loading && trailing}
  </button>
);
