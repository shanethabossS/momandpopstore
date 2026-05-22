import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('page title contains Mom & Pop', async ({ page }) => {
    expect(await page.title()).toMatch(/Mom.*Pop/i);
  });

  test('heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading').first()).toBeVisible();
  });

  test('body has substantial content', async ({ page }) => {
    const body = await page.locator('body').textContent();
    expect((body ?? '').length).toBeGreaterThan(200);
  });
});

test.describe('Navigation', () => {
  test('has login and signup links', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').textContent();
    expect(body?.toLowerCase()).toMatch(/sign in|sign up|login/);
  });
});

test.describe('Auth pages', () => {
  test('/login loads with email input', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('/signup loads with email input', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('/dashboard unauthenticated redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/login/, { timeout: 10_000 });
    expect(page.url()).toMatch(/login/);
  });
});

test.describe('Stores', () => {
  test('/stores loads with a heading', async ({ page }) => {
    await page.goto('/stores');
    await expect(page.getByRole('heading').first()).toBeVisible({ timeout: 12_000 });
  });
});

test.describe('Static pages', () => {
  for (const route of ['/about', '/terms', '/privacy']) {
    test(`${route} loads with heading`, async ({ page }) => {
      await page.goto(route);
      await expect(page.getByRole('heading').first()).toBeVisible();
    });
  }
});
