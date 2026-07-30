import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

async function shot(viewport, label) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/es', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const hero = page.locator('section').first();
  await hero.screenshot({ path: `/tmp/hero-${label}.png` });
  console.log(`Captured ${label}`);
  await ctx.close();
}

await shot({ width: 1440, height: 900 }, 'desktop');
await shot({ width: 1024, height: 768 }, 'tablet');
await shot({ width: 768, height: 1024 }, 'tablet-portrait');
await shot({ width: 375, height: 812 }, 'mobile');

await browser.close();
