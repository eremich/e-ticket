import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Subway } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { CardStrip } from '../../components/EticketCard';
import { Segmented } from '../../components/Segmented';
import { NearestStation, StopRow } from '../../components/StopRow';
import { Banner } from '../../components/Banner';
import { Skeleton, SkeletonRow } from '../../components/Skeleton';
import { useFirstLoad, useStationChips, useStopChips } from '../../app/data';
import { lineById, stationById } from '../../data/metro';
import { HOME_STOPS, routeById, stopById } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { useActiveCard, useStore } from '../../store/useStore';
import { HomeMap } from './HomeMap';
import { StationSheet } from './StationSheet';

const NEAREST = 'saltivska';

const MetroButton = () => {
  const t = useT();
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate('/metro')}
      className="press -mr-1 flex h-10 items-center gap-1.5 rounded-chip bg-surface px-3.5 text-subheadline font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]"
    >
      <Subway aria-hidden weight="fill" className="size-4" />
      {t('transport.metro')}
    </button>
  );
};

/** "Where to?" — the single entry point for route search */
const SearchField = () => {
  const t = useT();
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate('/routes')} className="flex h-12 w-full items-center gap-2 rounded-chip bg-surface px-4 text-left text-body text-muted shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
      <MagnifyingGlass aria-hidden weight="bold" className="size-5" />
      {t('home.whereTo')}
    </button>
  );
};

/** After a trip: what leaves from the exit of the station you arrived at ("Tram 7 · 4 min") */
const Onward = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const arrivedAt = useStore((s) => s.arrivedAt);
  const stopChips = useStopChips();
  const exit = arrivedAt ? stationById(arrivedAt).exits?.[0] : undefined;
  if (!arrivedAt || !exit) return null;
  const stop = stopById(exit);
  return (
    <section className="px-4">
      <h2 className="section-title pb-2">
        {t('live.onward')} · {name(stationById(arrivedAt).name)}
      </h2>
      <div className="rounded-group bg-surface">
        <StopRow
          name={name(stop.name)}
          walkMin={stop.walkMin}
          meters={stop.meters}
          transport={routeById(stop.services[0].routeId).transport}
          arrivals={stopChips(stop)}
          onClick={() => navigate(`/stop/${stop.id}`)}
        />
      </div>
    </section>
  );
};

const ListView = ({ onStation }: { onStation: (id: string) => void }) => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const stopChips = useStopChips();
  const stationChips = useStationChips();
  const favorites = useStore((s) => s.favorites);
  const loading = useFirstLoad('home');
  const station = stationById(NEAREST);

  if (loading) {
    return (
      <div aria-busy className="flex flex-col gap-6 px-4">
        <Skeleton className="h-[116px] rounded-group" />
        <div className="rounded-group bg-surface">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  // Favorites first, then by walking distance
  const stops = HOME_STOPS.map(stopById).sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)) || a.walkMin - b.walkMin);

  return (
    <div className="screen-enter flex flex-col gap-6">
      <Onward />
      <section className="px-4">
        <h2 className="section-title pb-2">{t('home.nearestStation')}</h2>
        <NearestStation
          name={name(station.name)}
          line={station.line}
          lineName={name(lineById(station.line).name)}
          walkMin={3}
          stepFree={station.stepFree}
          directions={stationChips(NEAREST)}
          onClick={() => onStation(NEAREST)}
        />
      </section>
      <section className="px-4">
        <h2 className="section-title pb-2">{t('home.nearbyStops')}</h2>
        <div className="divide-y divide-line rounded-group bg-surface">
          {stops.map((stop) => (
            <StopRow
              key={stop.id}
              name={name(stop.name)}
              walkMin={stop.walkMin}
              meters={stop.meters}
              transport={routeById(stop.services[0].routeId).transport}
              favorite={favorites.includes(stop.id)}
              arrivals={stopChips(stop).map((chip, i) => ({ ...chip, onClick: () => navigate(`/line/${stop.services[i].routeId}?stop=${stop.id}`) }))}
              onClick={() => navigate(`/stop/${stop.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export const Home = () => {
  const t = useT();
  const navigate = useNavigate();
  const { balance } = useActiveCard();
  const fare = useStore((s) => s.fare);
  const live = useStore((s) => s.live);
  const view = useStore((s) => s.homeView);
  const setView = useStore((s) => s.setHomeView);
  const [station, setStation] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col pb-6">
      <NavBar large title={t('tab.home')} trailing={<MetroButton />}>
        <SearchField />
      </NavBar>
      <div className="flex flex-col gap-3 px-4 pb-4">
        <CardStrip balance={balance} fare={fare} onOpen={() => navigate('/card')} onTopUp={() => navigate('/card/top-up')} />
        {!live && <Banner tone="offline" title={t('home.noLive')} />}
        <Segmented
          label={t('home.view')}
          value={view}
          onChange={setView}
          options={[
            { key: 'list', label: t('home.list') },
            { key: 'map', label: t('home.map') },
          ]}
        />
      </div>
      {view === 'list' ? <ListView onStation={setStation} /> : <HomeMap />}
      <StationSheet stationId={station} onClose={() => setStation(null)} />
    </div>
  );
};
