---
name: gitignore-guide
description: Essential .gitignore entries for Playwright test artifacts
tags: [configuration, setup, version-control]
---

# Playwright .gitignore Guide

## Required Entries

Playwright generates these folders during test execution. Add to `.gitignore`:

```gitignore
# Playwright Test Artifacts
test-results/
playwright-report/
playwright/.auth/
.playwright/
```

## Verification

```bash
grep -E "test-results|playwright-report|playwright/.auth" .gitignore
```

If missing:

```bash
cat >> .gitignore << EOF
# Playwright
test-results/
playwright-report/
playwright/.auth/
.playwright/
EOF
```
