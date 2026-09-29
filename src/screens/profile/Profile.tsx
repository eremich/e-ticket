import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowsClockwise,
  Bell,
  ChartBar,
  ChatCircleDots,
  CircleHalf,
  ClockCounterClockwise,
  CreditCard,
  GraduationCap,
  PersonSimpleCircle,
  Receipt,
  Translate,
  Wallet,
} from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { ListGroup, ListRow, RowIcon } from '../../components/ListRow';
import { useLang, useT } from '../../i18n';
import { date, money, numericDate } from '../../lib/format';
import { TODAY } from '../../lib/time';
import { useActiveCard, useStore } from '../../store/useStore';
import { LANG_NAME } from './Choice';
import { monthStats, reducedState } from './data';
import { AlertPortal } from './parts';

/** The Profile tab: who you are, then trips and money, cards, requests, settings */
export const Profile = () => {
  const t = useT();
  const navigate = useNavigate();
  const { lang } = useLang();
  const theme = useStore((s) => s.theme);
  const activity = useStore((s) => s.activity);
  const requests = useStore((s) => s.requests);
  const auto = useStore((s) => s.autoTopUp);
  const toast = useStore((s) => s.toast);
  const card = useActiveCard();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const stats = monthStats(activity);
  const reduced = reducedState(card.reduced);

  const reducedTrailing =
    reduced.state === 'none' ? (
      t('profile.reducedNone')
    ) : reduced.state === 'expiring' ? (
      <span className="text-warn-ink">{t.n('profile.reducedExpires', reduced.days)}</span>
    ) : (
      t('profile.reducedUntil', { date: numericDate(t.lang, reduced.until) })
    );

  return (
    <div className="screen-enter flex flex-1 flex-col gap-6 pb-8">
      <NavBar large title={t('tab.profile')} />
      <div className="-mt-1 flex items-center gap-4 px-4">
        <span aria-hidden className="flex size-16 shrink-0 items-center justify-center rounded-chip bg-raised text-title2 text-ink">
          OK
        </span>
        <div className="min-w-0" aria-label={t('profile.avatarLabel', { phone: t('profile.phone') })}>
          <p className="truncate text-title2 text-ink">{t('profile.name')}</p>
          <p className="tnum text-subheadline text-muted">{t('profile.phone')}</p>
        </div>
      </div>

      <ListGroup header={t('profile.moneyHeader')} inset="icon">
        <ListRow leading={<RowIcon><ClockCounterClockwise weight="bold" /></RowIcon>} title={t('profile.trips')} trailing={<span className="tnum">{t.n('profile.tripsCount', stats.rides)}</span>} onClick={() => navigate('/profile/trips')} />
        <ListRow
          leading={<RowIcon><ChartBar weight="bold" /></RowIcon>}
          title={t('profile.spending')}
          subtitle={<span className="tnum">{t('profile.spendingValue', { amount: money(t.lang, stats.spent), month: date(t.lang, TODAY, { month: 'long' }) })}</span>}
          onClick={() => navigate('/profile/trips')}
        />
        <ListRow leading={<RowIcon><Receipt weight="bold" /></RowIcon>} title={t('profile.receipts')} onClick={() => navigate('/profile/trips?filter=topups')} />
      </ListGroup>

      <ListGroup header={t('profile.cardsHeader')} inset="icon">
        <ListRow leading={<RowIcon><CreditCard weight="bold" /></RowIcon>} title={t('profile.myCards')} onClick={() => navigate('/profile/cards')} />
        <ListRow
          leading={<RowIcon tone={reduced.state === 'expiring' ? 'warn' : undefined}><GraduationCap weight="bold" /></RowIcon>}
          title={t('profile.reduced')}
          subtitle={<span className="tnum">{reducedTrailing}</span>}
          onClick={() => navigate('/profile/reduced')}
        />
        <ListRow leading={<RowIcon><Wallet weight="bold" /></RowIcon>} title={t('profile.payments')} onClick={() => navigate('/card/top-up')} />
        <ListRow
          leading={<RowIcon><ArrowsClockwise weight="bold" /></RowIcon>}
          title={t('profile.auto')}
          trailing={auto.on ? t('profile.on') : t('profile.off')}
          onClick={() => navigate('/card/auto')}
        />
      </ListGroup>

      {requests.length > 0 && (
        <ListGroup header={t('profile.requestsHeader')} inset="icon">
          {requests.map((r) => (
            <ListRow
              key={r.id}
              leading={<RowIcon tone={r.status === 'answered' ? undefined : 'warn'}><ChatCircleDots weight="bold" /></RowIcon>}
              title={t(`report.${r.reason}`)}
              trailing={t(`request.status.${r.status}`)}
              onClick={() => navigate(`/profile/requests/${r.id}`)}
            />
          ))}
        </ListGroup>
      )}

      <ListGroup header={t('profile.settingsHeader')} inset="icon">
        <ListRow leading={<RowIcon><Bell weight="bold" /></RowIcon>} title={t('profile.notifications')} onClick={() => navigate('/profile/notifications')} />
        <ListRow leading={<RowIcon><Translate weight="bold" /></RowIcon>} title={t('profile.language')} trailing={LANG_NAME[lang]} onClick={() => navigate('/profile/language')} />
        <ListRow leading={<RowIcon><CircleHalf weight="bold" /></RowIcon>} title={t('profile.appearance')} trailing={t(`theme.${theme}`)} onClick={() => navigate('/profile/appearance')} />
        <ListRow leading={<RowIcon><PersonSimpleCircle weight="bold" /></RowIcon>} title={t('profile.accessibility')} onClick={() => navigate('/profile/accessibility')} />
      </ListGroup>

      <ListGroup>
        <ListRow destructive chevron={false} title={t('profile.delete')} onClick={() => setConfirmDelete(true)} />
      </ListGroup>

      {confirmDelete && (
        <AlertPortal
          title={t('profile.deleteTitle')}
          body={t('profile.deleteBody')}
          actions={[
            { label: t('common.cancel'), onPress: () => setConfirmDelete(false) },
            {
              label: t('profile.deleteConfirm'),
              primary: true,
              onPress: () => {
                setConfirmDelete(false);
                toast(t('profile.deleted'));
                navigate('/onboarding');
              },
            },
          ]}
        />
      )}
    </div>
  );
};
