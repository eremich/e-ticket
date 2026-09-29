import { useNavigate } from 'react-router-dom';
import { CheckCircle, NavigationArrow, Star, Warning } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { RouteStep, RouteSteps } from '../../components/RouteStep';
import { ArrivalChip } from '../../components/ArrivalChip';
import { Button } from '../../components/Button';
import { ServiceChangeBanner } from '../../components/ServiceChangeBanner';
import { stationById } from '../../data/metro';
import { CLOSED_STATION } from '../../data/places';
import { useName, useT } from '../../i18n';
import { clock, money } from '../../lib/format';
import { NOW } from '../../lib/time';
import { cx } from '../../lib/cx';
import { useActiveCard, useStore } from '../../store/useStore';
import { useOption, useSteps } from './trip';

/** One option in full: the steps with the next train, and a balance check before you leave */
export const RouteDetail = () => {
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const option = useOption();
  const steps = useSteps();
  const card = useActiveCard();
  const from = useStore((s) => s.routeFrom);
  const to = useStore((s) => s.routeTo);
  const saved = useStore((s) => s.savedRoutes);
  const toggleSaved = useStore((s) => s.toggleSavedRoute);
  const startTrip = useStore((s) => s.startTrip);
  const toast = useStore((s) => s.toast);
  if (!option) return null;

  const key = `${from}>${to}`;
  const isSaved = saved.includes(key);
  const short = card.balance < option.fare;
  const m = (n: number) => money(t.lang, n);
  const list = steps(option);
  const firstRide = list.findIndex((s) => s.kind === 'ride');

  return (
    <div className="flex flex-1 flex-col">
      <NavBar
        title={t('time.min', { n: option.totalMin })}
        onBack={() => navigate(-1)}
        backLabel={t('tab.routes')}
        trailing={
          <button
            type="button"
            aria-pressed={isSaved}
            aria-label={isSaved ? t('detail.unsave') : t('detail.save')}
            onClick={() => {
              toggleSaved(key);
              if (!isSaved) toast(t('detail.saved'));
            }}
            className="press -mr-2 flex size-11 items-center justify-center text-action"
          >
            <Star aria-hidden weight={isSaved ? 'fill' : 'regular'} className={cx('size-6', isSaved && 'text-warn')} />
          </button>
        }
      />
      <div className="flex flex-1 flex-col gap-4 px-4 pb-6 pt-2">
        <header className="flex items-baseline justify-between">
          <p className="tnum flex items-baseline gap-2">
            <span className="text-large-title text-ink">{t('time.min', { n: option.totalMin })}</span>
            <span className="text-subheadline text-muted">
              {clock(NOW)}–{clock(NOW + option.totalMin)}
            </span>
          </p>
          <span className="tnum text-title2 text-ink">{m(option.fare)}</span>
        </header>

        {/* Balance check: say it before the turnstile, not at it */}
        {short ? (
          <div role="status" className="flex items-center gap-3 rounded-group bg-warn/15 p-3">
            <Warning aria-hidden weight="fill" className="size-5 shrink-0 text-warn-ink" />
            <div className="min-w-0 flex-1">
              <p className="text-headline text-warn-ink">{t('detail.short')}</p>
              <p className="tnum text-subheadline text-ink">{t('detail.shortBody', { left: m(card.balance), fare: m(option.fare) })}</p>
            </div>
            <Button size="md" variant="filled" onClick={() => navigate('/card/top-up')}>
              {t('card.topUp')}
            </Button>
          </div>
        ) : (
          <p role="status" className="flex items-center gap-2 rounded-group bg-ok/10 px-3 py-2.5 text-subheadline text-ok-ink">
            <CheckCircle aria-hidden weight="fill" className="size-5" />
            {t('detail.covers')}
          </p>
        )}

        {option.affected && (
          <ServiceChangeBanner
            title={t('change.title', { stop: name(stationById(CLOSED_STATION).name) })}
            body={t('change.body')}
            actionLabel={t('change.alt')}
            onAction={() => navigate('/routes/detail?opt=tram-27-work', { replace: true })}
          />
        )}

        <div className="rounded-group bg-surface px-2 pb-1 pt-4">
          <RouteSteps>
            {list.map(({ key: k, stations: _stations, ...s }, i) => (
              <RouteStep
                key={k}
                {...s}
                aside={
                  i === firstRide && s.transport ? (
                    <ArrivalChip
                      transport={s.transport}
                      number={s.number ?? ''}
                      minutes={option.leavesIn}
                    />
                  ) : undefined
                }
              />
            ))}
          </RouteSteps>
        </div>
      </div>
      <div className="sticky bottom-0 border-t border-line bg-canvas/95 px-4 pb-4 pt-3 backdrop-blur">
        <Button
          block
          icon={<NavigationArrow aria-hidden weight="fill" className="size-5" />}
          onClick={() => {
            startTrip(option.id, option.path ?? []);
            navigate('/routes/live');
          }}
        >
          {t('detail.start')}
        </Button>
      </div>
    </div>
  );
};
