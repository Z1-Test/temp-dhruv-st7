---
name: authentication
description: Handle authentication in tests
metadata:
  category: guide
  related: [fixtures]
---

# Authentication

Handle login and authentication.

## Save Auth State

```typescript
// global-setup.ts
async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("/login");
  await page.fill("#email", process.env.USER ?? 'testuser@example.com');
  await page.fill("#password", process.env.PASS ?? 'password123');
  await page.click('button[type="submit"]');

  await page.context().storageState({ path: "auth.json" });
  await browser.close();
}
```

## Reuse Auth State

```typescript
test.use({ storageState: "auth.json" });

test("authenticated", async ({ page }) => {
  await page.goto("/dashboard");
  // Already logged in
});
```

## Auth Fixture

```typescript
const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "auth.json",
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
```

See: https://playwright.dev/docs/auth
