# Network API Reference

Comprehensive reference for network mocking, routes, and API testing.

**Source**: <https://playwright.dev/docs/network> | <https://playwright.dev/docs/api-testing>

---

## Route Interception

### page.route(url, handler)

```typescript
await page.route("**/api/users", (route) => {
  route.fulfill({ json: [{ id: 1, name: "Test User" }] });
});

await page.route(/\\.jpg$/, (route) => {
  route.fulfill({ path: "placeholder.jpg" });
});

// URL pattern matching
await page.route("**/api/**", handler);
await page.route(/\/api\/(users|posts)/, handler);
await page.route((url) => url.pathname === "/api/data", handler);
```

### route.fulfill(options)

```typescript
// JSON response
route.fulfill({
  status: 200,
  contentType: "application/json",
  body: JSON.stringify({ data: "mocked" }),
});

// Shorthand
route.fulfill({ json: { data: "mocked" } });

// From file
route.fulfill({ path: "./mocks/data.json" });

// Custom headers
route.fulfill({
  status: 200,
  headers: {
    "Content-Type": "application/json",
    "X-Custom-Header": "value",
  },
  body: JSON.stringify({ data: "test" }),
});
```

### route.continue(options?)

```typescript
// Pass through with modifications
route.continue({
  headers: {
    ...route.request().headers(),
    Authorization: "Bearer fake-token",
  },
});

// Modify POST data
route.continue({
  postData: JSON.stringify({ modified: true }),
});
```

### route.abort(errorCode?)

```typescript
await page.route("**/*.{png,jpg,jpeg}", (route) => route.abort());
await page.route("**/analytics/**", (route) => route.abort());
await page.route("**/ads/**", (route) => route.abort("internetdisconnected"));
```

---

## Request Inspection

### route.request()

```typescript
await page.route("**/api/submit", (route) => {
  const request = route.request();

  console.log(request.method()); // GET, POST, etc.
  console.log(request.url()); // full URL
  console.log(request.headers()); // headers object
  console.log(request.postData()); // POST body as string
  console.log(request.postDataJSON()); // POST body as JSON

  route.fulfill({ json: { success: true } });
});
```

### Conditional Mocking

```typescript
await page.route("**/api/users", (route) => {
  const url = new URL(route.request().url());
  const role = url.searchParams.get("role");

  if (role === "admin") {
    route.fulfill({ json: [{ id: 1, name: "Admin" }] });
  } else {
    route.continue(); // pass through to real API
  }
});
```

### Mock POST Requests

```typescript
await page.route("**/api/submit", async (route) => {
  const postData = route.request().postDataJSON();

  route.fulfill({
    json: {
      success: true,
      id: 123,
      ...postData, // echo back
    },
  });
});
```

---

## Context-Level Mocking

```typescript
test("mock for all pages", async ({ context, page }) => {
  // Applies to all pages in context
  await context.route("**/api/**", (route) => {
    route.fulfill({ json: { mocked: true } });
  });

  await page.goto("/page1");
  const page2 = await context.newPage();
  await page2.goto("/page2");
  // Both pages use the mock
});
```

---

## Wait for Network Events

### page.waitForResponse(urlOrPredicate, options?)

```typescript
// Wait for URL pattern
const responsePromise = page.waitForResponse("**/api/data");
await page.click("button");
const response = await responsePromise;
expect(response.status()).toBe(200);

// Wait with predicate
const response = await page.waitForResponse(
  (response) => response.url().includes("/api/") && response.status() === 200
);

// With timeout
const response = await page.waitForResponse("**/api/**", {
  timeout: 10000,
});
```

### page.waitForRequest(urlOrPredicate, options?)

```typescript
const requestPromise = page.waitForRequest("**/api/submit");
await page.click("button[type=submit]");
const request = await requestPromise;

console.log(request.method());
console.log(request.postDataJSON());
```

### waitForEvent()

```typescript
const [request] = await Promise.all([
  page.waitForEvent("request", (request) => request.url().includes("/api/")),
  page.click("button"),
]);

const [response] = await Promise.all([
  page.waitForEvent("response", (response) => response.status() === 200),
  page.click("button"),
]);
```

---

## Unroute

```typescript
const handler = (route) => route.fulfill({ json: { mocked: true } });

await page.route("**/api/**", handler);

// Later - remove specific route
await page.unroute("**/api/**", handler);

// Remove all routes
await page.unrouteAll({ behavior: "wait" }); // wait for pending
await page.unrouteAll({ behavior: "ignoreErrors" });
```

---

## HAR Files

### Record Network Traffic

```bash
npx playwright test --save-har=network.har
```

```typescript
test("record HAR", async ({ browser }) => {
  const context = await browser.newContext({
    recordHar: { path: "network.har" },
  });
  const page = await context.newPage();
  await page.goto("/");
  await context.close(); // saves HAR
});
```

### Replay from HAR

```typescript
test("replay from HAR", async ({ browser }) => {
  const context = await browser.newContext({
    recordHar: {
      path: "network.har",
      mode: "replay", // replay recorded traffic
    },
  });
  const page = await context.newPage();
  await page.goto("/"); // uses HAR instead of real network
});
```

### page.routeFromHAR()

```typescript
await page.routeFromHAR("network.har", {
  url: "**/api/**", // only mock API calls from HAR
  update: false, // or true to update HAR
});
```

---

## API Testing (APIRequestContext)

### Create API Context

```typescript
import { test, expect } from "@playwright/test";

test("API test", async ({ playwright }) => {
  const apiContext = await playwright.request.newContext({
    baseURL: "https://api.example.com",
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  // Make requests
  const response = await apiContext.get("/users");
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const users = await response.json();
  expect(users).toHaveLength(5);

  await apiContext.dispose();
});
```

### HTTP Methods

```typescript
// GET
const response = await apiContext.get("/users");
const response = await apiContext.get("/users", {
  params: { role: "admin" },
});

// POST
const response = await apiContext.post("/users", {
  data: { name: "Test User", email: "test@example.com" },
});

// PUT
const response = await apiContext.put("/users/123", {
  data: { name: "Updated Name" },
});

// PATCH
const response = await apiContext.patch("/users/123", {
  data: { email: "new@example.com" },
});

// DELETE
const response = await apiContext.delete("/users/123");

// HEAD
const response = await apiContext.head("/users");
```

### Request Options

```typescript
const response = await apiContext.post("/api/data", {
  data: { key: "value" },
  headers: {
    "X-Custom-Header": "value",
  },
  params: {
    filter: "active",
  },
  timeout: 10000,
  failOnStatusCode: true, // throw on non-2xx
  ignoreHTTPSErrors: true,
});
```

### Response Methods

```typescript
const response = await apiContext.get("/users");

response.ok(); // true if status 200-299
response.status(); // status code
response.statusText(); // status text
response.headers(); // headers object
response.json(); // parse JSON
response.text(); // get text
response.body(); // get buffer
response.url(); // final URL after redirects
```

### API Testing with Setup/Teardown

```typescript
test("CRUD operations", async ({ apiContext }) => {
  // Create
  const createResponse = await apiContext.post("/users", {
    data: { name: "Test User" },
  });
  const user = await createResponse.json();

  // Read
  const getResponse = await apiContext.get(`/users/${user.id}`);
  expect(getResponse.ok()).toBeTruthy();

  // Update
  const updateResponse = await apiContext.put(`/users/${user.id}`, {
    data: { name: "Updated Name" },
  });
  expect(updateResponse.ok()).toBeTruthy();

  // Delete
  const deleteResponse = await apiContext.delete(`/users/${user.id}`);
  expect(deleteResponse.ok()).toBeTruthy();
});
```

### API Fixture Pattern

```typescript
import { test as base } from "@playwright/test";

const test = base.extend({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: process.env.API_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });
    await use(context);
    await context.dispose();
  },

  // Create test data via API
  testUser: async ({ apiContext }, use) => {
    const response = await apiContext.post("/users", {
      data: { name: `Test-${Date.now()}` },
    });
    const user = await response.json();

    await use(user);

    // Cleanup
    await apiContext.delete(`/users/${user.id}`);
  },
});

export { test };
```

---

## Times / Counters

```typescript
let callCount = 0;

await page.route("**/api/data", (route) => {
  callCount++;

  if (callCount === 1) {
    route.fulfill({ json: { loading: true } });
  } else {
    route.fulfill({ json: { data: "loaded" } });
  }
});
```

---

## Error Simulation

```typescript
// Network error
await page.route("**/api/data", (route) => {
  route.abort("failed");
});

// HTTP errors
await page.route("**/api/data", (route) => {
  route.fulfill({
    status: 500,
    body: "Internal Server Error",
  });
});

await page.route("**/api/data", (route) => {
  route.fulfill({
    status: 404,
    json: { error: "Not found" },
  });
});

// Timeout simulation
await page.route("**/api/slow", async (route) => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  route.fulfill({ json: { data: "slow" } });
});
```

---

## WebSocket Mocking

```typescript
await page.routeWebSocket("ws://example.com/ws", (ws) => {
  ws.on("message", (message) => {
    console.log("Received:", message);
  });

  ws.send("mocked message");

  ws.on("close", () => {
    console.log("WebSocket closed");
  });
});
```

---

## Combine with Page

```typescript
test("API + UI flow", async ({ page, apiContext }) => {
  // Create data via API
  const response = await apiContext.post("/todos", {
    data: { title: "Buy milk" },
  });
  const todo = await response.json();

  // Verify in UI
  await page.goto("/todos");
  await expect(page.getByText("Buy milk")).toBeVisible();

  // Cleanup via API
  await apiContext.delete(`/todos/${todo.id}`);
});
```
