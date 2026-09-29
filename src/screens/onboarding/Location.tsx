import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MapPin } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow } from '../../components/ListRow';
import { SystemAlert } from '../../components/SystemAlert';
import { HOME_STOPS, STOP_NAMES } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { useStore } from '../../store/useStore';
import { Lead } from './parts';

const ALERT_DELAY_MS = 400;

/** Why we ask for location, then the iOS system prompt. Denying leads to picking a home stop. */
export const Location = () => {
  const t = useT();
  const navigate = useNavigate();
  const setAllowed = useStore((s) => s.setLocationAllowed);
  const [alert, setAlert] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setAlert(true), ALERT_DELAY_MS);
    return () => clearTimeout(id);
  }, []);
  const target = typeof document !== 'undefined' ? document.getElementById('sheet-root') : null;

  const answer = (allowed: boolean) => {
    setAllowed(allowed);
    setAlert(false);
    navigate(allowed ? '/' : '/onboarding/home-stop');
  };

  return (
    <div className="screen-enter flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-16 text-center">
        <div role="img" aria-label={t('location.pinLabel')} className="relative flex size-44 items-center justify-center">
          {[0, 1].map((i) => (
            <span key={i} aria-hidden className="ring-out absolute size-32 rounded-full border-2 border-action" style={{ animationDelay: `${i * 0.9}s` }} />
          ))}
          <span aria-hidden className="absolute size-32 rounded-full bg-action-soft" />
          <MapPin aria-hidden weight="fill" className="relative size-16 text-action" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-large-title text-ink">{t('location.title')}</h1>
          <p className="text-body text-muted">{t('location.body')}</p>
        </div>
      </div>
      {alert &&
        target &&
        createPortal(
          <SystemAlert
            title={t('location.alertTitle')}
            body={t('location.alertBody')}
            actions={[
              { label: t('location.once'), onPress: () => answer(true) },
              { label: t('location.while'), onPress: () => answer(true), primary: true },
              { label: t('location.deny'), onPress: () => answer(false) },
            ]}
          />,
          target,
        )}
    </div>
  );
};

/** Without location, Home shows arrivals for one chosen stop */
export const HomeStop = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const setHomeStop = useStore((s) => s.setHomeStop);
  return (
    <div className="screen-enter flex flex-1 flex-col">
      <NavBar large title={t('location.pickTitle')} onBack={() => navigate(-1)} backLabel={t('common.back')}>
        <Lead>{t('location.pickBody')}</Lead>
      </NavBar>
      <div className="pt-4">
        <ListGroup>
          {HOME_STOPS.map((id) => (
            <ListRow
              key={id}
              title={name(STOP_NAMES[id])}
              onClick={() => {
                setHomeStop(id);
                navigate('/');
              }}
            />
          ))}
        </ListGroup>
      </div>
    </div>
  );
};
