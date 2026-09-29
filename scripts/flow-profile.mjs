// Dev check: Profile tab — trips, report a problem (request + instant refund), cards, lost card, plastic to phone,
// reduced fare renewal, notifications, new phone, Ukrainian and dark.
// Usage: node scripts/flow-profile.mjs (dev server on 5174). Writes scripts/.out/profile.png and profile-1..N.png
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

mkdirSync('scripts/.out', { recursive: true });
const BASE = 'http://localhost:5174';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 940 }, reducedMotion: 'reduce' });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const shots = [];
const snap = async (label, full = false) => {
  if (full) {
    // Scroll-area content taller than the phone: capture the whole scroll height
    await p.evaluate(() => document.getElementById('screen')?.scrollTo(0, 0));
  }
  shots.push({ label, b64: (await p.locator('#phone').screenshot()).toString('base64') });
};
const phone = p.locator('#phone');
const path = () => new URL(p.url()).pathname;
const expectPath = (want) => {
  if (path() !== want) errors.push(`expected ${want}, got ${path()}`);
};
const expectText = async (re, label) => {
  if (!(await phone.getByText(re).first().isVisible().catch(() => false))) errors.push(`missing text ${label ?? re}`);
};
const go = async (url) => {
  await p.goto(`${BASE}${url}`);
  await p.waitForTimeout(350);
};
const click = async (role, name, opts = {}) => {
  await phone.getByRole(role, { name, ...opts }).first().click();
  await p.waitForTimeout(300);
};
const scrollDown = async () => {
  await p.evaluate(() => document.getElementById('screen')?.scrollTo(0, 99999));
  await p.waitForTimeout(200);
};

// Profile root, then a ride, then a report that becomes a request
await go('/profile?theme=light');
await snap('profile');
await scrollDown();
await snap('profile bottom');
await click('button', /^Trips/);
expectPath('/profile/trips');
await snap('trips');
await click('button', /Metro 1/);
await snap('ride detail');
await click('button', 'Report a problem');
await click('radio', 'Gate did not open');
await snap('report');
await click('button', 'Send report');
await expectText(/Request sent/, 'request sent');
await snap('request sent');
await click('button', 'Done');
expectPath('/profile');
await scrollDown();
await snap('profile with request');
await click('button', /Gate did not open/);
await expectText(/In review|Request sent/, 'timeline');
await snap('request detail');

// Double charge: instant refund
await go('/profile/trips?seed=double-charge&theme=light');
await snap('trips double');
await click('button', /07:52/);
await click('button', 'Report a problem');
await click('radio', 'Charged twice');
await click('button', 'Send report');
await expectText(/₴8 returned/, 'refund success');
await snap('refunded');
await click('button', 'Done');
await click('button', /^Trips/);
await snap('trips after refund');
await click('tab', /Top-ups/);
await snap('trips topups');

// Cards, rename, lost card
await go('/profile/cards?theme=light');
await snap('cards');
await click('button', /Eticket/);
await snap('card detail');
await click('button', 'Rename');
await phone.getByLabel('Card name').fill('Daily card');
await snap('rename sheet');
await click('button', 'Save name');
await p.waitForTimeout(400);
await expectText(/Daily card/, 'renamed');
await click('button', 'Lost card');
await snap('lost');
await click('button', 'Block card');
await snap('block alert');
await phone.getByRole('alertdialog').getByRole('button', { name: 'Block card' }).click();
await p.waitForTimeout(600);
await snap('lost done');
await click('button', 'Done');
expectPath('/card');

// Plastic to phone
await go('/profile/cards/mom?theme=light');
await snap('plastic detail');
await click('button', 'Move to this phone');
await p.waitForTimeout(400);
await snap('to phone hold');
await p.waitForTimeout(3200);
await snap('to phone done');
await click('button', 'Done');
expectPath('/card');
await go('/profile/cards/main?theme=light');
await click('button', 'Remove card');
await snap('remove alert');

// Reduced fare
await go('/profile/reduced?theme=light');
await snap('reduced none');
await click('button', 'Apply for reduced fare');
expectPath('/onboarding/reduced');
await click('button', 'Student');
await click('button', 'Choose photo');
await p.waitForTimeout(1900);
await click('button', 'Continue');
expectPath('/profile/reduced');
await snap('reduced active');
await go('/profile?seed=fare-expiring&theme=light');
await snap('profile expiring');
await click('button', /Reduced fare/);
await snap('reduced expiring');
await click('button', 'Renew');
await snap('renew upload');
await click('button', 'Choose photo');
await snap('renew checking');
await p.waitForTimeout(1900);
await snap('renew approved');
await go('/profile/reduced?seed=fare-expiring,renewal-declines&theme=light');
await click('button', 'Renew');
await click('button', 'Choose photo');
await p.waitForTimeout(1900);
await snap('renew declined');

// Notifications, accessibility, new phone
await go('/profile/notifications?theme=light');
await phone.getByRole('switch', { name: 'Receipts by email' }).click();
await snap('notifications');
await go('/profile/accessibility?theme=light');
await phone.getByRole('switch', { name: 'Step-free routes by default' }).click();
await snap('accessibility');
await go('/onboarding/new-phone?theme=light');
await snap('new phone');
await click('button', 'Move to this phone');
await p.waitForTimeout(400);
await snap('new phone moving');
await p.waitForTimeout(1500);
await snap('new phone done');
await click('button', 'Continue');
expectPath('/');

// Delete account
await go('/profile?theme=light');
await scrollDown();
await click('button', 'Delete account');
await snap('delete alert');
await phone.getByRole('alertdialog').getByRole('button', { name: 'Delete account' }).click();
await p.waitForTimeout(400);
expectPath('/onboarding');

// Ukrainian and dark
await go('/profile?lang=uk&theme=dark');
await snap('profile uk dark');
await scrollDown();
await snap('profile uk dark bottom');
await go('/profile/trips?lang=uk&theme=dark&seed=double-charge');
await snap('trips uk dark');
await go('/profile/reduced?lang=uk&theme=light&seed=fare-expiring,renewal-declines');
await click('button', 'Продовжити');
await click('button', 'Обрати фото');
await p.waitForTimeout(1900);
await snap('reduced declined uk');
await go('/profile/cards?lang=uk&theme=dark');
await snap('cards uk dark');
await go('/profile/notifications?lang=uk&theme=light');
await snap('notifications uk');
await go('/profile/trips/h1/report?lang=uk&theme=light');
await snap('report uk');

const PER = 6;
const sheet = (list, w) =>
  `<body style="margin:0;display:flex;flex-wrap:wrap;gap:8px;background:#888;font:12px sans-serif;width:${(w + 8) * 3}px">${list
    .map((s) => `<figure style="margin:0"><img src="data:image/png;base64,${s.b64}" width="${w}"><figcaption>${s.label}</figcaption></figure>`)
    .join('')}</body>`;
const render = async (html, out, width) => {
  await p.setViewportSize({ width, height: 900 });
  await p.setContent(html);
  await p.screenshot({ path: out, fullPage: true });
};
await render(sheet(shots, 300), 'scripts/.out/profile.png', 936);
for (let i = 0; i * PER < shots.length; i++) await render(sheet(shots.slice(i * PER, (i + 1) * PER), 390), `scripts/.out/profile-${i + 1}.png`, 1194);
console.log(shots.length, JSON.stringify(errors));
await b.close();
