import { LINES, TRANSFERS, stationById, type Station } from '../data/metro';
import { FARE } from '../data/cards';
import type { RouteLeg } from '../components/RouteOption';
import type { Transport } from './icons';

/**
 * Metro routing on the real graph: neighbours on a line, plus the three interchanges.
 * Breadth-first search, then the path is cut into rides and transfers.
 */

/** Walking between the two platforms of an interchange */
export const TRANSFER_MIN = 3;

const neighbours = (id: string): string[] => {
  const s = stationById(id);
  const line = LINES.find((l) => l.id === s.line)!;
  const i = line.stations.findIndex((x) => x.id === id);
  const out = [line.stations[i - 1]?.id, line.stations[i + 1]?.id].filter(Boolean) as string[];
  for (const [a, b] of TRANSFERS) {
    if (a === id) out.push(b);
    if (b === id) out.push(a);
  }
  return out;
};

export const metroPath = (from: string, to: string): string[] => {
  const prev = new Map<string, string | null>([[from, null]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur === to) break;
    for (const n of neighbours(cur)) {
      if (!prev.has(n)) {
        prev.set(n, cur);
        queue.push(n);
      }
    }
  }
  const path: string[] = [];
  for (let at: string | null | undefined = to; at; at = prev.get(at)) path.unshift(at);
  return path[0] === from ? path : [];
};

export interface MetroSegment {
  kind: 'ride';
  line: 1 | 2 | 3;
  stations: Station[];
  /** Terminus in the direction of travel */
  towards: Station;
}
export interface TransferSegment {
  kind: 'transfer';
  from: Station;
  to: Station;
}

/** Cuts a station path into rides (same line) and transfers (line change) */
export const segments = (path: string[]): (MetroSegment | TransferSegment)[] => {
  const out: (MetroSegment | TransferSegment)[] = [];
  let ride: Station[] = [];
  const flush = () => {
    if (ride.length > 1) {
      const line = LINES.find((l) => l.id === ride[0].line)!;
      const i0 = line.stations.findIndex((s) => s.id === ride[0].id);
      const i1 = line.stations.findIndex((s) => s.id === ride[ride.length - 1].id);
      out.push({ kind: 'ride', line: ride[0].line, stations: ride, towards: i1 > i0 ? line.stations[line.stations.length - 1] : line.stations[0] });
    }
  };
  path.map(stationById).forEach((s, i, all) => {
    const prev = all[i - 1];
    if (prev && prev.line !== s.line) {
      flush();
      out.push({ kind: 'transfer', from: prev, to: s });
      ride = [s];
    } else ride.push(s);
  });
  flush();
  return out;
};

export interface TripOption {
  id: string;
  legs: RouteLeg[];
  totalMin: number;
  leavesIn: number;
  transfers: number;
  walkMin: number;
  fare: number;
  freeTransfer: boolean;
  stepFree: boolean;
  /** Metro station path, for the map and live progress */
  path?: string[];
  /** Surface-only alternative: which transports it uses */
  uses: Transport[];
  from: string;
}

/** Metro option between two stations, with walking at both ends */
export const metroOption = (from: string, to: string, walkStart: number, walkEnd: number, leavesIn: number): TripOption | null => {
  const path = metroPath(from, to);
  if (path.length < 2) return null;
  const segs = segments(path);
  const rides = segs.filter((s): s is MetroSegment => s.kind === 'ride');
  const transfers = segs.length - rides.length;
  const rideMin = rides.reduce((a, r) => a + (r.stations.length - 1) * LINES.find((l) => l.id === r.line)!.hop, 0);
  const stations = path.map(stationById);
  return {
    id: `metro-${from}-${to}`,
    legs: [
      ...(walkStart ? [{ kind: 'walk' as const, minutes: walkStart }] : []),
      ...rides.map((r) => ({ kind: 'ride' as const, transport: 'metro' as const, number: r.line })),
      ...(walkEnd ? [{ kind: 'walk' as const, minutes: walkEnd }] : []),
    ],
    // Door to door: walking, riding and changing platforms. The wait is shown separately ("Leaves in 2 min").
    totalMin: walkStart + rideMin + transfers * TRANSFER_MIN + walkEnd,
    leavesIn,
    transfers,
    walkMin: walkStart + walkEnd,
    fare: FARE.metro,
    freeTransfer: true,
    stepFree: !!stations[0].stepFree && !!stations[stations.length - 1].stepFree,
    path,
    uses: ['metro'],
    from,
  };
};
