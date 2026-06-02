import { test, expect } from '@playwright/test';

test.use({
  storageState: 'playwright/.auth/admin.json'
});

test('admin can see View All Users button', async ({ page }) => {

  await page.goto('http://localhost:3000/dashboard');

  await expect(
    page.getByRole('button', {
      name: 'View All Users'
    })
  ).toBeVisible();

});

test('user cannot see View All Users button', async ({ page }) => {

  // Login as normal user
  // Complete OTP
  // Reach dashboard

  await expect(
    page.getByRole('button', {
      name: 'View All Users'
    })
  ).not.toBeVisible();

});