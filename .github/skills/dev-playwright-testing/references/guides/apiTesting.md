---
name: api-testing
description: Test APIs with Playwright
metadata:
  category: guide
  related: [mocking]
---

# API Testing

Test APIs using Playwright's request context.

## Basic Request

```typescript
import { request } from "@playwright/test";

test("API test", async () => {
  const context = await request.newContext({
    baseURL: "https://api.example.com",
  });

  const response = await context.get("/users");
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.length).toBeGreaterThan(0);
});
```

## POST Request

```typescript
const response = await context.post("/users", {
  data: { name: "Alice", email: "alice@example.com" },
});
```

## With Auth

```typescript
const context = await request.newContext({
  baseURL: "https://api.example.com",
  extraHTTPHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
```

## API + UI

```typescript
test("create via API, verify in UI", async ({ page, request }) => {
  const api = await request.newContext();

  const response = await api.post("/api/todos", {
    data: { title: "Test item" },
  });
  const { id } = await response.json();

  await page.goto("/todos");
  await expect(page.locator(`text=Test item`)).toBeVisible();

  await api.delete(`/api/todos/${id}`);
});
```

See: https://playwright.dev/docs/api-testing
