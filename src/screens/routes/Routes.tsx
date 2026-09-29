import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, ClockCounterClockwise, House, MapTrifold, MagnifyingGlass, Star, Subway, Wheelchair } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { FromTo } from '../../components/FromTo';
import { Chip } from '../../components/Chip';
import { RouteOption } from '../../components/RouteOption';
import { ListGroup, ListRow, RowIcon } from '../../components/ListRow';
import { Sheet } from '../../components/Sheet';
import { ServiceChangeBanner } from '../../components/ServiceChangeBanner';
import { LineBadge } from '../../components/LineBadge';
import { SAVED_PLACES, placeById, type Place } from '../../data/places';
import { STATIONS } from '../../data/metro';
import { useName, useT } from '../../i18n';
import { planOptions } from '../../lib/options';
import { TRANSPORT_ICON, TRANSPORTS } from '../../lib/icons';
import { NOW } from '../../lib/time';
import { useActiveCard, useStore } from '../../store/useStore';
import { useStopName } from '../../app/data';

const PLACE_ICON = { home: <House weight="fill" />, work: <Briefcase weight="fill" />, station: <Subway weight="fill" />, here: <House weight="fill" /> };

/** Name with the station for saved places: "Work · Vokzalna" */
const usePlaceLabel = () => {
  const name = useName();
  const t = useT();
  return (id: string) => {
    const p = placeById(id);
    if (!p) return '';
    if (p.kind === 'here') return t('routes.here');
    if (p.kind === 'station') return name(p.name);
    return `${name(p.name)} · ${name(placeById(p.station)!.name)}`;
  };
};

/** Search: saved places first, then stations matching the query in either language */
const SearchSheet = ({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (id: string) => void }) => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const stations = STATIONS.filter((s) => !query || s.name.en.toLowerCase().includes(query) || s.name.uk.toLowerCase().includes(query));
  return (
    <Sheet open={open} title={t('routes.to')} onClose={onClose} detents={['large']}>
      <label className="flex h-11 items-center gap-2 rounded-control bg-raised px-3">
        <MagnifyingGlass aria-hidden weight="bold" className="size-5 text-muted" />
        <span className="sr-only">{t('routes.search')}</span>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('routes.search')} className="h-full flex-1 bg-transparent text-body text-ink outline-none placeholder:text-muted" />
      </label>
      <div className="-mx-4 mt-4 flex flex-col gap-5">
        {!query && (
          <ListGroup header={t('routes.saved')} inset="icon">
            {SAVED_PLACES.map((p) => (
              <ListRow key={p.id} leading={<RowIcon>{PLACE_ICON[p.kind]}</RowIcon>} title={name(p.name)} subtitle={name(placeById(p.station)!.name)} onClick={() => onPick(p.id)} />
            ))}
            <ListRow leading={<RowIcon tone="muted"><MapTrifold weight="fill" /></RowIcon>} title={t('routes.pickOnMap')} onClick={() => navigate('/metro')} />
          </ListGroup>
        )}
        {stations.length ? (
          <ListGroup header={t('routes.stations')} inset="icon">
            {stations.map((s) => (
              <ListRow key={s.id} leading={<LineBadge transport="metro" number={s.line} size="sm" />} title={name(s.name)} onClick={() => onPick(s.id)} />
            ))}
          </ListGroup>
        ) : (
          <p className="px-8 text-body text-muted">{t('routes.noResults')}</p>
        )}
      </div>
    </Sheet>
  );
};

/** Routes: From / To, then saved and recent routes — or the options once a destination is set */
export const Routes = () => {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const label = usePlaceLabel();
  const stopName = useStopName();
  const from = useStore((s) => s.routeFrom);
  const to = useStore((s) => s.routeTo);
  const setRoute = useStore((s) => s.setRoute);
  const filters = useStore((s) => s.routeFilters);
  const setFilters = useStore((s) => s.setRouteFilters);
  const saved = useStore((s) => s.savedRoutes);
  const recent = useStore((s) => s.recentRoutes);
  const serviceChange = useStore((s) => s.serviceChange);
  const fare = useStore((s) => s.fare);
  const card = useActiveCard();
  const [search, setSearch] = useState(false);

  // Deep links from the station sheet: /routes?from=… or ?to=…
  useEffect(() => {
    const qFrom = params.get('from');
    const qTo = params.get('to');
    if (qFrom || qTo) setRoute(qFrom ?? 'here', qTo ?? (qFrom ? null : to));
    // Only on arrival with a query
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const options = useMemo(() => (to ? planOptions(from, to, filters, serviceChange) : []), [from, to, filters, serviceChange]);
  const pick = (key: string) => {
    const [f, d] = key.split('>');
    setRoute(f, d);
  };
  const routeRow = (key: string, icon: JSX.Element, tone: 'warn' | 'muted') => {
    const [f, d] = key.split('>');
    const affected = serviceChange && planOptions(f, d, filters, true).some((o) => o.affected);
    return (
      <ListRow
        key={key}
        leading={<RowIcon tone={tone}>{icon}</RowIcon>}
        title={`${label(f).split(' · ')[0]} → ${label(d).split(' · ')[0]}`}
        subtitle={affected ? <ServiceChangeBanner compact title={t('routes.affected')} /> : undefined}
        onClick={() => pick(key)}
      />
    );
  };

  const filterChip = (key: 'fewer' | 'lessWalk' | 'stepFree', text: string, icon?: JSX.Element) => (
    <Chip key={key} label={text} icon={icon} variant="toggle" selected={filters[key]} onClick={() => setFilters({ [key]: !filters[key], ...(key === 'fewer' ? { lessWalk: false } : key === 'lessWalk' ? { fewer: false } : {}) })} />
  );

  return (
    <div className="flex flex-1 flex-col pb-8">
      <NavBar
        large
        title={t('tab.routes')}
        trailing={
          <button type="button" aria-label={t('home.metro')} onClick={() => navigate('/metro')} className="press -mr-2 flex size-11 items-center justify-center text-action">
            <MapTrifold aria-hidden weight="bold" className="size-6" />
          </button>
        }
      >
        <FromTo
          fromLabel={t('routes.from')}
          toLabel={t('routes.to')}
          from={label(from)}
          to={to ? label(to) : undefined}
          fromIsHere={from === 'here'}
          placeholder={t('home.whereTo')}
          swapLabel={t('routes.swap')}
          onTo={() => setSearch(true)}
          onFrom={() => setRoute('here', to)}
          onSwap={() => to && setRoute(to, from)}
        />
      </NavBar>

      {!to ? (
        <div className="screen-enter mt-4 flex flex-col gap-6">
          <ListGroup header={t('routes.saved')} inset="icon">
            {SAVED_PLACES.map((p: Place) => (
              <ListRow key={p.id} leading={<RowIcon>{PLACE_ICON[p.kind]}</RowIcon>} title={label(p.id).split(' · ')[0]} subtitle={label(p.id).split(' · ')[1]} onClick={() => setRoute('here', p.id)} />
            ))}
          </ListGroup>
          {saved.length > 0 && <ListGroup header={t('routes.favorites')} inset="icon">{saved.map((k) => routeRow(k, <Star weight="fill" />, 'warn'))}</ListGroup>}
          {recent.length > 0 && <ListGroup header={t('routes.recent')} inset="icon">{recent.map((k) => routeRow(k, <ClockCounterClockwise weight="bold" />, 'muted'))}</ListGroup>}
        </div>
      ) : (
        <div className="screen-enter mt-3 flex flex-col gap-3">
          <div role="group" aria-label={t('routes.filters')} className="scroll-x flex gap-2 px-4">
            {TRANSPORTS.map((tr) => {
              const Icon = TRANSPORT_ICON[tr];
              const on = filters.transports.includes(tr);
              return (
                <Chip
                  key={tr}
                  label={t(`transport.${tr}`)}
                  icon={<Icon aria-hidden weight="regular" className="size-4" />}
                  variant="toggle"
                  selected={on}
                  onClick={() => setFilters({ transports: on ? filters.transports.filter((x) => x !== tr) : [...filters.transports, tr] })}
                />
              );
            })}
          </div>
          <div className="scroll-x flex gap-2 px-4">
            {filterChip('fewer', t('routes.fewer'))}
            {filterChip('lessWalk', t('routes.lessWalk'))}
            {filterChip('stepFree', t('route.stepFree'), <Wheelchair aria-hidden weight="bold" className="size-4" />)}
          </div>
          <section className="flex flex-col gap-3 px-4 pt-2">
            <h2 className="section-title">{t('routes.options')}</h2>
            {options.length === 0 && <p className="px-4 text-body text-muted">{t('routes.none')}</p>}
            {options.map((o, i) => (
              <div key={o.id} className="flex flex-col gap-1.5">
                <RouteOption
                  legs={o.legs}
                  totalMin={o.totalMin}
                  depart={NOW}
                  arrive={NOW + o.totalMin}
                  leavesIn={o.leavesIn}
                  from={o.path ? label(o.path[0]) : stopName(o.from)}
                  transfers={o.transfers}
                  walkMin={o.walkMin}
                  fare={o.fare}
                  freeTransfer={o.freeTransfer}
                  stepFree={o.stepFree}
                  short={card.balance < Math.max(o.fare, fare)}
                  best={i === 0}
                  onClick={() => navigate(`/routes/detail?opt=${o.id}`)}
                />
                {o.affected && <ServiceChangeBanner compact title={t('routes.affected')} />}
              </div>
            ))}
          </section>
        </div>
      )}
      <SearchSheet
        open={search}
        onClose={() => setSearch(false)}
        onPick={(id) => {
          setSearch(false);
          setRoute(from, id);
        }}
      />
    </div>
  );
};
