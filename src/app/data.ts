import { useEffect } from 'react';
import type { ArrivalChipProps } from '../components/ArrivalChip';
import { lineById, stationById, transferOf } from '../data/metro';
import { routeById, stopById, stopName } from '../data/surface';
import type { Name, Stop } from '../data/types';
import { useName } from '../i18n';
import { metroDirections } from '../lib/arrivals';
import { NOW } from '../lib/time';
import { useStore } from '../store/useStore';

export const LOADING_MS = 600;

/** Shows a skeleton the first time a screen opens in a session (simulated fetch) */
export function useFirstLoad(key: string) {
  const loaded = useStore((s) => !!s.loaded[key]);
  const markLoaded = useStore((s) => s.markLoaded);
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => markLoaded(key), LOADING_MS);
    return () => clearTimeout(t);
  }, [loaded, key, markLoaded]);
  return !loaded;
}

/** Live minutes, or the timetable time when live data is off */
const when = (minutes: number, live: boolean) => (live ? { minutes } : { scheduled: NOW + minutes });

/** Arrival chips for a stop: next vehicle per route */
export const useStopChips = () => {
  const live = useStore((s) => s.live);
  return (stop: Stop): ArrivalChipProps[] =>
    stop.services.map((sv) => {
      const r = routeById(sv.routeId);
      return { transport: r.transport, number: r.number, ...when(sv.next, live) };
    });
};

/** Metro direction chips for a station */
export const useStationChips = () => {
  const live = useStore((s) => s.live);
  const name = useName();
  return (stationId: string): ArrivalChipProps[] => {
    const st = stationById(stationId);
    return metroDirections(stationId, 1).map((d) => ({ transport: 'metro', number: st.line, towards: name(d.towards.name), ...when(d.minutes[0], live) }));
  };
};

/** Everything the station sheet needs */
export const useStationPanel = () => {
  const live = useStore((s) => s.live);
  const name = useName();
  const stopChips = useStopChips();
  return (stationId: string) => {
    const st = stationById(stationId);
    const tr = transferOf(stationId);
    return {
      title: name(st.name),
      props: {
        line: st.line,
        lineName: name(lineById(st.line).name),
        stepFree: st.stepFree,
        directions: metroDirections(stationId).map((d) =>
          live ? { towards: name(d.towards.name), minutes: d.minutes } : { towards: name(d.towards.name), scheduled: d.minutes.map((m) => NOW + m) },
        ),
        transfer: tr ? { name: name(tr.name), line: tr.line } : undefined,
        exits: (st.exits ?? []).map((id) => {
          const stop = stopById(id);
          return { name: name(stop.name), walkMin: Math.max(1, stop.walkMin - 2), arrivals: stopChips(stop) };
        }),
      },
    };
  };
};

export const useStopName = () => {
  const name = useName();
  return (id: string) => name(stopName(id) as Name);
};
