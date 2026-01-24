import { test, expect } from '@playwright/test';

test.describe('Declarative Shadow DOM (DSD)', () => {
  test('should pierce shadow roots automatically with standard locators', async ({ page }) => {
    // Inject DSD HTML for demonstration
    await page.setContent(`
      <html>
        <body>
          <div id="wrapper">
            <h1>Normal DOM</h1>
            
            <component-card>
              <!-- Declarative Shadow Root -->
              <template shadowrootmode="open">
                <style>
                  .card { border: 1px solid #ccc; padding: 10px; }
                  h2 { color: blue; }
                </style>
                <div class="card">
                  <h2>Shadow Header</h2>
                  <p>Content inside shadow root</p>
                  <button type="button">Shadow Button</button>
                </div>
              </template>
            </component-card>
            
          </div>
        </body>
      </html>
    `);

    // 1. Locators automatically pierce open shadow roots
    // No special syntax needed to find elements inside <component-card>
    const shadowHeader = page.getByRole('heading', { name: 'Shadow Header' });
    const shadowButton = page.getByRole('button', { name: 'Shadow Button' });
    const shadowText = page.getByText('Content inside shadow root');

    // 2. Assertions work normally
    await expect(shadowHeader).toBeVisible();
    await expect(shadowButton).toBeEnabled();
    await expect(shadowButton).toHaveText('Shadow Button');
    await expect(shadowText).toBeVisible();

    // 3. CSS locators also pierce
    const cardContent = page.locator('.card p');
    await expect(cardContent).toHaveText('Content inside shadow root');
    
    // 4. NOTE: XPath does NOT pierce shadow roots
    const xpathLocator = page.locator('//button[text()="Shadow Button"]');
    await expect(xpathLocator).toHaveCount(0); // Cannot find it
  });

  test('should work with nested shadow roots', async ({ page }) => {
    await page.setContent(`
      <outer-component>
        <template shadowrootmode="open">
          <div class="outer">
            <inner-component>
              <template shadowrootmode="open">
                <span data-testid="nested-target">Deep content</span>
              </inner-component>
            </inner-component>
          </div>
        </template>
      </outer-component>
    `);

    // Pierces multiple levels automatically
    await expect(page.getByTestId('nested-target')).toHaveText('Deep content');
    
    // Explicit traversal works but is usually unnecessary
    await expect(page.locator('outer-component').locator('inner-component').getByText('Deep content')).toBeVisible();
  });
});
