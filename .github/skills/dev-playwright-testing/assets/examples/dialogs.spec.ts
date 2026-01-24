/**
 * Example: dialogs.spec.ts
 * Template: assets/test-template.ts
 * Purpose: Demonstrate dialog handling and file upload
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test('dialogs: accept confirmation dialog', async ({ page }) => {
  // Arrange
  await page.setContent(`
    <button onclick="confirm('Are you sure?') ? document.body.innerText='Deleted' : ''">Delete item</button>
  `);

  // Wire dialog handler before action to avoid races
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Are you sure');
    dialog.accept();
  });

  // Act
  await page.click('text=Delete item');

  // Assert
  await expect(page.locator('text=Deleted')).toBeVisible();
});

test('file upload: setInputFiles on file input', async ({ page }) => {
  await page.setContent(`
    <input type="file" />
    <div id="status">Waiting</div>
    <script>
      document.querySelector('input').onchange = () => {
        document.getElementById('status').innerText = 'Upload successful';
      };
    </script>
  `);
  
  // Use existing file for upload test
  await page.locator('input[type=file]').setInputFiles('./fixtures/sample-data.json');
  
  await expect(page.locator('text=Upload successful')).toBeVisible();
});
