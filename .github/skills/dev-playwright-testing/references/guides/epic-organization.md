---
name: epic-organization
description: Organize tests by epic/feature
metadata:
  category: guide
  related: [configuration]
---

# Epic Organization

Organize tests by epic and feature.

## Directory Structure

```
src/e2e/
├── F01-authentication/
│   ├── login.spec.ts
│   ├── signup.spec.ts
│   └── password-reset.spec.ts
├── F02-shopping-cart/
│   ├── add-to-cart.spec.ts
│   └── checkout.spec.ts
└── F03-dashboard/
    └── dashboard.spec.ts
```

## Naming Convention

- Epic prefix: `F01`, `F02`, etc.
- Kebab-case: `add-to-cart.spec.ts`
- Descriptive: Feature name in folder

## Config

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./src/e2e",
  testMatch: /.*\.spec\.ts$/,
});
```

## Run by Epic

```bash
npx playwright test src/e2e/F01-authentication
npx playwright test src/e2e/F02-shopping-cart
```
