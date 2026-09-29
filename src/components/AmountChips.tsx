import { useId } from 'react';
import { useT } from '../i18n';
import { money } from '../lib/format';
import { cx } from '../lib/cx';

export interface AmountChipsProps {
  amounts: number[];
  value: number;
  onChange: (value: number) => void;
  /** Adds "Other" with a numeric field */
  other?: boolean;
  /** Other is chosen (the value is typed) */
  custom?: boolean;
  onCustom?: (custom: boolean) => void;
  min?: number;
  max?: number;
  label: string;
}

/** Preset amounts as big tappable tiles, plus Other with a field. Money first, in the locale's format. */
export const AmountChips = ({ amounts, value, onChange, other = false, custom = false, onCustom, min = 10, max = 2000, label }: AmountChipsProps) => {
  const t = useT();
  const fieldId = useId();
  const invalid = custom && (value < min || value > max);
  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2">
        {amounts.map((a) => {
          const on = !custom && a === value;
          return (
            <button
              key={a}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                onCustom?.(false);
                onChange(a);
              }}
              className={cx(
                'press tnum h-13 rounded-control text-headline transition-colors duration-150',
                on ? 'bg-action-soft text-action ring-2 ring-inset ring-action' : 'bg-surface text-ink ring-1 ring-inset ring-line',
              )}
            >
              {money(t.lang, a)}
            </button>
          );
        })}
        {other && (
          <button
            type="button"
            role="radio"
            aria-checked={custom}
            onClick={() => onCustom?.(true)}
            className={cx(
              'press h-13 rounded-control text-headline transition-colors duration-150',
              custom ? 'bg-action-soft text-action ring-2 ring-inset ring-action' : 'bg-surface text-ink ring-1 ring-inset ring-line',
            )}
          >
            {t('topup.other')}
          </button>
        )}
      </div>
      {custom && (
        <div className="rise flex flex-col gap-1">
          <label htmlFor={fieldId} className="px-1 text-footnote text-muted">
            {t('topup.otherLabel')}
          </label>
          <input
            id={fieldId}
            inputMode="numeric"
            autoFocus
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '').slice(0, 4)))}
            aria-invalid={invalid || undefined}
            aria-describedby={`${fieldId}-hint`}
            className={cx('tnum h-13 rounded-control bg-surface px-4 text-title2 text-ink outline-none ring-1 ring-inset focus:ring-2', invalid ? 'ring-error' : 'ring-line focus:ring-action')}
          />
          <p id={`${fieldId}-hint`} className={cx('px-1 text-footnote', invalid ? 'text-error' : 'text-muted')}>
            {t('topup.min', { min: money(t.lang, min), max: money(t.lang, max) })}
          </p>
        </div>
      )}
    </div>
  );
};
