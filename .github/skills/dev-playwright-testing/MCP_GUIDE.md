# Playwright MCP Server — Tool Usage Guide

**Purpose**: Guide for LLMs on when and how to use Playwright MCP server tools effectively with this skill.

**Prerequisites**: Playwright MCP server must be installed and available (`@playwright/mcp@latest`).

---

## Core Principles

### When to Use MCP vs. Generate Tests

#### ✅ Use MCP Tools When:

- **Interactive exploration** — Debugging live applications, exploring UI behavior
- **Quick validation** — Checking if elements exist, verifying current state
- **Manual test conversion** — Recording user flows to convert to automated tests
- **Rapid prototyping** — Testing locator strategies before codifying
- **Live debugging** — Investigating flaky test failures in real-time

#### ✅ Generate Playwright Test Code When:

- **Automated testing** — Creating reusable `.spec.ts` files for CI/CD
- **Regression testing** — Building test suites that run repeatedly
- **Documentation** — Tests serve as executable specifications
- **Team collaboration** — Tests are versioned and reviewed

> **Key Insight**: MCP tools are for **exploration and validation**. Playwright tests are for **automation and repeatability**.

---

## Tool Selection Guide

### Navigation & Page Management

| Tool                    | When to Use                                        | Example Scenario                           |
| ----------------------- | -------------------------------------------------- | ------------------------------------------ |
| `browser_navigate`      | Start exploring a URL, navigate to different pages | "Check the login page at /auth/login"      |
| `browser_navigate_back` | Return to previous page during exploration         | "Go back and try the other flow"           |
| `browser_tabs`          | Work with multi-tab workflows, switch contexts     | "Open the dashboard in a new tab"          |
| `browser_resize`        | Test responsive design, mobile viewports           | "Check how this looks on mobile (375x667)" |
| `browser_close`         | End the session, clean up                          | "Close the browser when done"              |

**Best Practice**: Always use `browser_navigate` with relative paths when `BASE_URL` is configured.

---

### Inspection & Understanding

| Tool                       | When to Use                                                                | Avoid When                                 |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| `browser_snapshot`         | **Primary inspection tool**. Get structured accessibility tree of the page | You need pixel-perfect visual verification |
| `browser_take_screenshot`  | Visual verification, debugging layout issues, creating documentation       | You can use `browser_snapshot` instead     |
| `browser_console_messages` | Debug JavaScript errors, check for warnings                                | No console activity expected               |
| `browser_network_requests` | Verify API calls, check for failed requests, debug network issues          | Not debugging network-related problems     |

**Critical**: Always prefer `browser_snapshot` over `browser_take_screenshot`. Snapshots provide structured data that LLMs can parse and act upon. Screenshots require vision capabilities.

**Snapshot Example**:

```
Use browser_snapshot to:
1. Identify all interactive elements (buttons, inputs, links)
2. Get element references (ref) for interaction
3. Understand page structure without visual parsing
```

---

### Element Interaction

| Tool                    | Use Case                                 | Parameters to Note                                                            |
| ----------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| `browser_click`         | Click buttons, links, checkboxes         | Requires `element` (description) + `ref` (from snapshot)                      |
| `browser_hover`         | Trigger hover effects, reveal dropdowns  | Use before `browser_snapshot` to capture hover state                          |
| `browser_type`          | Fill single input fields                 | Set `submit: true` to press Enter after typing                                |
| `browser_fill_form`     | Fill multiple fields at once             | **Preferred for forms** — more efficient than individual `browser_type` calls |
| `browser_select_option` | Choose from dropdowns                    | Pass values as array (supports multi-select)                                  |
| `browser_press_key`     | Send keyboard shortcuts, navigation keys | Use `ArrowDown`, `Enter`, `Escape`, etc.                                      |
| `browser_drag`          | Drag-and-drop interactions               | Requires start and end element refs                                           |

**Workflow Example**:

```
1. browser_snapshot → Get element refs
2. browser_fill_form → Fill all form fields at once
3. browser_click → Submit button (using ref from snapshot)
4. browser_snapshot → Verify success state
```

---

### Advanced Actions

| Tool                    | When to Use                                                       | Alternatives                                       |
| ----------------------- | ----------------------------------------------------------------- | -------------------------------------------------- |
| `browser_evaluate`      | Execute custom JavaScript, extract data not in accessibility tree | Use built-in tools when possible                   |
| `browser_run_code`      | Run **Playwright code snippets** (not generic JS)                 | Generate a `.spec.ts` file instead for reusability |
| `browser_wait_for`      | Wait for dynamic content (`text`, `textGone`), or arbitrary time  | Better than manual delays                          |
| `browser_file_upload`   | Upload files via file input                                       | Requires absolute paths                            |
| `browser_handle_dialog` | Accept/dismiss alerts, prompts, confirms                          | Must be called when dialog is open                 |

**When to Use `browser_run_code`**:

- Test a complex Playwright pattern before adding to test file
- One-off data extraction that doesn't justify a full test
- Rapid iteration on locator strategies

**Example**:

```javascript
// browser_run_code example
async (page) => {
  const count = await page.getByRole("button").count();
  return { buttonCount: count };
};
```

---

### Verification Tools

| Tool                             | Purpose                                       | Use in MCP                          |
| -------------------------------- | --------------------------------------------- | ----------------------------------- |
| `browser_verify_element_visible` | Assert that element with role/name is visible | Quick validation during exploration |
| `browser_verify_text_visible`    | Assert text is present (less precise)         | When you don't know the exact role  |
| `browser_verify_list_visible`    | Verify a list contains expected items         | Validating navigation menus, tables |
| `browser_verify_value`           | Check input value, checkbox state             | Form validation                     |

**Note**: These verification tools are useful for **quick checks in MCP**. When writing test files, use Playwright's `expect()` assertions instead.

---

### Debugging & Tracing

| Tool                       | When to Use                                                |
| -------------------------- | ---------------------------------------------------------- |
| `browser_generate_locator` | Get the Playwright code for a locator to use in test files |
| `browser_start_tracing`    | Start recording a trace for debugging                      |
| `browser_stop_tracing`     | Stop trace and save to file                                |

**Workflow for Test Generation**:

```
1. Explore the page with browser_snapshot
2. Identify target elements
3. Use browser_generate_locator to get test-ready locators
4. Generate .spec.ts file with those locators
```

---

## Common Workflows

### Workflow 1: Explore & Generate Login Test

```
1. browser_navigate → "/login"
2. browser_snapshot → Identify form fields (get refs)
3. browser_fill_form → Fill username/password
4. browser_click → Submit button
5. browser_snapshot → Verify redirect to dashboard
6. browser_generate_locator → Get locators for submit button
7. Generate login.spec.ts using insights from steps 1-6
```

### Workflow 2: Debug Flaky Test

```
1. browser_navigate → Failing page
2. browser_start_tracing → Start recording
3. browser_snapshot → Check initial state
4. Perform actions that cause flakiness
5. browser_console_messages → Check for JS errors
6. browser_network_requests → Check for failed API calls
7. browser_stop_tracing → Save trace for analysis
```

### Workflow 3: Convert Manual Test to Automated

```
1. browser_navigate → Start of user flow
2. For each step:
   a. browser_snapshot → Understand current state
   b. Perform action (click, type, etc.)
   c. browser_snapshot → Verify result
3. browser_generate_locator → For key elements
4. Generate .spec.ts file following best practices
```

### Workflow 4: Validate Form Behavior

```
1. browser_navigate → Form page
2. browser_snapshot → Get form field refs
3. browser_fill_form → Fill with test data
4. browser_verify_value → Check field was filled
5. browser_click → Submit
6. browser_wait_for → text: "Success"
7. browser_snapshot → Confirm success state
```

---

## Tool Capabilities Matrix

### Core Tools (Always Available)

- ✅ **22 core tools** available by default
- Navigation, interaction, inspection, verification

### Optional Capabilities (Require `--caps` flag)

#### Vision Tools (Requires `--caps vision`)

- `browser_mouse_click_xy` — Click at coordinates (x, y)
- `browser_mouse_drag_xy` — Drag from (x1, y1) to (x2, y2)
- `browser_mouse_move_xy` — Move mouse to (x, y)

**When to Use**: Pixel-perfect interactions (canvas, drawing apps, games). Avoid for standard web testing.

#### PDF Tools (Requires `--caps pdf`)

- `browser_pdf_save` — Save page as PDF

**When to Use**: Generating reports, archiving pages, PDF integration testing.

---

## Anti-Patterns ❌

### Don't: Use Screenshots for Element Interaction

```
❌ browser_take_screenshot → Try to find button coordinates → browser_mouse_click_xy
✅ browser_snapshot → Get element ref → browser_click
```

### Don't: Execute Random JavaScript

```
❌ browser_evaluate → document.querySelector('#id').value = 'text'
✅ browser_type → Use proper element ref and text parameter
```

### Don't: Skip Snapshots

```
❌ browser_click → (Guess element ref)
✅ browser_snapshot → Get correct ref → browser_click
```

### Don't: Hardcode URLs

```
❌ browser_navigate → "http://localhost:3000/dashboard"
✅ browser_navigate → "/dashboard" (uses BASE_URL from config)
```

### Don't: Chain Actions Without Verification

```
❌ browser_click → browser_click → browser_click
✅ browser_click → browser_snapshot → (verify state) → browser_click
```

---

## Integration with Playwright Skill

### File References

- **Configuration**: `assets/playwright.config.ts`
- **Best Practices**: `references/best-practices.md`
- **Examples**: `assets/examples/`
- **Guides**: `references/guides/`

### When to Read References

- **Locators Guide** (`references/locators.md`) — Before using `browser_generate_locator`
- **Assertions Guide** (`references/assertions.md`) — Before writing test verification code
- **Configuration** (`references/configuration.md`) — Before suggesting config changes

### Converting MCP Exploration to Tests

After exploration with MCP tools:

1. **Extract Locators**: Use `browser_generate_locator` on key elements
2. **Review Patterns**: Check `assets/examples/` for similar test patterns
3. **Follow Structure**: Tests go in `./src/e2e/` per config
4. **Apply Guardrails**: No hardcoded credentials, use `process.env.*`

---

## Quick Reference Table

| Task              | Primary Tool               | Follow-up Tool              |
| ----------------- | -------------------------- | --------------------------- |
| Start exploration | `browser_navigate`         | `browser_snapshot`          |
| Find elements     | `browser_snapshot`         | `browser_generate_locator`  |
| Fill form         | `browser_fill_form`        | `browser_verify_value`      |
| Click button      | `browser_click`            | `browser_snapshot` (verify) |
| Debug errors      | `browser_console_messages` | `browser_network_requests`  |
| Wait for content  | `browser_wait_for`         | `browser_snapshot`          |
| Test mobile view  | `browser_resize`           | `browser_snapshot`          |
| Record trace      | `browser_start_tracing`    | `browser_stop_tracing`      |

---

## Configuration Best Practices

### Recommended MCP Server Config

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--browser",
        "chromium",
        "--timeout-action",
        "5000",
        "--timeout-navigation",
        "60000",
        "--test-id-attribute",
        "data-testid"
      ]
    }
  }
}
```

### Key Arguments

- `--browser` — Match your test config (`chromium`, `firefox`, `webkit`)
- `--headless` — Run without UI (faster for automation)
- `--save-trace` — Auto-save traces to output directory
- `--timeout-action` — Must match Playwright config (default: 5000ms)

---

## Summary

**Golden Rule**: Use MCP tools for **interactive exploration and debugging**. Generate Playwright test files for **automation and CI/CD**.

**Tool Hierarchy**:

1. `browser_snapshot` — Your primary inspection tool
2. `browser_fill_form` / `browser_click` — Primary interaction tools
3. `browser_generate_locator` — Bridge from MCP to test code
4. `browser_run_code` — Advanced scenarios only

**Remember**: The Playwright MCP server is a **companion** to this skill, not a replacement for writing proper Playwright tests.
