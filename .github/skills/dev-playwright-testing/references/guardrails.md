---
name: guardrails
description: Constraints and limitations for test development
metadata:
  category: standards
  related: [best-practices]
---

# Guardrails

Development constraints for Playwright testing.

## No External Dependencies

Avoid adding third-party testing libraries without approval:

```typescript
// ❌ Requires approval
import "@testing-library/playwright";
import "axe-playwright";

// ✅ Use Playwright built-ins
import { test, expect } from "@playwright/test";
```

## No Hardcoded Secrets

```typescript
// ❌ Bad
await page.fill("#password", "mypassword123");

// ✅ Good
await page.fill("#password", process.env.TEST_PASSWORD);
```

## No test.only in CI

```typescript
// playwright.config.ts
export default defineConfig({
  forbidOnly: !!process.env.CI,
});
```

## Explicit Waits Only

```typescript
// ❌ Bad
await page.waitForTimeout(3000);

// ✅ Good
await expect(locator).toBeVisible();
await page.waitForLoadState("networkidle");
```

## No Global State

Each test should be isolated and independent.

## Fail Fast Locally

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
});
```
