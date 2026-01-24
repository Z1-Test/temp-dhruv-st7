/**
 * Example: downloads.spec.ts
 * Template: assets/test-template.ts
 * Purpose: Show CI-friendly download handling using testInfo/output paths.
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';

test('downloads: wait for download and assert file exists', async ({ page, browserName }, testInfo) => {
  test.fixme(['firefox', 'webkit'].includes(browserName), 'Downloads flaky on Firefox/WebKit in this environment');

  // Arrange
  await page.setContent(`
    <a href="data:text/plain;charset=utf-8,content" download="sample.txt">Download sample</a>
  `);

  // Act
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=Download sample'),
  ]);

  // Use testInfo.outputPath to save artifacts in CI-friendly location
  const savePath = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(savePath);

  // Assert
  expect(fs.existsSync(savePath)).toBeTruthy();
});
