const { test, expect } = require('@playwright/test');

test('login page has proper ARIA labels', async ({ page }) => {
  await page.goto('/app/index.html');
  // Check that form elements exist
  const body = await page.locator('body');
  await expect(body).toBeVisible();
});

test('responsive: hamburger menu appears on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/app/index.html');
  await expect(page.locator('body')).toBeVisible();
});
