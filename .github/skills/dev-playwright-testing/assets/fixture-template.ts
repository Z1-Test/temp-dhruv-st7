/**
 * Auth fixture template with storageState
 * Links: references/fixtures.md, references/guides/authentication.md
 */
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  authStatePath: async ({ page }, use) => {
    await page.goto('/login');
    await page.fill('#user', process.env.TEST_USER ?? 'test');
    await page.fill('#pass', process.env.TEST_PASS ?? 'password');
    await page.click('text=Sign in');
    await page.waitForURL('/dashboard');

    const path = 'authState.json';
    await page.context().storageState({ path });
    await use(path);
  },
});

test('access protected page with auth', async ({ browser, authStatePath }) => {
  const context = await browser.newContext({ storageState: authStatePath });
  const page = await context.newPage();
  await page.goto('/dashboard');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
