---
name: debugging
description: How to debug Playwright tests
metadata:
  category: troubleshooting
  related: [configuration, troubleshooting]
  playwright_api: test.debug, page.pause
---

# Debugging

Debug failing tests with Playwright tools.

## Official Docs

https://playwright.dev/docs/debug

## Debug Mode

```bash
npx playwright test --debug
```

Opens Playwright Inspector with step-by-step execution.

## Pause in Test

```typescript
test("debug specific point", async ({ page }) => {
  await page.goto("/");
  await page.pause(); // Execution pauses here
  await page.click("button");
});
```

## Headed Mode

```bash
npx playwright test --headed
```

## Slow Motion

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    launchOptions: {
      slowMo: 500, // 500ms delay between actions
    },
  },
});
```

## Console Logs

```typescript
page.on("console", (msg) => console.log(msg.text()));

test("see console", async ({ page }) => {
  await page.goto("/");
  // Browser console logs appear in terminal
});
```

## Screenshots

```typescript
await page.screenshot({ path: "debug.png" });
await page.locator(".element").screenshot({ path: "element.png" });
```

## Traces

```bash
# Record trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

In config:

```typescript
export default defineConfig({
  use: {
    trace: "on-first-retry",
  },
});
```

## Video Recording

```typescript
export default defineConfig({
  use: {
    video: "on",
  },
});
```

## Step-by-Step

```typescript
test("step by step", async ({ page }) => {
  await test.step("Login", async () => {
    await page.goto("/login");
    await page.fill("#email", "user@example.com");
  });

  await test.step("Navigate", async () => {
    await page.click('a[href="/dashboard"]');
  });
});
```

## Inspect Element

```typescript
await page.locator("button").highlight();
```

## Page State

```typescript
const html = await page.content();
console.log(html);

const url = page.url();
console.log(url);
```

##Evaluate in Browser

```typescript
const result = await page.evaluate(() => {
  console.log("From browser console");
  return document.title;
});
```

## Network Activity

```typescript
page.on("request", (request) => {
  console.log(">>", request.method(), request.url());
});

page.on("response", (response) => {
  console.log("<<", response.status(), response.url());
});
```

## VS Code Debugger

Add breakpoint in test, run:

```bash
npx playwright test --debug
```

## Test Info

```typescript
test("debug info", async ({ page }, testInfo) => {
  console.log(testInfo.title);
  console.log(testInfo.file);
  console.log(testInfo.line);
});
```

## Verbose Logging

```bash
DEBUG=pw:api npx playwright test
```
