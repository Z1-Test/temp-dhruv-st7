/**
 * Example: visual.spec.ts
 * Purpose: Visual regression testing examples
 */

import { test, expect } from '@playwright/test';

test('homepage screenshot', async ({ page }) => {
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  await expect(page).toHaveScreenshot('homepage.png');
});

test('element screenshot', async ({ page }) => {
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  await expect(page.locator('h1')).toHaveScreenshot('heading.png');
});

test('mask dynamic content', async ({ page }) => {
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  
  await expect(page).toHaveScreenshot('page.png', {
    mask: [page.locator('.timestamp')],
  });
});

test('dark mode', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  await expect(page).toHaveScreenshot('page-dark.png');
});

test('responsive', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  await expect(page).toHaveScreenshot('page-mobile.png');
});

test('wait for content', async ({ page }) => {
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('page.png');
});
