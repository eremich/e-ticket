import { useStore } from '../store/useStore';
import { NOW } from '../lib/time';
import { metroPath } from '../lib/routing';

/**
 * Deterministic starting states for ?scenario=<name> (brief §9).
 * Each one sets the store and, when the story starts elsewhere than Home, the screen to open.
 */
export interface Scenario {
  apply?: () => void;
  /** Screen to open when the link points at the app root */
  path?: string;
}

const set = useStore.setState;
const card = (patch: Partial<ReturnType<typeof useStore.getState>['cards'][number]>) =>
  set((s) => ({ cards: s.cards.map((c) => (c.id === 'main' ? { ...c, ...patch } : c)) }));

export const SCENARIOS: Record<string, Scenario> = {
  // The morning commute: ₴6 on the card, fare ₴8
  default: {},
  'low-balance': { apply: () => card({ balance: 14 }) },
  declined: { apply: () => set({ tap: { step: 'declined', placeId: 'saltivska', fare: 8 } }) },
  offline: { apply: () => set({ offline: true, live: false }) },
  'no-live-data': { apply: () => set({ live: false }) },
  visitor: { path: '/visitor' },
  'visitor-expired': {
    apply: () => useStore.getState().setVisitorTicket({ kind: 'day', boughtAt: NOW - 1440, validUntil: NOW, rides: 5, expired: true }),
    path: '/visitor/ticket',
  },
  'lost-card': { apply: () => card({ balance: 98 }), path: '/profile/cards/main/lost' },
  'new-user': { path: '/onboarding' },
  'double-charge': { apply: () => useStore.getState().seedDoubleCharge(), path: '/profile/trips' },
  'new-phone': { path: '/onboarding/new-phone' },
  'fare-expiring': { apply: () => useStore.getState().setReduced('main', { kind: 'student', until: new Date(2026, 9, 25) }), path: '/profile/reduced' },
  // Mid-trip on line 2, just before the closed station
  'service-change': { apply: () => startWorkTrip(true), path: '/routes/live' },
  'plastic-to-phone': { apply: () => card({ balance: 34 }), path: '/profile/cards/main/to-phone' },
};

/** Extra states used by the screenshot script, not listed in the brief */
export const SHOT_SCENARIOS: Record<string, Scenario> = {
  paid: {
    apply: () => {
      card({ balance: 98 });
      set({ lastPaidAt: NOW, tap: { step: 'success', placeId: 'saltivska', fare: 8 } });
    },
  },
  'on-trip': { apply: () => startWorkTrip(false), path: '/routes/live' },
  'visitor-ticket': {
    apply: () => useStore.getState().setVisitorTicket({ kind: 'day', boughtAt: NOW - 90, validUntil: NOW + 1350, rides: 2 }),
    path: '/visitor/ticket',
  },
};

export const SCENARIO_NAMES = Object.keys(SCENARIOS);

/** Home → Work by metro, already paid, the train on line 2 */
function startWorkTrip(serviceChange: boolean) {
  const path = metroPath('saltivska', 'vokzalna');
  card({ balance: 98 });
  set({ serviceChange, routeFrom: 'here', routeTo: 'work', lastPaidAt: NOW, trip: { optionId: 'metro-saltivska-vokzalna', path, index: 1 } });
}

/** Applies ?scenario= before the first render; returns the path to open, if any */
export const applyScenario = (name: string | null): string | undefined => {
  const sc = name ? (SCENARIOS[name] ?? SHOT_SCENARIOS[name]) : undefined;
  if (!sc) return undefined;
  sc.apply?.();
  return sc.path;
};
