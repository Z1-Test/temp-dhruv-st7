/**
 * Thin Page Object template (actions only, no assertions)
 * Links: references/page-objects.md
 */
import type { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly user = '#user';
  readonly pass = '#pass';
  readonly loginButton = 'role=button[name="Log in"]';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(user: string, pass: string) {
    await this.page.locator(this.user).fill(user);
    await this.page.locator(this.pass).fill(pass);
    await this.page.locator(this.loginButton).click();
  }
}
