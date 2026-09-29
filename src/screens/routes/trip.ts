import { useSearchParams } from 'react-router-dom';
import type { RouteStepProps } from '../../components/RouteStep';
import { lineById, stationById } from '../../data/metro';
import { placeById } from '../../data/places';
import { routeById, stopName } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { DEFAULT_FILTERS, planOptions, type PlannedOption } from '../../lib/options';
import { segments, TRANSFER_MIN, type MetroSegment } from '../../lib/routing';
import { NOW } from '../../lib/time';
import { useStore } from '../../store/useStore';

/** The option a detail or live screen is about: from ?opt=, planned with default filters so it is always found */
export const useOption = (): PlannedOption | undefined => {
  const [q] = useSearchParams();
  const from = useStore((s) => s.routeFrom);
  const to = useStore((s) => s.routeTo);
  const serviceChange = useStore((s) => s.serviceChange);
  const trip = useStore((s) => s.trip);
  const id = q.get('opt') ?? trip?.optionId;
  // A deep link without a chosen destination shows the default story: Home → Work
  const all = planOptions(from, to ?? 'work', DEFAULT_FILTERS, serviceChange);
  return all.find((o) => o.id === id) ?? all[0];
};

export type StepWithStations = RouteStepProps & { key: string; stations?: string[] };

/** Turns an option into timed steps: walk, rides with stop counts, free transfers, arrival */
export const useSteps = () => {
  const t = useT();
  const name = useName();
  const to = useStore((s) => s.routeTo);
  const from = useStore((s) => s.routeFrom);
  return (o: PlannedOption): StepWithStations[] => {
    const origin = placeById(from);
    const dest = placeById(to ?? 'work');
    const destLabel = dest ? name(dest.name) : '';
    const steps: StepWithStations[] = [];
    let clock = NOW;
    const walkFirst = o.legs[0]?.kind === 'walk' ? o.legs[0].minutes : 0;

    if (o.path) {
      const first = stationById(o.path[0]);
      if (walkFirst) {
        steps.push({
          key: 'walk',
          kind: 'walk',
          time: clock,
          title: t('detail.walkTo', { place: name(first.name) }),
          detail: `${t('detail.walkMeta', { n: walkFirst, m: origin?.meters ?? 200 })}${first.stepFree ? ` · ${t('detail.entrance')}` : ''}`,
        });
        clock += walkFirst;
      }
      for (const seg of segments(o.path)) {
        if (seg.kind === 'transfer') {
          steps.push({
            key: `x-${seg.to.id}`,
            kind: 'transfer',
            time: clock,
            title: t('detail.transfer', { n: seg.to.line, stop: name(seg.to.name) }),
            detail: t('detail.transferBody'),
            stations: [seg.from.id, seg.to.id],
          });
          clock += TRANSFER_MIN;
        } else {
          const ride = seg as MetroSegment;
          const min = (ride.stations.length - 1) * lineById(ride.line).hop;
          steps.push({
            key: `r-${ride.stations[0].id}`,
            kind: 'ride',
            time: clock,
            transport: 'metro',
            number: ride.line,
            title: t('detail.ride', { line: `${t('transport.metro')} ${ride.line}`, stop: name(ride.towards.name) }),
            detail: t.n('detail.stops', ride.stations.length - 1, { min }),
            stations: ride.stations.map((s) => s.id),
          });
          clock += min;
        }
      }
    } else {
      // Surface option: walk, the vehicle, walk
      const route = routeById('tram-27');
      steps.push({ key: 'walk', kind: 'walk', time: clock, title: t('detail.walkTo', { place: name(stopName(o.from)) }), detail: t('detail.walkMeta', { n: walkFirst, m: 220 }) });
      clock += walkFirst;
      const rideMin = o.totalMin - o.walkMin;
      steps.push({
        key: 'r-tram',
        kind: 'ride',
        time: clock,
        transport: route.transport,
        number: route.number,
        title: t('detail.ride', { line: `${t('transport.tram')} ${route.number}`, stop: name(route.towards) }),
        detail: t.n('detail.stops', route.stops.length - 1, { min: rideMin }),
      });
      clock += rideMin;
      const walkLast = o.legs[o.legs.length - 1]?.kind === 'walk' ? (o.legs[o.legs.length - 1] as { minutes: number }).minutes : 0;
      if (walkLast) {
        steps.push({ key: 'walk-end', kind: 'walk', time: clock, title: t('detail.walkTo', { place: destLabel }), detail: t('detail.walkMeta', { n: walkLast, m: 600 }) });
        clock += walkLast;
      }
    }
    steps.push({ key: 'arrive', kind: 'arrive', time: NOW + o.totalMin, title: t('detail.arrive', { place: destLabel }), last: true });
    return steps;
  };
};
