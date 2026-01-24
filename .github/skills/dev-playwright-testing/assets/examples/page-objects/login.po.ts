/**
 * Page Object: login.po.ts
 * Template: assets/page-object-template.ts
 * Purpose: Thin PO with selectors + small actions; keep assertions in tests.
 */

import type { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly user = '#username';
  readonly pass = '#password';
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
