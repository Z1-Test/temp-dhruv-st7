---
name: best-practices
description: Project-specific opinionated rules for authoring Playwright tests. Covers naming, patterns, fixtures, page objects, and code style. Use when establishing coding standards.
metadata:
  category: standards
  related: [guardrails, fixtures, page-objects]
  project_version: playwright-1.57.x, node-24-lts
---

# Playwright Best Practices (Opinionated)

This document captures the project-specific, opinionated rules the agent should follow when authoring or refactoring Playwright tests.

## Versions & Runtime

- Playwright: 1.57.x (target)
- Node: 24 LTS
- Runtime: No dynamic package installs during Skill execution

## File Extension ⚠️

> [!IMPORTANT] > **Critical**: `src/e2e/**` may contain two types of tests:

| Extension   | Type           | Tool                    |
| ----------- | -------------- | ----------------------- |
| `*.test.ts` | Backend E2E    | NOT Playwright (IGNORE) |
| `*.spec.ts` | Playwright E2E | Playwright ONLY ✅      |

**Rule**: Only work with `*.spec.ts` files. Ignore `*.test.ts` files.

## Naming & File Structure

- Files: **`camelCase.spec.ts`** (e.g., `loginFlow.spec.ts`)
  - ❌ NOT `*.test.ts` - those are backend tests
  - ✅ ONLY `*.spec.ts` - Playwright tests
- Fixtures: `camelCaseFixture` (exported from `fixtures/`)
- Page objects: `thingPage.ts` with class `ThingPage` (thin methods only)
- Tests: `test('should do X', async ({ page }) => {...})` — test names in lower sentence case but camelCase for identifiers

## Project Structure

### Monorepo Architecture

This is a monorepo with multiple web applications. Each application serves a specific domain or subdomain.

**UI Applications**:

- Location: `src/packages/app-*/`
- Pattern: Folders matching regex `src/packages/app-*`
- Structure: Each `app-*` folder contains a complete web app
- Examples: `app-admin`, `app-customer`, `app-vendor`

When writing tests, identify which app you're testing and reference its UI implementation in the corresponding `src/packages/app-*/` directory.

### Test Files

- Location: `src/e2e/**/*.spec.ts`
- Extension: `*.spec.ts` ONLY (NOT `*.test.ts`)

### Utility Files

- `src/support/helpers/` - Test helper functions
- `src/support/fixtures/` - Custom fixtures
- `src/support/data/` - Test data generators
- `src/shared/` - Shared constants/types

**Example**:

```typescript
// src/support/helpers/auth.ts
export async function loginAs(page, role: "admin" | "user") {
  await page.goto("/login");
  await page.fill("#username", process.env[`${role.toUpperCase()}_USER`]);
  await page.fill("#password", process.env[`${role.toUpperCase()}_PASS`]);
  await page.click('button[type="submit"]');
}

// src/e2e/**/dashboard.spec.ts
import { loginAs } from "../support/helpers/auth";

test("admin dashboard", async ({ page }) => {
  await loginAs(page, "admin");
  await expect(page.locator('role=heading[name="Admin"]')).toBeVisible();
});
```

## Workflow

### Before Writing Tests

1. **Validate setup**: `./scripts/validate-setup.sh` ⚠️ CRITICAL
2. **Check config location**: Verify `playwright.config.ts` at **project root**
   - ❌ NOT in `.claude/`, `.github/`, `.vscode/`, or skill folders
   - ✅ Must be at root (same level as `package.json`)
3. Check existing patterns in `src/e2e/`
4. Review test structure and utilities

### During Test Writing

1. Write test in `src/e2e/**/<feature>.spec.ts`
2. Use `*.spec.ts` extension ONLY
3. Import from `src/support/` if needed
4. Use `process.env.*` for secrets

### Debugging

1. Run in debug mode: `./scripts/debug.sh src/e2e/**/<test>.spec.ts`
2. Check traces in `test-results/`
3. View report: `./scripts/open-report.sh`

## Test Patterns (Rules)

1. Locators-in-tests

   - Prefer `const button = page.locator('role=button[name="Submit"]');` inside the test or fixture.
   - ❌ Avoid defining locators in a separate file (e.g., `selectors.ts`) or class properties unless reusing across many tests.

2. Selectors & Shadow DOM

   - **Prefer Role-Based**: `getByRole`, `getByText`, `getByLabel` are user-facing and resilient.
   - **Avoid XPath**: XPath selectors do **NOT** pierce Shadow DOM. Use CSS or built-in locators instead.
   - **Avoid Test IDs**: Use only if no user-facing attribute is unique/stable.
   - Avoid raw `page.$()` or `page.evaluate()` for selectors unless necessary.

3. Fixture-first

   - Compose fixtures for auth, user creation, and small helpers.
   - Keep fixtures explicit and small:
     - `userFixture` returns `{ user, token }`
     - `authPage` encapsulates login flow but does not assert

4. Page Objects (POs)

   - Keep POs thin: selectors + `async` action helpers.
   - No assertions inside POs.

5. Assertions & Test Size

   - Aim for one logical behavior per test. Break up tests when multiple unrelated asserts are present.
   - Use `await expect(locator).toHaveText(...)` for stability.

6. Determinism & Mocking

   - Use route handlers (`page.route`) or service-level mocks for network determinism in E2E tests.
   - Favor deterministic assertions (content presence, state) over timing-based checks.

7. Flaky test triage
   - Enable `trace: 'on-first-retry'` and `screenshot: 'only-on-failure'` in config or test options.
   - On failure, capture trace and screenshot, and re-run locally with `npx playwright test <test-file> -g "testName" --trace=on`.

## Style & Tone

- Keep answers concise and code-first. Provide short rationale (1-2 sentences) when proposing changes.
- When showing diffs or replacements, prefer minimal patches and file snippets.

## Accessibility checks (short example)

- Prefer role-based selectors and simple a11y checks with Playwright built-ins.

```ts
test("a11y smoke check", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('role=heading[name="Contact"]')).toBeVisible();
  // Basic accessibility snapshot (built-in)
  const snapshot = await page.accessibility.snapshot();
  expect(snapshot).toBeTruthy();
});
```

> Note: Integrating axe-core or other a11y libraries requires adding external dependencies — follow project guardrails and get explicit approval before adding them.

**Related**: <https://playwright.dev/docs/accessibility>

## Leveraging the Playwright Spec Efficiently

- Prefer built-in features (locators, fixtures, test fixtures, tracing) over custom solutions.
- Use Playwright's official docs for complex APIs and include exact option names (e.g., `trace: "on-first-retry"`).
- Prefer built-in features (locators, fixtures, test fixtures, tracing) over custom solutions.
- Use Playwright's official docs for complex APIs and include exact option names (e.g., `trace: "on-first-retry"`).
- When asked to implement advanced behaviors, give 2–3 small examples that demonstrate the preferred solution and an alternative fallback.

## Anti-patterns to avoid

- **Long global timeouts**: Avoid raising global timeouts to hide flakiness; prefer targeted waits or mocking.
- **Monolithic tests**: Large tests asserting many unrelated behaviors — split into smaller tests with one logical assertion each.
- **Assertions in POs**: Do not place assertions inside thin Page Objects; keep assertions in tests.
- **Over-mocking**: Mocking every network request can make tests diverge from production; mock only what is necessary.
- **Navigation without action**: ⚠️ **CRITICAL** - Never call `page.goBack()` or `page.goForward()` without first performing a navigation action.

### Navigation Testing Anti-pattern

**Problem**: Checking element visibility and then calling `page.goBack()` without actually clicking/navigating first results in flawed test logic.

❌ **WRONG - Flawed Logic**:

```typescript
test("should persist search when navigating back", async ({ page }) => {
  const searchInput = page.locator('input[data-testid="product-search"]');
  await searchInput.fill("Foundation");
  await page.waitForLoadState("networkidle");

  const productLink = page
    .locator('[data-testid="product-card"]')
    .first()
    .locator("a");

  if (await productLink.isVisible().catch(() => false)) {
    // ❌ BUG: Checking visibility but NOT clicking before goBack()
    await page.goBack(); // This doesn't test the intended behavior!
    await expect(searchInput).toHaveValue("Foundation");
  }
});
```

**Why it's wrong**: The test checks if a link is visible but never clicks it, so there's no new page to go back from. The `page.goBack()` call doesn't test the intended behavior.

✅ **CORRECT - Complete Navigation Flow**:

```typescript
test("should persist search when navigating back", async ({ page }) => {
  const searchInput = page.locator('input[data-testid="product-search"]');
  await searchInput.fill("Foundation");
  await page.waitForLoadState("networkidle");

  const productCard = page.locator('[data-testid="product-card"]').first();

  if (await productCard.isVisible().catch(() => false)) {
    const productLink = productCard.locator("a").first();

    if (await productLink.isVisible().catch(() => false)) {
      // ✅ CORRECT: Click to navigate to product page
      await productLink.click();
      await page.waitForURL(/\/product\//); // Wait for navigation

      // ✅ Now goBack() makes sense - we're actually on a different page
      await page.goBack();
      await page.waitForLoadState("networkidle");

      // Verify search term persisted after navigation
      await expect(searchInput).toHaveValue("Foundation");
    }
  }
});
```

**Rule**: Before calling `page.goBack()` or `page.goForward()`:

1. **Actually perform the navigation** - click a link, submit a form, or programmatically navigate
2. **Wait for navigation to complete** - use `await page.waitForURL()` or `await page.waitForLoadState()`
3. **Then** use `goBack()` or `goForward()` to test the back/forward behavior
4. **Verify** the intended state after going back

**Related patterns**:

- Use `await page.waitForURL(/pattern/)` after navigation actions
- Use `await page.waitForLoadState('networkidle')` to ensure page is fully loaded
- Always test the complete user journey, not partial flows

## Mock HTML Warning

> [!CAUTION]
> **Inline `<script>` tags in `route.fulfill()` do NOT execute reliably.**

When mocking HTML responses, JavaScript inside the HTML may not run. This causes tests to fail unexpectedly.

❌ **AVOID - Scripts may not execute**:

```typescript
await page.route('**/login', route => route.fulfill({
  body: `
    <form id="loginForm">
      <script>
        // ❌ This JavaScript may NOT execute in mocked context
        document.getElementById('loginForm').onsubmit = (e) => {
          validateForm();
        };
      </script>
      <input id="email" />
      <button>Submit</button>
    </form>
  `
}));

// Test fails because validation script didn't run
await page.click('button');
await expect(page.locator('.error')).toBeVisible(); // ❌ Never appears
```

✅ **CORRECT - Static HTML + state injection**:

```typescript
// Pattern 1: Static HTML only - test visible elements
await page.route('**/login', route => route.fulfill({
  body: `
    <form>
      <input id="email" />
      <button>Submit</button>
    </form>
  `
}));
await page.goto('/login');
await expect(page.locator('#email')).toBeVisible();
await expect(page.locator('button')).toBeVisible();

// Pattern 2: State injection via page.evaluate()
await page.goto('/login');
await page.evaluate(() => {
  localStorage.setItem('authToken', 'mock-token');
  window.dispatchEvent(new Event('storage'));
});
// Verify the app reacts to the injected state
await expect(page.locator('.welcome-message')).toBeVisible();

// Pattern 3: Run a local server for complex JavaScript interactions
// Use when tests require real client-side logic
```

**When to use each pattern**:

| Pattern | Use When |
|---------|----------|
| Static HTML | Testing element presence, layout, basic interactions |
| State injection | Testing authenticated states, localStorage-dependent features |
| Local server | Testing complex client-side validation, SPA routing |
