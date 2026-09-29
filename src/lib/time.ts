/**
 * Frozen mock clock: Tuesday 13 October 2026, 08:14 — a weekday morning commute.
 * Everything time-based reads NOW, so screenshots are deterministic.
 */
export const TODAY = new Date(2026, 9, 13);

/** Minutes since midnight */
export const NOW = 8 * 60 + 14;
