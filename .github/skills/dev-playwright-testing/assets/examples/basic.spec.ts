/**
 * Example: basic.spec.ts
 * Template: assets/test-template.ts
 * Purpose: Minimal smoke test demonstrating Arrange/Act/Assert and locator-first pattern.
 */

import { test, expect } from '@playwright/test';

test('home page shows Example Domain', async ({ page }) => {
  // Arrange
  await page.setContent(`
    <html>
      <body>
        <h1>Example Domain</h1>
      </body>
    </html>
  `);

  // Act & Assert
  await expect(page.locator('h1')).toHaveText('Example Domain');
});
