import { cx } from '../lib/cx';

export interface TicketOptionProps {
  name: string;
  body: string;
  /** Formatted price: "₴60" */
  price: string;
  selected: boolean;
  onSelect: () => void;
}

/** One ticket to choose from. A radio card: selected takes the action tint and a 2px ring. */
export const TicketOption = ({ name, body, price, selected, onSelect }: TicketOptionProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={cx(
      'press flex min-h-16 w-full items-center gap-3 rounded-group p-4 text-left transition-colors duration-150',
      selected ? 'bg-surface ring-2 ring-inset ring-accent' : 'bg-surface ring-1 ring-inset ring-line',
    )}
  >
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="text-headline text-ink">{name}</span>
      <span className="text-subheadline text-muted">{body}</span>
    </span>
    <span className="tnum shrink-0 text-title2 text-ink">{price}</span>
  </button>
);
