import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CalendarBlank, Wheelchair } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { LineBadge } from '../../components/LineBadge';
import { LineStopList } from '../../components/LineStopList';
import { CityMap, VehicleMarker } from '../../components/CityMap';
import { Button } from '../../components/Button';
import { routeById, stopById, stopName } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { vehiclesOn } from '../../lib/arrivals';
import { NOW } from '../../lib/time';
import { useStore } from '../../store/useStore';

const STROKE = { tram: 'stroke-tram', trolleybus: 'stroke-trolleybus', bus: 'stroke-bus' } as const;

/** A line: where its vehicles are now, and every stop with live times from the rider's stop onwards */
export const LineDetail = () => {
  const { id = '' } = useParams();
  const [q] = useSearchParams();
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const live = useStore((s) => s.live);
  const route = routeById(id);
  if (!route) return null;

  // The rider's stop: from the link, else the first stop that has live data
  const hereId = q.get('stop') ?? route.stops.find((s) => stopById(s.id))?.id ?? route.stops[0].id;
  const hereIdx = Math.max(0, route.stops.findIndex((s) => s.id === hereId));
  const next = stopById(hereId)?.services.find((sv) => sv.routeId === id)?.next ?? 3;
  const hereAt = route.stops[hereIdx].at;

  const stops = route.stops.map((s, i) => {
    let m = next + s.at - hereAt;
    if (m < 0) m += route.headway;
    return { name: name(stopName(s.id)), here: i === hereIdx, ...(live ? { minutes: m } : { scheduled: NOW + m }) };
  });
  // The vehicle coming to the rider's stop, placed between stops by time; plus the one a headway ahead of it
  const hop = hereIdx > 0 ? (hereAt - route.stops[hereIdx - 1].at) : 4;
  // Clamped so a vehicle before the first stop still sits inside the list
  const approaching = Math.max(-0.4, hereIdx - next / hop);
  const ahead = route.stops.findIndex((s) => s.at > hereAt + route.headway - next);
  const vehicles = [approaching, ...(ahead > 0 ? [ahead - 0.5] : [])];
  const label = `${t(`transport.${route.transport}`)} ${route.number}`;

  return (
    <div className="screen-enter flex flex-1 flex-col pb-8">
      <NavBar title={label} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <header className="flex items-center gap-3 px-4 pb-4 pt-2">
        <LineBadge transport={route.transport} number={route.number} label={label} />
        <div className="min-w-0">
          <h1 className="text-headline text-ink">{t('line.towards', { stop: name(route.towards) })}</h1>
          <p className="flex items-center gap-1 text-subheadline text-muted">
            {t('stop.every', { n: route.headway })}
            {route.lowFloor && (
              <>
                {' · '}
                <Wheelchair aria-hidden weight="bold" className="size-4 text-action" />
                {t('line.lowFloor')}
              </>
            )}
          </p>
        </div>
      </header>

      {route.path.length > 0 && (
        <div className="mx-4 h-44 overflow-hidden rounded-group">
          <CityMap>
            <polyline points={route.path.map((p) => p.join(',')).join(' ')} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className={STROKE[route.transport]} />
            {vehiclesOn(route).map((v) => (
              <VehicleMarker key={v.id} transport={route.transport} number={route.number} x={v.point[0]} y={v.point[1]} />
            ))}
          </CityMap>
        </div>
      )}

      <section className="mt-5 px-4">
        <h2 className="section-title pb-2">{t('line.stops')}</h2>
        <div className="rounded-group bg-surface py-3">
          <LineStopList
            transport={route.transport}
            stops={stops}
            vehicles={live ? vehicles : []}
            onStop={(i) => stopById(route.stops[i].id) && navigate(`/stop/${route.stops[i].id}`)}
          />
        </div>
      </section>
      <div className="mt-4 px-4">
        <Button variant="gray" block icon={<CalendarBlank aria-hidden className="size-5" />} onClick={() => navigate(`/timetable/${id}?stop=${hereId}`)}>
          {t('stop.timetable')}
        </Button>
      </div>
    </div>
  );
};
