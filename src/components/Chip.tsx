import type { ReactNode } from 'react';
import { Check } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** single: one choice (amounts) — accent fill. toggle: independent filters — white with a check, so several on at once stay calm */
  variant?: 'single' | 'toggle';
}

/** Selectable pill for filters and amounts. Selected = the accent fill, otherwise a quiet gray pill. */
export const Chip = ({ label, selected = false, icon, onClick, disabled, variant = 'single' }: ChipProps) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onClick}
    className={cx(
      'press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-chip px-4 text-subheadline transition-colors duration-150 disabled:opacity-40',
      variant === 'toggle'
        ? selected
          ? 'bg-surface font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)] ring-1 ring-inset ring-line'
          : 'text-muted ring-1 ring-inset ring-line hover:text-ink'
        : selected
          ? 'bg-accent font-semibold text-on-accent'
          : 'bg-raised text-ink hover:bg-line',
    )}
  >
    {variant === 'toggle' && selected ? <Check aria-hidden weight="bold" className="size-4 text-action" /> : icon}
    <span>{label}</span>
  </button>
);
