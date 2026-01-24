# Testing Best Practices

## What is it?

A comprehensive guide to testing web applications across functional, accessibility, visual, and performance dimensions.

## Why test thoroughly?

- **Confidence**: Ship with certainty that features work
- **Regression Prevention**: Catch bugs before users do
- **Accessibility Compliance**: Validate WCAG requirements
- **Performance Monitoring**: Track Core Web Vitals over time

---

## Testing Strategy Overview

| Test Type | Purpose | Tools | Speed |
|-----------|---------|-------|-------|
| Unit | Isolated logic | Vitest, Jest | Fast |
| Component | UI components | Playwright CT, Storybook | Medium |
| Integration | Feature workflows | Playwright, Cypress | Medium |
| E2E | Full user journeys | Playwright | Slow |
| Accessibility | WCAG compliance | axe-core, Lighthouse | Medium |
| Visual | UI appearance | Playwright snapshots | Medium |
| Performance | Core Web Vitals | Lighthouse, web-vitals | Medium |

---

## E2E Testing with Playwright

> For comprehensive Playwright guidance, use the [playwright-testing](../../playwright-testing/SKILL.md) skill.

### Test File Structure

```
src/
└── e2e/
    ├── pages/
    │   ├── home.page.ts
    │   └── login.page.ts
    ├── fixtures/
    │   └── test-data.ts
    ├── home.spec.ts
    └── auth.spec.ts
```

### Page Object Pattern

```typescript
// pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Test Example

```typescript
// auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Authentication', () => {
  test('successful login redirects to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('invalid credentials show error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('user@example.com', 'wrongpassword');
    
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
    await expect(page).toHaveURL('/login');
  });
});
```

### Best Practices

| Practice | Why |
|----------|-----|
| Use `getByRole()`, `getByLabel()` | Accessible, resilient selectors |
| Avoid `data-testid` | Prefer user-facing attributes |
| Use Page Objects | Maintainable, DRY tests |
| Test user flows, not implementation | Resilient to refactoring |
| Isolate test data | No shared state between tests |

---

## Accessibility Testing

### Automated Testing with axe-core

```typescript
// a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('form page is accessible', async ({ page }) => {
    await page.goto('/contact');
    
    const results = await new AxeBuilder({ page })
      .include('#contact-form')
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
});
```

### Common WCAG Violations and Fixes

| Violation | WCAG | Fix |
|-----------|------|-----|
| Missing alt text | 1.1.1 | Add `alt` attribute to images |
| Low contrast | 1.4.3 | Increase text/background contrast to 4.5:1+ |
| Missing form labels | 3.3.2 | Associate `<label>` with inputs |
| Missing lang attribute | 3.1.1 | Add `lang="en"` to `<html>` |
| No focus styles | 2.4.7 | Add `:focus-visible` styles |
| Inaccessible click handlers | 4.1.2 | Use `<button>` instead of `<div onclick>` |

### Manual Testing Checklist

- [ ] Navigate entire page with keyboard only
- [ ] Check focus order is logical
- [ ] Verify focus indicators are visible
- [ ] Test with screen reader (NVDA, VoiceOver)
- [ ] Check color contrast with browser tools
- [ ] Test interactive elements (dialogs, menus) with keyboard
- [ ] Verify skip links work

---

## Visual Regression Testing

### Playwright Visual Comparisons

```typescript
// visual.spec.ts
import { test, expect } from '@playwright/test';

test('homepage visual snapshot', async ({ page }) => {
  await page.goto('/');
  
  // Wait for images and animations to complete
  await page.waitForLoadState('networkidle');
  
  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01, // Allow 1% difference
  });
});

test('component visual snapshot', async ({ page }) => {
  await page.goto('/components');
  
  const card = page.locator('.feature-card').first();
  await expect(card).toHaveScreenshot('feature-card.png');
});
```

### Handling Dynamic Content

```typescript
// Mask dynamic content before screenshot
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [
    page.locator('.timestamp'),
    page.locator('.user-avatar'),
  ],
});

// Or replace dynamic text
await page.locator('.timestamp').evaluate(el => {
  el.textContent = 'Jan 1, 2025';
});
```

---

## Performance Testing

### Lighthouse CI

```typescript
// lighthouse.spec.ts
import { test } from '@playwright/test';

test('homepage meets performance thresholds', async ({ page }) => {
  await page.goto('/');
  
  // Get Core Web Vitals
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const data = { lcp: 0, cls: 0 };
      
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        data.lcp = entries[entries.length - 1].startTime;
        resolve(data);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  });
  
  console.log('LCP:', metrics.lcp);
  // Assert LCP < 2500ms
});
```

### web-vitals in Tests

```typescript
test('measures Core Web Vitals', async ({ page }) => {
  // Inject web-vitals library
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
  });
  
  await page.goto('/');
  
  const vitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      const metrics = {};
      
      webVitals.onLCP((m) => { metrics.LCP = m.value; });
      webVitals.onCLS((m) => { metrics.CLS = m.value; });
      webVitals.onINP((m) => { metrics.INP = m.value; });
      
      setTimeout(() => resolve(metrics), 3000);
    });
  });
  
  console.log('Vitals:', vitals);
});
```

---

## Cross-Browser Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    // Desktop browsers
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    
    // Mobile viewports
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    
    // Tablet
    { name: 'tablet', use: { ...devices['iPad Pro 11'] } },
  ],
  
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
});
```

### Browser-Specific Tests

```typescript
test('feature works in all browsers', async ({ page, browserName }) => {
  await page.goto('/feature');
  
  // Common assertions
  await expect(page.getByRole('button')).toBeVisible();
  
  // Browser-specific assertions
  if (browserName === 'webkit') {
    // Safari-specific behavior
  }
});
```

---

## Test Data Management

### Fixtures

```typescript
// fixtures/test-data.ts
export const testUsers = {
  standard: {
    email: 'user@example.com',
    password: 'Password123!',
    name: 'Test User',
  },
  admin: {
    email: 'admin@example.com', 
    password: 'Admin123!',
    name: 'Admin User',
  },
};

export const testProducts = [
  { id: 1, name: 'Widget', price: 29.99 },
  { id: 2, name: 'Gadget', price: 49.99 },
];
```

### Custom Fixtures

```typescript
// fixtures/auth.fixture.ts
import { test as base, expect } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/dashboard');
    
    // Provide authenticated page to test
    await use(page);
  },
});
```

---

## SEO and PWA Testing

### SEO Checks

```typescript
test('page has required SEO elements', async ({ page }) => {
  await page.goto('/');
  
  // Title
  const title = await page.title();
  expect(title.length).toBeGreaterThan(30);
  expect(title.length).toBeLessThan(60);
  
  // Meta description
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toBeTruthy();
  expect(description!.length).toBeGreaterThan(120);
  
  // Single H1
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBe(1);
  
  // Canonical URL
  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  expect(canonical).toBeTruthy();
});
```

### PWA Checks

```typescript
test('PWA is installable', async ({ page }) => {
  await page.goto('/');
  
  // Check manifest
  const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifest).toBeTruthy();
  
  // Check service worker registration
  const swRegistered = await page.evaluate(() => {
    return navigator.serviceWorker?.controller !== null;
  });
  expect(swRegistered).toBe(true);
});
```

---

## Testing Checklist

### Before Release

- [ ] All E2E tests passing
- [ ] No accessibility violations (axe-core)
- [ ] Visual regression snapshots updated
- [ ] Cross-browser tests passing (Chrome, Firefox, Safari)
- [ ] Mobile viewport tests passing
- [ ] Performance thresholds met (LCP < 2.5s)
- [ ] SEO audit passing
- [ ] PWA audit passing (if applicable)

### Test Quality

- [ ] Tests use accessible selectors
- [ ] Tests are isolated (no shared state)
- [ ] Flaky tests are fixed, not skipped
- [ ] Test data is managed in fixtures
- [ ] Page Objects used for maintainability
