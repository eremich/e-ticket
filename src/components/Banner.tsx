import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { CloudSlash, Info, Warning, XCircle } from '@phosphor-icons/react';
import { cx } from '../lib/cx';

export interface BannerProps {
  tone: 'info' | 'warn' | 'error' | 'offline';
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}

const TONES: Record<BannerProps['tone'], { cls: string; icon: Icon; ink: string }> = {
  info: { cls: 'bg-action-soft', icon: Info, ink: 'text-action' },
  warn: { cls: 'bg-warn/15', icon: Warning, ink: 'text-warn-ink' },
  error: { cls: 'bg-error/10', icon: XCircle, ink: 'text-error' },
  offline: { cls: 'bg-raised', icon: CloudSlash, ink: 'text-ink' },
};

/** Inline message: an icon and a title that says what happened, then what to do. Full tint, no side stripe. */
export const Banner = ({ tone, title, children, action }: BannerProps) => {
  const { cls, icon: Icon, ink } = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-group p-3', cls)}>
      <Icon aria-hidden className={cx('mt-px size-5 shrink-0', ink)} weight="fill" />
      <div className="min-w-0 flex-1">
        <p className={cx('text-headline', ink)}>{title}</p>
        {children && <div className="mt-0.5 text-subheadline text-ink">{children}</div>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
};
