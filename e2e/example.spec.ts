import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('should have visible main content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
  });
});
