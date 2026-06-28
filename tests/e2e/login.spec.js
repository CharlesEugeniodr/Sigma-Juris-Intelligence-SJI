const { test, expect } = require('@playwright/test');

test('página de login carrega corretamente', async ({ page }) => {
  await page.goto('/app/index.html');
  await expect(page).toHaveTitle(/Sigma-Juris/);
  // O formulário de login deve estar visível se não houver token
  await expect(page.locator('form')).toBeVisible();
});
