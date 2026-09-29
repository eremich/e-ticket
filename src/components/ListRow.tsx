import type { ReactNode } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface ListRowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Makes the row pressable and adds a chevron (unless chevron is false) */
  onClick?: () => void;
  chevron?: boolean;
  destructive?: boolean;
}

/** One row of an inset grouped list. Separators are drawn by ListGroup, inset past the leading icon. */
export const ListRow = ({ title, subtitle, leading, trailing, onClick, chevron = true, destructive = false }: ListRowProps) => {
  const content = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col py-2.5 text-left">
        <span className={cx('text-body', destructive ? 'text-error' : 'text-ink')}>{title}</span>
        {subtitle && <span className="text-subheadline text-muted">{subtitle}</span>}
      </span>
      {trailing && <span className="flex shrink-0 items-center text-body text-muted">{trailing}</span>}
      {onClick && chevron && <CaretRight aria-hidden className="-mr-1 size-4 shrink-0 text-muted/70" weight="bold" />}
    </>
  );
  const cls = 'flex min-h-11 w-full items-center gap-3 px-4';
  return onClick ? (
    <button type="button" onClick={onClick} className={cx(cls, 'text-left transition-colors duration-100 active:bg-raised')}>
      {content}
    </button>
  ) : (
    <div className={cls}>{content}</div>
  );
};

export interface ListGroupProps {
  header?: string;
  footer?: ReactNode;
  children: ReactNode;
  /** Separator inset: 16 for text rows, 60 when rows have a leading icon */
  inset?: 'text' | 'icon';
}

/** iOS inset grouped list: rounded surface block on canvas, footnote header and footer */
export const ListGroup = ({ header, footer, children, inset = 'text' }: ListGroupProps) => (
  <section className="px-4">
    {header && <h2 className="px-4 pb-1.5 text-footnote uppercase text-muted">{header}</h2>}
    <div
      className={cx(
        'overflow-hidden rounded-group bg-surface',
        '[&>*+*]:relative [&>*+*]:before:absolute [&>*+*]:before:right-0 [&>*+*]:before:top-0 [&>*+*]:before:h-px [&>*+*]:before:bg-line',
        inset === 'icon' ? '[&>*+*]:before:left-15' : '[&>*+*]:before:left-4',
      )}
    >
      {children}
    </div>
    {footer && <p className="px-4 pt-1.5 text-footnote text-muted">{footer}</p>}
  </section>
);

/** Rounded-square icon used as a row's leading element, like iOS Settings */
export const RowIcon = ({ children, tone = 'action' }: { children: ReactNode; tone?: 'action' | 'ok' | 'warn' | 'error' | 'muted' }) => {
  const tones = {
    action: 'bg-action text-on-action',
    ok: 'bg-ok-ink text-on-action',
    warn: 'bg-warn-ink text-on-action',
    error: 'bg-error text-on-action',
    muted: 'bg-muted text-surface',
  };
  return <span className={cx('flex size-8 items-center justify-center rounded-inner [&>svg]:size-[18px]', tones[tone])}>{children}</span>;
};
