import { useEffect, useRef, type ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BatteryFull, CellSignalFull, CreditCard, House, Path, User, WifiHigh } from '@phosphor-icons/react';
import { TabBar, type TabItem } from '../components/TabBar';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { TapOverlay } from '../screens/pay/TapOverlay';
import { TAP_PLACES } from '../data/cards';
import { SCENARIO_NAMES } from '../data/scenarios';
import { useName } from '../i18n';
import { Toast } from '../components/Toast';
import { Segmented } from '../components/Segmented';
import { LANGS, useLang, useT, type Lang } from '../i18n';
import { useStore } from '../store/useStore';
import { clock } from '../lib/format';
import type { ThemeChoice } from '../lib/theme';
import { NOW } from '../lib/time';

/** Each tab owns a stack of screens; the tab stays selected on screens pushed from it */
const TABS: (Omit<TabItem, 'label'> & { path: string; stack: string[] })[] = [
  { key: 'home', icon: House, path: '/', stack: ['/stop', '/line', '/timetable', '/metro'] },
  { key: 'routes', icon: Path, path: '/routes', stack: [] },
  { key: 'card', icon: CreditCard, path: '/card', stack: [] },
  { key: 'profile', icon: User, path: '/profile', stack: [] },
];
const tabOf = (path: string) =>
  TABS.find((x) => x.path === path) ?? TABS.find((x) => x.path !== '/' && path.startsWith(x.path)) ?? TABS.find((x) => x.stack.some((p) => path.startsWith(p)));

const StatusBar = () => (
  <div aria-hidden className="status-bar flex h-[54px] shrink-0 items-center justify-between px-9 pt-2 text-headline text-ink">
    <span className="tnum">{clock(NOW)}</span>
    <span className="flex items-center gap-1.5">
      <CellSignalFull className="size-[18px]" weight="fill" />
      <WifiHigh className="size-[18px]" weight="bold" />
      <BatteryFull className="size-6" weight="fill" />
    </span>
  </div>
);

const LANG_NAME: Record<Lang, string> = { en: 'English', uk: 'Українська' };

/** Desktop-only controls outside the phone frame. Not part of screenshots. */
const DeskPanel = () => {
  const t = useT();
  const { lang, setLang } = useLang();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 lg:flex">
      <div>
        <p className="text-title2 text-ink">{t('desk.title')}</p>
        <p className="text-subheadline text-muted">{t('desk.subtitle')}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-footnote font-semibold text-ink">{t('desk.language')}</p>
        <Segmented label={t('desk.language')} value={lang} onChange={setLang} options={LANGS.map((l) => ({ key: l, label: LANG_NAME[l] }))} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-footnote font-semibold text-ink">{t('desk.theme')}</p>
        <Segmented<ThemeChoice>
          label={t('desk.theme')}
          value={theme}
          onChange={setTheme}
          options={(['system', 'light', 'dark'] as const).map((k) => ({ key: k, label: t(`theme.${k}`) }))}
        />
        <p className="text-footnote text-muted">{t('desk.clock', { time: clock(NOW) })}</p>
      </div>
      <ScenarioPicker />
      <TapControls />
    </aside>
  );
};

/** Reloads the prototype into a brief §9 scenario, keeping language and theme */
const ScenarioPicker = () => {
  const t = useT();
  const q = new URLSearchParams(window.location.search);
  const current = q.get('scenario') ?? 'default';
  const go = (name: string) => {
    const next = new URLSearchParams({ scenario: name, lang: useLang.getState().lang });
    const theme = q.get('theme');
    if (theme) next.set('theme', theme);
    window.location.assign(`/?${next}`);
  };
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-5">
      <label htmlFor="scenario" className="text-footnote font-semibold text-ink">
        {t('desk.scenario')}
      </label>
      <select id="scenario" value={current} onChange={(e) => go(e.target.value)} className="h-11 w-full rounded-control bg-surface px-3 text-subheadline text-ink ring-1 ring-inset ring-line">
        {SCENARIO_NAMES.map((n) => (
          <option key={n}>{n}</option>
        ))}
      </select>
    </div>
  );
};

/** The validator lives outside the phone: pick where, then tap. Keeps dev controls out of screenshots. */
const TapControls = () => {
  const t = useT();
  const name = useName();
  const place = useStore((s) => s.tapPlace);
  const setPlace = useStore((s) => s.setTapPlace);
  const start = useStore((s) => s.startTap);
  const busy = useStore((s) => !!s.tap);
  const offline = useStore((s) => s.offline);
  const setOffline = useStore((s) => s.setOffline);
  return (
    <div className="flex flex-col gap-2 border-t border-line pt-5">
      <p className="text-footnote font-semibold text-ink">{t('desk.tap')}</p>
      <label className="sr-only" htmlFor="tap-place">
        {t('desk.tapAt')}
      </label>
      <select
        id="tap-place"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        className="h-11 w-full rounded-control bg-surface px-3 text-subheadline text-ink ring-1 ring-inset ring-line"
      >
        {TAP_PLACES.map((p) => (
          <option key={p.id} value={p.id}>
            {t(`transport.${p.transport}`)} {p.number} · {name(p.name)}
          </option>
        ))}
      </select>
      <Button size="md" block disabled={busy} onClick={() => start()}>
        {t('desk.tapButton')}
      </Button>
      <label className="mt-1 flex items-center justify-between gap-3 text-subheadline text-ink">
        {t('desk.offline')}
        <Toggle label={t('desk.offline')} checked={offline} onChange={setOffline} />
      </label>
    </div>
  );
};

const ToastViewport = () => {
  const toasts = useStore((s) => s.toasts);
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-4 bottom-28 z-toast flex flex-col items-center gap-2">
      {toasts.map((x) => (
        <Toast key={x.id} message={x.message} tone={x.tone} />
      ))}
    </div>
  );
};

export const Shell = ({ children }: { children?: ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const main = useRef<HTMLElement>(null);
  const active = tabOf(pathname);

  useEffect(() => {
    main.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-full items-center justify-center gap-16 phone:p-8">
      <DeskPanel />
      <div
        id="phone"
        className="relative flex h-[100dvh] w-full flex-col overflow-clip bg-canvas text-ink phone:h-[844px] phone:w-[390px] phone:rounded-phone phone:shadow-phone"
      >
        <StatusBar />
        <main ref={main} id="screen" className="scroll-area relative flex flex-1 flex-col">
          {children ?? <Outlet />}
        </main>
        {active && (
          <TabBar
            items={TABS.map((x) => ({ ...x, label: t(`tab.${x.key}` as 'tab.home') }))}
            active={active.key}
            onSelect={(k) => navigate(TABS.find((x) => x.key === k)!.path)}
          />
        )}
        <div id="sheet-root" className="pointer-events-none absolute inset-0 z-sheet" />
        <TapOverlay />
        <ToastViewport />
      </div>
    </div>
  );
};
