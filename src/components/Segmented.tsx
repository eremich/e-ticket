import { cx } from '../lib/cx';

export interface SegmentedProps<K extends string> {
  label: string;
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}

/** iOS segmented control. The thumb slides between segments. */
export const Segmented = <K extends string>({ label, options, value, onChange }: SegmentedProps<K>) => {
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  return (
    <div role="tablist" aria-label={label} className="relative flex rounded-inner bg-raised p-0.5">
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 rounded-[7px] bg-surface shadow-[0_1px_3px_rgb(0_0_0/0.12)] transition-transform duration-200 ease-out"
        style={{ width: `calc((100% - 4px) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o) => {
        const on = o.key === value;
        return (
          <button
            key={o.key}
            role="tab"
            type="button"
            aria-selected={on}
            onClick={() => onChange(o.key)}
            className={cx('relative h-8 flex-1 truncate px-2 text-footnote transition-colors duration-150', on ? 'font-semibold text-ink' : 'text-ink/80')}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
};
