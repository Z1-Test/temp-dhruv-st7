/**
 * API + UI test template with cleanup
 * Links: references/guides/apiTesting.md
 */
import { test, expect, request } from '@playwright/test';

test('api+ui: create via API then validate in UI', async ({ page }) => {
  const api = await request.newContext({ baseURL: process.env.API_URL });

  const create = await api.post('/api/todos', { data: { title: 'test-item' } });
  const { id } = await create.json();

  try {
    await page.goto(`${process.env.APP_URL}/todos`);
    await expect(page.locator('text=test-item')).toBeVisible();
  } finally {
    await api.delete(`/api/todos/${id}`);
    await api.dispose();
  }
});
