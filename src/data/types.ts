import type { Transport } from '../lib/icons';

/** Proper names come in both languages: stations, stops, streets */
export type Name = { en: string; uk: string };

/** A surface route (tram, trolleybus, bus) */
export interface Route {
  id: string;
  transport: Exclude<Transport, 'metro'>;
  number: string;
  /** Terminus in the direction we show */
  towards: Name;
  /** Minutes between vehicles on weekdays; weekends add WEEKEND_EXTRA */
  headway: number;
  /** Stops in order, with minutes from the first stop */
  stops: { id: string; at: number }[];
  /** Path on the neighbourhood map (viewBox 0 0 390 460), for vehicles and highlights */
  path: [number, number][];
  lowFloor?: boolean;
}

/** A surface stop */
export interface Stop {
  id: string;
  name: Name;
  /** Walking distance from the rider's position */
  walkMin: number;
  meters: number;
  /** Position on the neighbourhood map, when it is on it */
  x?: number;
  y?: number;
  /** Next arrival per route at the frozen clock, minutes */
  services: { routeId: string; next: number }[];
  /** Metro station this stop serves */
  station?: string;
}
