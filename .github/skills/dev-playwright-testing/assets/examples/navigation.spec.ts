/**
 * Example: navigation.spec.ts
 * Template: assets/test-template.ts
 * Purpose: Demonstrates navigation patterns and Promise.all waitForNavigation usage.
 */

import { test, expect } from '@playwright/test';

test('navigation: clicking a link waits for navigation and shows details', async ({ page }) => {
  // Arrange: Go to a real(ish) origin first so relative links work, OR use absolute links.
  // Using absolute is safer for mocks.
  const targetUrl = 'http://example.com/info';
  
  await page.route(targetUrl, route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: `<html><body><h1>Details Page</h1></body></html>`
  }));

  await page.setContent(`
    <a href="${targetUrl}">More information</a>
  `);
  
  // Act: user clicks link which causes navigation
  await Promise.all([
    page.waitForURL(targetUrl), 
    page.click('a:has-text("More information")'),
  ]);

  // Assert
  await expect(page.locator('h1')).toHaveText('Details Page');
});
