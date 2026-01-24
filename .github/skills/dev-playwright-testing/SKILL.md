---
name: dev-playwright-testing
description: Write Playwright E2E tests from specifications using Playwright 1.57.x and Node 24 LTS. Config at root (testDir src/e2e, 60s timeout). Creates tests, fixtures, page objects. Debugs flaky tests. Use when writing e2e tests, testing web apps, playwright testing, browser automation, debugging flaky tests, visual regression testing, accessibility testing.
metadata:
  category: development
---

# Playwright Testing Skill

## What is it?

An expert Playwright skill for generating E2E tests, fixtures, and page objects from natural-language specifications. Uses Playwright 1.57.x and Node 24 LTS to create comprehensive browser automation tests with built-in best practices and MCP integration.

## Why use it?

- **Structured workflow**: Guided process from UI exploration through validation
- **Comprehensive references**: Built-in API docs, examples, and templates
- **Best practices enforced**: Automatic adherence to testing standards and patterns
- **MCP integration**: Browser automation via Model Context Protocol
- **Full toolkit**: Scripts, fixtures, page objects, and debugging guides

**Primary standard**: `references/best-practices.md`  
**Navigation**: See `README.md` for complete reference map

## Critical Setup

**Before ANY work**: Run `./scripts/validate-setup.sh` (validates installation and config)

**File locations** (strict):

- Tests: `src/e2e/**/*.spec.ts` ONLY (not `*.test.ts`)
- Utilities: `src/support/{helpers,fixtures,data}/`
- Config: `playwright.config.ts` at project root (not in `.claude/`, `.github/`, `.vscode/`)
- **UI Apps**: `src/packages/app-*/` - Each folder contains a web app for a domain/subdomain

Import utilities from `src/support/`, not from within `src/e2e/`.

**Project Structure**: This is a monorepo with multiple web applications. UI code is located in folders matching the pattern `src/packages/app-*` (e.g., `app-admin`, `app-customer`, `app-vendor`). Each app represents a separate domain or subdomain.

## How to use it?

Follow this workflow when creating Playwright tests:

### 1. UI Code Exploration (MANDATORY)

**Before writing any tests**, explore the UI codebase to understand the application structure.

**Identify target application**:

- Location: `src/packages/app-*/` directories
- Each `app-*` folder contains a complete web application
- Examples: `app-admin`, `app-customer`, `app-vendor`

**Explore and document**:

1. **Which app** are you testing? (e.g., `app-admin`)
2. **UI structure**: Review pages, components, layouts
3. **Routing**: Understand navigation and URL patterns
4. **Components**: Identify key interactive elements (forms, buttons, modals)
5. **State management**: Note any state patterns (context, stores, etc.)
6. **Special patterns**: Dialogs, downloads, frames, authentication flows

**Tools to use**:

- `list_dir` - Explore folder structure
- `view_file` - Review component implementations
- `grep_search` - Find specific patterns or components

**Output**: Document your findings before proceeding to test planning.

### 2. Browser-based UI Exploration (Optional)

Use Playwright MCP server to explore the running application.  
**See**: `MCP_GUIDE.md` for MCP server setup and browser tools.

**Identify**:

- User flows and journeys
- Interactive elements (buttons, forms, inputs)
- Special UI patterns (dialogs, downloads, frames)
- Data requirements

### 3. Setup & Validation

**MANDATORY**: Run validation script first:

```bash
./scripts/validate-setup.sh
```

### 4. Test Planning

**Organize tests** by epic/feature:

```text
src/e2e/
└── F42-shopping-cart/
    ├── add-to-cart.spec.ts
    └── remove-from-cart.spec.ts
```

**Plan fixtures** (if needed):

- Auth state: `src/support/fixtures/`
- Test data: `src/support/data/`
- API mocks: inline or fixture-based

### 5. Implementation

**Write tests** following structure:

1. Use API references (`references/api/`)
2. Follow `references/best-practices.md`
3. Create fixtures in `src/support/fixtures/`
4. Create helpers in `src/support/helpers/`

⚠️ **CRITICAL**: Never call `page.goBack()` without first navigating to a new page. See navigation anti-pattern in `references/best-practices.md`.

**Reference during implementation**:

- Page API: `references/api/page-api.md`
- Test API: `references/api/test-api.md`
- Network API: `references/api/network-api.md`

### 6. Execution & Debugging

**Run tests**:

```bash
npx playwright test
npx playwright test --debug  # debug mode
npx playwright show-report   # view report
```

**If tests fail**:

1. Check traces in `test-results/`
2. Review screenshots
3. Use `references/debugging.md`
4. Fix flaky tests (see `assets/examples/flaky.spec.ts`)

### 7. Validation

**Run checklist**: Review `CHECKLIST.md`

**Verify**:

- All scenarios covered
- Best practices compliance
- No hardcoded credentials
- Tests are deterministic

**Commit** when all tests pass and checklist satisfied.

## Configuration

**File**: `assets/playwright.config.ts` (frozen, copy to project root)

## API References

Quick reference for Playwright Test APIs:

- **Page & Locators**: `references/api/page-api.md`
- **Test Structure**: `references/api/test-api.md`
- **Network & Mocking**: `references/api/network-api.md`

## Limitations

- **Playwright version**: Specific to Playwright 1.57.x
- **Node version**: Requires Node 24 LTS
- **No external libraries**: Playwright built-ins only, no additional test frameworks
- **File naming**: Must use `*.spec.ts` extension (not `*.test.ts`)
- **Credentials**: No hardcoded credentials (use `process.env.*` placeholders)
- **Browser support**: Limited to browsers supported by Playwright

**Details**: See `references/guardrails.md`

## Supporting References

- **[README.md](README.md)** - Complete documentation and reference map
- **[CHECKLIST.md](CHECKLIST.md)** - Testing workflow verification checklist
- **[MCP_GUIDE.md](MCP_GUIDE.md)** - Playwright MCP server integration guide
- **[references/best-practices.md](references/best-practices.md)** - Project coding standards
- **[references/debugging.md](references/debugging.md)** - Troubleshooting guide
- **[references/api/page-api.md](references/api/page-api.md)** - Page, Locator, Assertions API
- **[references/api/test-api.md](references/api/test-api.md)** - Test structure, Fixtures, Hooks
- **[references/api/network-api.md](references/api/network-api.md)** - Mocking, Routes, API testing
- **[references/guides/authentication.md](references/guides/authentication.md)** - Login and auth patterns
- **[assets/examples/](assets/examples/)** - Runnable test examples
