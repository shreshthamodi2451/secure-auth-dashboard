const { test, expect } = require('@playwright/test');

test.afterEach(
  async ({ request }) => {

    await request.delete(
      'http://localhost:5001/api/test/delete-user/playwright@test.com'
    );

  }
);

test.describe('2FA Flow', () => {

  test(
    'user without 2fa goes to setup page',
    async ({ page, request }) => {

      await request.post(
        'http://localhost:5001/api/test/create-user',
        {
          data: {
            isVerified: true,
            twoFactorEnabled: false
          }
        }
      );

      await page.goto(
        'http://localhost:3000/login'
      );

      await page.fill(
        '#email',
        'playwright@test.com'
      );

      await page.fill(
        '#password',
        'Password123'
      );

      await page.click(
        'button[type="submit"]'
      );

      await expect(page)
        .toHaveURL(/setup-2fa/);

    }
  );

  test(
    'user with 2FA enabled is redirected to OTP page',
    async ({ page, request }) => {

      await request.post(
        'http://localhost:5001/api/test/create-user',
        {
          data: {
            isVerified: true,
            twoFactorEnabled: true,
            twoFactorMethod: 'authenticator'
          }
        }
      );

      await page.goto(
        'http://localhost:3000/login'
      );

      await page.fill(
        '#email',
        'playwright@test.com'
      );

      await page.fill(
        '#password',
        'Password123'
      );

      await page.click(
        'button[type="submit"]'
      );

      await expect(page)
        .toHaveURL(/otp/);

    }
  );

});