import { ArrowRight, Warning } from '@phosphor-icons/react';

export interface ServiceChangeBannerProps {
  title: string;
  body?: string;
  /** One-tap alternative */
  actionLabel?: string;
  onAction?: () => void;
  /** Compact form for lists: icon and title only */
  compact?: boolean;
}

/**
 * Service change: a closed stop or a detour. Amber, with the warning icon and a title that names the stop,
 * and the fix one tap away. Never uses a transport color.
 */
export const ServiceChangeBanner = ({ title, body, actionLabel, onAction, compact = false }: ServiceChangeBannerProps) =>
  compact ? (
    <span className="inline-flex items-center gap-1 rounded-chip bg-warn/15 px-2 py-0.5 text-caption text-warn-ink">
      <Warning aria-hidden weight="fill" className="size-3.5" />
      {title}
    </span>
  ) : (
    <div role="status" className="flex flex-col gap-2 rounded-group bg-warn/15 p-3">
      <div className="flex gap-2.5">
        <Warning aria-hidden weight="fill" className="mt-px size-5 shrink-0 text-warn-ink" />
        <div className="min-w-0">
          <p className="text-headline text-warn-ink">{title}</p>
          {body && <p className="mt-0.5 text-subheadline text-ink">{body}</p>}
        </div>
      </div>
      {actionLabel && (
        <button type="button" onClick={onAction} className="press flex min-h-11 items-center justify-center gap-1.5 rounded-control bg-surface text-headline text-ink">
          {actionLabel}
          <ArrowRight aria-hidden weight="bold" className="size-4" />
        </button>
      )}
    </div>
  );
