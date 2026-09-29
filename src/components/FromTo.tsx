import { ArrowsDownUp, MapPin, NavigationArrow } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface FromToProps {
  fromLabel: string;
  toLabel: string;
  from: string;
  /** Empty shows the placeholder */
  to?: string;
  placeholder: string;
  swapLabel: string;
  fromIsHere?: boolean;
  onFrom?: () => void;
  onTo?: () => void;
  onSwap?: () => void;
}

/** From / To pair, joined by a dotted line like a trip, with swap on the right */
export const FromTo = ({ fromLabel, toLabel, from, to, placeholder, swapLabel, fromIsHere, onFrom, onTo, onSwap }: FromToProps) => (
  <div className="relative flex items-center gap-2 rounded-group bg-surface py-1 pl-3 pr-1">
    <div className="relative flex min-w-0 flex-1 flex-col">
      <span aria-hidden className="absolute bottom-[26px] left-[9px] top-[26px] w-0.5 bg-[radial-gradient(circle,rgb(var(--c-muted))_1px,transparent_1.2px)] bg-[length:2px_5px] bg-repeat-y" />
      {[
        { label: fromLabel, value: from, onClick: onFrom, icon: fromIsHere ? <NavigationArrow weight="fill" className="size-4 rotate-90 text-action" /> : <span className="size-2.5 rounded-chip border-2 border-ink" /> },
        { label: toLabel, value: to, onClick: onTo, icon: <MapPin weight="fill" className="size-5 text-error" /> },
      ].map((row, i) => (
        <button key={row.label} type="button" onClick={row.onClick} className={cx('flex min-h-13 items-center gap-3 text-left', i === 0 && 'border-b border-line')}>
          <span aria-hidden className="flex w-5 justify-center">
            {row.icon}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-footnote text-muted">{row.label}</span>
            <span className={cx('truncate text-body', row.value ? 'text-ink' : 'text-muted')}>{row.value || placeholder}</span>
          </span>
        </button>
      ))}
    </div>
    <button type="button" aria-label={swapLabel} onClick={onSwap} className="press flex size-11 items-center justify-center rounded-chip text-action hover:bg-action-soft">
      <ArrowsDownUp aria-hidden weight="bold" className="size-5" />
    </button>
  </div>
);
