// Dev check: the brief's morning commute (5.8) by clicking from a fresh load.
// Usage: node scripts/flow-commute.mjs out.png (dev server on 5174)
import { chromium } from 'playwright';

const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 940 }, reducedMotion: 'reduce' });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
const phone = p.locator('#phone');
const shots = [];
const snap = async (label) => shots.push({ label, b64: (await phone.screenshot()).toString('base64') });

await p.goto('http://localhost:5174/?theme=light');
await p.waitForTimeout(900);
await snap('home ₴6');
await phone.getByRole('button', { name: 'Where to?' }).click();
await phone.getByRole('button', { name: /^Work/ }).click();
await p.waitForTimeout(400);
await snap('options');
await phone.getByRole('button', { name: /24 min/ }).first().click();
await p.waitForTimeout(400);
await snap('detail: short');
await p.getByRole('button', { name: 'Tap at validator' }).click();
await p.waitForTimeout(1700);
await phone.getByRole('button', { name: /Top up ₴100 with/ }).click();
await p.waitForTimeout(3000);
await phone.getByRole('button', { name: 'Tap again' }).click();
await p.waitForTimeout(1700);
await snap('paid');
await phone.getByRole('button', { name: 'Done' }).click();
await phone.getByRole('button', { name: 'Start trip' }).click();
await p.waitForTimeout(600);
await snap('live start');
// Ride to the interchange, then to one stop before the end
for (let i = 0; i < 80; i++) {
  if (await phone.getByText(/Transfer at Istorychnyi Muzei/).count()) break;
  await p.waitForTimeout(300);
}
await snap('transfer');
for (let i = 0; i < 40; i++) {
  if (await phone.getByText('Vokzalna is next').count()) break;
  await p.waitForTimeout(300);
}
await snap('get off');
for (let i = 0; i < 40; i++) {
  if (await phone.getByText(/arrived at Vokzalna/).count()) break;
  await p.waitForTimeout(300);
}
await snap('arrived');
await phone.getByRole('button', { name: 'End trip' }).click();
await p.waitForTimeout(500);
await snap('home onward');

const html = `<body style="margin:0;display:flex;flex-wrap:wrap;gap:6px;background:#888;font:12px sans-serif">${shots
  .map((s) => `<figure style="margin:0"><img src="data:image/png;base64,${s.b64}" width="300"><figcaption>${s.label}</figcaption></figure>`)
  .join('')}</body>`;
await p.setViewportSize({ width: 1236, height: 900 });
await p.setContent(html);
await p.screenshot({ path: out, fullPage: true });
console.log(JSON.stringify(errors));
await b.close();
