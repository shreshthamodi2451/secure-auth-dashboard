import { test, expect } from '@playwright/test';

test.use({
  storageState: 'playwright/.auth/admin.json'
});

test('logout works', async ({ page }) => {

  await page.goto(
    'http://localhost:3000/dashboard'
  );

  await expect(page)
    .toHaveURL(/dashboard/);

await page.pause();

  await expect(page)
    .toHaveURL(/login/);

  // Try accessing dashboard again
  await page.goto(
    'http://localhost:3000/dashboard'
  );

  await expect(page)
    .toHaveURL(/login/);

});