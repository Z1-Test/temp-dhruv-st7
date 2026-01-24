---
title: Runtime Dependencies Exceptions
description: Approved exceptions to the zero runtime dependencies rule for staystack-ts packages.
---

# Runtime Dependency Exceptions

This file lists **allowed exceptions** to the "zero runtime dependencies" rule and the justification/approval for each exception. Each exception entry must include:

- **package/name**
- **reason & scope**
- **approved-by** (GitHub handle) and date
- **mitigation/compatibility plan**

## Current Exceptions

- **package/name**: `playwright` (and `@playwright/test`)
- **reason & scope**: Required for browser automation testing across packages. Used in test suites only (devDependencies).
- **approved-by**: Temporary approval — 2026-01-07
- **mitigation/compatibility plan**: Will be reviewed and finalized when staystack-ts dependency policy is established. Currently needed for comprehensive UI testing.

## Example Entry

```md
- **package/name**: `wasm-bindgen`
- **reason & scope**: Required for cryptographic WASM shim in `@staytunedllp/wasm-crypto`.
- **approved-by**: @alice — 2025-11-01
- **mitigation/compatibility plan**: Vendor the build and verify checksums at CI.
```

## Process

To add an exception:

1. Open an issue describing the dependency, its purpose, and why it cannot be avoided.
2. Discuss justification with maintainers.
3. Merge a follow-up PR that adds the entry to this file with approver metadata.
