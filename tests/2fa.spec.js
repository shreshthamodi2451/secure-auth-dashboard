const { test, expect } = require('@playwright/test');

test.describe('2FA Flow', () => {

  test('user without 2fa goes to setup page', async ({ page }) => {

    await page.goto('http://localhost:3000/login');

    await page.fill('#email', 'newuser@gmail.com');
    await page.fill('#password', 'newuser123');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(
      /setup-2fa/
    );

  });

});



test('user with 2FA enabled is redirected to OTP page', async ({ page }) => {

  await page.goto('http://localhost:3000/login');

  await page.fill('#email', 'shreshthamodi2451@gmail.com');
  await page.fill('#password', 'shreshtha2451');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(
    /otp/
  );

});


