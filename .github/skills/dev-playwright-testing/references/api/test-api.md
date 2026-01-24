# Test API Reference

Comprehensive reference for Test Runner APIs: test structure, fixtures, hooks, and annotations.

**Source**: <https://playwright.dev/docs/api/class-test>

---

## Test Structure

### test(title, testFunction)

```typescript
import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Home/);
});
```

### test.describe(title, callback)

```typescript
test.describe('Authentication flows', () => {
  test('login success', async ({ page }) => { ... });
  test('login failure', async ({ page }) => { ... });
});

// Nested describes
test.describe('Feature', () => {
  test.describe('Subfeature', () => {
    test('test case', async ({ page }) => { ... });
  });
});
```

### test.describe.configure(options)

```typescript
test.describe.configure({ mode: "parallel" }); // run tests in parallel
test.describe.configure({ mode: "serial" }); // run in order, stop on first failure
test.describe.configure({ retries: 2 });
test.describe.configure({ timeout: 60000 });
```

---

## Hooks

### test.beforeEach(hookFunction)

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running: ${testInfo.title}`);
});
```

### test.beforeAll(hookFunction)

```typescript
test.beforeAll(async ({ browser }) => {
  // Runs once before all tests in describe block
  // Only has worker-scoped fixtures
});
```

### test.afterEach(hookFunction)

```typescript
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log(`Failed: ${testInfo.title}`);
    await page.screenshot({ path: `failure-${testInfo.title}.png` });
  }
});
```

### test.afterAll(hookFunction)

```typescript
test.afterAll(async () => {
  // Cleanup after all tests in describe block
});
```

---

## Annotations

### test.skip()

```typescript
test.skip('not implemented', async ({ page }) => { ... });

test.skip(({ browserName }) => browserName === 'webkit', 'Skip on WebKit');

test('conditional skip', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Firefox not supported');
  // test continues if not skipped
});
```

### test.only()

```typescript
test.only('focus this test', async ({ page }) => { ... });
test.describe.only('focus this suite', () => { ... });
```

### test.fixme()

```typescript
test.fixme('known broken test', async ({ page }) => { ... });
```

### test.fail()

```typescript
test("expect to fail", async ({ page }) => {
  test.fail(); // marks test as expected failure
  // test code that should fail
});

test.fail(({ browserName }) => browserName === "webkit", "Known WebKit issue");
```

### test.slow()

```typescript
test("slow operation", async ({ page }) => {
  test.slow(); // triples timeout
  await page.waitForTimeout(5000);
});

test.slow(({ browserName }) => browserName === "webkit", "Slower on WebKit");
```

### test.setTimeout(timeout)

```typescript
test("custom timeout", async ({ page }) => {
  test.setTimeout(120000); // 2 minutes
  await longRunningOperation();
});
```

---

## Fixtures

### test.extend(fixtures)

```typescript
import { test as base } from "@playwright/test";

// Basic fixture
const test = base.extend({
  todoPage: async ({ page }, use) => {
    await page.goto("/todos");
    await use(page);
  },
});

// Export for use in test files
export { test };
```

### Fixture with Setup and Teardown

```typescript
const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "auth.json",
    });
    const page = await context.newPage();

    await use(page); // test uses fixture

    // Teardown
    await context.close();
  },
});
```

### Fixture Options

```typescript
type MyFixtures = {
  workerData: string;
};

const test = base.extend<{}, MyFixtures>({
  // Worker-scoped (runs once per worker)
  workerData: [
    async ({}, use) => {
      const data = await prepareTestData();
      await use(data);
      await cleanup(data);
    },
    { scope: "worker" },
  ],
});
```

### Auto Fixtures

```typescript
const test = base.extend({
  // Runs automatically for every test
  autoFixture: [
    async ({}, use, testInfo) => {
      console.log(`Starting: ${testInfo.title}`);
      await use();
      console.log(`Finished: ${testInfo.title}`);
    },
    { auto: true },
  ],
});
```

### Fixture Composition

```typescript
const test = base.extend({
  user: async ({ apiContext }, use) => {
    // Create user via API
    const response = await apiContext.post("/users", {
      data: { name: "Test User" },
    });
    const user = await response.json();

    await use(user);

    // Cleanup
    await apiContext.delete(`/users/${user.id}`);
  },

  authenticatedPage: async ({ page, user }, use) => {
    // Use 'user' fixture
    await page.goto("/login");
    await page.fill("input[name=email]", user.email);
    await page.fill("input[name=password]", "password");
    await page.click("button[type=submit]");
    await use(page);
  },
});
```

---

## Built-in Fixtures

### Test-scoped Fixtures

```typescript
test("using fixtures", async ({
  page, // isolated Page instance
  context, // isolated BrowserContext
  browser, // shared Browser instance
  request, // APIRequestContext for API testing
}) => {
  await page.goto("/");
});
```

### Worker-scoped Fixtures

```typescript
test.beforeAll(async ({ browser, browserName }) => {
  // browser - shared across tests in worker
  // browserName - 'chromium' | 'firefox' | 'webkit'
});
```

### testInfo

```typescript
test("test info", async ({ page }, testInfo) => {
  console.log(testInfo.title);
  console.log(testInfo.file);
  console.log(testInfo.line);
  console.log(testInfo.column);
  console.log(testInfo.project.name);
  console.log(testInfo.status); // 'passed' | 'failed' | 'timedOut' | 'skipped'

  // Attachments
  await testInfo.attach("screenshot", {
    path: "screenshot.png",
    contentType: "image/png",
  });
});
```

---

## Parameterized Tests

### Loop-based

```typescript
for (const user of ["admin", "user", "guest"]) {
  test(`login as ${user}`, async ({ page }) => {
    await page.goto("/login");
    // test logic
  });
}
```

### Data-driven

```typescript
const testData = [
  { role: "admin", name: "Alice", canDelete: true },
  { role: "user", name: "Bob", canDelete: false },
];

testData.forEach(({ role, name, canDelete }) => {
  test(`${role} permissions`, async ({ page }) => {
    await page.goto(`/users/${name}`);
    await expect(page.locator(".delete-btn")).toBeVisible({
      visible: canDelete,
    });
  });
});
```

### Using test.describe for groups

```typescript
["mobile", "tablet", "desktop"].forEach(viewport => {
  test.describe(`${viewport} viewport`, () => {
    test.use({ viewport: VIEWPORTS[viewport] });

    test('layout test', async ({ page }) => { ... });
    test('navigation test', async ({ page }) => { ... });
  });
});
```

---

## test.use(options)

```typescript
// Override config for specific tests
test.use({
  locale: 'fr-FR',
  timezoneId: 'Europe/Paris',
  colorScheme: 'dark'
});

test('french locale', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Accueil/);
});

// Per-describe customization
test.describe('mobile tests', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    userAgent: 'mobile-user-agent'
  });

  test('mobile layout', async ({ page }) => { ... });
});
```

---

## test.step(title, body)

```typescript
test("multi-step flow", async ({ page }) => {
  await test.step("Navigate to login", async () => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
  });

  await test.step("Fill credentials", async () => {
    await page.fill("input[name=email]", "test@example.com");
    await page.fill("input[name=password]", "password");
  });

  await test.step("Submit form", async () => {
    await page.click("button[type=submit]");
    await expect(page).toHaveURL("/dashboard");
  });
});
```

### Conditional steps

```typescript
await test.step.skip("optional step", async () => {
  // step logic
});
```

---

## test.info()

```typescript
test("access test info", async ({ page }) => {
  const info = test.info();
  console.log(info.title); // test title
  console.log(info.project.name); // project name
  console.log(info.retry); // current retry number
  console.log(info.parallelIndex); // worker index

  // Attach files
  info.attach("debug-log", {
    body: JSON.stringify(debugData),
    contentType: "application/json",
  });
});
```

---

## test.expect

```typescript
import { test, expect } from "@playwright/test";

// Standard expect
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeTruthy();
expect(value).toContain(item);
expect(array).toHaveLength(5);
expect(obj).toHaveProperty("key", "value");
expect(string).toMatch(/regex/);

// Async matchers (for Playwright)
await expect(page).toHaveTitle(/Title/);
await expect(locator).toBeVisible();

// Soft assertions
await expect.soft(locator).toBeVisible();
await expect.soft(locator).toHaveText("Expected");
// Test continues even if soft assertions fail

// Poll for condition
await expect
  .poll(async () => {
    const status = await getStatus();
    return status;
  })
  .toBe("ready");

await expect
  .poll(
    async () => {
      const response = await page.request.get("/api/count");
      return response.json();
    },
    {
      timeout: 10000,
      intervals: [500, 1000],
    }
  )
  .toHaveProperty("count", 10);
```

---

## Configuration in Tests

### Accessing config

```typescript
test("use config", async ({ page }, testInfo) => {
  const baseURL = testInfo.project.use?.baseURL;
  const headless = testInfo.project.use?.headless;
  console.log(`Base URL: ${baseURL}`);
});
```

### Environment variables

```typescript
test("env vars", async ({ page }) => {
  const apiUrl = process.env.API_URL;
  const timeout = parseInt(process.env.TIMEOUT || "30000");
});
```
