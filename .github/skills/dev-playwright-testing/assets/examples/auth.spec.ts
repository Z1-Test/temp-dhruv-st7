/**
 * Example: auth.spec.ts
 * Template: assets/fixture-template.ts
 * Purpose: Demonstrate fixture-first auth pattern and storageState reuse.
 */

import { expect } from '@playwright/test';
import { test as base } from './fixtures/authFixture';
import { LoginPage } from './page-objects/login.po';

const test = base;

test('user can log in using auth fixture', async ({ page, authToken }) => {
  // Mock the login page route since we are in standalone mode
  await page.route('**/login', route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: `
      <html><body>
        <form>
          <input id="username" />
          <input id="password" />
          <button role="button" name="Log in">Log in</button>
          <div hidden>Welcome</div>
        </form>
        <script>
          document.querySelector('button').onclick = (e) => {
            e.preventDefault();
            document.querySelector('div').hidden = false;
          };
        </script>
      </body></html>
    `
  }));

  // Arrange: set auth token into localStorage (if fixture provided a token)
  await page.addInitScript(token => {
    window.localStorage.setItem('authToken', token);
  }, authToken);

  // Act
  const login = new LoginPage(page);
  await login.goto();
  await login.login('test', 'password');

  // Assert
  await expect(page.locator('text=Welcome')).toBeVisible();
});
