import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { LineBadge } from '../../components/LineBadge';
import { Segmented } from '../../components/Segmented';
import { TimetableGrid } from '../../components/TimetableGrid';
import { routeById, stopById, stopName } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { SERVICE_START, timetable } from '../../lib/arrivals';
import { clock } from '../../lib/format';
import { NOW, TODAY } from '../../lib/time';

/** Full day of departures at one stop. Opens on today's day type; the next departure is filled. */
export const Timetable = () => {
  const { id = '' } = useParams();
  const [q] = useSearchParams();
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const route = routeById(id);
  const isWeekend = [0, 6].includes(TODAY.getDay());
  const [days, setDays] = useState<'weekday' | 'weekend'>(isWeekend ? 'weekend' : 'weekday');
  if (!route) return null;

  const stopId = q.get('stop') ?? route.stops[0].id;
  // Anchor the day's departures on the live next arrival, so the table and Home agree (08:14 + 3 min = 08:17)
  const liveNext = stopById(stopId)?.services.find((sv) => sv.routeId === id)?.next ?? 0;
  const offset = (((NOW + liveNext - SERVICE_START) % route.headway) + route.headway) % route.headway;
  const times = timetable(route.headway, days === 'weekend', offset);
  const next = times.find((x) => x >= NOW);
  const today = (days === 'weekend') === isWeekend;

  return (
    <div className="screen-enter flex flex-1 flex-col pb-8">
      <NavBar title={t('timetable.title')} onBack={() => navigate(-1)} backLabel={t('common.back')} />
      <header className="flex items-center gap-3 px-4 pb-3 pt-2">
        <LineBadge transport={route.transport} number={route.number} />
        <div className="min-w-0">
          <h1 className="truncate text-headline text-ink">{name(stopName(stopId))}</h1>
          <p className="truncate text-subheadline text-muted">{t('line.towards', { stop: name(route.towards) })}</p>
        </div>
      </header>
      <div className="sticky top-11 z-10 bg-canvas px-4 pb-3">
        <Segmented
          label={t('timetable.days')}
          value={days}
          onChange={setDays}
          options={[
            { key: 'weekday', label: t('timetable.weekday') },
            { key: 'weekend', label: t('timetable.weekend') },
          ]}
        />
        {today && next !== undefined && <p className="tnum mt-2 px-1 text-subheadline font-semibold text-action">{t('timetable.next', { time: clock(next) })}</p>}
      </div>
      <div className="mx-4 overflow-hidden rounded-group bg-surface">
        <TimetableGrid times={times} now={today ? NOW : 0} />
      </div>
    </div>
  );
};
