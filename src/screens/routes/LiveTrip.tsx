import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowsLeftRight, FlagCheckered } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { MetroMap, METRO_VIEWBOX } from '../../components/MetroMap';
import { RouteStep, RouteSteps } from '../../components/RouteStep';
import { PushBanner } from '../../components/PushBanner';
import { ArrivalChip } from '../../components/ArrivalChip';
import { Button } from '../../components/Button';
import { ServiceChangeBanner } from '../../components/ServiceChangeBanner';
import { stationById } from '../../data/metro';
import { CLOSED_STATION } from '../../data/places';
import { routeById, stopById } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { lineById } from '../../data/metro';
import { useStore } from '../../store/useStore';
import { useOption, useSteps } from './trip';

/** Seconds between stations in the simulation */
const STEP_MS = 1800;

/**
 * Live trip on the metro map: the train moves station by station. At the interchange it says where to change
 * (no new tap); one stop before the end, a notification says to get off; at the end, what waits at the exit.
 */
export const LiveTrip = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const [q] = useSearchParams();
  const trip = useStore((s) => s.trip);
  const advance = useStore((s) => s.advanceTrip);
  const endTrip = useStore((s) => s.endTrip);
  const serviceChange = useStore((s) => s.serviceChange);
  const option = useOption();
  const steps = useSteps();

  // ?at=<station> freezes the train for screenshots; otherwise it moves on its own
  const at = q.get('at');
  useEffect(() => {
    if (!trip || !at) return;
    const i = trip.path.indexOf(at);
    if (i >= 0) useStore.setState({ trip: { ...trip, index: i } });
    // Once, when a frozen position is requested
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [at]);
  useEffect(() => {
    if (!trip || at || trip.index >= trip.path.length - 1) return;
    const id = setTimeout(advance, STEP_MS);
    return () => clearTimeout(id);
  }, [trip, at, advance]);

  if (!trip || !option || !trip.path.length) {
    return (
      <div className="flex flex-1 flex-col">
        <NavBar title={t('live.title')} onBack={() => navigate('/routes')} backLabel={t('tab.routes')} />
      </div>
    );
  }

  const { path, index } = trip;
  const here = stationById(path[index]);
  const next = path[index + 1] ? stationById(path[index + 1]) : undefined;
  const arrived = index === path.length - 1;
  const changing = next && next.line !== here.line;
  const getOff = index === path.length - 2;
  const list = steps(option);
  // Which step the train is in: the last step whose stations include the current one
  const current = list.reduce((acc, s, i) => (s.stations?.includes(here.id) ? i : acc), 0);
  const exitStop = here.exits?.[0] ? stopById(here.exits[0]) : undefined;
  const hop = lineById(here.line).hop;

  return (
    <div className="relative flex flex-1 flex-col">
      <NavBar title={t('live.title')} onBack={() => navigate(-1)} backLabel={t('tab.routes')} />

      <div className="relative mx-4 h-72 overflow-hidden rounded-group bg-canvas ring-1 ring-inset ring-line">
        {/* The map follows the train: its station stays in the middle of the window */}
        <div
          className="absolute left-1/2 top-1/2 transition-transform duration-700 ease-out"
          style={{ width: METRO_VIEWBOX.w, height: METRO_VIEWBOX.h, transform: `translate(${-here.x}px, ${-here.y}px)` }}
        >
          <MetroMap path={path} train={here.id} current={path[0]} />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-8 pt-4">
        {serviceChange && path.includes(CLOSED_STATION) && !arrived && (
          <ServiceChangeBanner
            title={t('change.title', { stop: name(stationById(CLOSED_STATION).name) })}
            body={t('change.body')}
            actionLabel={t('change.alt')}
            onAction={() => {
              useStore.getState().toast(t('change.usingAlt'));
              navigate('/routes/detail?opt=tram-27-work', { replace: true });
            }}
          />
        )}

        {arrived ? (
          <div role="status" className="rise flex flex-col gap-3 rounded-group bg-surface p-4">
            <p className="flex items-center gap-2 text-title2 text-ink">
              <FlagCheckered aria-hidden weight="fill" className="size-6 text-ok" />
              {t('live.arrived', { stop: name(here.name) })}
            </p>
            {exitStop && (
              <div className="flex flex-col gap-2">
                <p className="section-title px-0">
                  {t('live.onward')} · {name(exitStop.name)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exitStop.services.map((sv) => {
                    const r = routeById(sv.routeId);
                    return <ArrivalChip key={sv.routeId} transport={r.transport} number={r.number} minutes={sv.next} onClick={() => navigate(`/stop/${exitStop.id}`)} />;
                  })}
                </div>
              </div>
            )}
            <Button
              block
              onClick={() => {
                endTrip();
                navigate('/', { replace: true });
              }}
            >
              {t('live.end')}
            </Button>
          </div>
        ) : changing ? (
          <div role="status" className="rise flex items-start gap-3 rounded-group bg-action-soft p-4">
            <ArrowsLeftRight aria-hidden weight="bold" className="mt-0.5 size-6 shrink-0 text-action" />
            <div>
              <p className="text-headline text-ink">{t('live.transferNow', { stop: name(here.name), n: next!.line })}</p>
              <p className="text-subheadline text-ink">{t('detail.transferBody')}</p>
            </div>
          </div>
        ) : (
          next && (
            <p className="tnum flex items-baseline justify-between rounded-group bg-surface px-4 py-3">
              <span className="text-headline text-ink">{t('live.next', { stop: name(next.name) })}</span>
              <span className="text-subheadline text-muted">{t('live.inMin', { n: hop })}</span>
            </p>
          )
        )}

        <div className="rounded-group bg-surface px-2 pt-4">
          <RouteSteps>
            {list.map(({ key, stations: _s, ...s }, i) => (
              <RouteStep key={key} {...s} status={arrived ? 'done' : i < current ? 'done' : i === current ? 'current' : 'next'} />
            ))}
          </RouteSteps>
        </div>
      </div>

      {getOff && next && (
        <div className="pointer-events-none absolute inset-x-2 top-1 z-toast">
          <div className="pointer-events-auto">
            <PushBanner app={t('live.notification')} title={t('live.getOff', { stop: name(next.name) })} body={t('live.getOffBody')} time={t('live.now')} />
          </div>
        </div>
      )}
    </div>
  );
};
