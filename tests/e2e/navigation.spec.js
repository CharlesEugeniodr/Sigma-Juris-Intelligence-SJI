const { test, expect } = require('@playwright/test');

test('landing page loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toBeVisible();
});

test('app page loads login form', async ({ page }) => {
  await page.goto('/app/index.html');
  await expect(page).toHaveTitle(/Sigma/);
});

test('terms page is accessible', async ({ page }) => {
  await page.goto('/app/index.html#/termos');
  await expect(page.locator('body')).toBeVisible();
});
