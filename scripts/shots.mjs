// npm run shots — renders the 29 portfolio screenshots of the brief (§11) into shots/.
// Starts its own Vite server, 390 × 844 at 3×, reduced motion, English and light unless noted. No manual steps.
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const PORT = 5198;
const OUT = new URL('../shots/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const server = await createServer({ server: { port: PORT, strictPort: true }, logLevel: 'error' });
await server.listen();
const base = `http://localhost:${PORT}`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

const phone = page.locator('#phone');
/** Opens a path; skeletons are 600 ms, sheets 300 ms */
const open = async (path, wait = 800) => {
  const sep = path.includes('?') ? '&' : '?';
  await page.goto(`${base}${path}${path.includes('theme=') ? '' : `${sep}theme=light`}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(wait);
};
const click = (name) => phone.getByRole('button', { name }).first().click();
const shot = async (name) => {
  await page.waitForTimeout(300);
  await phone.screenshot({ path: fileURLToPath(new URL(`${name}.png`, OUT)) });
  console.log('  ✓', name);
};

const steps = [
  ['01-welcome', () => open('/onboarding')],
  ['02-add-card', () => open('/onboarding/add-card?mode=hold', 3400)],
  ['03-reduced-fare', async () => {
    await open('/onboarding/reduced');
    await click(/^Student/);
    await page.waitForTimeout(400);
    await click('Choose photo');
    await page.waitForTimeout(2200);
  }],
  ['04-wallet', () => open('/onboarding/wallet')],
  ['05-home', () => open('/')],
  ['06-home-uk', () => open('/?lang=uk')],
  ['07-home-map', () => open('/?view=map')],
  ['07a-metro-map', () => open('/metro')],
  ['07b-station-sheet', () => open('/metro?station=saltivska', 1000)],
  ['08-stop-detail', () => open('/stop/saltivska-metro')],
  ['09-line-detail', () => open('/line/tram-27?stop=saltivska-metro')],
  ['10-timetable', () => open('/timetable/tram-27?stop=saltivska-metro')],
  ['11-tap-success', () => open('/?scenario=paid', 1200)],
  ['12-tap-declined', () => open('/?scenario=declined', 1200)],
  ['13-card', () => open('/card')],
  ['14-top-up', () => open('/card/top-up')],
  ['15-auto-top-up', async () => {
    await open('/card/auto');
    await phone.getByRole('switch').first().click();
    await page.waitForTimeout(3000); // let the confirmation toast go
  }],
  ['16-routes-options', () => open('/routes?to=work')],
  ['17-route-live', () => open('/?scenario=on-trip&at=kyivska', 1200)],
  ['18-route-service-change', () => open('/?scenario=service-change&at=studentska', 1200)],
  ['19-visitor-tickets', () => open('/?scenario=visitor')],
  ['20-visitor-ticket-wallet', () => open('/?scenario=visitor-ticket')],
  ['21-profile-trips', () => open('/profile/trips')],
  ['22-report-problem', async () => {
    await open('/profile/trips/dc1/report?scenario=double-charge');
    await phone.getByText('Charged twice').first().click();
  }],
  ['23-refund-done', async () => {
    await click('Send report');
    await page.waitForTimeout(1200);
  }],
  ['24-new-phone', () => open('/?scenario=new-phone')],
  ['25-fare-renewal', () => open('/?scenario=fare-expiring')],
  ['26-lost-card', () => open('/?scenario=lost-card')],
  ['27-home-dark', () => open('/?theme=dark')],
];

try {
  for (const [name, run] of steps) {
    await run();
    await shot(name);
  }
} finally {
  await browser.close();
  await server.close();
}
if (errors.length) {
  console.error('Page errors:', errors);
  process.exit(1);
}
console.log(`Done: ${steps.length} screenshots in shots/`);
