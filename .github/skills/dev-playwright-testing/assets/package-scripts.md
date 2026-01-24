---
name: package-scripts
description: NPM script naming conventions for package.json
metadata:
  category: setup
  related: [configuration]
---

# Package.json Script Naming Conventions

Standard naming patterns for npm scripts in `package.json` for projects with multiple testing frameworks.

## Playwright Script Naming Pattern

**Pattern**: `pw:[category]:[action]` or `pw:[action]`

Use the `pw:` prefix to clearly identify Playwright-related scripts in projects with 50+ npm scripts.

---

## Recommended Scripts

### Setup & Installation

```json
{
  "scripts": {
    "pw:install": "npx playwright install --with-deps",
    "pw:install:browsers": "npx playwright install"
  }
}
```

### Test Execution

```json
{
  "scripts": {
    "pw:test": "playwright test",
    "pw:test:debug": "playwright test --debug",
    "pw:test:headed": "playwright test --headed",
    "pw:test:ui": "playwright test --ui",
    "pw:test:chromium": "playwright test --project=chromium",
    "pw:test:firefox": "playwright test --project=firefox",
    "pw:test:webkit": "playwright test --project=webkit"
  }
}
```

### Reporting & Output

```json
{
  "scripts": {
    "pw:report": "playwright show-report",
    "pw:report:open": "playwright show-report",
    "pw:trace": "playwright show-trace"
  }
}
```

### Visual Testing

```json
{
  "scripts": {
    "pw:snapshots:update": "playwright test --update-snapshots",
    "pw:snapshots:compare": "playwright test --reporter=html"
  }
}
```

### Code Generation

```json
{
  "scripts": {
    "pw:codegen": "playwright codegen"
  }
}
```

---

## Complete Example

```json
{
  "scripts": {
    "pw:install": "npx playwright install --with-deps",
    "pw:test": "playwright test",
    "pw:test:debug": "playwright test --debug",
    "pw:test:headed": "playwright test --headed",
    "pw:test:ui": "playwright test --ui",
    "pw:report": "playwright show-report",
    "pw:snapshots:update": "playwright test --update-snapshots",
    "pw:codegen": "playwright codegen"
  }
}
```

---

## Other Testing Framework Patterns

### E2E Testing (non-Playwright)

```json
{
  "scripts": {
    "e2e:test": "cypress run",
    "e2e:open": "cypress open"
  }
}
```

### Unit Testing

```json
{
  "scripts": {
    "unit:test": "jest",
    "unit:coverage": "jest --coverage",
    "unit:watch": "jest --watch"
  }
}
```

### Integration Testing

```json
{
  "scripts": {
    "integration:test": "jest --config jest.integration.config.js",
    "integration:db": "jest --config jest.integration.config.js --testPathPattern=db"
  }
}
```

---

## Benefits of Scoped Naming

### 1. **Clear Ownership**

```json
"pw:*"           // Playwright scripts
"e2e:*"          // Generic E2E scripts
"unit:*"         // Unit testing scripts
```

### 2. **Easy Discovery**

```bash
npm run pw:      # Press TAB to see all Playwright scripts
npm run e2e:     # Press TAB to see all E2E scripts
```

### 3. **Scalability**

- Works with 100+ npm scripts
- No naming conflicts between frameworks
- Self-documenting

### 4. **IDE Support**

- Autocomplete groups by prefix
- Easy to find related scripts
- Package.json script runners show organized lists

---

## Category-Action Pattern

For complex operations, use `pw:[category]:[action]`:

```json
{
  "scripts": {
    "pw:test:debug": "...", // Category: test, Action: debug
    "pw:report:open": "...", // Category: report, Action: open
    "pw:snapshots:update": "..." // Category: snapshots, Action: update
  }
}
```

**Common Categories**:

- `test` - Test execution
- `report` - Report operations
- `snapshots` - Visual testing
- `install` - Setup operations
- `codegen` - Code generation

---

## Running Scripts

```bash
# Standard usage
npm run pw:test
npm run pw:test:debug
npm run pw:report

# With arguments
npm run pw:test -- --headed
npm run pw:test -- tests/login.spec.ts
```
