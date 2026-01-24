/**
 * Flaky test handling pattern
 * Links: references/best-practices.md
 * Note: Configure retries in playwright.config.ts, prefer fixing root cause
 */
import { test, expect } from '@playwright/test';

test('flaky-network-handling', async ({ page }) => {
  await page.goto('/unstable-endpoint');
  await expect(page.locator('text=Loaded')).toBeVisible({ timeout: 10_000 });
});

