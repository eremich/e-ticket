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

/**
 * Floating glass tab bar (iOS 26). Four labeled tabs, icon + text.
 * The selected capsule slides to the new tab. Positioning is the caller's job:
 * the app floats it over content, Storybook shows it on its own.
 */
export const TabBar = ({ items, active, onSelect }: TabBarProps) => {
  const index = Math.max(0, items.findIndex((i) => i.key === active));
  return (
    <nav aria-label="Main" className="material-glass rounded-chip p-1 shadow-floating">
      <ul className="relative grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {/* Selected capsule slides between tabs */}
        <li
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 rounded-chip bg-raised transition-transform duration-indicator ease-out"
          style={{ width: `${100 / items.length}%`, transform: `translateX(${index * 100}%)` }}
        />
        {items.map(({ key, label, icon: Icon, badge }) => {
          const on = key === active;
          return (
            <li key={key} className="relative">
              <button
                type="button"
                aria-current={on ? 'page' : undefined}
                onClick={() => onSelect(key)}
                className={cx(
                  'press flex h-14 w-full flex-col items-center justify-center gap-0.5 rounded-chip text-tab transition-colors duration-150',
                  on ? 'text-action' : 'text-ink/70 hover:text-ink',
                )}
              >
                <span className="relative">
                  <Icon aria-hidden className="size-6" weight={on ? 'fill' : 'regular'} />
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
};
