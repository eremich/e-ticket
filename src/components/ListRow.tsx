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

/**
 * One row of an iOS inset grouped list (HIG metrics): 44 pt minimum, 17 pt title, 15 pt subtitle,
 * 17 pt secondary value, 29 pt icon with the text at 60 pt. Separators are drawn by ListGroup.
 */
export const ListRow = ({ title, subtitle, leading, trailing, onClick, chevron = true, destructive = false }: ListRowProps) => {
  const content = (
    <>
      {leading && <span className="flex shrink-0 items-center">{leading}</span>}
      <span className="flex min-w-0 flex-1 flex-col py-[11px] text-left">
        <span className={cx('text-body', destructive ? 'text-error' : 'text-ink')}>{title}</span>
        {subtitle && <span className="text-subheadline text-muted">{subtitle}</span>}
      </span>
      {trailing && <span className="flex shrink-0 items-center text-body text-muted">{trailing}</span>}
      {onClick && chevron && <CaretRight aria-hidden className="-mr-0.5 size-3.5 shrink-0 text-muted/60" weight="bold" />}
    </>
  );
  const cls = cx('flex min-h-11 w-full items-center pr-4', leading ? 'gap-[15px] pl-4' : 'gap-3 pl-4');
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
    {header && <h2 className="section-title pb-[7px]">{header}</h2>}
    <div
      className={cx(
        'overflow-hidden rounded-group bg-surface',
        '[&>*+*]:relative [&>*+*]:before:absolute [&>*+*]:before:right-0 [&>*+*]:before:top-0 [&>*+*]:before:h-px [&>*+*]:before:bg-line',
        inset === 'icon' ? '[&>*+*]:before:left-[60px]' : '[&>*+*]:before:left-4',
      )}
    >
      {children}
    </div>
    {footer && <p className="px-4 pt-[7px] text-footnote text-muted">{footer}</p>}
  </section>
);

/** iOS row icon: 29 pt rounded square, one neutral style. Color only when it means something (warning, error) */
export const RowIcon = ({ children, tone = 'action' }: { children: ReactNode; tone?: 'action' | 'ok' | 'warn' | 'error' | 'muted' }) => {
  const tones = {
    action: 'bg-raised text-ink',
    ok: 'bg-raised text-ink',
    warn: 'bg-raised text-warn-ink',
    error: 'bg-raised text-error',
    muted: 'bg-raised text-ink',
  };
  return <span className={cx('flex size-[29px] items-center justify-center rounded-[7px] [&>svg]:size-[17px]', tones[tone])}>{children}</span>;
};
