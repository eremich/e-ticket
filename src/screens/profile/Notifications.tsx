import { useNavigate } from 'react-router-dom';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { Toggle } from '../../components/Toggle';
import { useT } from '../../i18n';
import { money } from '../../lib/format';
import { useStore, type NotifySettings } from '../../store/useStore';

/** Which messages Eticket may send. Each row says what it does, not just its name. */
export const Notifications = () => {
  const t = useT();
  const navigate = useNavigate();
  const notify = useStore((s) => s.notify);
  const set = useStore((s) => s.setNotify);
  const below = useStore((s) => s.autoTopUp.below);
  const alerts = useStore((s) => s.alerts.length);

  const row = (key: keyof NotifySettings, title: string, subtitle: string) => (
    <ListRow title={title} subtitle={subtitle} trailing={<Toggle label={title} checked={notify[key]} onChange={(v) => set({ [key]: v })} />} />
  );

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t('notify.title')} onBack={() => navigate('/profile')} backLabel={t('tab.profile')} />
      <ListGroup>
        {row('lowBalance', t('notify.lowBalance'), t('notify.lowBalanceBody', { amount: money(t.lang, below) }))}
        {row('arrivals', t('notify.arrivals'), t.n('notify.arrivalsBody', alerts))}
        {row('serviceChanges', t('notify.serviceChanges'), t('notify.serviceChangesBody'))}
        {row('receipts', t('notify.receipts'), t('notify.receiptsBody'))}
      </ListGroup>
    </div>
  );
};
