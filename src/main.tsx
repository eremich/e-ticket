import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './app/App';
import { useStore } from './store/useStore';
import { initialTheme } from './lib/theme';
import { initialLang, useLang } from './i18n';
import { applyScenario } from './data/scenarios';

// Seed from the URL before the first render, so deep links and screenshots are deterministic.
// A ?theme= link shows that theme without overwriting the viewer's saved choice.
useStore.getState().setTheme(initialTheme(window.location.search), false);
useLang.getState().setLang(initialLang(window.location.search));
const q = new URLSearchParams(window.location.search);
if (q.get('view') === 'map') useStore.getState().setHomeView('map');
if (q.get('live') === '0') useStore.setState({ live: false });

// ?seed=double-charge,fare-expiring puts the prototype into a scenario's starting state
const seeds = q.getAll('seed').flatMap((v) => v.split(','));
if (seeds.includes('double-charge')) useStore.getState().seedDoubleCharge();
if (seeds.includes('renewal-declines')) useStore.getState().setRenewalDeclines(true);
if (seeds.includes('fare-expiring')) {
  const s = useStore.getState();
  s.setReduced('main', { kind: 'student', until: new Date(2026, 9, 25) });
}

// ?scenario=<name> (brief §9): starting state, and the screen to open when the link points at the root
const scenarioPath = applyScenario(q.get('scenario'));
if (scenarioPath && window.location.pathname === '/') window.history.replaceState(null, '', `${scenarioPath}${window.location.search}`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
