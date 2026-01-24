/**
 * Example: actions.spec.ts
 * Template: assets/test-template.ts
 * Purpose: Demonstrate locator-first actions and disambiguation patterns
 */

import { test, expect } from '@playwright/test';

test('actions: fill inputs, click buttons and select options', async ({ page }) => {
  // Arrange
  await page.setContent(`
    <form>
      <label for="name">Name</label>
      <input id="name" />
      
      <label for="email">Email</label>
      <input id="email" />
      
      <button type="submit">Send</button>
      <div id="success" hidden>Thanks for contacting us</div>
    </form>
    <script>
      document.querySelector('form').onsubmit = (e) => {
        e.preventDefault();
        document.getElementById('success').hidden = false;
      };
    </script>
  `);

  // Locators-in-tests pattern
  const name = page.locator('#name');
  const email = page.locator('#email');
  const submit = page.locator('button:has-text("Send")');

  // Act
  await name.fill('Test User');
  await email.fill('test@example.com');
  await submit.click();

  // Assert
  await expect(page.locator('text=Thanks for contacting us')).toBeVisible();
});
