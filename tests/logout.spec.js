import {test, expect} from '@playwright/test'

test.use({
    storageState: 'playwright/.auth/admin.json'
});

test('logout works', async ({page}) => {

    await page.goto('http://localhost:3000/dashboard');

    await page.getByRole('button', {name: 'Logout'}).click();

    await expect(page).toHaveURL(/login/);

    //try accessing dashboard again to make sure a user cannot still go to dashboard after loggin out, to make sure that the token is removed
    await page.goto('http://localhost:3000/dashboard');

  // Should still be redirected to login
  await expect(page).toHaveURL(/login/);
});