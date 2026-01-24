import { test as base } from '@playwright/test';

export const test = base.extend({
  authToken: async ({ request }, use) => {
    // START EXAMPLE MODIFICATION: Mock token instead of network call
    // const resp = await request.post('/api/test-login', { data: { user: 'test' } });
    // const json = await resp.json();
    // await use(json.token);
    await use('mock-auth-token-12345');
    // END EXAMPLE MODIFICATION
  },
  authStatePath: async ({ page }, use) => {
    // START EXAMPLE MODIFICATION: Mock login flow
    // Intercept login page and dashboard for standalone example
    await page.route('**/login', route => route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `
        <html><body>
          <form>
            <input id="user" />
            <input id="pass" />
            <button onclick="window.location.href='/dashboard'; return false;">Sign in</button>
          </form>
        </body></html>
      `
    }));
    await page.route('**/dashboard', route => route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body><h1>Dashboard</h1></body></html>'
    }));

    await page.goto('/login');
    await page.fill('#user', process.env.TEST_USER ?? 'test');
    await page.fill('#pass', process.env.TEST_PASS ?? 'password');
    await page.click('text=Sign in');
    await page.waitForURL('**/dashboard');
    const path = 'authState.json';
    await page.context().storageState({ path });
    await use(path);
    // END EXAMPLE MODIFICATION
  },
});
