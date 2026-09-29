import { stationById, STATIONS } from './metro';
import type { Name } from './types';

/** A place you can route to: saved places, or any metro station */
export interface Place {
  id: string;
  name: Name;
  /** Station the place is served by */
  station: string;
  /** Walk between the place and the station */
  walk: number;
  meters: number;
  kind: 'home' | 'work' | 'station' | 'here';
}

export const SAVED_PLACES: Place[] = [
  { id: 'home', name: { en: 'Home', uk: 'Дім' }, station: 'saltivska', walk: 3, meters: 220, kind: 'home' },
  // Work is in the station building at Vokzalna, so no walk at the end: 24 min door to door, as in the brief
  { id: 'work', name: { en: 'Work', uk: 'Робота' }, station: 'vokzalna', walk: 0, meters: 0, kind: 'work' },
];

/** The rider stands at home, near Saltivska */
export const HERE: Place = { id: 'here', name: { en: 'Current location', uk: 'Моє місцезнаходження' }, station: 'saltivska', walk: 3, meters: 220, kind: 'here' };

export const placeById = (id: string): Place | undefined => {
  if (id === 'here') return HERE;
  const saved = SAVED_PLACES.find((p) => p.id === id);
  if (saved) return saved;
  if (STATIONS.some((s) => s.id === id)) return { id, name: stationById(id).name, station: id, walk: 0, meters: 0, kind: 'station' };
  return undefined;
};

/** The station closed in the service-change scenario */
export const CLOSED_STATION = 'akademika-pavlova';
