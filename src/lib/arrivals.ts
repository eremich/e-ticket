import { lineById, stationById, type Station } from '../data/metro';
import { routeById } from '../data/surface';
import type { Route, Stop } from '../data/types';

/**
 * Arrivals and timetables from the frozen clock. Deterministic: the same screen always shows the same minutes.
 */

export const SERVICE_START = 5 * 60 + 30;
export const SERVICE_END = 23 * 60;
/** Weekends run less often */
export const WEEKEND_EXTRA = 3;

/** Next arrivals of one route at a stop, minutes from now */
export const stopArrivals = (stop: Stop, routeId: string, count = 3) => {
  const service = stop.services.find((s) => s.routeId === routeId);
  if (!service) return [];
  const { headway } = routeById(routeId);
  return Array.from({ length: count }, (_, k) => service.next + k * headway);
};

/** Hand-set first trains where the story needs a specific number ("To Istorychnyi Muzei · 2 min") */
const METRO_FIRST: Record<string, number> = {
  'saltivska>istorychnyi-muzei': 2,
  'studentska>istorychnyi-muzei': 4,
  'studentska>saltivska': 3,
  'istorychnyi-muzei>saltivska': 5,
  'maidan-konstytutsii>kholodna-hora': 3,
  'maidan-konstytutsii>industrialna': 1,
  'vokzalna>industrialna': 2,
  'vokzalna>kholodna-hora': 4,
};

export interface MetroDirection {
  /** Terminus the train is heading to */
  towards: Station;
  minutes: number[];
}

/** Both directions at a station (one at a terminus), next three trains each */
export const metroDirections = (stationId: string, count = 3): MetroDirection[] => {
  const station = stationById(stationId);
  const line = lineById(station.line);
  const idx = line.stations.findIndex((s) => s.id === stationId);
  const ends = [line.stations[0], line.stations[line.stations.length - 1]].filter((end) => end.id !== stationId);
  return ends.map((towards, i) => {
    const fallback = ((idx * 3 + line.id * 2 + i * 2) % line.headway) + 1;
    const first = METRO_FIRST[`${stationId}>${towards.id}`] ?? fallback;
    return { towards, minutes: Array.from({ length: count }, (_, k) => first + k * line.headway) };
  });
};

/** Departures for a day, minutes since midnight */
export const timetable = (headway: number, weekend: boolean, offset = 0) => {
  const step = headway + (weekend ? WEEKEND_EXTRA : 0);
  const out: number[] = [];
  for (let t = SERVICE_START + offset; t <= SERVICE_END; t += step) out.push(t);
  return out;
};

/** Departures grouped by hour for the timetable grid */
export const byHour = (times: number[]) => {
  const map = new Map<number, number[]>();
  for (const t of times) {
    const h = Math.floor(t / 60);
    map.set(h, [...(map.get(h) ?? []), t % 60]);
  }
  return [...map.entries()];
};

/** Point along a polyline at fraction f (0..1) */
export const pointAt = (path: [number, number][], f: number): [number, number] => {
  const segs = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, f)) * total;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const r = segs[i] ? d / segs[i] : 0;
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * r, path[i][1] + (path[i + 1][1] - path[i][1]) * r];
    }
    d -= segs[i];
  }
  return path[path.length - 1];
};

/**
 * Vehicles on a route at a moment: one every headway along the whole run.
 * `tick` (minutes, fractional) moves them; 0 gives the frozen screenshot positions.
 */
export const vehiclesOn = (route: Route, tick = 0) => {
  const run = route.stops[route.stops.length - 1]?.at || 30;
  const count = Math.max(1, Math.floor(run / route.headway));
  // Each route gets its own phase so vehicles of different lines don't stack at the start
  const phase = [...route.id].reduce((a, c) => a + c.charCodeAt(0), 0) % route.headway;
  return Array.from({ length: count }, (_, i) => {
    const f = ((((i * route.headway + phase + tick) % run) + run) % run) / run;
    return { id: `${route.id}-${i}`, f, point: pointAt(route.path, f) };
  });
};
