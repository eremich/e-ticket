import { useNavigate, useSearchParams } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ListGroup } from '../../components/ListRow';
import { Segmented } from '../../components/Segmented';
import { TripRow } from '../../components/TripRow';
import { useT } from '../../i18n';
import { date, money } from '../../lib/format';
import { useStore, type Activity } from '../../store/useStore';
import { useActivityRow } from '../card/activity';
import { dayOf, monthStats } from './data';

type Filter = 'all' | 'rides' | 'topups';
const FILTERS: Filter[] = ['all', 'rides', 'topups'];
const RIDE_KINDS: Activity['kind'][] = ['ride', 'transfer', 'refund'];
const OPENABLE: Activity['kind'][] = ['ride', 'topup', 'refund'];

const matches = (f: Filter, a: Activity) => (f === 'all' ? true : f === 'rides' ? RIDE_KINDS.includes(a.kind) : a.kind === 'topup');

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-0 flex-1 flex-col">
    <span className="tnum text-title2 text-ink">{value}</span>
    <span className="truncate text-footnote text-muted">{label}</span>
  </div>
);

/** History for every card, by day, with this month's totals on top */
export const Trips = () => {
  const t = useT();
  const navigate = useNavigate();
  const [q, setQ] = useSearchParams();
  const activity = useStore((s) => s.activity);
  const row = useActivityRow();
  const filter = (FILTERS as string[]).includes(q.get('filter') ?? '') ? (q.get('filter') as Filter) : 'all';
  const stats = monthStats(activity);
  const m = (n: number) => money(t.lang, n);

  const days = [...new Set(activity.filter((a) => matches(filter, a)).map((a) => a.daysAgo))].sort((a, b) => a - b);
  const label = (n: number) => (n === 0 ? t('trip.today') : n === 1 ? t('trip.yesterday') : date(t.lang, dayOf(n), { weekday: 'short', day: 'numeric', month: 'long' }));
  const back = () => navigate('/profile');

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t('trips.title')} onBack={back} backLabel={t('tab.profile')}>
        <Segmented<Filter>
          label={t('trips.filterLabel')}
          value={filter}
          onChange={(k) => setQ(k === 'all' ? {} : { filter: k }, { replace: true })}
          options={FILTERS.map((k) => ({ key: k, label: t(`trips.${k === 'all' ? 'all' : k}`) }))}
        />
      </NavBar>

      <section className="px-4">
        <h2 className="section-title pb-2">{t('trips.summaryHeader')}</h2>
        <div className="flex flex-col gap-4 rounded-group bg-surface p-4">
          <div className="flex flex-col">
            <span className="tnum text-large-title text-ink">{m(stats.spent)}</span>
            <span className="text-subheadline text-muted">{t('trips.spent')}</span>
          </div>
          <div className="flex gap-4 border-t border-line pt-4">
            <Stat label={t('trips.ridesCount')} value={String(stats.rides)} />
            <Stat label={t('trips.topupsTotal')} value={m(stats.topups)} />
          </div>
        </div>
      </section>

      {days.length === 0 && <p className="px-8 text-center text-body text-muted">{t('trips.empty')}</p>}
      {days.map((d) => (
        <ListGroup key={d} header={label(d)}>
          {activity
            .filter((a) => a.daysAgo === d && matches(filter, a))
            .sort((a, b) => b.time - a.time)
            .map((a) => (
              <TripRow key={a.id} {...row(a)} onClick={OPENABLE.includes(a.kind) ? () => navigate(`/profile/trips/${a.id}`) : undefined} />
            ))}
        </ListGroup>
      ))}
    </div>
  );
};
