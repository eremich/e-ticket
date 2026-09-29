import { create } from 'zustand';
import { applyTheme, saveTheme, type ThemeChoice } from '../lib/theme';
import type { Transport } from '../lib/icons';
import { FARE, INITIAL_CARDS, TAP_PLACES, TRANSFER_WINDOW, type Card, type PayMethod } from '../data/cards';
import { NOW } from '../lib/time';
import { DEFAULT_FILTERS, type RouteFilters } from '../lib/options';

export type Toast = { id: number; message: string; tone?: 'ok' | 'error' };

/** Money movements on a card: rides, free transfers, top-ups, transfers between cards */
export interface Activity {
  id: string;
  cardId: string;
  kind: 'ride' | 'transfer' | 'topup' | 'sent' | 'received' | 'refund';
  /** Minutes since midnight, and days before today (0 = today) */
  time: number;
  daysAgo: number;
  amount: number;
  place?: { transport: Transport; number: string | number; placeId: string };
  method?: PayMethod;
  /** For a refund: the ride it returns */
  refundOf?: string;
}

export type ReportReason = 'double' | 'gate' | 'fare';

/** A problem report waiting for an answer */
export interface ProblemRequest {
  id: string;
  tripId: string;
  reason: ReportReason;
  status: 'sent' | 'review' | 'answered';
  createdAt: { daysAgo: number; time: number };
}

export interface NotifySettings {
  lowBalance: boolean;
  arrivals: boolean;
  serviceChanges: boolean;
  receipts: boolean;
}

export type VisitorKind = 'single' | 'day' | 'days3';

/** A ticket bought without an account. Times are minutes on the frozen clock (may pass 1440). */
export interface VisitorTicket {
  kind: VisitorKind;
  boughtAt: number;
  validUntil: number;
  rides: number;
  expired?: boolean;
}

export type TapStep = 'hold' | 'success' | 'transfer' | 'declined' | 'ready';

export interface TapSession {
  step: TapStep;
  placeId: string;
  /** Second tap for another passenger: always charged, never a transfer */
  extra?: boolean;
  fare: number;
  /** Paying with Apple Pay inside the declined screen */
  paying?: boolean;
}

interface State {
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice, persist?: boolean) => void;
  toasts: Toast[];
  toast: (message: string, tone?: Toast['tone']) => void;

  cards: Card[];
  activeCard: string;
  setActiveCard: (id: string) => void;
  /** Typical fare for "trips left" */
  fare: number;
  activity: Activity[];
  /** Last charged ride, for the free transfer window */
  lastPaidAt: number | null;

  autoTopUp: { on: boolean; below: number; amount: number };
  setAutoTopUp: (a: Partial<State['autoTopUp']>) => void;
  method: PayMethod;
  setMethod: (m: PayMethod) => void;
  /** The saved bank card declines (payment error state) */
  cardDeclines: boolean;
  topUp: (amount: number, method: PayMethod, cardId?: string) => boolean;
  transferTo: (toCardId: string, amount: number) => void;
  addToWallet: (cardId: string) => void;
  /** Onboarding: link a card and make it the one in use */
  addCard: (card: Card) => void;
  setReduced: (cardId: string, reduced: Card['reduced']) => void;
  renameCard: (cardId: string, name: string) => void;
  removeCard: (cardId: string) => void;
  /** Lost or replaced card: block it and carry its balance to a new virtual card. Returns the new card's id. */
  blockAndMove: (cardId: string) => string;

  requests: ProblemRequest[];
  addRequest: (tripId: string, reason: ReportReason) => string;
  /** Puts a ride's fare back on its card and logs the refund */
  refundRide: (rideId: string) => void;
  /** Scenario helper: two charges 30 s apart at 07:52 on the main card */
  seedDoubleCharge: () => void;
  /** Scenario helper: the next reduced-fare renewal is declined */
  renewalDeclines: boolean;
  setRenewalDeclines: (v: boolean) => void;
  notify: NotifySettings;
  setNotify: (n: Partial<NotifySettings>) => void;
  /** Accessibility: bigger arrival times (flag only) */
  largerTimes: boolean;
  setLargerTimes: (v: boolean) => void;

  /** Answer to the location prompt; false means Home falls back to homeStop */
  locationAllowed: boolean;
  setLocationAllowed: (v: boolean) => void;
  homeStop: string | null;
  setHomeStop: (id: string | null) => void;
  visitorTicket: VisitorTicket | null;
  setVisitorTicket: (t: VisitorTicket | null) => void;

  tap: TapSession | null;
  tapPlace: string;
  setTapPlace: (id: string) => void;
  startTap: (extra?: boolean) => void;
  resolveTap: () => void;
  closeTap: () => void;
  setTapPaying: (paying: boolean) => void;
  offline: boolean;
  setOffline: (v: boolean) => void;

  live: boolean;
  loaded: Record<string, boolean>;
  markLoaded: (key: string) => void;
  favorites: string[];
  toggleFavorite: (stopId: string) => void;
  alerts: string[];
  toggleAlert: (key: string) => void;
  homeView: 'list' | 'map';
  setHomeView: (v: 'list' | 'map') => void;
  mapFilter: Transport[];
  toggleMapFilter: (t: Transport) => void;

  routeFrom: string;
  routeTo: string | null;
  setRoute: (from: string, to: string | null) => void;
  routeFilters: RouteFilters;
  setRouteFilters: (f: Partial<RouteFilters>) => void;
  /** Saved routes and recent searches, as "from>to" */
  savedRoutes: string[];
  toggleSavedRoute: (key: string) => void;
  recentRoutes: string[];
  /** Live trip: option id, the station path and how far along it the train is */
  trip: { optionId: string; path: string[]; index: number } | null;
  startTrip: (optionId: string, path: string[]) => void;
  advanceTrip: () => void;
  endTrip: () => void;
  /** A station closed today (service-change scenario) */
  serviceChange: boolean;
  /** Where the last trip ended, for Home's onward suggestion */
  arrivedAt: string | null;
}

const TOAST_MS = 2600;
let toastId = 0;
let activityId = 0;
let requestId = 0;
let virtualId = 0;
/** 07:52, the double-charge scenario */
const DOUBLE_CHARGE_AT = 7 * 60 + 52;
const VIRTUAL_NUMBERS = ['0124 0777 3301 5210', '0124 0777 3301 6644', '0124 0777 3301 7719'];

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
const newId = () => `a${++activityId}`;

/** Earlier days of history so Trips and Recent are never empty in the default story */
const HISTORY: Activity[] = [
  { id: 'h1', cardId: 'main', kind: 'ride', time: 18 * 60 + 42, daysAgo: 1, amount: -8, place: { transport: 'metro', number: 1, placeId: 'vokzalna' } },
  { id: 'h2', cardId: 'main', kind: 'ride', time: 8 * 60 + 11, daysAgo: 1, amount: -8, place: { transport: 'metro', number: 2, placeId: 'saltivska' } },
  { id: 'h3', cardId: 'main', kind: 'transfer', time: 18 * 60 + 58, daysAgo: 2, amount: 0, place: { transport: 'tram', number: '27', placeId: 'saltivska-metro' } },
  { id: 'h4', cardId: 'main', kind: 'ride', time: 18 * 60 + 40, daysAgo: 2, amount: -8, place: { transport: 'metro', number: 1, placeId: 'vokzalna' } },
  { id: 'h5', cardId: 'main', kind: 'topup', time: 8 * 60 + 5, daysAgo: 2, amount: 50, method: 'applepay' },
  { id: 'h6', cardId: 'main', kind: 'ride', time: 17 * 60 + 35, daysAgo: 5, amount: -8, place: { transport: 'metro', number: 2, placeId: 'saltivska' } },
  { id: 'h7', cardId: 'main', kind: 'topup', time: 9 * 60 + 20, daysAgo: 9, amount: 100, method: 'card' },
];

export const useStore = create<State>((set, get) => ({
  theme: 'system',
  setTheme: (theme, persist = true) => {
    applyTheme(theme);
    if (persist) saveTheme(theme);
    set({ theme });
  },
  toasts: [],
  toast: (message, tone = 'ok') => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), TOAST_MS);
  },

  cards: INITIAL_CARDS,
  activeCard: 'main',
  setActiveCard: (activeCard) => set({ activeCard }),
  fare: FARE.metro,
  activity: HISTORY,
  lastPaidAt: null,

  autoTopUp: { on: false, below: 20, amount: 100 },
  setAutoTopUp: (a) => set((s) => ({ autoTopUp: { ...s.autoTopUp, ...a } })),
  method: 'applepay',
  setMethod: (method) => set({ method }),
  cardDeclines: false,
  topUp: (amount, method, cardId) => {
    const s = get();
    if (method === 'card' && s.cardDeclines) return false;
    const id = cardId ?? s.activeCard;
    set({
      cards: s.cards.map((c) => (c.id === id ? { ...c, balance: c.balance + amount } : c)),
      activity: [{ id: newId(), cardId: id, kind: 'topup', time: NOW, daysAgo: 0, amount, method }, ...s.activity],
    });
    return true;
  },
  transferTo: (toCardId, amount) => {
    const s = get();
    set({
      cards: s.cards.map((c) => (c.id === s.activeCard ? { ...c, balance: c.balance - amount } : c.id === toCardId ? { ...c, balance: c.balance + amount } : c)),
      activity: [
        { id: newId(), cardId: s.activeCard, kind: 'sent', time: NOW, daysAgo: 0, amount: -amount },
        { id: newId(), cardId: toCardId, kind: 'received', time: NOW, daysAgo: 0, amount },
        ...s.activity,
      ],
    });
  },
  addToWallet: (cardId) => set((s) => ({ cards: s.cards.map((c) => (c.id === cardId ? { ...c, express: true } : c)) })),

  addCard: (card) => set((s) => ({ cards: [...s.cards, card], activeCard: card.id })),
  setReduced: (cardId, reduced) => set((s) => ({ cards: s.cards.map((c) => (c.id === cardId ? { ...c, reduced } : c)) })),
  renameCard: (cardId, name) => set((s) => ({ cards: s.cards.map((c) => (c.id === cardId ? { ...c, name: { en: name, uk: name } } : c)) })),
  removeCard: (cardId) =>
    set((s) => {
      if (s.cards.length < 2) return {};
      const cards = s.cards.filter((c) => c.id !== cardId);
      return { cards, activeCard: s.activeCard === cardId ? cards[0].id : s.activeCard };
    }),
  blockAndMove: (cardId) => {
    const s = get();
    const old = s.cards.find((c) => c.id === cardId)!;
    const fresh: Card = {
      id: `virtual-${++virtualId}`,
      name: { en: 'Virtual card', uk: 'Віртуальна картка' },
      number: VIRTUAL_NUMBERS[(virtualId - 1) % VIRTUAL_NUMBERS.length],
      balance: old.balance,
      kind: 'virtual',
      express: old.express,
    };
    set({
      cards: [...s.cards.map((c) => (c.id === cardId ? { ...c, blocked: true, balance: 0, express: false } : c)), fresh],
      activeCard: s.activeCard === cardId ? fresh.id : s.activeCard,
    });
    return fresh.id;
  },

  requests: [],
  addRequest: (tripId, reason) => {
    const id = `r${++requestId}`;
    set((s) => ({ requests: [{ id, tripId, reason, status: 'sent', createdAt: { daysAgo: 0, time: NOW } }, ...s.requests] }));
    return id;
  },
  refundRide: (rideId) => {
    const s = get();
    const ride = s.activity.find((a) => a.id === rideId);
    if (!ride) return;
    set({
      cards: s.cards.map((c) => (c.id === ride.cardId ? { ...c, balance: c.balance - ride.amount } : c)),
      activity: [{ id: newId(), cardId: ride.cardId, kind: 'refund', time: NOW, daysAgo: 0, amount: -ride.amount, refundOf: rideId, place: ride.place }, ...s.activity],
    });
  },
  seedDoubleCharge: () =>
    set((s) => {
      if (s.activity.some((a) => a.id === 'dc1')) return {};
      const at = { transport: 'metro' as const, number: 2, placeId: 'saltivska' };
      const rides: Activity[] = [
        { id: 'dc2', cardId: 'main', kind: 'ride', time: DOUBLE_CHARGE_AT, daysAgo: 0, amount: -8, place: at },
        { id: 'dc1', cardId: 'main', kind: 'ride', time: DOUBLE_CHARGE_AT, daysAgo: 0, amount: -8, place: at },
      ];
      return { activity: [...rides, ...s.activity] };
    }),
  renewalDeclines: false,
  setRenewalDeclines: (renewalDeclines) => set({ renewalDeclines }),
  notify: { lowBalance: true, arrivals: true, serviceChanges: true, receipts: false },
  setNotify: (n) => set((s) => ({ notify: { ...s.notify, ...n } })),
  largerTimes: false,
  setLargerTimes: (largerTimes) => set({ largerTimes }),
  locationAllowed: true,
  setLocationAllowed: (locationAllowed) => set({ locationAllowed }),
  homeStop: null,
  setHomeStop: (homeStop) => set({ homeStop }),
  visitorTicket: null,
  setVisitorTicket: (visitorTicket) => set({ visitorTicket }),

  tap: null,
  tapPlace: 'saltivska',
  setTapPlace: (tapPlace) => set({ tapPlace }),
  startTap: (extra = false) => {
    const place = TAP_PLACES.find((p) => p.id === get().tapPlace)!;
    set({ tap: { step: 'hold', placeId: place.id, extra, fare: FARE[place.transport] } });
  },
  /** The validator answers: free transfer inside the window, a charge, or a decline */
  resolveTap: () => {
    const s = get();
    if (!s.tap) return;
    const place = TAP_PLACES.find((p) => p.id === s.tap!.placeId)!;
    const card = s.cards.find((c) => c.id === s.activeCard)!;
    const inWindow = s.lastPaidAt !== null && NOW - s.lastPaidAt < TRANSFER_WINDOW;
    const at = { transport: place.transport, number: place.number, placeId: place.id };
    if (inWindow && !s.tap.extra) {
      set({ tap: { ...s.tap, step: 'transfer' }, activity: [{ id: newId(), cardId: card.id, kind: 'transfer', time: NOW, daysAgo: 0, amount: 0, place: at }, ...s.activity] });
      return;
    }
    if (card.balance < s.tap.fare) {
      set({ tap: { ...s.tap, step: 'declined' } });
      return;
    }
    let balance = card.balance - s.tap.fare;
    const activity: Activity[] = [{ id: newId(), cardId: card.id, kind: 'ride', time: NOW, daysAgo: 0, amount: -s.tap.fare, place: at }];
    // Auto top-up keeps the balance from ever becoming a problem
    if (s.autoTopUp.on && balance < s.autoTopUp.below) {
      balance += s.autoTopUp.amount;
      activity.unshift({ id: newId(), cardId: card.id, kind: 'topup', time: NOW, daysAgo: 0, amount: s.autoTopUp.amount, method: s.method });
    }
    set({
      tap: { ...s.tap, step: 'success' },
      cards: s.cards.map((c) => (c.id === card.id ? { ...c, balance } : c)),
      activity: [...activity, ...s.activity],
      lastPaidAt: s.tap.extra ? s.lastPaidAt : NOW,
    });
  },
  closeTap: () => set({ tap: null }),
  setTapPaying: (paying) => set((s) => (s.tap ? { tap: { ...s.tap, paying } } : {})),
  offline: false,
  setOffline: (offline) => set({ offline }),

  live: true,
  loaded: {},
  markLoaded: (key) => set((s) => ({ loaded: { ...s.loaded, [key]: true } })),
  favorites: ['saltivska-metro'],
  toggleFavorite: (stopId) => set((s) => ({ favorites: toggle(s.favorites, stopId) })),
  alerts: [],
  toggleAlert: (key) => set((s) => ({ alerts: toggle(s.alerts, key) })),
  homeView: 'list',
  setHomeView: (homeView) => set({ homeView }),
  mapFilter: ['tram', 'trolleybus', 'bus'],
  toggleMapFilter: (t) => set((s) => ({ mapFilter: toggle(s.mapFilter, t) })),

  routeFrom: 'here',
  routeTo: null,
  setRoute: (routeFrom, routeTo) =>
    set((s) => ({
      routeFrom,
      routeTo,
      recentRoutes: routeTo ? [`${routeFrom}>${routeTo}`, ...s.recentRoutes.filter((k) => k !== `${routeFrom}>${routeTo}`)].slice(0, 4) : s.recentRoutes,
    })),
  routeFilters: DEFAULT_FILTERS,
  setRouteFilters: (f) => set((s) => ({ routeFilters: { ...s.routeFilters, ...f } })),
  savedRoutes: ['home>work'],
  toggleSavedRoute: (key) => set((s) => ({ savedRoutes: toggle(s.savedRoutes, key) })),
  recentRoutes: ['here>derzhprom'],
  trip: null,
  startTrip: (optionId, path) => set({ trip: { optionId, path, index: 0 }, arrivedAt: null }),
  advanceTrip: () => set((s) => (s.trip && s.trip.index < s.trip.path.length - 1 ? { trip: { ...s.trip, index: s.trip.index + 1 } } : {})),
  endTrip: () => set((s) => ({ arrivedAt: s.trip ? s.trip.path[s.trip.path.length - 1] : null, trip: null })),
  serviceChange: false,
  arrivedAt: null,
}));

/** The card in use */
export const useActiveCard = () => useStore((s) => s.cards.find((c) => c.id === s.activeCard)!);
