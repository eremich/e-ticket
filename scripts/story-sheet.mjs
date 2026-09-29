// Dev helper: screenshots Storybook stories into one contact sheet for visual review.
// Usage: node scripts/story-sheet.mjs out.png storyId[@globals] /app/path?query ...
// Specs starting with "/" are app screens: the 390 × 844 phone frame is captured after the 600 ms skeleton.
import { chromium } from 'playwright';

const [out, ...ids] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 820 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const shots = [];
for (const spec of ids) {
  if (spec.startsWith('/')) {
    await page.setViewportSize({ width: 600, height: 920 });
    // "/path?query#bottom" scrolls the screen to its end before the capture
    const [path, anchor] = spec.split('#');
    await page.goto(`http://localhost:5174${path}`);
    await page.waitForSelector('#phone', { timeout: 20000 });
    await page.waitForTimeout(900);
    if (anchor === 'bottom') {
      await page.evaluate(() => document.querySelector('#screen')?.scrollTo(0, 99999));
      await page.waitForTimeout(300);
    }
    const phone = page.locator('#phone');
    shots.push({ id: spec, b64: (await phone.screenshot()).toString('base64') });
    await page.setViewportSize({ width: 420, height: 820 });
    continue;
  }
  const [id, globals = ''] = spec.split('@');
  await page.goto(`http://localhost:6007/iframe.html?id=${id}&viewMode=story&globals=${globals}`);
  await page.waitForSelector('#storybook-root > *', { timeout: 20000 });
  await page.waitForTimeout(500);
  shots.push({ id: spec, b64: (await page.screenshot()).toString('base64') });
}
const html = `<body style="margin:0;display:flex;flex-wrap:wrap;gap:8px;background:#888;font:12px sans-serif">${shots
  .map((s) => `<figure style="margin:0;background:#fff"><img src="data:image/png;base64,${s.b64}" width="400"><figcaption>${s.id}</figcaption></figure>`)
  .join('')}</body>`;
const cols = Math.min(ids.length, 4);
await page.setViewportSize({ width: cols * 428, height: 900 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
