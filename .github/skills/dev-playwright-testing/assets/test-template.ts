/**
 * Basic test template with Arrange/Act/Assert pattern
 * Links: references/locators.md, references/guides/actions.md
 */
import { test, expect } from '@playwright/test';

test('example: navigation and assertion', async ({ page }) => {
  await page.goto(process.env.APP_URL ?? 'https://example.com');
  
  await page.locator('role=button[name="Menu"]').click();
  await page.locator('role=link[name="Settings"]').click();
  
  await expect(page).toHaveURL(/settings/);
  await expect(page.locator('role=heading[name="Settings"]')).toBeVisible();
});
