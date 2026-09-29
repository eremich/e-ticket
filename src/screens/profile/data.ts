import { TODAY } from '../../lib/time';
import type { Card } from '../../data/cards';
import type { Activity, ReportReason } from '../../store/useStore';

/** Rides, rides count and top-ups earlier this month that the prototype does not list one by one */
export const OCTOBER_EARLIER = { spent: 152, rides: 19, topups: 150 };
const REDUCED_WARNING_DAYS = 14;
const DAY_MS = 86_400_000;

/** Calendar date for "n days before today" */
export const dayOf = (daysAgo: number) => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - daysAgo);

/** Totals for the current month: what was spent on rides (refunds taken off), how many rides, and how much was topped up */
export const monthStats = (activity: Activity[]) => {
  const inMonth = activity.filter((a) => a.daysAgo < TODAY.getDate());
  const sum = (kind: Activity['kind']) => inMonth.filter((a) => a.kind === kind);
  const rides = sum('ride');
  const refunds = sum('refund');
  return {
    spent: OCTOBER_EARLIER.spent - rides.reduce((n, a) => n + a.amount, 0) - refunds.reduce((n, a) => n + a.amount, 0),
    rides: OCTOBER_EARLIER.rides + rides.length - refunds.length,
    topups: OCTOBER_EARLIER.topups + sum('topup').reduce((n, a) => n + a.amount, 0),
  };
};

export type ReducedState = { state: 'none' } | { state: 'active'; until: Date } | { state: 'expiring'; until: Date; days: number };

/** none, active, or ending within 14 days of today */
export const reducedState = (reduced: Card['reduced']): ReducedState => {
  if (!reduced) return { state: 'none' };
  const days = Math.round((reduced.until.getTime() - TODAY.getTime()) / DAY_MS);
  return days <= REDUCED_WARNING_DAYS ? { state: 'expiring', until: reduced.until, days } : { state: 'active', until: reduced.until };
};

export const plusYear = (d: Date) => new Date(d.getFullYear() + 1, d.getMonth(), d.getDate());
export const minusDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);

/** A stable receipt number made from the activity id */
export const receiptNo = (id: string) => {
  const n = [...id].reduce((h, c) => (h * 131 + c.charCodeAt(0) * 7919) % 899_999, 4231);
  return `E-${String(100_000 + n)}`;
};

/** The other charge that makes a ride a double charge: same card, same minute, not already refunded */
export const findDuplicate = (activity: Activity[], ride: Activity) => {
  const other = activity.find((a) => a.id !== ride.id && a.kind === 'ride' && a.cardId === ride.cardId && a.daysAgo === ride.daysAgo && Math.abs(a.time - ride.time) <= 1);
  if (!other) return undefined;
  const refunded = activity.some((a) => a.kind === 'refund' && (a.refundOf === ride.id || a.refundOf === other.id));
  return refunded ? undefined : other;
};

export const isReason = (v: string | null): v is ReportReason => v === 'double' || v === 'gate' || v === 'fare';
