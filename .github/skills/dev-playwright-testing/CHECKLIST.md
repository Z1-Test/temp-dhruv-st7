---
name: playwright-checklist
description: Verification checklist for Playwright test quality. Use before committing tests, reviewing test quality, or debugging test issues.
---

# Testing Checklist

Follow this workflow to ensure test quality.

## 1. Before Writing Tests (CRITICAL)

### Setup

- [ ] **RUN**: `./scripts/validate-setup.sh` (BLOCKING)
- [ ] **VERIFY**: `playwright.config.ts` at project root
- [ ] **VERIFY**: `.gitignore` includes Playwright outputs (`test-results/`, `playwright-report/`, `playwright/.auth/`)
- [ ] (Optional) **MCP Server**: Configure Playwright MCP server (see `MCP_GUIDE.md`)
- [ ] Check `src/e2e/` structure
- [ ] Review `.env.example`

### Planning

- [ ] **EXPLORE UI CODE**: Review `src/packages/app-*/` structure (MANDATORY)
  - [ ] Identify target application
  - [ ] Review UI components, pages, and routing
  - [ ] Note state management patterns
  - [ ] Document special UI patterns (modals, forms, etc.)
- [ ] Identify test scope
- [ ] Review existing `*.spec.ts` patterns
- [ ] Check existing utilities in `src/support/`

---

## 2. During Test Writing (ENFORCE)

- [ ] Use `*.spec.ts` extension ONLY (NOT `*.test.ts`)
- [ ] Use camelCase filenames (e.g., `loginFlow.spec.ts`)
- [ ] Place in `src/e2e/` directory
- [ ] Import utilities from `src/support/`
- [ ] Use `page.locator()` pattern
- [ ] Use `process.env.*` for secrets
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] No hardcoded waits (`waitForTimeout`)
- [ ] Descriptive test names
- [ ] Use fixtures for reusable setup

---

## 3. Before Committing (VERIFY)

- [ ] All tests pass: `npm run test`
- [ ] No flaky tests (run 3x)
- [ ] No hardcoded credentials
- [ ] No absolute URLs (use `baseURL`)
- [ ] Proper error messages in assertions
- [ ] File follows `*.spec.ts` naming
- [ ] Visual tests updated (if needed): `./scripts/update-snapshots.sh`
- [ ] Review report: `./scripts/open-report.sh`

---

## 4. CI/CD (Optional)

### Pipeline

- [ ] CI pipeline configured (GitHub Actions, etc.)
- [ ] Test reports generated
- [ ] Artifacts uploaded on failure
- [ ] Team notified of failures

### Environment

- [ ] Environment variables set in CI
- [ ] Browser installation automated
- [ ] Retries configured (2 retries in CI)

---

## Common Issues

| Issue                  | Fix                                                                             |
| ---------------------- | ------------------------------------------------------------------------------- |
| Setup not validated    | `./scripts/validate-setup.sh`                                                   |
| Wrong file extension   | Rename `*.test.ts` → `*.spec.ts`                                                |
| Output files committed | Add to `.gitignore`: `test-results/`, `playwright-report/`, `playwright/.auth/` |

---
