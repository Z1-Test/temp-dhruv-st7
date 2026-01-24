/**
 * Component testing template (React example)
 * Links: references/component-testing.md
 * Requires: npm i -D @playwright/experimental-ct-react
 */
import { test, expect } from '@playwright/experimental-ct-react';
import Button from './Button';

test('Button renders and interacts', async ({ mount }) => {
  const component = await mount(<Button label="Save" />);
  await component.locator('role=button[name="Save"]').click();
  await expect(component).toHaveScreenshot('button-save.png');
});
