import type { Transport } from '../lib/icons';
import type { Name } from './types';

export interface Card {
  id: string;
  name: Name;
  number: string;
  balance: number;
  kind: 'plastic' | 'virtual';
  reduced?: { kind: 'student' | 'pensioner'; until: Date };
  blocked?: boolean;
  /** Added to Apple Wallet with express mode */
  express?: boolean;
}

/** Olena's cards. Standard fare on the main card (the morning commute story); reduced fare lives in its scenario. */
export const INITIAL_CARDS: Card[] = [
  { id: 'main', name: { en: 'Eticket', uk: 'Eticket' }, number: '0124 0125 0556 2255', balance: 6, kind: 'plastic', express: true },
  { id: 'mom', name: { en: "Mom's card", uk: 'Мамина картка' }, number: '0124 0987 1120 5518', balance: 34, kind: 'plastic' },
];

export const FARE: Record<Transport, number> = { metro: 8, tram: 8, trolleybus: 8, bus: 12 };
/** Transfers within this many minutes are free */
export const TRANSFER_WINDOW = 60;

/** Where the simulated validator is */
export interface TapPlace {
  id: string;
  transport: Transport;
  number: string | number;
  name: Name;
}

export const TAP_PLACES: TapPlace[] = [
  { id: 'saltivska', transport: 'metro', number: 2, name: { en: 'Saltivska', uk: 'Салтівська' } },
  { id: 'vokzalna-tram-7', transport: 'tram', number: '7', name: { en: 'Vokzalna Square', uk: 'Привокзальна площа' } },
  { id: 'saltivske-bus-115', transport: 'bus', number: '115', name: { en: 'Saltivske Shose', uk: 'Салтівське шосе' } },
];

export type PayMethod = 'applepay' | 'googlepay' | 'card';
export const SAVED_CARD_LAST = '0931';
