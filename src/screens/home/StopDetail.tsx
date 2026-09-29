import { useNavigate, useParams } from 'react-router-dom';
import { Bell, BellRinging, CalendarBlank, CaretRight, Star, Wheelchair } from '@phosphor-icons/react';
import { NavBar } from '../../components/NavBar';
import { LineBadge } from '../../components/LineBadge';
import { Button } from '../../components/Button';
import { routeById, stopById } from '../../data/surface';
import { useName, useT } from '../../i18n';
import { stopArrivals } from '../../lib/arrivals';
import { clock } from '../../lib/format';
import { NOW } from '../../lib/time';
import { cx } from '../../lib/cx';
import { useStore } from '../../store/useStore';

/** A stop: every line with its next three arrivals, arrival alerts, favorite, and the way to the full timetable */
export const StopDetail = () => {
  const { id = '' } = useParams();
  const t = useT();
  const name = useName();
  const navigate = useNavigate();
  const stop = stopById(id);
  const live = useStore((s) => s.live);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const alerts = useStore((s) => s.alerts);
  const toggleAlert = useStore((s) => s.toggleAlert);
  const toast = useStore((s) => s.toast);
  const fav = favorites.includes(id);

  if (!stop) return null;

  return (
    <div className="screen-enter flex flex-1 flex-col pb-8">
      <NavBar
        large
        title={name(stop.name)}
        onBack={() => navigate(-1)}
        backLabel={t('common.back')}
        trailing={
          <button
            type="button"
            aria-pressed={fav}
            aria-label={fav ? t('stop.unfavorite') : t('stop.favorite')}
            onClick={() => {
              toggleFavorite(id);
              if (!fav) toast(t('stop.favoriteAdded'));
            }}
            className="press -mr-2 flex size-11 items-center justify-center text-action"
          >
            <Star aria-hidden weight={fav ? 'fill' : 'regular'} className={cx('size-6', fav && 'text-warn')} />
          </button>
        }
      >
        <p className="tnum -mt-1 pb-3 text-subheadline text-muted">{t('stop.walk', { n: stop.walkMin, m: stop.meters })}</p>
      </NavBar>

      <section className="flex flex-col gap-3 px-4">
        <h2 className="section-title">{t('stop.lines')}</h2>
        {stop.services.map((sv) => {
          const r = routeById(sv.routeId);
          const times = stopArrivals(stop, r.id);
          const key = `${r.id}@${id}`;
          const on = alerts.includes(key);
          const label = `${t(`transport.${r.transport}`)} ${r.number}`;
          return (
            <article key={r.id} className="rounded-group bg-surface">
              <button type="button" onClick={() => navigate(`/line/${r.id}?stop=${id}`)} className="press flex w-full items-center gap-3 px-4 pt-3.5 text-left">
                <LineBadge transport={r.transport} number={r.number} label={label} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-headline text-ink">{t('arrival.towards', { stop: name(r.towards) })}</span>
                  <span className="flex items-center gap-1 text-footnote text-muted">
                    {t('stop.every', { n: r.headway })}
                    {r.lowFloor && <Wheelchair aria-label={t('line.lowFloor')} weight="bold" className="size-3.5 text-action" />}
                  </span>
                </span>
                <CaretRight aria-hidden weight="bold" className="size-4 text-muted/70" />
              </button>
              <p className="tnum flex items-baseline gap-3 px-4 pb-3 pt-2.5">
                {live ? (
                  <>
                    <span className={cx('text-large-title', times[0] <= 0 ? 'text-ok-ink' : 'text-ink')}>{times[0] <= 0 ? t('time.now') : t('time.min', { n: times[0] })}</span>
                    <span className="text-headline text-muted">{times.slice(1).map((m) => t('time.min', { n: m })).join(' · ')}</span>
                  </>
                ) : (
                  <span className="text-title2 text-muted">{t('time.scheduled', { time: clock(NOW + times[0]) })}</span>
                )}
              </p>
              <div className="flex gap-2 border-t border-line p-2">
                <Button
                  variant={on ? 'tinted' : 'gray'}
                  size="md"
                  className="flex-1"
                  aria-pressed={on}
                  icon={on ? <BellRinging aria-hidden weight="fill" className="size-5" /> : <Bell aria-hidden className="size-5" />}
                  onClick={() => {
                    toggleAlert(key);
                    if (!on) toast(t('stop.notifySet', { line: label }));
                  }}
                >
                  {on ? t('stop.notifyOn') : t('stop.notify')}
                </Button>
                <Button variant="gray" size="md" aria-label={t('stop.timetable')} onClick={() => navigate(`/timetable/${r.id}?stop=${id}`)} icon={<CalendarBlank aria-hidden className="size-5" />} />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};
