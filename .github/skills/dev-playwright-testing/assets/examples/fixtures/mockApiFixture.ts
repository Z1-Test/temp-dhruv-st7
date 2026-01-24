import { test as base, Page } from '@playwright/test';

/**
 * Mock API Fixture
 * 
 * Intercepts API requests and provides mock responses for predictable testing.
 * Useful for testing error states, edge cases, or working without a backend.
 * 
 * Example usage:
 *   test('shows error on failed API call', async ({ page, mockApi }) => {
 *     await mockApi.mockProductsError();
 *     await page.goto('/products');
 *     await expect(page.locator('.error-message')).toBeVisible();
 *   });
 */

type MockApiHelpers = {
  mockProducts: (products?: unknown[]) => Promise<void>;
  mockProductsError: () => Promise<void>;
  mockUserProfile: (user?: unknown) => Promise<void>;
  mockApiDelay: (delayMs: number) => Promise<void>;
};

type MockApiFixture = {
  mockApi: MockApiHelpers;
};

export const test = base.extend<MockApiFixture>({
  mockApi: async ({ page }, use) => {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api';

    const helpers: MockApiHelpers = {
      /**
       * Mock products endpoint with sample data
       */
      async mockProducts(products = []) {
        const defaultProducts = [
          { id: '1', name: 'Test Product 1', price: 19.99, inventory: 50 },
          { id: '2', name: 'Test Product 2', price: 29.99, inventory: 30 },
          { id: '3', name: 'Test Product 3', price: 39.99, inventory: 20 },
        ];

        await page.route(`${apiUrl}/products`, async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(products.length > 0 ? products : defaultProducts),
          });
        });
      },

      /**
       * Mock products endpoint to return error
       */
      async mockProductsError() {
        await page.route(`${apiUrl}/products`, async (route) => {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
              error: 'Internal Server Error',
              message: 'Failed to fetch products',
            }),
          });
        });
      },

      /**
       * Mock user profile endpoint
       */
      async mockUserProfile(user = {}) {
        const defaultUser = {
          id: 'user123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          ...user,
        };

        await page.route(`${apiUrl}/user/profile`, async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(defaultUser),
          });
        });
      },

      /**
       * Add delay to all API calls to simulate slow network
       */
      async mockApiDelay(delayMs: number) {
        await page.route(`${apiUrl}/**`, async (route) => {
          await new Promise(resolve => setTimeout(resolve, delayMs));
          await route.continue();
        });
      },
    };

    // Provide the helpers to the test
    await use(helpers);

    // Cleanup: Remove all route handlers
    await page.unroute(`${apiUrl}/**`);
  },
});

export { expect } from '@playwright/test';

/**
 * USAGE EXAMPLE
 * 
 * How to use this fixture in your tests:
 */

// import { test, expect } from './fixtures/mockApiFixture';
// 
// test.describe('Product Listing Error Handling', () => {
//   test('shows error message when API fails', async ({ page, mockApi }) => {
//     // Mock the products API to return an error
//     await mockApi.mockProductsError();
//     
//     // Navigate to products page
//     await page.goto('/products');
//     
//     // Verify error message is displayed
//     await expect(page.locator('.error-message')).toBeVisible();
//     await expect(page.locator('.error-message')).toHaveText(/failed to fetch products/i);
//   });
//   
//   test('displays products from mocked API', async ({ page, mockApi }) => {
//     // Mock products with custom data
//     await mockApi.mockProducts([
//       { id: '1', name: 'Mocked Product', price: 99.99, inventory: 10 },
//     ]);
//     
//     await page.goto('/products');
//     
//     // Verify mocked product is displayed
//     await expect(page.locator('.product-card')).toHaveCount(1);
//     await expect(page.locator('.product-card h2')).toHaveText('Mocked Product');
//     await expect(page.locator('.product-card .price')).toHaveText('$99.99');
//   });
// });

