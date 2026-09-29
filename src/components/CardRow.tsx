import { CaretRight } from '@phosphor-icons/react';
import { useT } from '../i18n';
import { money } from '../lib/format';
import { cx } from '../lib/cx';
import { EticketLogo } from './EticketCard';

export interface CardRowProps {
  name: string;
  /** 16 digits, grouped by 4 */
  number: string;
  balance: number;
  kind?: 'plastic' | 'virtual';
  blocked?: boolean;
  onClick?: () => void;
}

/** Compact card for lists: a small thumbnail of the card face, its name, last digits and balance */
export const CardRow = ({ name, number, balance, kind = 'plastic', blocked = false, onClick }: CardRowProps) => {
  const t = useT();
  const last = number.replace(/\s/g, '').slice(-4);
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={cx('flex min-h-16 w-full items-center gap-3 px-4 py-2 text-left', onClick && 'transition-colors duration-100 active:bg-raised')}>
      <span aria-hidden className={cx('flex aspect-[1.586] w-14 shrink-0 items-end rounded-inner p-1.5 text-[10px] text-white shadow-object', kind === 'virtual' ? 'bg-card-virtual' : 'bg-card-face', blocked && 'grayscale')}>
        <EticketLogo />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body text-ink">{name}</span>
        <span className="tnum truncate text-footnote text-muted">{blocked ? `${t('card.blocked')} · •••• ${last}` : `•••• ${last}`}</span>
      </span>
      <span className={cx('tnum shrink-0 text-headline', blocked ? 'text-muted' : 'text-ink')}>{money(t.lang, balance)}</span>
      {onClick && <CaretRight aria-hidden weight="bold" className="-mr-1 size-4 shrink-0 text-muted/70" />}
    </Tag>
  );
};
