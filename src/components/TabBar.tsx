import type { Icon } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface TabItem {
  key: string;
  label: string;
  icon: Icon;
  badge?: boolean;
}

export interface TabBarProps {
  items: TabItem[];
  active: string;
  onSelect: (key: string) => void;
}

/** Classic iOS tab bar: labeled tabs, solid bar with a hairline, no floating glass. */
export const TabBar = ({ items, active, onSelect }: TabBarProps) => (
  <nav aria-label="Main" className="border-t border-line bg-surface/95 pb-[max(20px,env(safe-area-inset-bottom))] backdrop-blur">
    <ul className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map(({ key, label, icon: Icon, badge }) => {
        const on = key === active;
        return (
          <li key={key}>
            <button
              type="button"
              aria-current={on ? 'page' : undefined}
              onClick={() => onSelect(key)}
              className={cx(
                'press flex h-[50px] w-full flex-col items-center justify-center gap-0.5 text-tab transition-colors duration-150',
                on ? 'text-action' : 'text-muted hover:text-ink',
              )}
            >
              <span className="relative">
                <Icon aria-hidden className="size-[26px]" weight={on ? 'fill' : 'regular'} />
                {badge && (
                  <span className="absolute -right-1 -top-0.5 size-2.5 rounded-chip border-2 border-surface bg-error">
                    <span className="sr-only">Needs attention</span>
                  </span>
                )}
              </span>
              {label}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);
