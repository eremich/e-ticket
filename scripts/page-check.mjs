// Dev helper: screenshot a long web page in vertical slices for review.
// Usage: node scripts/page-check.mjs <url> <outPrefix> <width> [sliceHeight]
import { chromium } from 'playwright';
const [url, out, width = '1440', slice = '2400'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 0.6 });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await p.goto(url, { waitUntil: 'networkidle' });
const h = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0, i = 1; y < h; y += Number(slice), i++) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${out}-${i}.png`, fullPage: true, clip: { x: 0, y, width: Number(width), height: Math.min(Number(slice), h - y) } });
}
console.log(h, JSON.stringify(errors));
await b.close();
