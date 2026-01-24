/**
 * Example: flaky.spec.ts
 * Template: assets/flaky-test-template.ts
 * Purpose: Demonstrate how to document flakiness and prefer fixes over retries.
 */

import { test, expect } from '@playwright/test';

test('resilient load of remote content', async ({ page }) => {
  // Arrange: Simulate slow loading content
  await page.setContent(`
    <div id="container"></div>
    <script>
      setTimeout(() => {
        document.getElementById('container').innerHTML = '<div class="item-list"><div>Item A</div></div>';
      }, 100);
    </script>
  `);

  const list = page.locator('.item-list');
  
  // Resilient assertion: waits automatically
  await expect(list).toBeVisible({ timeout: 10_000 });
  await expect(list.locator('text=Item A')).toBeVisible();
});
