import { cx } from '../lib/cx';

export interface SkeletonProps {
  className?: string;
}

/** Placeholder block while live data loads (600 ms). Pulses opacity only. */
export const Skeleton = ({ className }: SkeletonProps) => <div aria-hidden className={cx('skeleton rounded-inner bg-raised', className)} />;

/** A stop-row-shaped skeleton for Home and stop lists */
export const SkeletonRow = () => (
  <div aria-hidden className="flex items-center gap-3 px-4 py-3">
    <Skeleton className="size-9 rounded-inner" />
    <div className="flex flex-1 flex-col gap-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-8 w-24 rounded-chip" />
  </div>
);
