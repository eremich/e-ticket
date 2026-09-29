import { placeById, CLOSED_STATION } from '../data/places';
import { FARE } from '../data/cards';
import { metroDirections } from './arrivals';
import { metroOption, segments, type MetroSegment, type TripOption } from './routing';
import type { Transport } from './icons';

export interface RouteFilters {
  transports: Transport[];
  fewer: boolean;
  lessWalk: boolean;
  stepFree: boolean;
}

export const DEFAULT_FILTERS: RouteFilters = { transports: ['metro', 'tram', 'trolleybus', 'bus'], fewer: false, lessWalk: false, stepFree: false };

/** Surface alternative to Vokzalna: tram 27 to Tsentralnyi Rynok, then a walk. Avoids line 2 entirely. */
const TRAM_TO_WORK: TripOption = {
  id: 'tram-27-work',
  legs: [
    { kind: 'walk', minutes: 3 },
    { kind: 'ride', transport: 'tram', number: '27' },
    { kind: 'walk', minutes: 8 },
  ],
  totalMin: 42,
  leavesIn: 3,
  transfers: 0,
  walkMin: 11,
  fare: FARE.tram,
  freeTransfer: false,
  stepFree: true,
  uses: ['tram'],
  from: 'saltivska-metro',
};

export interface PlannedOption extends TripOption {
  /** Passes a station closed today */
  affected: boolean;
}

/** Options between two places: the metro path first, surface alternatives after, then filters and sorting */
export const planOptions = (fromId: string, toId: string, filters: RouteFilters, serviceChange: boolean): PlannedOption[] => {
  const from = placeById(fromId);
  const to = placeById(toId);
  if (!from || !to || from.station === to.station) return [];

  const out: PlannedOption[] = [];
  const firstRide = (path: string[]) => segments(path).find((s): s is MetroSegment => s.kind === 'ride');
  const probe = metroOption(from.station, to.station, from.walk, to.walk, 0);
  if (probe?.path) {
    const ride = firstRide(probe.path);
    const leavesIn = metroDirections(from.station).find((d) => d.towards.id === ride?.towards.id)?.minutes[0] ?? 3;
    out.push({ ...probe, leavesIn, affected: serviceChange && probe.path.includes(CLOSED_STATION) });
  }
  if (from.station === 'saltivska' && to.station === 'vokzalna') out.push({ ...TRAM_TO_WORK, affected: false });

  let list = out.filter((o) => o.uses.every((u) => filters.transports.includes(u)));
  if (filters.stepFree) list = list.filter((o) => o.stepFree);
  if (filters.fewer) list = [...list].sort((a, b) => a.transfers - b.transfers || a.totalMin - b.totalMin);
  else if (filters.lessWalk) list = [...list].sort((a, b) => a.walkMin - b.walkMin || a.totalMin - b.totalMin);
  return list;
};
