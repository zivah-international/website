import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: 0,
  reporter: [['list']],
  expect: { timeout: 10_000 },
  use: {
    // Must be `localhost`, not `127.0.0.1`: Next 16 blocks cross-origin dev
    // resources and treats the two hosts as different origins, which silently
    // prevents hydration (drawer/theme tests would time out).
    baseURL: 'http://localhost:3100',
    // Next 16 negotiates the [locale] segment from Accept-Language and would
    // 307-redirect `/` to `/en` for an en-US browser. The public site is
    // Spanish-first (default locale, unprefixed `/`), so pin the browser.
    locale: 'es-EC',
    viewport: { width: 1440, height: 900 },
    colorScheme: 'light',
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm exec next dev --turbopack --port 3100',
      url: 'http://localhost:3100',
      reuseExistingServer: false,
      timeout: 180_000,
      env: { NEXT_PUBLIC_SITE_URL: 'http://127.0.0.1:4010' },
    },
  ],
});
