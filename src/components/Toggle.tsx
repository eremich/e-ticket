import { cx } from '../lib/cx';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

/** iOS switch. The visible label lives in the row; this carries it for screen readers. */
export const Toggle = ({ checked, onChange, label, disabled }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={cx(
      'relative h-[31px] w-[51px] shrink-0 rounded-chip transition-colors duration-200 disabled:opacity-40',
      checked ? 'bg-ok' : 'bg-raised',
    )}
  >
    <span
      aria-hidden
      className={cx(
        'absolute left-0.5 top-0.5 size-[27px] rounded-chip bg-white shadow-[0_3px_8px_rgb(0_0_0/0.15),0_1px_1px_rgb(0_0_0/0.16)] transition-transform duration-200 ease-out',
        checked && 'translate-x-5',
      )}
    />
  </button>
);
