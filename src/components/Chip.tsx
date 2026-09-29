import type { ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/** Selectable pill for filters and amounts. Selected = action tint with a hairline ring + aria-pressed. */
export const Chip = ({ label, selected = false, icon, onClick, disabled }: ChipProps) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onClick}
    className={cx(
      'press inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-chip px-4 text-subheadline transition-colors duration-150 disabled:opacity-40',
      selected ? 'bg-action-soft font-semibold text-action ring-1 ring-inset ring-action/40' : 'bg-surface text-ink ring-1 ring-inset ring-line hover:ring-muted/50',
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);
