import { useId } from 'react';
import { useT } from '../i18n';
import { cx } from '../lib/cx';

const PREFIX = '0124';
const LENGTH = 16;

/** 16 digits in groups of four, as printed on the card */
export const groupDigits = (v: string) => v.replace(/\D/g, '').slice(0, LENGTH).replace(/(\d{4})(?=\d)/g, '$1 ');

export const isCardNumber = (v: string) => {
  const d = v.replace(/\s/g, '');
  return d.length === LENGTH && d.startsWith(PREFIX);
};

/** Wrong as soon as it can no longer become valid: a digit that breaks the 0124 start */
const isWrong = (v: string) => {
  const d = v.replace(/\s/g, '');
  return d.length > 0 && !PREFIX.startsWith(d.slice(0, PREFIX.length));
};

/** Small drawing of the card back so riders know where the 16 digits are */
const CardBack = ({ label }: { label: string }) => (
  <svg role="img" aria-label={label} viewBox="0 0 160 100" className="w-40 shrink-0">
    <rect width="160" height="100" rx="10" className="fill-raised" />
    <rect y="14" width="160" height="16" className="fill-muted/60" />
    {Array.from({ length: 22 }, (_, i) => (
      <rect key={i} x={20 + i * 5.6} y="42" width={i % 3 === 0 ? 3 : 1.6} height="22" className="fill-ink" />
    ))}
    <rect x="16" y="72" width="128" height="16" rx="4" className="fill-action-soft stroke-action" strokeWidth="1.5" />
    {[0, 1, 2, 3].map((g) => (
      <rect key={g} x={24 + g * 30} y="78" width="22" height="4" rx="2" className="fill-action" />
    ))}
  </svg>
);

export interface CardNumberFieldProps {
  value: string;
  onChange: (grouped: string) => void;
}

/** Eticket number entry: groups as you type, flags a wrong start early, and shows where to find the number */
export const CardNumberField = ({ value, onChange }: CardNumberFieldProps) => {
  const t = useT();
  const id = useId();
  const invalid = isWrong(value);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="px-1 text-footnote uppercase text-muted">
          {t('addCard.numberTitle')}
        </label>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          placeholder="0124 0000 0000 0000"
          value={value}
          onChange={(e) => onChange(groupDigits(e.target.value))}
          aria-invalid={invalid || undefined}
          aria-describedby={`${id}-hint`}
          className={cx(
            'tnum h-13 rounded-control bg-surface px-4 text-headline text-ink outline-none ring-1 ring-inset placeholder:text-muted/60 focus:ring-2',
            invalid ? 'ring-error' : 'ring-line focus:ring-action',
          )}
        />
        {invalid && (
          <p id={`${id}-hint`} role="alert" className="px-1 text-footnote text-error">
            {t('addCard.invalid')}
          </p>
        )}
      </div>
      <div id={invalid ? undefined : `${id}-hint`} className="flex items-center gap-4 rounded-group bg-surface p-4">
        <CardBack label={t('addCard.backLabel')} />
        <p className="text-subheadline text-muted">{t('addCard.where')}</p>
      </div>
    </div>
  );
};
