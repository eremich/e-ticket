// Dev check: onboarding (sign in → card → reduced → wallet → location), the denied-location path, and the visitor ticket flow.
// Usage: node scripts/flow-onboarding.mjs [out.png] (dev server on 5174)
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const out = process.argv[2] ?? 'scripts/.out/onboarding.png';
mkdirSync('scripts/.out', { recursive: true });
const BASE = 'http://localhost:5174';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 940 }, reducedMotion: 'reduce' });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const shots = [];
const snap = async (label) => shots.push({ label, b64: (await p.locator('#phone').screenshot()).toString('base64') });
const phone = p.locator('#phone');
const path = () => new URL(p.url()).pathname;
const expectPath = (want) => {
  if (path() !== want) errors.push(`expected ${want}, got ${path()}`);
};

await p.goto(`${BASE}/onboarding?theme=light`);
await p.waitForTimeout(500); await snap('welcome');
await phone.getByRole('button', { name: 'Sign in' }).click();
await p.waitForTimeout(300);
await phone.getByLabel(/Phone number/).fill('12');
await phone.getByRole('button', { name: 'Send code' }).click();
await p.waitForTimeout(200); await snap('phone invalid');
await phone.getByLabel(/Phone number/).fill('671234567');
await phone.getByRole('button', { name: 'Send code' }).click();
await phone.getByLabel('Code from SMS').fill('123456');
await p.waitForTimeout(200); await snap('code');
await phone.getByRole('button', { name: 'Continue', exact: true }).click();
await p.waitForTimeout(300); await snap('has card');
await phone.getByRole('button', { name: /Yes, add my card/ }).click();
await p.waitForTimeout(400); await snap('hold');
await p.waitForTimeout(3200); await snap('found');
await phone.getByRole('button', { name: 'Continue' }).click();
await p.waitForTimeout(300); await snap('reduced');
await phone.getByRole('button', { name: 'Student' }).click();
await p.waitForTimeout(300); await snap('upload');
await phone.getByRole('button', { name: 'Choose photo' }).click();
await p.waitForTimeout(400); await snap('checking');
await p.waitForTimeout(1500); await snap('approved');
await phone.getByRole('button', { name: 'Continue' }).click();
await p.waitForTimeout(300); await snap('wallet');
await phone.getByRole('button', { name: 'Add to Apple Wallet' }).click();
await p.waitForTimeout(800); await snap('location alert');
await phone.getByRole('button', { name: 'Allow while using the app' }).click();
await p.waitForTimeout(400); expectPath('/');

await p.goto(`${BASE}/onboarding/location?theme=light`);
await p.waitForTimeout(800);
await phone.getByRole('button', { name: "Don't allow" }).click();
await p.waitForTimeout(300); await snap('home stop');
await phone.getByRole('button', { name: /Saltivska/ }).first().click();
await p.waitForTimeout(400); expectPath('/');

await p.goto(`${BASE}/onboarding/add-card?mode=number&theme=light`);
await p.waitForTimeout(300);
await phone.getByLabel('Enter card number').fill('05551');
await p.waitForTimeout(200); await snap('number wrong');
await phone.getByLabel('Enter card number').fill('0124043177889016');
await p.waitForTimeout(200); await snap('number ok');

await p.goto(`${BASE}/onboarding/virtual?theme=light`);
await p.waitForTimeout(300); await snap('virtual');

await p.goto(`${BASE}/visitor?theme=light`);
await p.waitForTimeout(400); await snap('visitor');
await phone.getByRole('radio', { name: /1 day/ }).click();
await phone.getByRole('button', { name: /Buy 1 day for/ }).click();
await p.waitForTimeout(3000);
expectPath('/visitor/ticket'); await snap('ticket');

await p.goto(`${BASE}/onboarding?lang=uk&theme=light`);
await p.waitForTimeout(400); await snap('welcome uk');
await phone.getByRole('button', { name: /Ви в гостях/ }).click();
await p.waitForTimeout(400);
await phone.getByRole('radio', { name: /3 дні/ }).click();
await snap('visitor uk');
await phone.getByRole('button', { name: /Купити/ }).click();
await p.waitForTimeout(3000); await snap('ticket uk');

await p.goto(`${BASE}/onboarding/sign-in?lang=uk&theme=dark`);
await p.waitForTimeout(400); await snap('sign in uk dark');

const html = `<body style="margin:0;display:flex;flex-wrap:wrap;gap:6px;background:#888;font:12px sans-serif">${shots.map((s) => `<figure style="margin:0"><img src="data:image/png;base64,${s.b64}" width="300"><figcaption>${s.label}</figcaption></figure>`).join('')}</body>`;
await p.setViewportSize({ width: 1236, height: 900 });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
console.log(JSON.stringify(errors));
await b.close();
