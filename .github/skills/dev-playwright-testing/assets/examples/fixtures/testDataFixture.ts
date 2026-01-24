import { test as base } from '@playwright/test';

/**
 * Test Data Fixture
 * 
 * Creates and manages test data via API for E2E tests.
 * Automatically sets up test data before each test and cleans up after.
 * 
 * Example usage:
 *   test('can add product to cart', async ({ page, testData }) => {
 *     await page.goto(`/products/${testData.productId}`);
 *     // ... test with the created product
 *   });
 */

type TestUser = {
  userId: string;
  email: string;
  token: string;
};

type TestProduct = {
  productId: string;
  name: string;
  price: number;
};

type TestDataFixture = {
  testUser: TestUser;
  testProduct: TestProduct;
};

export const test = base.extend<TestDataFixture>({
  testUser: async ({}, use) => {
    // Setup: Create test user via API
    const timestamp = Date.now();
    const userData = {
      email: `test.user.${timestamp}@example.com`,
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User',
    };

    // Call your API to create user
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create test user: ${response.statusText}`);
    }

    const { userId, token } = await response.json();

    const testUser = {
      userId,
      email: userData.email,
      token,
    };

    // Provide the test user to the test
    await use(testUser);

    // Teardown: Delete test user
    await fetch(`${apiUrl}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },

  testProduct: async ({}, use) => {
    // Setup: Create test product via API
    const timestamp = Date.now();
    const productData = {
      name: `Test Product ${timestamp}`,
      description: 'A test product for E2E testing',
      price: 29.99,
      inventory: 100,
    };

    const apiUrl = process.env.API_URL || 'http://localhost:3000/api';
    const response = await fetch(`${apiUrl}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create test product: ${response.statusText}`);
    }

    const { productId } = await response.json();

    const testProduct = {
      productId,
      name: productData.name,
      price: productData.price,
    };

    // Provide the test product to the test
    await use(testProduct);

    // Teardown: Delete test product
    await fetch(`${apiUrl}/products/${productId}`, {
      method: 'DELETE',
    });
  },
});

export { expect } from '@playwright/test';

/**
 * USAGE EXAMPLE
 * 
 * How to use this fixture in your tests:
 */

// import { test, expect } from './fixtures/testDataFixture';
// 
// test.describe('Shopping Cart', () => {
//   test('can add product to cart', async ({ page, testUser, testProduct }) => {
//     // testUser and testProduct are automatically created before this test
//     
//     // Login with the created user
//     await page.goto('/login');
//     await page.fill('#email', testUser.email);
//     await page.fill('#password', 'Test123!'); // Use the password from userData
//     await page.click('button:text("Login")');
//     
//     // Navigate to the created product
//     await page.goto(`/products/${testProduct.productId}`);
//     
//     // Verify product details
//     await expect(page.locator('h1')).toHaveText(testProduct.name);
//     await expect(page.locator('.price')).toHaveText(`$${testProduct.price}`);
//     
//     // Add to cart
//     await page.click('button:text("Add to Cart")');
//     
//     // Verify cart count
//     await expect(page.locator('.cart-count')).toHaveText('1');
//     
//     // After test completes, testUser and testProduct are automatically deleted
//   });
// });

