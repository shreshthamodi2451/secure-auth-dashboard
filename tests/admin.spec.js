const { test, expect } = require('@playwright/test');

test('dashboard requires authentication', async ({ page }) => {

  await page.goto('http://localhost:3000/dashboard');

  await expect(page).toHaveURL(/login/);

  await page.evaluate(() => {
  localStorage.clear();
});

  await expect(
    page.getByRole('button', { name: 'Sign In' })
  ).toBeVisible();

  await expect(
    page.getByPlaceholder('name@example.com')
  ).toBeVisible();

});