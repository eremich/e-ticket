import { useNavigate, useParams } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { StatusTimeline } from '../../components/StatusTimeline';
import { useT } from '../../i18n';
import { clock } from '../../lib/format';
import { useStore } from '../../store/useStore';
import { useActivityRow } from '../card/activity';
import { useTimelines } from './timelines';

/** One problem report and where it stands */
export const RequestDetail = () => {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams();
  const req = useStore((s) => s.requests.find((r) => r.id === id));
  const trip = useStore((s) => s.activity.find((a) => a.id === req?.tripId));
  const row = useActivityRow();
  const { request } = useTimelines();
  const back = () => navigate('/profile');

  if (!req) {
    return (
      <div className="screen-enter flex flex-1 flex-col">
        <NavBar title={t('request.title')} onBack={back} backLabel={t('tab.profile')} />
        <p className="px-4 pt-6 text-body text-muted">{t('detail.notFound')}</p>
      </div>
    );
  }

  const r = trip ? row(trip) : undefined;
  const sent = `${t('trip.today')}, ${clock(req.createdAt.time)}`;
  const tripLabel = trip?.place ? `${t(`transport.${trip.place.transport}`)} ${trip.place.number} · ${clock(trip.time)}` : undefined;

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t(`report.${req.reason}`)} onBack={back} backLabel={t('tab.profile')} />
      <ListGroup>
        <ListRow chevron={false} title={t('request.reason')} trailing={<span className="text-ink">{t(`report.${req.reason}`)}</span>} />
        {tripLabel && r && (
          <ListRow chevron={false} title={t('request.trip')} trailing={<span className="tnum text-ink">{tripLabel}</span>} />
        )}
      </ListGroup>
      <section className="px-4">
        <div className="rounded-group bg-surface p-4">
          <StatusTimeline label={t('request.title')} steps={request(req.status, sent)} />
        </div>
      </section>
    </div>
  );
};
