# Playwright Testing Skill

**For Developers**: This README is for human developers getting started with Playwright testing in this organization.

**For AI Agents**: See `SKILL.md` for agent-specific instructions and workflows.

Expert Playwright skill for generating E2E tests, fixtures, and page objects from natural-language specifications.

## Quick Start

```bash
npm install -D @playwright/test
npx playwright install --with-deps
npx playwright test
```

## Folder Structure

```text
playwright-testing/
├── SKILL.md              # Agent-specific details
├── CHECKLIST.md          # Testing workflow verification
├── src/
│   ├── e2e/              # Test files (*.spec.ts ONLY)
│   ├── support/          # Test utilities
│   │   ├── helpers/      # Test helper functions
│   │   ├── fixtures/     # Custom fixtures
│   │   └── data/         # Test data generators
│   └── shared/           # Application-shared utilities
│       ├── constants.ts  # Shared constants
│       └── types.ts      # Shared types
├── assets/               # Templates and configuration
│   ├── playwright.config.ts          # Standard config
│   ├── test-template.ts              # Basic test pattern
│   ├── fixture-template.ts           # Fixture pattern
│   ├── page-object-template.ts       # Page object pattern
│   ├── api-test-template.ts          # API testing pattern
│   ├── flaky-test-template.ts        # Flaky test handling
│   ├── component-test-template.ts    # Component testing
│   ├── .env.example                  # Environment variables
│   └── examples/                     # Runnable examples
│       ├── basic.spec.ts             # Minimal smoke test
│       ├── auth.spec.ts              # Authentication patterns
│       ├── actions.spec.ts           # User interactions
│       ├── navigation.spec.ts        # Page navigation
│       ├── apiIntegration.spec.ts    # API + UI testing
│       ├── dialogs.spec.ts           # Alert handling
│       ├── downloads.spec.ts         # File downloads
│       ├── frames.spec.ts            # Iframe interactions
│       ├── flaky.spec.ts             # Retry patterns
│       ├── visual.spec.ts            # Screenshot comparison
│       ├── accessibility.spec.ts     # A11y testing
│       ├── performance.spec.ts       # Performance metrics
│       ├── fixtures/                 # Example fixtures
│       └── page-objects/             # Example page objects
├── references/           # API references and guides
│   ├── api/                          # Comprehensive API references
│   │   ├── page-api.md               # Page, Locator, Assertions
│   │   ├── test-api.md               # Test structure, Fixtures, Hooks
│   │   └── network-api.md            # Mocking, Routes, API testing
│   ├── best-practices.md             # Project coding standards
│   ├── guardrails.md                 # Constraints
│   ├── debugging.md                  # Troubleshooting guide
│   ├── gitignore.md                  # Gitignore patterns
│   └── guides/                       # Step-by-step workflows
│       ├── authentication.md         # Login & auth patterns
│       └── epic-organization.md      # Feature organization
└── scripts/              # Helper scripts
    ├── validate-setup.sh             # Validate installation
    ├── init-playwright.sh            # Initialize project
    ├── install-browsers.sh           # Install browsers
    ├── debug.sh                      # Run in debug mode
    ├── open-report.sh                # Open HTML report
    └── update-snapshots.sh           # Update screenshots
```

## Configuration

**Standard Config**: `assets/playwright.config.ts` (copy to project root)

**Key Settings**:

- Test Directory: `./src/e2e/`
- Timeout: 60s default
- Base URL: `process.env.BASE_URL`
- Tracing: On first retry

## Templates

### Test Templates (assets/)

- `test-template.ts` - Basic Arrange/Act/Assert pattern
- `fixture-template.ts` - Reusable auth fixture
- `page-object-template.ts` - Thin page object pattern
- `api-test-template.ts` - API + UI validation
- `flaky-test-template.ts` - Handling flaky tests
- `component-test-template.ts` - Component testing

### Config Files

- `playwright.config.ts` - Standard configuration
- `.env.example` - Environment variable template

### Scripts

See **[package-scripts.md](assets/package-scripts.md)** for script naming conventions and patterns.

## Examples (assets/examples/)

### Basic Tests

- `basic.spec.ts` - Minimal smoke test (navigation + assertion)
- `actions.spec.ts` - Fill, click, select patterns
- `navigation.spec.ts` - Page navigation with waitForNavigation

### Authentication & Data

- `auth.spec.ts` - Uses authFixture for authenticated tests
- `apiIntegration.spec.ts` - Create via API, verify in UI

### Advanced Testing

- `visual.spec.ts` - Screenshot comparison
- `accessibility.spec.ts` - A11y checks and role selectors
- `performance.spec.ts` - Load time, Core Web Vitals

### Interactions

- `dialogs.spec.ts` - Alert, confirm, prompt handling
- `downloads.spec.ts` - File download verification
- `frames.spec.ts` - Iframe interactions
- `shadow.spec.ts` - Declarative Shadow DOM (DSD) interaction

### Patterns

- `flaky.spec.ts` - Retry and trace patterns
- `fixtures/` - Auth, test data, mock fixtures
- `page-objects/` - Thin page object examples

## API References (references/api/)

Comprehensive Playwright Test API references:

- **[Page API](references/api/page-api.md)** - Page automation, locators, actions, assertions
- **[Test API](references/api/test-api.md)** - Test structure, fixtures, hooks, annotations
- **[Network API](references/api/network-api.md)** - Mocking, routes, API testing

## Project Guidelines

- **[Best Practices](references/best-practices.md)** - Project coding standards
- **[Guardrails](references/guardrails.md)** - Project constraints
- **[Debugging](references/debugging.md)** - Troubleshooting guide

## Guides (references/guides/)

Step-by-step workflows for common patterns:

- **[Authentication](references/guides/authentication.md)** - Login and auth patterns
- **[API Testing](references/guides/apiTesting.md)** - Test APIs with request context
- **[Epic Organization](references/guides/epic-organization.md)** - Feature-based test organization

## MCP Integration

**[MCP Guide](MCP_GUIDE.md)** - Playwright MCP server integration

Learn how to use Playwright browser automation via Model Context Protocol:

- MCP server setup and configuration
- Browser tools (navigate, snapshot, click, type)
- Integration with agent workflows

## Scripts (scripts/)

| Script                | Purpose                                     |
| --------------------- | ------------------------------------------- |
| `validate-setup.sh`   | Validate Playwright installation and config |
| `init-playwright.sh`  | Initialize Playwright in a project          |
| `install-browsers.sh` | Install Playwright browsers                 |
| `debug.sh`            | Run tests in debug mode                     |
| `open-report.sh`      | Open HTML test report                       |
| `update-snapshots.sh` | Update visual test snapshots                |

Run with `--help` for usage:

```bash
./scripts/validate-setup.sh --help
./scripts/init-playwright.sh --help
```

## Common Tasks

| Task                  | Reference                             |
| --------------------- | ------------------------------------- |
| Configure test runner | `assets/playwright.config.ts`         |
| Select elements       | `references/api/page-api.md`          |
| Create fixtures       | `references/api/test-api.md`          |
| Mock API requests     | `references/api/network-api.md`       |
| Debug failing tests   | `references/debugging.md`             |
| Handle auth           | `references/guides/authentication.md` |

## Best Practices

- **Versions**: Playwright 1.57.x, Node 24 LTS
- **Naming**: camelCase (`*.spec.ts`)
- **Patterns**: Locators-in-tests, fixture-first, thin page objects
- **Selectors**: Prefer role-based selectors
- **No external libraries**: Playwright built-ins only
- **No secrets**: Use `process.env.*` placeholders

See `references/best-practices.md` for complete guidelines.

## Official Docs

- Playwright: <https://playwright.dev/>
- Getting Started: <https://playwright.dev/docs/intro>
- Locators: <https://playwright.dev/docs/locators>
- Assertions: <https://playwright.dev/docs/test-assertions>

See `SKILL.md` for agent-specific details.
