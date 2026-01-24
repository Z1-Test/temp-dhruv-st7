# Page API Reference

Comprehensive reference for Page, Locator, and Assertion APIs used in Playwright tests.

**Source**: <https://playwright.dev/docs/api/class-page> | <https://playwright.dev/docs/api/class-locator>

---

## Locators (Element Selection)

### getByRole(role, options?)

```typescript
await page.getByRole("button", { name: "Submit" }).click();
await page.getByRole("heading", { name: "Welcome", level: 1 });
await page.getByRole("textbox", { name: /email/i });
await page.getByRole("checkbox", { checked: true });
```

### getByText(text, options?)

```typescript
await page.getByText("Sign in").click();
await page.getByText(/welcome/i, { exact: false });
```

### getByLabel(text, options?)

```typescript
await page.getByLabel("Email").fill("test@example.com");
await page.getByLabel(/password/i).fill("secret");
```

### getByPlaceholder(text, options?)

```typescript
await page.getByPlaceholder("Enter email").fill("test@example.com");
```

### getByTestId(testId)

```typescript
await page.getByTestId("submit-btn").click();
// Configure custom attribute: playwright.config.ts → use.testIdAttribute
```

### getByAltText(text, options?)

```typescript
await page.getByAltText("company logo").click();
```

### getByTitle(text, options?)

```typescript
await page.getByTitle("close").click();
```

### locator(selector)

```typescript
await page.locator('[data-testid="login"]').click();
await page.locator(".item").filter({ hasText: "Active" }).first();
await page.locator(".item").nth(2).click(); // zero-indexed
```

### Shadow DOM & DSD

Playwright locators **automatically pierce** open Shadow DOMs (including Declarative Shadow DOM). You don't need special selectors.

**Warning**: `xpath` locators **DO NOT** pierce Shadow DOM.

```typescript
// Works automatically (pierces shadow root)
await page.getByRole("button", { name: "Shadow Button" }).click();
await page.locator("component-box button").click();

// ❌ XPath does NOT pierce shadow roots
await page.locator("//button").click(); // Fails inside shadow root
```

---

## Locator Methods

### Filtering & Selection

```typescript
locator.filter({ hasText: "Active" });
locator.filter({ has: page.locator(".icon") });
locator.first();
locator.last();
locator.nth(index);
locator.count();
locator.and(locator); // intersection
locator.or(locator); // union
```

### Chaining

```typescript
const form = page.locator("form#login");
await form.getByLabel("Email").fill("test@example.com");
await form.getByRole("button", { type: "submit" }).click();
```

---

## Actions

### click(options?)

```typescript
await locator.click();
await locator.click({ button: "right" });
await locator.click({ modifiers: ["Control"] });
await locator.click({ clickCount: 2 }); // double-click
await locator.click({ position: { x: 10, y: 10 } });
```

### fill(value, options?)

```typescript
await locator.fill("text value");
await locator.clear(); // clear input
```

### press(key, options?)

```typescript
await locator.press("Enter");
await locator.press("Control+A");
await locator.pressSequentially("Hello", { delay: 100 });
```

### check() / uncheck()

```typescript
await locator.check();
await locator.uncheck();
await locator.setChecked(true);
```

### selectOption(values, options?)

```typescript
await locator.selectOption("value");
await locator.selectOption(["opt1", "opt2"]);
await locator.selectOption({ label: "Option Label" });
```

### hover(options?)

```typescript
await locator.hover();
await locator.hover({ position: { x: 0, y: 0 } });
```

### dragTo(target, options?)

```typescript
await source.dragTo(target);
```

### setInputFiles(files, options?)

```typescript
await locator.setInputFiles("/path/to/file.pdf");
await locator.setInputFiles(["/file1.pdf", "/file2.pdf"]);
await locator.setInputFiles({
  name: "test.txt",
  mimeType: "text/plain",
  buffer: Buffer.from("file content"),
});
```

---

## Navigation

### goto(url, options?)

```typescript
await page.goto("/dashboard");
await page.goto("https://example.com");
await page.goto(url, { waitUntil: "networkidle" });
await page.goto(url, { waitUntil: "domcontentloaded" });
```

### goBack(options?) / goForward(options?)

```typescript
await page.goBack();
await page.goForward();
await page.goBack({ waitUntil: "networkidle" });
```

### reload(options?)

```typescript
await page.reload();
await page.reload({ waitUntil: "networkidle" });
```

### waitForLoadState(state?, options?)

```typescript
await page.waitForLoadState("load");
await page.waitForLoadState("domcontentloaded");
await page.waitForLoadState("networkidle");
```

### waitForURL(url, options?)

```typescript
await page.waitForURL("**/dashboard");
await page.waitForURL(/dashboard/);
await page.waitForURL((url) => url.searchParams.get("id") === "123");
```

---

## Frames & Dialogs

### Frames

```typescript
const frame = page.frameLocator('iframe[title="Widget"]');
await frame.getByRole("button").click();

// Multiple frames
page.frames();
page.mainFrame();
```

### Dialogs

```typescript
page.on("dialog", (dialog) => dialog.accept());
page.on("dialog", (dialog) => dialog.dismiss());
page.on("dialog", (dialog) => dialog.accept("prompt text"));

await page.click("button"); // triggers dialog
```

### Downloads

```typescript
const downloadPromise = page.waitForEvent("download");
await page.click("a[download]");
const download = await downloadPromise;
await download.saveAs("/path/to/save");
```

---

## Assertions

### Page Assertions

```typescript
await expect(page).toHaveURL("https://example.com/");
await expect(page).toHaveURL(/dashboard/);
await expect(page).toHaveTitle("Dashboard");
await expect(page).toHaveTitle(/dash/i);
```

### Visibility & State

```typescript
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeEditable();
await expect(locator).toBeFocused();
await expect(locator).toBeChecked();
await expect(locator).not.toBeVisible();
```

### Text Assertions

```typescript
await expect(locator).toHaveText("Expected text");
await expect(locator).toHaveText(/regex/);
await expect(locator).toContainText("partial");
await expect(locator).toHaveText(["Item 1", "Item 2"]); // multiple elements
```

### Value & Attributes

```typescript
await expect(locator).toHaveValue("input value");
await expect(locator).toHaveAttribute("href", "/page");
await expect(locator).toHaveClass("active");
await expect(locator).toHaveClass(/btn-/);
await expect(locator).toHaveId("submit");
await expect(locator).toHaveCSS("color", "rgb(255, 0, 0)");
await expect(locator).toBeEmpty();
```

### Count Assertions

```typescript
await expect(page.locator(".item")).toHaveCount(5);
await expect(page.locator(".item")).toHaveCount(0); // none
```

### Screenshot Assertions

```typescript
await expect(page).toHaveScreenshot("page.png");
await expect(locator).toHaveScreenshot("element.png");
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
```

### Assertion Options

```typescript
await expect(locator).toBeVisible({ timeout: 10000 });
await expect.soft(locator).toBeVisible(); // continue on failure
await expect
  .poll(async () => {
    const response = await page.request.get("/api/status");
    return response.status();
  })
  .toBe(200);
```

---

## Element Information

### Get Element Data

```typescript
await locator.innerText();
await locator.textContent();
await locator.innerHTML();
await locator.inputValue();
await locator.getAttribute("href");
await locator.isChecked();
await locator.isDisabled();
await locator.isEditable();
await locator.isEnabled();
await locator.isHidden();
await locator.isVisible();
```

### Wait for Element

```typescript
await locator.waitFor({ state: "visible" });
await locator.waitFor({ state: "hidden" });
await locator.waitFor({ state: "attached" });
await locator.waitFor({ state: "detached" });
await locator.waitFor({ timeout: 5000 });
```

---

## Screenshots

```typescript
await page.screenshot({ path: "page.png" });
await page.screenshot({ path: "page.jpg", type: "jpeg" });
await page.screenshot({ fullPage: true });
await locator.screenshot({ path: "element.png" });
```

---

## Advanced

### evaluate()

```typescript
const dimensions = await page.evaluate(() => {
  return {
    width: document.body.scrollWidth,
    height: document.body.scrollHeight,
  };
});

const text = await locator.evaluate((el) => el.textContent);
```

### waitForResponse()

```typescript
const responsePromise = page.waitForResponse("**/api/data");
await page.click("button");
const response = await responsePromise;
expect(response.status()).toBe(200);
```

### waitForRequest()

```typescript
const requestPromise = page.waitForRequest("**/api/submit");
await page.click("button");
const request = await requestPromise;
```
