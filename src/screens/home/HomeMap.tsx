import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CityMap, StopDot, VehicleMarker, YouAreHere } from '../../components/CityMap';
import { Chip } from '../../components/Chip';
import { ROUTES, STOPS } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { vehiclesOn } from '../../lib/arrivals';
import { TRANSPORT_ICON, type Transport } from '../../lib/icons';
import { useStore } from '../../store/useStore';

const FILTERS: Transport[] = ['tram', 'trolleybus', 'bus'];
/** Simulated minutes per real second while the map is open */
const SPEED = 0.25;

/** Vehicles creep along their routes; frozen when reduced motion is on (and for screenshots) */
const useTick = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setTick((x) => x + SPEED), 1000);
    return () => clearInterval(id);
  }, []);
  return tick;
};

/** Home's map mode: every vehicle nearby, filter by type, tap a vehicle for its line */
export const HomeMap = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const filter = useStore((s) => s.mapFilter);
  const toggle = useStore((s) => s.toggleMapFilter);
  const tick = useTick();
  const routes = ROUTES.filter((r) => r.path.length && filter.includes(r.transport));

  return (
    <div className="screen-enter flex flex-col gap-3 px-4">
      <div role="group" aria-label={t('home.filters')} className="scroll-x -mx-4 flex gap-2 px-4">
        {FILTERS.map((f) => {
          const Icon = TRANSPORT_ICON[f];
          return <Chip key={f} label={t(`transport.${f}`)} icon={<Icon aria-hidden weight="fill" className="size-4" />} selected={filter.includes(f)} onClick={() => toggle(f)} />;
        })}
      </div>
      <div className="h-[460px] overflow-hidden rounded-group">
        <CityMap>
          {routes.map((r) => (
            <polyline key={r.id} points={r.path.map((p) => p.join(',')).join(' ')} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="stroke-muted/40" />
          ))}
          {STOPS.filter((s) => s.x !== undefined).map((s) => (
            <StopDot key={s.id} x={s.x!} y={s.y!} label={name(s.name)} onClick={() => navigate(`/stop/${s.id}`)} />
          ))}
          <YouAreHere x={345} y={95} />
          {routes.flatMap((r) =>
            vehiclesOn(r, tick).map((v) => (
              <VehicleMarker
                key={v.id}
                transport={r.transport}
                number={r.number}
                x={v.point[0]}
                y={v.point[1]}
                label={`${t(`transport.${r.transport}`)} ${r.number}`}
                onClick={() => navigate(`/line/${r.id}`)}
              />
            )),
          )}
        </CityMap>
      </div>
    </div>
  );
};
