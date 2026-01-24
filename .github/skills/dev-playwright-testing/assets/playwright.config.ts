import { defineConfig, devices } from '@playwright/test';

/**
 * StayTuned LLP - Standard Playwright Configuration
 * See references/configuration.md for documentation
 * Last Updated: 2025-12-24
 */
export default defineConfig({
  testDir: './src/e2e',
  // IMPORTANT: Only match *.spec.ts files (Playwright tests)
  // Ignore *.test.ts files (backend E2E tests, NOT Playwright)
  testMatch: /.*\.spec\.ts$/,
  timeout: 60_000,
  workers: 2,
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,

  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results.json' }]
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure' }]
      ],

  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  use: {
    baseURL: process.env.STAGING_URL 
      || process.env.PRODUCTION_URL 
      || process.env.BASE_URL 
      || 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 10000, // Use a reasonable timeout instead of 0
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'edge', use: { ...devices['Desktop Edge'] } },
  ],

  // webServer: {
  //   command: 'firebase emulators:start',
  //   url: 'http://localhost:5000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120_000,
  // },
});
