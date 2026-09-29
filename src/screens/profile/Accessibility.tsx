import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Toggle } from '../../components/Toggle';
import { useT } from '../../i18n';
import { useStore } from '../../store/useStore';

/** Defaults that make the app easier to use */
export const Accessibility = () => {
  const t = useT();
  const navigate = useNavigate();
  const stepFree = useStore((s) => s.routeFilters.stepFree);
  const setFilters = useStore((s) => s.setRouteFilters);
  const larger = useStore((s) => s.largerTimes);
  const setLarger = useStore((s) => s.setLargerTimes);

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t('a11y.title')} onBack={() => navigate('/profile')} backLabel={t('tab.profile')} />
      <ListGroup>
        <ListRow title={t('a11y.stepFree')} trailing={<Toggle label={t('a11y.stepFree')} checked={stepFree} onChange={(v) => setFilters({ stepFree: v })} />} />
        <ListRow title={t('a11y.largerTimes')} trailing={<Toggle label={t('a11y.largerTimes')} checked={larger} onChange={setLarger} />} />
      </ListGroup>
      <ListGroup footer={t('a11y.reduceMotionNote')}>
        <ListRow title={t('a11y.reduceMotion')} />
      </ListGroup>
    </div>
  );
};
