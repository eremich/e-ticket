import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface SystemAlertAction {
  label: string;
  onPress: () => void;
  /** Bold, as iOS marks the recommended answer */
  primary?: boolean;
}

export interface SystemAlertProps {
  title: string;
  body: ReactNode;
  actions: SystemAlertAction[];
}

/**
 * A simulated iOS system alert: 270pt wide, blurred, buttons stacked and split by hairlines.
 * It covers its container with a dim layer, so place it inside the phone screen.
 */
export const SystemAlert = ({ title, body, actions }: SystemAlertProps) => {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => first.current?.focus(), []);
  return (
    <div className="pointer-events-auto absolute inset-0 z-overlay flex items-center justify-center bg-scrim/40">
      <div role="alertdialog" aria-modal="true" aria-label={title} className="pop-in w-[270px] overflow-hidden rounded-sheet bg-surface/85 text-center backdrop-blur-xl">
        <div className="flex flex-col gap-1 px-4 pb-4 pt-5">
          <h2 className="text-headline text-ink">{title}</h2>
          <p className="text-footnote text-ink">{body}</p>
        </div>
        <div className="flex flex-col">
          {actions.map((a, i) => (
            <button
              key={a.label}
              ref={i === 0 ? first : undefined}
              type="button"
              onClick={a.onPress}
              className={cx('min-h-11 border-t border-line px-3 py-2 text-body text-action transition-colors duration-100 active:bg-raised', a.primary && 'font-semibold')}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
